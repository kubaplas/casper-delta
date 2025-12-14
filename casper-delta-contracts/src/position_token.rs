use odra::{casper_types::U256, prelude::*, ContractRef};
use odra_modules::access::AccessControl;
use odra_modules::cep96::{Cep96, Cep96ContractMetadata};
use odra_modules::{cep18::errors::Error as Cep18Error, cep18_token::Cep18};

use crate::market::{MarketContractRef, MarketError};
use crate::position_token::PositionTokenError::Misconfigured;
use crate::roles::ShortsRole;

const CONTRACT_ICON_URI: &str = "https://casper-delta.kubaplas.pl/icon.png";
const CONTRACT_PROJECT_URI: &str = "https://casper-delta.kubaplas.pl/";

#[odra::odra_type]
pub enum LongOrShort {
    Long,
    Short,
}

#[odra::odra_error]
pub enum PositionTokenError {
    Misconfigured = 9001,
    PeerTransfersDisabled = 9002,
    Unauthorized = 9401,
}
/// A module definition. Each module struct consists of Vars and Mappings
/// or/and other modules.
#[odra::module]
pub struct PositionToken {
    /// A submodule that implements the CEP-18 token standard.
    token_type: Var<LongOrShort>,
    token: SubModule<Cep18>,
    access_control: SubModule<AccessControl>,
    metadata: SubModule<Cep96>,
    market: Var<Address>,
    wcspr: Var<Address>,
    peer_transfers_enabled: Var<bool>,
}

/// Module implementation.
///
/// To generate entrypoints,
/// an implementation block must be marked as #[odra::module].
#[odra::module]
impl PositionToken {
    /// Initializes the contract with the given metadata and initial supply.
    pub fn init(
        &mut self,
        name: String,
        symbol: String,
        contract_name: String,
        contract_description: String,
        decimals: u8,
        initial_supply: U256,
        long_or_short: LongOrShort,
        wcspr: Address,
        market: Address,
    ) {
        let caller = self.env().caller();
        self.token.init(symbol, name, decimals, initial_supply);
        self.access_control
            .unchecked_grant_role(&ShortsRole::Admin.role_id(), &caller);
        self.token_type.set(long_or_short);
        self.wcspr.set(wcspr);
        self.market.set(market);
        self.peer_transfers_enabled.set(true);
        self.metadata.init(
            Some(contract_name),
            Some(contract_description),
            Some(CONTRACT_ICON_URI.to_string()),
            Some(CONTRACT_PROJECT_URI.to_string()),
        );
    }

    pub fn transfer(&mut self, recipient: &Address, amount: &U256) {
        let sender = self.env().caller();
        if self.is_wcspr(&recipient) {
            let token_type = self.token_type.get().unwrap();
            match token_type {
                LongOrShort::Long => {
                    self.market().withdraw_long_from(&sender, *amount);
                }
                LongOrShort::Short => {
                    self.market().withdraw_short_from(&sender, *amount);
                }
            }
        } else {
            if !self.is_market(&recipient) && !self.peer_transfers_enabled.get_or_default() {
                self.env().revert(PositionTokenError::PeerTransfersDisabled);
            }
            self.token.raw_transfer(&sender, &recipient, &amount);
        }
    }

    pub fn transfer_from(&mut self, owner: &Address, recipient: &Address, amount: &U256) {
        let sender = self.env().caller();
        if self.is_market(&sender) {
            self.token.raw_transfer(owner, recipient, amount);
        } else {
            if !self.is_market(&recipient) && !self.peer_transfers_enabled.get_or_default() {
                self.env().revert(PositionTokenError::PeerTransfersDisabled);
            }
            self.token.transfer_from(owner, recipient, amount);
        }
    }

    /// Burns the given amount of tokens from the given address.
    pub fn burn(&mut self, owner: &Address, amount: &U256) {
        // self.assert_burn_and_mint_enabled();

        let caller = self.env().caller();
        if self.is_market(&caller) {
            if self.balance_of(owner) < *amount {
                self.env().revert(Cep18Error::InsufficientBalance);
            }
            self.token.raw_burn(owner, amount);
        } else {
            self.assert_owner(&caller);
            self.token.raw_burn(owner, amount);
        }
    }

    pub fn mint(&mut self, to: &Address, amount: &U256) {
        let caller = self.env().caller();
        if self.is_market(&caller) {
            self.token.raw_mint(to, amount);
        } else {
            self.assert_owner(&caller);
            self.token.raw_mint(to, amount);
        }
    }

    pub fn long_or_short(&self) -> LongOrShort {
        // Token type is initialized in `init` function, so we always expect it to be set.
        self.token_type.get().unwrap()
    }

    // Delegate all Cep18 functions to the token submodule.
    delegate! {
        to self.token {
            /// Returns the name of the token.
            fn name(&self) -> String;

            /// Returns the symbol of the token.
            fn symbol(&self) -> String;

            /// Returns the number of decimals the token uses.
            fn decimals(&self) -> u8;

            /// Returns the total supply of the token.
            fn total_supply(&self) -> U256;

            /// Returns the balance of the given address.
            fn balance_of(&self, address: &Address) -> U256;

            /// Returns the amount of tokens the owner has allowed the spender to spend.
            fn allowance(&self, owner: &Address, spender: &Address) -> U256;

            /// Approves the spender to spend the given amount of tokens on behalf of the caller.
            fn approve(&mut self, spender: &Address, amount: &U256);

            /// Decreases the allowance of the spender by the given amount.
            fn decrease_allowance(&mut self, spender: &Address, decr_by: &U256);

            /// Increases the allowance of the spender by the given amount.
            fn increase_allowance(&mut self, spender: &Address, inc_by: &U256);
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

    pub fn disable_peer_transfers(&mut self) {
        let caller = self.env().caller();
        self.assert_owner(&caller);
        self.peer_transfers_enabled.set(false);
    }

    pub fn enable_peer_transfers(&mut self) {
        let caller = self.env().caller();
        self.assert_owner(&caller);
        self.peer_transfers_enabled.set(true);
    }
}

impl PositionToken {
    pub fn market(&self) -> MarketContractRef {
        let addr = self.market.get_or_revert_with(Misconfigured);
        MarketContractRef::new(self.env(), addr)
    }

    fn is_wcspr(&self, address: &Address) -> bool {
        let wcspr = self.wcspr.get_or_revert_with(Misconfigured);
        &wcspr == address
    }

    fn is_market(&self, address: &Address) -> bool {
        let market = self.market.get_or_revert_with(Misconfigured);
        &market == address
    }

    fn assert_owner(&self, address: &Address) {
        if !(self
            .access_control
            .has_role(&ShortsRole::Owner.role_id(), address)
            || self
                .access_control
                .has_role(&ShortsRole::Admin.role_id(), address))
        {
            self.env().revert(MarketError::Unauthorized);
        }
    }
}
