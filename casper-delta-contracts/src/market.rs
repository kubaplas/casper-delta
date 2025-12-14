use crate::events::{
    ConfigUpdated, FeeCollected, LongDeposited, LongWithdrawn, PriceFeedUpdated, PriceUpdated,
    ShortDeposited, ShortWithdrawn,
};
use crate::market::MarketError::Misconfigured;
use crate::position_token::PositionTokenContractRef;
use crate::roles::ShortsRole;
use crate::{
    config::Config,
    system::{MarketState, Side},
};
use odra::casper_types::U256;
use odra::prelude::*;
use odra::ContractRef;
use odra_modules::access::{AccessControl, Role};
use odra_modules::cep18_token::Cep18ContractRef;
use odra_modules::cep96::{Cep96, Cep96ContractMetadata};
use odra_modules::security::Pauseable;
use odra_modules::wrapped_native::WrappedNativeTokenContractRef;
use styks_contracts::styks_price_feed::StyksPriceFeedContractRef;

const DEFAULT_FEE: u64 = 200; // 1/200 = 0.5%

const CONTRACT_NAME: &str = "Casper Delta Market";
const CONTRACT_DESCRIPTION: &str = "Main Market Contract for the Casper Delta project";
const CONTRACT_ICON_URI: &str = "https://casper-trade.kubaplas.pl/icon.png";
const CONTRACT_PROJECT_URI: &str = "https://casper-trade.kubaplas.pl/";

/// Comprehensive data structure containing all frontend-needed information for a specific address
#[odra::odra_type]
pub struct AddressMarketState {
    // Market state information
    pub market_state: MarketState,
    pub is_paused: bool,
    pub fee: U256,

    // Address-specific balances
    pub wcspr_balance: U256,
    pub long_token_balance: U256,
    pub short_token_balance: U256,
    pub market_allowance: U256,

    // Position values (calculated on-chain for consistency)
    pub long_position_value: U256,
    pub short_position_value: U256,
    pub total_position_value: U256,

    // Share percentages (as basis points, i.e., 10000 = 100%)
    pub long_share_percentage: U256,
    pub short_share_percentage: U256,

    // Contract configuration
    pub config: Config,
}

#[odra::module(
    events = [
        LongDeposited, ShortDeposited, LongWithdrawn, ShortWithdrawn, PriceUpdated,
        ConfigUpdated, PriceFeedUpdated, FeeCollected
    ],
    errors = MarketError
)]
pub struct Market {
    access_control: SubModule<AccessControl>,
    pauseable: SubModule<Pauseable>,
    metadata: SubModule<Cep96>,
    state: Var<MarketState>,
    price_feed: Var<Address>,
    price_feed_id: Var<String>,
    fee: Var<U256>,
    long_token: Var<Address>,
    short_token: Var<Address>,
    wcspr_token: Var<Address>,
    fee_collector: Var<Address>,
}

#[odra::module]
impl Market {
    pub fn init(&mut self, price_feed_address: Address, price_feed_id: String) {
        let caller = self.env().caller();
        let price_feed = StyksPriceFeedContractRef::new(self.env(), price_feed_address);
        let last_price = price_feed.get_twap_price(&price_feed_id);
        if let Some(last_price) = last_price {
            self.price_feed.set(price_feed_address);
            self.price_feed_id.set(price_feed_id);
            self.state.set(MarketState::new(U256::from(last_price)));
        } else {
            self.env().revert(MarketError::NewPriceIsFromTheFuture);
        }
        self.access_control
            .unchecked_grant_role(&ShortsRole::Admin.role_id(), &caller);

        self.fee.set(U256::from(DEFAULT_FEE));
        self.metadata.init(
            Some(CONTRACT_NAME.to_string()),
            Some(CONTRACT_DESCRIPTION.to_string()),
            Some(CONTRACT_ICON_URI.to_string()),
            Some(CONTRACT_PROJECT_URI.to_string()),
        );
    }

    delegate! {
        to self.access_control {
            fn has_role(&self, role: &Role, address: &Address) -> bool;
            fn grant_role(&mut self, role: &Role, address: &Address);
            fn revoke_role(&mut self, role: &Role, address: &Address);
            fn get_role_admin(&self, role: &Role) -> Role;
            fn renounce_role(&mut self, role: &Role, address: &Address);
        }
    }

    delegate! {
        to self.metadata {
            fn contract_name(&self) -> Option<String>;
            fn contract_description(&self) -> Option<String>;
            fn contract_icon_uri(&self) -> Option<String>;
            fn contract_project_uri(&self) -> Option<String>;
        }
    }

    pub fn pause(&mut self) {
        let caller = self.env().caller();
        self.assert_admin(&caller);
        self.pauseable.pause();
    }
    pub fn unpause(&mut self) {
        let caller = self.env().caller();
        self.assert_admin(&caller);
        self.pauseable.unpause();
    }
    pub fn is_paused(&self) -> bool {
        self.pauseable.is_paused()
    }

    pub fn update_price(&mut self) {
        let previous_state = self.get_state();
        let new_state = self.get_updated_state();
        let new_price = new_state.price();
        let previous_price = previous_state.price();
        self.set_state(new_state);

        self.env().emit_event(PriceUpdated {
            new_price,
            previous_price,
            timestamp: self.env().get_block_time(),
        });
    }

    pub fn deposit_long(&mut self, wcspr_amount: U256) {
        self.deposit_unchecked(&self.env().caller(), Side::Long, wcspr_amount);
    }

    pub fn deposit_long_from(&mut self, sender: &Address, wcspr_amount: U256) {
        if self.is_long_token(&self.env().caller()) {
            self.env()
                .revert(MarketError::LongTokenContractNotACallerOnDeposit);
        }
        self.deposit_unchecked(sender, Side::Long, wcspr_amount);
    }

    pub fn deposit_short(&mut self, wcspr_amount: U256) {
        self.deposit_unchecked(&self.env().caller(), Side::Short, wcspr_amount);
    }

    pub fn deposit_short_from(&mut self, sender: &Address, wcspr_amount: U256) {
        self.update_price();
        if self.is_short_token(&self.env().caller()) {
            self.env()
                .revert(MarketError::ShortTokenContractNotACallerOnDeposit);
        }
        self.deposit_unchecked(sender, Side::Short, wcspr_amount);
    }

    pub fn withdraw_long(&mut self, long_token_amount: U256) {
        self.withdrawal_unchecked(&self.env().caller(), Side::Long, long_token_amount);
    }

    pub fn withdraw_long_from(&mut self, sender: &Address, long_token_amount: U256) {
        if self.is_wcspr_token(&self.env().caller()) {
            self.env()
                .revert(MarketError::LongTokenContractNotACallerOnWithdrawal);
        }
        self.withdrawal_unchecked(sender, Side::Long, long_token_amount);
    }

    pub fn withdraw_short(&mut self, short_token_amount: U256) {
        self.withdrawal_unchecked(&self.env().caller(), Side::Short, short_token_amount);
    }

    pub fn withdraw_short_from(&mut self, sender: &Address, short_token_amount: U256) {
        if self.is_wcspr_token(&self.env().caller()) {
            self.env()
                .revert(MarketError::ShortTokenContractNotACallerOnWithdrawal);
        }
        self.withdrawal_unchecked(sender, Side::Short, short_token_amount);
    }

    pub fn get_market_state(&self) -> MarketState {
        self.get_state()
    }

    pub fn set_config(&mut self, cfg: Config) {
        let caller = self.env().caller();
        self.assert_config_manager(&caller);
        self.long_token.set(cfg.long_token);
        self.short_token.set(cfg.short_token);
        self.wcspr_token.set(cfg.wcspr_token);
        self.fee_collector.set(cfg.fee_collector);

        self.env().emit_event(ConfigUpdated {
            admin: caller,
            long_token: cfg.long_token,
            short_token: cfg.short_token,
            wcspr_token: cfg.wcspr_token,
            fee_collector: cfg.fee_collector,
        });
    }

    pub fn get_config(&self) -> Config {
        Config {
            long_token: self.long_token.get_or_revert_with(Misconfigured),
            short_token: self.short_token.get_or_revert_with(Misconfigured),
            wcspr_token: self.wcspr_token.get_or_revert_with(Misconfigured),
            fee_collector: self.fee_collector.get_or_revert_with(Misconfigured),
        }
    }

    pub fn set_price_feed(&mut self, price_feed_address: Address, price_feed_id: String) {
        let caller = self.env().caller();
        self.assert_price_manager(&caller);
        self.price_feed.set(price_feed_address);
        self.price_feed_id.set(price_feed_id.clone());

        self.env().emit_event(PriceFeedUpdated {
            admin: caller,
            price_feed_address,
            price_feed_id,
        });
    }

    /// Returns comprehensive market and user data in a single call for frontend efficiency.
    ///
    /// This endpoint consolidates all the data that the frontend typically needs:
    /// - Market state (price, liquidities, total supplies)
    /// - User balances (WCSPR, long tokens, short tokens)
    /// - Market allowance for spending WCSPR
    /// - Calculated position values in WCSPR terms
    /// - Share percentages in basis points (10000 = 100%)
    /// - Contract configuration and settings
    ///
    /// By combining these into a single call, the frontend can avoid making multiple
    /// separate requests, reducing latency and improving user experience.
    pub fn get_address_market_state(&self, address: Address) -> AddressMarketState {
        // Get updated market state with current price
        let market_state = self.get_updated_state();

        // Get user balances
        let wcspr_balance = self.wcspr_token_cep18().balance_of(&address);
        let long_token_balance = self.long_token_cep18().balance_of(&address);
        let short_token_balance = self.short_token_cep18().balance_of(&address);

        // Get market allowance
        let market_allowance = self
            .wcspr_token_cep18()
            .allowance(&address, &self.env().self_address());

        // Calculate position values
        let long_position_value = if market_state.long_total_supply.is_zero() {
            U256::zero()
        } else {
            long_token_balance.saturating_mul(market_state.long_liquidity)
                / market_state.long_total_supply
        };

        let short_position_value = if market_state.short_total_supply.is_zero() {
            U256::zero()
        } else {
            short_token_balance.saturating_mul(market_state.short_liquidity)
                / market_state.short_total_supply
        };

        let total_position_value = long_position_value.saturating_add(short_position_value);

        // Calculate share percentages (as basis points, i.e., 10000 = 100%)
        let long_share_percentage = if market_state.long_total_supply.is_zero() {
            U256::zero()
        } else {
            long_token_balance.saturating_mul(U256::from(10000u64)) / market_state.long_total_supply
        };

        let short_share_percentage = if market_state.short_total_supply.is_zero() {
            U256::zero()
        } else {
            short_token_balance.saturating_mul(U256::from(10000u64))
                / market_state.short_total_supply
        };

        AddressMarketState {
            market_state,
            is_paused: self.is_paused(),
            fee: self.fee.get().unwrap_or_revert(&self.env()),
            wcspr_balance,
            long_token_balance,
            short_token_balance,
            market_allowance,
            long_position_value,
            short_position_value,
            total_position_value,
            long_share_percentage,
            short_share_percentage,
            config: self.get_config(),
        }
    }

    fn long_token_address(&self) -> Address {
        self.long_token.get_or_revert_with(Misconfigured)
    }

    fn wcspr_token_address(&self) -> Address {
        self.wcspr_token.get_or_revert_with(Misconfigured)
    }

    fn short_token_address(&self) -> Address {
        self.short_token.get_or_revert_with(Misconfigured)
    }

    fn fee_collector_address(&self) -> Address {
        self.fee_collector.get_or_revert_with(Misconfigured)
    }
}

impl Market {
    fn get_updated_state(&self) -> MarketState {
        let price_feed = StyksPriceFeedContractRef::new(
            self.env(),
            self.price_feed
                .get()
                .unwrap_or_revert_with(&self.env(), Misconfigured),
        );
        let price_feed_id = self
            .price_feed_id
            .get()
            .unwrap_or_revert_with(&self.env(), Misconfigured);
        let new_price = price_feed.get_twap_price(&price_feed_id);
        if let Some(new_price) = new_price {
            let mut state = self.get_state();
            let new_price = U256::from(new_price);
            state.update_price(new_price);
            state
        } else {
            self.env().revert(MarketError::PriceFeedError);
        }
    }

    fn get_state(&self) -> MarketState {
        self.state.get().unwrap_or_revert(&self.env())
    }

    fn set_state(&mut self, state: MarketState) {
        self.state.set(state);
    }

    fn deposit_unchecked(&mut self, sender: &Address, side: Side, amount: U256) {
        self.pauseable.require_not_paused();
        self.collect_deposit(&sender, &amount);
        let (amount, fee) = self.split_fee(amount);
        self.collect_fee(&fee);

        let mut state = self.get_updated_state();
        let new_tokens = state.on_deposit(side, amount);
        self.set_state(state);

        // Mint new tokens to the caller.
        match side {
            Side::Long => {
                self.long_token().mint(&sender, &new_tokens);
                self.env().emit_event(LongDeposited {
                    user: *sender,
                    wcspr_amount: amount,
                    long_tokens_minted: new_tokens,
                    fee_collected: fee,
                });
            }
            Side::Short => {
                self.short_token().mint(&sender, &new_tokens);
                self.env().emit_event(ShortDeposited {
                    user: *sender,
                    wcspr_amount: amount,
                    short_tokens_minted: new_tokens,
                    fee_collected: fee,
                });
            }
        };
    }

    pub fn withdrawal_unchecked(&mut self, reciever: &Address, side: Side, amount: U256) {
        self.pauseable.require_not_paused();
        // Update the state and get the amount that can be withdrawn.
        let mut state = self.get_updated_state();
        let withdraw_amount = state.on_withdraw(side, amount);
        self.set_state(state);

        // Withdraw the deposit and fee.
        let (withdraw_amount, fee) = self.split_fee(withdraw_amount);
        self.collect_fee(&fee);
        self.withdraw_deposit(reciever, &withdraw_amount);

        // Burn the tokens and emit events.
        match side {
            Side::Long => {
                self.long_token().burn(&reciever, &amount);
                self.env().emit_event(LongWithdrawn {
                    user: *reciever,
                    long_tokens_burned: amount,
                    wcspr_amount: withdraw_amount,
                    fee_collected: fee,
                });
            }
            Side::Short => {
                self.short_token().burn(&reciever, &amount);
                self.env().emit_event(ShortWithdrawn {
                    user: *reciever,
                    short_tokens_burned: amount,
                    wcspr_amount: withdraw_amount,
                    fee_collected: fee,
                });
            }
        };
    }

    // Check if the new price is in fact newer and if so, update the last price.
    // fn handle_and_validate_new_price(&mut self, new: PriceData) {
    //     let current = self.last_price.get_or_revert_with(MarketError::LastPriceNotSet);
    //     if current.timestamp > new.timestamp {
    //         self.env().revert(MarketError::NewPriceIsTooOld);
    //     }
    //     if new.timestamp > self.env().get_block_time() {
    //         self.env().revert(MarketError::NewPriceIsFromTheFuture);
    //     }
    //     self.last_price.set(new);
    // }

    fn collect_fee(&mut self, amount: &U256) {
        if amount.is_zero() {
            return;
        }
        let fee_collector = self.fee_collector_address();
        self.wcspr_token().transfer(&fee_collector, amount);

        self.env().emit_event(FeeCollected {
            amount: *amount,
            fee_collector,
        });
    }

    fn collect_deposit(&mut self, sender: &Address, amount: &U256) {
        self.wcspr_token()
            .transfer_from(&sender, &self.env().self_address(), amount);
    }

    fn withdraw_deposit(&mut self, recipient: &Address, amount: &U256) {
        self.wcspr_token().transfer(recipient, amount);
    }

    fn assert_admin(&self, address: &Address) {
        if !self
            .access_control
            .has_role(&ShortsRole::Admin.role_id(), address)
        {
            self.env().revert(MarketError::Unauthorized);
        }
    }

    fn assert_price_manager(&self, address: &Address) {
        if !(self
            .access_control
            .has_role(&ShortsRole::PriceManager.role_id(), address)
            || self
                .access_control
                .has_role(&ShortsRole::Admin.role_id(), address))
        {
            self.env().revert(MarketError::Unauthorized);
        }
    }

    fn assert_config_manager(&self, address: &Address) {
        if !(self
            .access_control
            .has_role(&ShortsRole::ConfigManager.role_id(), address)
            || self
                .access_control
                .has_role(&ShortsRole::Admin.role_id(), address))
        {
            self.env().revert(MarketError::Unauthorized);
        }
    }
    fn split_fee(&self, amount: U256) -> (U256, U256) {
        let fee = self.fee.get().unwrap_or_revert(&self.env());
        let fee_amount = amount / fee;
        let left_amount = amount - fee_amount;
        (left_amount, fee_amount)
    }

    pub fn is_long_token(&self, addr: &Address) -> bool {
        &self.long_token_address() == addr
    }

    pub fn is_short_token(&self, addr: &Address) -> bool {
        &self.short_token_address() == addr
    }

    pub fn is_wcspr_token(&self, addr: &Address) -> bool {
        &self.wcspr_token_address() == addr
    }

    pub fn is_fee_collector(&self, addr: &Address) -> bool {
        &self.fee_collector_address() == addr
    }

    pub fn long_token(&self) -> PositionTokenContractRef {
        let addr = self.long_token_address();
        PositionTokenContractRef::new(self.env(), addr)
    }

    pub fn long_token_cep18(&self) -> Cep18ContractRef {
        let addr = self.long_token_address();
        Cep18ContractRef::new(self.env(), addr)
    }

    pub fn short_token(&self) -> PositionTokenContractRef {
        let addr = self.short_token_address();
        PositionTokenContractRef::new(self.env(), addr)
    }

    pub fn short_token_cep18(&self) -> Cep18ContractRef {
        let addr = self.short_token_address();
        Cep18ContractRef::new(self.env(), addr)
    }

    pub fn wcspr_token(&self) -> WrappedNativeTokenContractRef {
        let addr = self.wcspr_token_address();
        WrappedNativeTokenContractRef::new(self.env(), addr)
    }

    pub fn wcspr_token_cep18(&self) -> Cep18ContractRef {
        let addr = self.wcspr_token_address();
        Cep18ContractRef::new(self.env(), addr)
    }
}

#[odra::odra_error]
pub enum MarketError {
    LastPriceNotSet = 8001,
    NewPriceIsTooOld = 8002,
    NewPriceIsFromTheFuture = 8003,
    LongShareNotSet = 8004,
    TotalDepositNotSet = 8005,
    LongTokenContractNotACallerOnDeposit = 8006,
    ShortTokenContractNotACallerOnDeposit = 8007,
    LongTokenContractNotACallerOnWithdrawal = 8008,
    ShortTokenContractNotACallerOnWithdrawal = 8009,
    Misconfigured = 8010,
    PriceFeedError = 8011,
    Unauthorized = 8401,
}
