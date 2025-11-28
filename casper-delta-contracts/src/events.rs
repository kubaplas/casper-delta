use odra::{casper_types::U256, prelude::*};

/// Event emitted when a user deposits into a long position
#[odra::event]
pub struct LongDeposited {
    /// The address of the user who deposited
    pub user: Address,
    /// The amount of WCSPR that was deposited
    pub wcspr_amount: U256,
    /// The amount of long tokens that were minted
    pub long_tokens_minted: U256,
    /// The fee that was collected
    pub fee_collected: U256,
}

/// Event emitted when a user deposits into a short position
#[odra::event]
pub struct ShortDeposited {
    /// The address of the user who deposited
    pub user: Address,
    /// The amount of WCSPR that was deposited
    pub wcspr_amount: U256,
    /// The amount of short tokens that were minted
    pub short_tokens_minted: U256,
    /// The fee that was collected
    pub fee_collected: U256,
}

/// Event emitted when a user withdraws from a long position
#[odra::event]
pub struct LongWithdrawn {
    /// The address of the user who withdrew
    pub user: Address,
    /// The amount of long tokens that were burned
    pub long_tokens_burned: U256,
    /// The amount of WCSPR that was withdrawn
    pub wcspr_amount: U256,
    /// The fee that was collected
    pub fee_collected: U256,
}

/// Event emitted when a user withdraws from a short position
#[odra::event]
pub struct ShortWithdrawn {
    /// The address of the user who withdrew
    pub user: Address,
    /// The amount of short tokens that were burned
    pub short_tokens_burned: U256,
    /// The amount of WCSPR that was withdrawn
    pub wcspr_amount: U256,
    /// The fee that was collected
    pub fee_collected: U256,
}

/// Event emitted when the market price is updated
#[odra::event]
pub struct PriceUpdated {
    /// The new price
    pub new_price: U256,
    /// The previous price
    pub previous_price: U256,
    /// The timestamp when the price was updated
    pub timestamp: u64,
}

/// Event emitted when the market configuration is updated
#[odra::event]
pub struct ConfigUpdated {
    /// The address of the admin who updated the config
    pub admin: Address,
    /// The new long token address
    pub long_token: Address,
    /// The new short token address
    pub short_token: Address,
    /// The new WCSPR token address
    pub wcspr_token: Address,
    /// The new fee collector address
    pub fee_collector: Address,
}

/// Event emitted when the price feed is updated
#[odra::event]
pub struct PriceFeedUpdated {
    /// The address of the admin who updated the price feed
    pub admin: Address,
    /// The new price feed address
    pub price_feed_address: Address,
    /// The new price feed ID
    pub price_feed_id: String,
}

/// Event emitted when a fee is collected
#[odra::event]
pub struct FeeCollected {
    /// The amount of WCSPR that was collected as fee
    pub amount: U256,
    /// The address of the fee collector
    pub fee_collector: Address,
}
