use odra::host::HostEnv;
use odra_cli::{
    scenario::{Args, Error, Scenario, ScenarioMetadata},
    CommandArg, ContractProvider, DeployedContractsContainer,
};
use styks_contracts::styks_price_feed::StyksPriceFeed;

pub struct UpdatePrice;
impl ScenarioMetadata for UpdatePrice {
    const NAME: &'static str = "UpdatePrice";
    const DESCRIPTION: &'static str = "Updates the price directly in the PriceFeed contract.";
}

impl Scenario for UpdatePrice {
    fn args(&self) -> Vec<CommandArg> {
        let price = CommandArg::new(
            "price",
            "The new price to set in the PriceFeed contract",
            odra::schema::casper_contract_schema::NamedCLType::U64,
        );
        vec![price.required()]
    }

    fn run(
        &self,
        env: &HostEnv,
        container: &DeployedContractsContainer,
        args: Args,
    ) -> core::result::Result<(), Error> {
        env.set_gas(50_000_000_000);
        let mut price_feed = container.contract_ref::<StyksPriceFeed>(env)?;
        let price = args.get_single::<u64>("price")?;
        price_feed.add_to_feed(vec![(String::from("CSPRUSD"), price)]);
        Ok(())
    }
}
