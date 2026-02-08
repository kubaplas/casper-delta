use std::{thread::sleep, time::Duration};

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

use crate::scenarios::bot::{
    asset_manager::AssetManager, data::PriceData, path::Path, utils::PriceCalculator,
};

mod asset_manager;
mod data;
mod path;
mod utils;
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
        let caller = env.caller();

        let dry_run = args.get_single("dry-run").unwrap_or(false);
        if dry_run {
            println!("Dry run mode enabled");
        }
        let asset_manager = AssetManager::new(env, &contracts);
        asset_manager.print_balances()?;

        loop {
            odra_cli::log(&format!(
                "Current time: {}",
                chrono::Local::now().format("%Y-%m-%d %H:%M:%S")
            ));

            let price_data = self.get_price_data(&calc)?;
            odra_cli::log(&price_data);

            let path = Path::from(&price_data);
            odra_cli::log(&format!("Swap path: {:?}", path));
            if path == Path::Empty {
                odra_cli::log("No arbitrage path found\n");
                self.cool_down();
                continue;
            }

            let amount_in = price_data.get_amount_in(path);
            if let Ok([amount_in, .., amount_out]) = self
                .get_swap_amounts(&contracts, path, amount_in)
                .as_deref()
            {
                if dry_run {
                    odra_cli::log("Dry run mode - no swap completed");
                    Self::print_gains_in_cspr(*amount_in, *amount_out, &price_data, path);
                    self.cool_down();
                    continue;
                }

                let (actual_amount_in, actual_amount_out) =
                    self.swap(env, &contracts, path, *amount_in, *amount_out, caller)?;
                Self::print_gains_in_cspr(actual_amount_in, actual_amount_out, &price_data, path);
            } else {
                odra_cli::log("No valid swap amounts found\n");
            }
            self.cool_down();
        }
    }
}

impl Bot {
    fn swap(
        &self,
        env: &HostEnv,
        refs: &ContractRefs,
        path: Path,
        amount_in: U256,
        amount_out: U256,
        recipient: Address,
    ) -> Result<(U256, U256), Error> {
        let asset_manager = AssetManager::new(env, refs);
        asset_manager.ensure_funds(path, amount_in)?;
        if path.is_multi_hop() {
            env.set_gas(cspr!(13));
        } else {
            env.set_gas(cspr!(8));
        }
        let result = refs.router()?.swap_tokens_for_exact_tokens(
            amount_out,
            amount_in,
            path.build(refs)?,
            recipient,
            u64::MAX,
        );
        odra_cli::log("Arbitrage swap completed");
        asset_manager.print_balances()?;

        if let [amount_in, .., amount_out] = result.as_slice() {
            Ok((*amount_in, *amount_out))
        } else {
            Err(Error::OdraError {
                message: "Invalid swap result".to_string(),
            })
        }
    }

    fn get_price_data(&self, calc: &PriceCalculator) -> Result<PriceData, Error> {
        let (long_price, short_price) = calc.casper_trade_prices()?;
        let (long_fair_price, short_fair_price, wcspr_price) = calc.fair_prices()?;

        Ok(PriceData::new(
            long_price,
            short_price,
            wcspr_price,
            long_fair_price,
            short_fair_price,
        ))
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

    fn print_gains_in_cspr(amount_in: U256, amount_out: U256, price_data: &PriceData, path: Path) {
        let average_transaction_cost = if path.is_multi_hop() { 12.5f64 } else { 8.0f64 };
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
        odra_cli::log(&format!("Gain: {gain_cspr:.2} CSPR"));
        odra_cli::log(&format!("Gain percent: {gain_percent:.2}%"));
    }

    fn cool_down(&self) {
        odra_cli::log("Sleeping for 3 minutes...");
        odra_cli::log("=======================\n");
        sleep(Duration::from_secs(180));
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
}
