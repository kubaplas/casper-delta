use odra::{
    casper_types::U256,
    host::{HostEnv, HostRef},
    uints::ToU256,
};
use odra_cli::{cspr, scenario::Error};

use crate::scenarios::bot::{path::Path, ContractRefs};

const TOP_UP_AMOUNT: u64 = 2_000_000_000;

pub struct AssetManager<'a> {
    env: &'a HostEnv,
    refs: &'a ContractRefs<'a>,
}

impl<'a> AssetManager<'a> {
    pub fn new(env: &'a HostEnv, refs: &'a ContractRefs<'a>) -> Self {
        Self { env, refs }
    }

    pub fn ensure_funds(&self, path: Path, amount_in: U256) -> Result<(), Error> {
        match path {
            Path::LongWcsprShort | Path::LongWcspr => self.top_up_longs_if_required(amount_in)?,
            Path::ShortWcsprLong | Path::ShortWcspr => self.top_up_shorts_if_required(amount_in)?,
            Path::WcsprLong | Path::WcsprShort => self.wrap_cspr_if_required()?,
            Path::Empty => panic!("Empty path is not supported"),
        }
        Ok(())
    }

    pub fn print_balances(&self) -> Result<(), Error> {
        odra_cli::log("===== Balances =====");
        odra_cli::log(&format!(
            "CSPR balance: {:.2}",
            self.my_cspr_balance()?.as_u64() as f64 / 1_000_000_000.0f64
        ));
        odra_cli::log(&format!(
            "WCSPR balance: {:.2}",
            self.my_wcspr_balance()?.as_u64() as f64 / 1_000_000_000.0f64
        ));
        odra_cli::log(&format!(
            "Long balance: {:.2}",
            self.my_long_balance()?.as_u64() as f64 / 1_000_000_000.0f64
        ));
        odra_cli::log(&format!(
            "Short balance: {:.2}",
            self.my_short_balance()?.as_u64() as f64 / 1_000_000_000.0f64
        ));
        odra_cli::log("====================");
        Ok(())
    }

    fn top_up_longs_if_required(&self, amount_in: U256) -> Result<(), Error> {
        let me = self.env.caller();
        let long_token = self.refs.long()?;
        let wcspr_token = self.refs.wcspr()?;
        let long_balance = long_token.balance_of(&me);
        let required_balance = amount_in;
        if long_balance < required_balance {
            odra_cli::log("Toping up longs");
            if wcspr_token.balance_of(&me) < TOP_UP_AMOUNT.into() {
                odra_cli::log("Not enough wcspr to top up longs");
                return Err(Error::OdraError {
                    message: "Not enough wcspr to top up longs".to_string(),
                });
            }
            self.env.set_gas(cspr!(2.5));
            self.refs.market()?.try_deposit_long(TOP_UP_AMOUNT.into())?;
        }

        Ok(())
    }

    fn top_up_shorts_if_required(&self, amount_in: U256) -> Result<(), Error> {
        let me = self.env.caller();
        let short_token = self.refs.short()?;
        let wcspr_token = self.refs.wcspr()?;
        let short_balance = short_token.balance_of(&me);
        let required_balance = amount_in;
        if short_balance < required_balance {
            odra_cli::log("Toping up shorts");
            if wcspr_token.balance_of(&me) < TOP_UP_AMOUNT.into() {
                odra_cli::log("Not enough wcspr to top up shorts");
                return Err(Error::OdraError {
                    message: "Not enough wcspr to top up shorts".to_string(),
                });
            }
            self.env.set_gas(cspr!(2.5));
            self.refs
                .market()?
                .try_deposit_short(TOP_UP_AMOUNT.into())?;
        }

        Ok(())
    }

    fn wrap_cspr_if_required(&self) -> Result<(), Error> {
        let cspr_balance = self.my_cspr_balance()?;
        if cspr_balance.as_u64() < TOP_UP_AMOUNT {
            return Err(Error::OdraError {
                message: "Not enough cspr to wrap".to_string(),
            });
        }
        self.env.set_gas(cspr!(4));
        self.refs
            .wcspr()?
            .with_tokens(TOP_UP_AMOUNT.into())
            .deposit();

        Ok(())
    }

    fn my_cspr_balance(&self) -> Result<U256, Error> {
        let me = self.env.caller();
        Ok(self
            .env
            .balance_of(&me)
            .to_u256()
            .map_err(|_| Error::OdraError {
                message: "Failed to convert cspr balance to u256".to_string(),
            })?)
    }

    fn my_wcspr_balance(&self) -> Result<U256, Error> {
        let me = self.env.caller();
        Ok(self.refs.wcspr()?.balance_of(&me))
    }

    fn my_long_balance(&self) -> Result<U256, Error> {
        let me = self.env.caller();
        Ok(self.refs.long()?.balance_of(&me))
    }

    fn my_short_balance(&self) -> Result<U256, Error> {
        let me = self.env.caller();
        Ok(self.refs.short()?.balance_of(&me))
    }
}
