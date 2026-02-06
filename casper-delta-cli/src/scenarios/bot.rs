#![allow(dead_code)]
use std::{fmt::Display, thread::sleep, time::Duration};

use casper_delta_contracts::{
    market::{Market, MarketHostRef},
    position_token::{PositionToken, PositionTokenHostRef},
    wrapped_native::{WrappedNativeToken, WrappedNativeTokenHostRef},
};
use casper_trade_contracts::{
    pair::{Pair, PairHostRef},
    router::{Router, RouterHostRef},
};
use odra::host::HostEnv;
use odra::prelude::*;
use odra::{casper_types::U256, schema::casper_contract_schema::NamedCLType};
use odra_cli::{
    cspr,
    scenario::{Args, Error, Scenario, ScenarioMetadata},
    ContractProvider, DeployedContractsContainer,
};

pub struct BotSetup;

impl ScenarioMetadata for BotSetup {
    const NAME: &'static str = "BotSetup";
    const DESCRIPTION: &'static str = "Sets up the environment for the bot.";
}

impl Scenario for BotSetup {
    fn run(
        &self,
        env: &HostEnv,
        container: &DeployedContractsContainer,
        _args: Args,
    ) -> Result<(), Error> {
        let contracts = ContractRefs::new(env, container);
        let cspr_trade_address = contracts.router()?.address();
        let cspr_delta_address = contracts.market()?.address();
        env.set_gas(cspr!(2.5));

        // Casper trade must be able to spend wcspr, long and short tokens
        contracts.wcspr()?.approve(&cspr_trade_address, &U256::MAX);
        contracts.long()?.approve(&cspr_trade_address, &U256::MAX);
        contracts.short()?.approve(&cspr_trade_address, &U256::MAX);

        // Casper delta must be able to spend wcspr
        contracts.wcspr()?.approve(&cspr_delta_address, &U256::MAX);

        Ok(())
    }
}

pub struct Bot;

impl ScenarioMetadata for Bot {
    const NAME: &'static str = "Bot";
    const DESCRIPTION: &'static str = "Runs the bot.";
}

impl Scenario for Bot {
    fn args(&self) -> Vec<odra_cli::CommandArg> {
        vec![odra_cli::CommandArg::new(
            "dry-run",
            "Dry run the bot",
            NamedCLType::Bool,
        )]
    }

    fn run(
        &self,
        env: &HostEnv,
        container: &DeployedContractsContainer,
        args: Args,
    ) -> Result<(), Error> {
        let contracts = ContractRefs::new(env, container);
        let calc = PriceCalculator::new(&contracts);

        let dry_run = args.get_single("dry-run").unwrap_or(false);
        if dry_run {
            println!("Dry run mode enabled");
        }

        loop {
            let price_data = self.get_price_data(&calc)?;
            let path = Path::calc(&price_data);
            println!("{price_data}");

            if path == Path::Empty {
                println!("No arbitrage path found\n");
                sleep(Duration::from_secs(180));
                continue;
            }
            println!("Swap path: {:?}", path);

            let amount_in = price_data.get_amount_in(path);
            if let Ok([amount_in, .., amount_out]) = self
                .get_swap_amounts(&contracts, path, amount_in)
                .as_deref()
            {
                if !dry_run {
                    self.set_gas(env, path);
                    self.swap(&contracts, path, *amount_in, *amount_out, env.caller())?;
                    println!("Arbitrage swap completed");
                }

                Self::print_gains_in_cspr(*amount_in, *amount_out, price_data, path);
                println!("Sleeping for 3 minutes...\n");
                sleep(Duration::from_secs(180));
            } else {
                println!("No valid swap amounts found\n");
                sleep(Duration::from_secs(180));
                continue;
            }
        }
    }
}

struct ContractRefs<'a> {
    env: &'a HostEnv,
    container: &'a DeployedContractsContainer,
}

impl<'a> ContractRefs<'a> {
    fn new(env: &'a HostEnv, container: &'a DeployedContractsContainer) -> Self {
        Self { env, container }
    }

    fn router(&self) -> Result<RouterHostRef, Error> {
        Ok(self.container.contract_ref::<Router>(self.env)?)
    }

    fn long_wcspr_pair(&self) -> Result<PairHostRef, Error> {
        Ok(self
            .container
            .contract_ref_named::<Pair>(self.env, Some("CD_LONG-WCSPR LP".to_string()))?)
    }

    fn wcspr_short_pair(&self) -> Result<PairHostRef, Error> {
        Ok(self
            .container
            .contract_ref_named::<Pair>(self.env, Some("WCSPR-CD_SHORT LP".to_string()))?)
    }

    fn market(&self) -> Result<MarketHostRef, Error> {
        Ok(self.container.contract_ref::<Market>(self.env)?)
    }

    fn wcspr(&self) -> Result<WrappedNativeTokenHostRef, Error> {
        Ok(self
            .container
            .contract_ref::<WrappedNativeToken>(self.env)?)
    }

    fn long(&self) -> Result<PositionTokenHostRef, Error> {
        Ok(self
            .container
            .contract_ref_named::<PositionToken>(self.env, Some("CD_LONG".to_string()))?)
    }

    fn short(&self) -> Result<PositionTokenHostRef, Error> {
        Ok(self
            .container
            .contract_ref_named::<PositionToken>(self.env, Some("CD_SHORT".to_string()))?)
    }

    fn token_address(&self, token: Token) -> Result<Address, Error> {
        let name = match token {
            Token::Long => "CD_LONG",
            Token::Short => "CD_SHORT",
            Token::Wcspr => "WrappedNativeToken",
        };

        self.container
            .address_by_name(name)
            .ok_or(Error::OdraError {
                message: format!("{} not found", name),
            })
    }
}

struct PriceCalculator<'a> {
    contracts: &'a ContractRefs<'a>,
}

impl<'a> PriceCalculator<'a> {
    fn new(contracts: &'a ContractRefs<'a>) -> Self {
        Self { contracts }
    }

    fn casper_trade_prices(&self) -> Result<(f64, f64), Error> {
        let (reserves_long, reserves_wcspr_long, _) =
            self.contracts.long_wcspr_pair()?.get_reserves();
        let (reserves_wcspr_short, reserves_short, _) =
            self.contracts.wcspr_short_pair()?.get_reserves();

        let long_token_price = Self::calculate_price(reserves_wcspr_long, reserves_long);
        let short_token_price = Self::calculate_price(reserves_wcspr_short, reserves_short);

        Ok((long_token_price, short_token_price))
    }

    fn fair_prices(&self) -> Result<(f64, f64, f64), Error> {
        let market = self.contracts.market()?;
        let state = market
            .get_address_market_state(market.address())
            .market_state;
        let long_token_price = Self::calculate_price(state.long_liquidity, state.long_total_supply);
        let short_token_price =
            Self::calculate_price(state.short_liquidity, state.short_total_supply);
        let wcspr_price = state.price().as_u64() as f64 / 100_000.0f64;

        Ok((long_token_price, short_token_price, wcspr_price))
    }

    fn calculate_price(amount0: U256, amount1: U256) -> f64 {
        (amount0 * U256::from(1_000_000) / amount1).as_u64() as f64 / 1000_000.0f64
    }
}

impl Bot {
    fn swap(
        &self,
        refs: &ContractRefs,
        path: Path,
        amount_in: U256,
        amount_out: U256,
        recipient: Address,
    ) -> Result<(), Error> {
        refs.router()?.swap_tokens_for_exact_tokens(
            amount_out,
            amount_in,
            path.build(refs)?,
            recipient,
            u64::MAX,
        );
        Ok(())
    }

    fn set_gas(&self, env: &HostEnv, path: Path) {
        if path.is_multi_hop() {
            env.set_gas(cspr!(13));
        } else {
            env.set_gas(cspr!(8));
        }
    }

    fn get_price_data(&self, calc: &PriceCalculator) -> Result<PriceData, Error> {
        let (long_price, short_price) = calc.casper_trade_prices()?;
        let (long_fair_price, short_fair_price, wcspr_price) = calc.fair_prices()?;

        let price_data = PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        );

        Ok(price_data)
    }

    fn get_swap_amounts(
        &self,
        refs: &ContractRefs,
        path: Path,
        amount_in: U256,
    ) -> Result<Vec<U256>, Error> {
        let path = path.build(refs)?;
        refs.router()?
            .try_get_amounts_out(amount_in, path)
            .map_err(|e| Error::OdraError {
                message: format!("Failed to get amounts out: {:?}", e),
            })
    }

    fn print_gains_in_cspr(amount_in: U256, amount_out: U256, price_data: PriceData, path: Path) {
        let average_transaction_cost = 12.5f64;
        let (amount_in_cspr, amount_out_cspr) = match path {
            Path::LongWcsprShort => (
                amount_in.as_u64() as f64 * price_data.long_fair_price,
                amount_out.as_u64() as f64 * price_data.short_fair_price,
            ),
            Path::ShortWcsprLong => (
                amount_in.as_u64() as f64 * price_data.short_fair_price,
                amount_out.as_u64() as f64 * price_data.long_fair_price,
            ),
            Path::LongWcspr => (
                amount_in.as_u64() as f64 * price_data.long_fair_price,
                amount_out.as_u64() as f64,
            ),
            Path::ShortWcspr => (
                amount_in.as_u64() as f64 * price_data.short_fair_price,
                amount_out.as_u64() as f64,
            ),
            Path::WcsprLong => (
                amount_in.as_u64() as f64,
                amount_out.as_u64() as f64 * price_data.long_fair_price,
            ),
            Path::WcsprShort => (
                amount_in.as_u64() as f64,
                amount_out.as_u64() as f64 * price_data.short_fair_price,
            ),
            Path::Empty => return,
        };
        let gain_cspr =
            (amount_out_cspr - amount_in_cspr) / 1_000_000_000.0f64 - average_transaction_cost;
        let gain_percent = (gain_cspr / amount_in_cspr) * 100.0f64;
        println!("Gain: {gain_cspr:.2} CSPR");
        println!("Gain percent: {gain_percent:.2}%");
    }
}

#[derive(Debug)]
enum Token {
    Long,
    Short,
    Wcspr,
}

#[derive(Debug)]
struct PriceData {
    long_price: f64,
    short_price: f64,
    wcspr_price: f64,
    long_fair_price: f64,
    short_fair_price: f64,
    long_diff: f64,
    short_diff: f64,
    longs_for_one_usd: u64,
    shorts_for_one_usd: u64,
    wcspr_for_one_usd: u64,
}

impl PriceData {
    fn new(
        long_price: f64,
        short_price: f64,
        wcspr_price: f64,
        long_fair_price: f64,
        short_fair_price: f64,
    ) -> Self {
        let long_diff = ((long_price / long_fair_price) * 100.0f64).floor() - 100.0f64;
        let short_diff = ((short_price / short_fair_price) * 100.0f64).floor() - 100.0f64;
        let longs_for_one_usd = (1.0f64 / wcspr_price / long_fair_price) as u64;
        let shorts_for_one_usd = (1.0f64 / wcspr_price / short_fair_price) as u64;
        let wcspr_for_one_usd = (1.0f64 / wcspr_price) as u64;

        Self {
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
            long_diff,
            short_diff,
            longs_for_one_usd,
            shorts_for_one_usd,
            wcspr_for_one_usd,
        }
    }

    fn shorts_amount_per_usd(&self) -> U256 {
        U256::from(self.shorts_for_one_usd * 1_000_000_000)
    }

    fn longs_amount_per_usd(&self) -> U256 {
        U256::from(self.longs_for_one_usd * 1_000_000_000)
    }

    fn wcspr_amount_per_usd(&self) -> U256 {
        U256::from(self.wcspr_for_one_usd * 1_000_000_000_000)
    }

    fn get_amount_in(&self, path: Path) -> U256 {
        match path {
            Path::LongWcsprShort => self.longs_amount_per_usd(),
            Path::ShortWcsprLong => self.shorts_amount_per_usd(),
            Path::LongWcspr => self.longs_amount_per_usd(),
            Path::ShortWcspr => self.shorts_amount_per_usd(),
            Path::WcsprLong => self.wcspr_amount_per_usd(),
            Path::WcsprShort => self.wcspr_amount_per_usd(),
            Path::Empty => U256::zero(),
        }
    }
}

impl Display for PriceData {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "Long price: {} CSPR\nShort price: {} CSPR\nWCSPR price: {} USD\nLong fair price: {} CSPR\nShort fair price: {} CSPR\n",
            self.long_price,
            self.short_price,
            self.wcspr_price,
            self.long_fair_price,
            self.short_fair_price
        )?;
        if self.long_diff > 0.0f64 {
            write!(f, "Long diff overvalued by {}%\n", self.long_diff)?;
        } else {
            write!(f, "Long diff undervalued by {}%\n", self.long_diff)?;
        }
        if self.short_diff > 0.0f64 {
            write!(f, "Short diff overvalued by {}%\n", self.short_diff)?;
        } else {
            write!(f, "Short diff undervalued by {}%\n", self.short_diff)?;
        }
        write!(
            f,
            "Long/USD: {}\nShort/USD: {}\n",
            self.longs_for_one_usd, self.shorts_for_one_usd
        )?;
        Ok(())
    }
}

#[derive(Debug, PartialEq, Clone, Copy)]
enum Path {
    LongWcsprShort,
    ShortWcsprLong,
    LongWcspr,
    ShortWcspr,
    WcsprLong,
    WcsprShort,
    Empty,
}

impl Path {
    fn calc(data: &PriceData) -> Self {
        let diff_threshold = 3.3f64;
        let long_diff = data.long_diff.abs();
        let short_diff = data.short_diff.abs();
        let long_price_diff = data.long_price - data.long_fair_price;
        let short_price_diff = data.short_price - data.short_fair_price;

        if long_price_diff > 0.0f64
            && short_price_diff < 0.0f64
            && long_diff > diff_threshold
            && short_diff > diff_threshold
        {
            Path::LongWcsprShort
        } else if short_price_diff > 0.0f64
            && long_price_diff < 0.0f64
            && long_diff > diff_threshold
            && short_diff > diff_threshold
        {
            Path::ShortWcsprLong
        } else if long_price_diff > 0.0f64 && long_diff > diff_threshold {
            Path::LongWcspr
        } else if short_price_diff > 0.0f64 && short_diff > diff_threshold {
            Path::ShortWcspr
        } else if long_price_diff < 0.0f64 && long_diff > diff_threshold {
            Path::WcsprLong
        } else if short_price_diff < 0.0f64 && short_diff > diff_threshold {
            Path::WcsprShort
        } else {
            Path::Empty
        }
    }

    fn build(&self, refs: &ContractRefs) -> Result<Vec<Address>, Error> {
        match self {
            Path::LongWcsprShort => Ok(vec![
                refs.token_address(Token::Long)?,
                refs.token_address(Token::Wcspr)?,
                refs.token_address(Token::Short)?,
            ]),
            Path::ShortWcsprLong => Ok(vec![
                refs.token_address(Token::Short)?,
                refs.token_address(Token::Wcspr)?,
                refs.token_address(Token::Long)?,
            ]),
            Path::LongWcspr => Ok(vec![
                refs.token_address(Token::Long)?,
                refs.token_address(Token::Wcspr)?,
            ]),
            Path::ShortWcspr => Ok(vec![
                refs.token_address(Token::Short)?,
                refs.token_address(Token::Wcspr)?,
            ]),
            Path::WcsprLong => Ok(vec![
                refs.token_address(Token::Wcspr)?,
                refs.token_address(Token::Long)?,
            ]),
            Path::WcsprShort => Ok(vec![
                refs.token_address(Token::Wcspr)?,
                refs.token_address(Token::Short)?,
            ]),
            Path::Empty => Ok(vec![]),
        }
    }

    fn is_multi_hop(&self) -> bool {
        matches!(self, Path::LongWcsprShort | Path::ShortWcsprLong)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_path_calc_long_overvalued_short_undervalued() {
        // Long is overvalued (100 > 90), short is undervalued (60 < 77)
        // Both diffs > 2.5% threshold
        let long_price = 100.0;
        let long_fair_price = 90.0;
        let short_price = 60.0;
        let short_fair_price = 77.0;
        let wcspr_price = 1.0;
        let data = PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        );
        assert_eq!(Path::calc(&data), Path::LongWcsprShort);
    }

    #[test]
    fn test_path_calc_short_overvalued_long_undervalued() {
        // Short is overvalued (100 > 90), long is undervalued (60 < 77)
        // Both diffs > 2.5% threshold
        let long_price = 60.0;
        let long_fair_price = 77.0;
        let short_price = 100.0;
        let short_fair_price = 90.0;
        let wcspr_price = 1.0;
        let data = PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        );
        assert_eq!(Path::calc(&data), Path::ShortWcsprLong);
    }

    #[test]
    fn test_path_calc_long_overvalued_only() {
        // Long is overvalued (100 > 90), short diff is below threshold
        let long_price = 100.0;
        let long_fair_price = 90.0;
        let short_price = 50.0;
        let short_fair_price = 50.5;
        let wcspr_price = 1.0;
        let data = PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        );
        assert_eq!(Path::calc(&data), Path::LongWcspr);
    }

    #[test]
    fn test_path_calc_short_overvalued_only() {
        // Short is overvalued (100 > 90), long diff is below threshold
        let long_price = 50.0;
        let long_fair_price = 50.5;
        let short_price = 100.0;
        let short_fair_price = 90.0;
        let wcspr_price = 1.0;
        let data = PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        );
        assert_eq!(Path::calc(&data), Path::ShortWcspr);
    }

    #[test]
    fn test_path_calc_long_undervalued_only() {
        // Long is undervalued (60 < 77), short diff is below threshold
        let long_price = 60.0;
        let long_fair_price = 77.0;
        let short_price = 50.0;
        let short_fair_price = 50.5;
        let wcspr_price = 1.0;
        let data = PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        );
        assert_eq!(Path::calc(&data), Path::WcsprLong);
    }

    #[test]
    fn test_path_calc_short_undervalued_only() {
        // Short is undervalued (60 < 77), long diff is below threshold
        let long_price = 50.0;
        let long_fair_price = 50.5;
        let short_price = 60.0;
        let short_fair_price = 77.0;
        let wcspr_price = 1.0;
        let data = PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        );
        assert_eq!(Path::calc(&data), Path::WcsprShort);
    }

    #[test]
    fn test_path_calc_empty_no_significant_diff() {
        // Both prices are close to fair prices (diffs < 2.5% threshold)
        let long_price = 100.0;
        let long_fair_price = 100.5;
        let short_price = 50.0;
        let short_fair_price = 50.5;
        let wcspr_price = 1.0;
        let data = PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        );
        assert_eq!(Path::calc(&data), Path::Empty);
    }

    #[test]
    fn test_path_calc_both_overvalued() {
        // Both are overvalued with significant diffs
        // Since the paired condition (long > 0 && short < 0) fails,
        // it falls through to check long_price_diff > 0, returning LongWcspr
        let long_price = 100.0;
        let long_fair_price = 90.0;
        let short_price = 100.0;
        let short_fair_price = 90.0;
        let wcspr_price = 1.0;
        let data = PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        );
        assert_eq!(Path::calc(&data), Path::LongWcspr);
    }

    #[test]
    fn test_path_calc_both_undervalued() {
        // Both are undervalued with significant diffs
        // Since the paired condition (short > 0 && long < 0) fails,
        // it falls through to check long_price_diff < 0, returning WcsprLong
        let long_price = 60.0;
        let long_fair_price = 77.0;
        let short_price = 60.0;
        let short_fair_price = 77.0;
        let wcspr_price = 1.0;
        let data = PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        );
        assert_eq!(Path::calc(&data), Path::WcsprLong);
    }

    #[test]
    fn test_path_calc_threshold_boundary_above() {
        // Test exactly at the threshold boundary (2.5%)
        // Long diff = 11.11% (100/90 = 1.111), short diff = 22.07% (60/77.3 = 0.776)
        let long_price = 100.0;
        let long_fair_price = 90.0;
        let short_price = 60.0;
        let short_fair_price = 77.3;
        let wcspr_price = 1.0;
        let data = PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        );
        assert_eq!(Path::calc(&data), Path::LongWcsprShort);
    }

    #[test]
    fn test_path_calc_threshold_boundary_below() {
        // Test just below the threshold (< 2.5%)
        // Long diff = 2.0% (102/100 = 1.02), short diff = 2.0% (51/50 = 1.02)
        let long_price = 102.0;
        let long_fair_price = 100.0;
        let short_price = 51.0;
        let short_fair_price = 50.0;
        let wcspr_price = 1.0;
        let data = PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        );
        assert_eq!(Path::calc(&data), Path::Empty);
    }
}
