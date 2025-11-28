use odra::prelude::*;

#[odra::odra_type]
pub struct Config {
    pub long_token: Address,
    pub short_token: Address,
    pub wcspr_token: Address,
    pub fee_collector: Address,
}
