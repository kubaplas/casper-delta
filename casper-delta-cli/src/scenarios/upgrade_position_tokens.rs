use odra::host::{Deployer, HostEnv, NoArgs};
use odra::prelude::Addressable;
use odra_cli::{
    cspr,
    scenario::{Args, Error, Scenario, ScenarioMetadata},
    CommandArg, ContractProvider, DeployedContractsContainer,
};
use casper_delta_contracts::position_token::PositionToken;
use crate::{CD_LONG_ID, CD_SHORT_ID};

pub struct UpgradePositionTokens;

impl ScenarioMetadata for UpgradePositionTokens {
    const NAME: &'static str = "UpgradePositionTokens";
    const DESCRIPTION: &'static str = "Upgrade Position Tokens to the newest version";
}

impl Scenario for UpgradePositionTokens {
    fn args(&self) -> Vec<CommandArg> {
        vec![]
    }

    fn run(
        &self,
        env: &HostEnv,
        container: &DeployedContractsContainer,
        _args: Args,
    ) -> Result<(), Error> {

        let long_token = container.contract_ref_named::<PositionToken>(env, Some(CD_LONG_ID.to_string()))?;
        let short_token = container.contract_ref_named::<PositionToken>(env, Some(CD_SHORT_ID.to_string()))?;
        env.set_gas(cspr!(400));
        odra_cli::log(format!(
            "Upgrading Position Token Long at address: {:?}",
            long_token.address()
        ));

        let _ = PositionToken::try_upgrade(env, long_token.address(), NoArgs).unwrap();
        odra_cli::log("Upgraded Position Token Long successfully.");
        odra_cli::log(format!(
            "Upgrading Position Token Short at address: {:?}",
            short_token.address()
        ));

        let _ = PositionToken::try_upgrade(env, short_token.address(), NoArgs).unwrap();
        Ok(())
    }
}
