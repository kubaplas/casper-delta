use casper_delta_contracts::{config::Config, market::Market};
use odra::host::HostEnv;
use odra::prelude::*;
use odra_cli::{
    scenario::{Args, Error, Scenario, ScenarioMetadata},
    CommandArg, ContractProvider, DeployedContractsContainer,
};

pub struct SetMarketConfig;

impl ScenarioMetadata for SetMarketConfig {
    const NAME: &'static str = "SetMarketConfig";
    const DESCRIPTION: &'static str = "Sets the configuration for the Market contract.";
}

impl Scenario for SetMarketConfig {
    fn args(&self) -> Vec<CommandArg> {
        use odra::schema::casper_contract_schema::NamedCLType;

        vec![
            CommandArg::new(
                "long_token",
                "Address of the long position token contract (optional)",
                NamedCLType::String,
            ),
            CommandArg::new(
                "short_token",
                "Address of the short position token contract (optional)",
                NamedCLType::String,
            ),
            CommandArg::new(
                "wcspr_token",
                "Address of the WCSPR token contract (optional)",
                NamedCLType::String,
            ),
            CommandArg::new(
                "fee_collector",
                "Address of the fee collector (optional)",
                NamedCLType::String,
            ),
        ]
    }

    fn run(
        &self,
        env: &HostEnv,
        container: &DeployedContractsContainer,
        args: Args,
    ) -> Result<(), Error> {
        self.configure_market(env, container, args)?;
        Ok(())
    }
}

impl SetMarketConfig {
    fn configure_market(
        &self,
        env: &HostEnv,
        container: &DeployedContractsContainer,
        args: Args,
    ) -> Result<(), Error> {
        odra_cli::log("Setting configuration for Market contract.");

        let mut market = container.contract_ref::<Market>(env)?;

        // Get the current configuration as base
        let current_config = market.get_config();

        // Parse optional arguments and use current values as defaults
        let long_token_addr = if let Ok(long_token_str) = args.get_single::<String>("long_token") {
            long_token_str
                .parse::<Address>()
                .map_err(|_| Error::OdraError {
                    message: "Invalid long_token address format".to_string(),
                })?
        } else {
            current_config.long_token
        };

        let short_token_addr = if let Ok(short_token_str) = args.get_single::<String>("short_token")
        {
            short_token_str
                .parse::<Address>()
                .map_err(|_| Error::OdraError {
                    message: "Invalid short_token address format".to_string(),
                })?
        } else {
            current_config.short_token
        };

        let wcspr_token_addr = if let Ok(wcspr_token_str) = args.get_single::<String>("wcspr_token")
        {
            wcspr_token_str
                .parse::<Address>()
                .map_err(|_| Error::OdraError {
                    message: "Invalid wcspr_token address format".to_string(),
                })?
        } else {
            current_config.wcspr_token
        };

        let fee_collector =
            if let Ok(fee_collector_str) = args.get_single::<String>("fee_collector") {
                fee_collector_str
                    .parse::<Address>()
                    .map_err(|_| Error::OdraError {
                        message: "Invalid fee_collector address format".to_string(),
                    })?
            } else {
                current_config.fee_collector
            };

        let config = Config {
            long_token: long_token_addr,
            short_token: short_token_addr,
            wcspr_token: wcspr_token_addr,
            fee_collector,
        };

        // Log which values are being updated
        let mut updates = Vec::new();
        if current_config.long_token != config.long_token {
            updates.push("long_token");
        }
        if current_config.short_token != config.short_token {
            updates.push("short_token");
        }
        if current_config.wcspr_token != config.wcspr_token {
            updates.push("wcspr_token");
        }
        if current_config.fee_collector != config.fee_collector {
            updates.push("fee_collector");
        }

        if updates.is_empty() {
            odra_cli::log("No configuration changes needed - all values already match.");
            return Ok(());
        }

        odra_cli::log(format!(
            "Updating configuration fields: {}",
            updates.join(", ")
        ));
        env.set_gas(5_000_000_000u64);
        market.set_config(config);
        odra_cli::log("Configuration set successfully for Market contract.");

        Ok(())
    }
}
