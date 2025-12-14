//!
use std::str::FromStr;

use casper_delta_cli::scenarios::{SetMarketConfig, UpdatePrice};
use casper_delta_contracts::config::Config;
use casper_delta_contracts::faucetable_wcspr::{FaucetableWcspr, FaucetableWcsprInitArgs};
use casper_delta_contracts::market::{Market, MarketInitArgs};
use casper_delta_contracts::position_token::{LongOrShort, PositionToken, PositionTokenInitArgs};
use odra::host::{HostEnv, InstallConfig};
use odra::prelude::{Address, Addressable};
use odra_cli::{cspr, deploy::DeployScript, DeployedContractsContainer, DeployerExt, OdraCli};
use styks_contracts::styks_price_feed::StyksPriceFeed;
// mod scenarios;

const PRICE_FEED_ID: &str = "CSPRUSD";
pub struct ContractsDeployScript;
impl DeployScript for ContractsDeployScript {
    fn deploy(
        &self,
        env: &HostEnv,
        container: &mut DeployedContractsContainer,
    ) -> Result<(), odra_cli::deploy::Error> {
        let price_feed_address = Address::from_str(
            "hash-2879d6e927289197aab0101cc033f532fe22e4ab4686e44b5743cb1333031acc",
        )
        .unwrap();
        env.set_gas(50_000_000_000);

        let mut market = Market::load_or_deploy_with_cfg(
            env,
            None,
            MarketInitArgs {
                price_feed_address,
                price_feed_id: PRICE_FEED_ID.to_string(),
            },
            InstallConfig::upgradable::<Market>(),
            container,
            cspr!(400),
        )?;

        let wcspr_token = FaucetableWcspr::load_or_deploy_with_cfg(
            env,
            None,
            FaucetableWcsprInitArgs {
                market: market.address(),
            },
            InstallConfig::upgradable::<FaucetableWcspr>(),
            container,
            cspr!(400),
        )?;

        let short_token = PositionToken::load_or_deploy_with_cfg(
            env,
            Some("CD_SHORT".to_string()),
            PositionTokenInitArgs {
                name: "Casper Delta Short Token".to_string(),
                symbol: "CD_SHORT".to_string(),
                contract_name: "Casper Delta Short Token".to_string(),
                contract_description: "Short position token used by Casper Delta.".to_string(),
                decimals: 9,
                initial_supply: 0u64.into(),
                long_or_short: LongOrShort::Short,
                wcspr: wcspr_token.address(),
                market: market.address(),
            },
            InstallConfig {
                package_named_key: "short_token".to_string(),
                is_upgradable: true,
                allow_key_override: true,
            },
            container,
            cspr!(400),
        )?;

        let long_token = PositionToken::load_or_deploy_with_cfg(
            env,
            Some("CD_LONG".to_string()),
            PositionTokenInitArgs {
                name: "Casper Delta Long Token".to_string(),
                symbol: "CD_LONG".to_string(),
                contract_name: "Casper Delta Long Token".to_string(),
                contract_description: "Long position Token used by Casper Delta".to_string(),
                decimals: 9,
                initial_supply: 0u64.into(),
                long_or_short: LongOrShort::Long,
                wcspr: wcspr_token.address(),
                market: market.address(),
            },
            InstallConfig {
                package_named_key: "long_token".to_string(),
                is_upgradable: true,
                allow_key_override: true,
            },
            container,
            cspr!(400),
        )?;

        let cfg = Config {
            wcspr_token: wcspr_token.address().clone(),
            short_token: short_token.address().clone(),
            long_token: long_token.address().clone(),
            fee_collector: env.get_account(0),
        };

        market.set_config(cfg.clone());

        Ok(())
    }
}

/// Main function to run the CLI tool.
pub fn main() {
    OdraCli::new()
        .about("Casper Delta CLI Tool")
        .deploy(ContractsDeployScript)
        .contract::<StyksPriceFeed>()
        .contract::<Market>()
        .named_contract::<PositionToken>("CD_LONG".to_string())
        .named_contract::<PositionToken>("CD_SHORT".to_string())
        .contract::<FaucetableWcspr>()
        .scenario(UpdatePrice)
        .scenario(SetMarketConfig)
        .build()
        .run();
}
