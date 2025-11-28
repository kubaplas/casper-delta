use crate::faucetable_wcspr::Error::{FaucetAlreadyUsed, OnlyTransferManagerCanTransferFunds};
use crate::roles::FaucetRole;
use odra::casper_types::U256;
use odra::prelude::*;
use odra_modules::access::{AccessControl, Role};
use odra_modules::cep18_token::Cep18;

pub const FAUCET_AMOUNT: u64 = 1_000_000_000_000; // 1000 WCSPR

#[odra::module]
pub struct FaucetableWcspr {
    access_control: SubModule<AccessControl>,
    wcspr: SubModule<Cep18>,
    fauceted_accounts: Mapping<Address, bool>,
    participants: List<Address>,
}

#[odra::module]
impl FaucetableWcspr {
    pub fn init(&mut self, market: Address) {
        self.wcspr.init(
            "CDWCSPR".to_string(),
            "Casper Delta Competition Wrapped CSPR".to_string(),
            9,
            U256::zero(),
        );
        // Grant admin role to the caller and transfer manager role to the market
        let caller = self.env().caller();
        self.access_control
            .unchecked_grant_role(&FaucetRole::Admin.role_id(), &caller);
        self.access_control
            .unchecked_grant_role(&FaucetRole::TransferManager.role_id(), &market);
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
        to self.wcspr {
            fn name(&self) -> String;
            fn symbol(&self) -> String;
            fn decimals(&self) -> u8;
            fn total_supply(&self) -> U256;
            fn balance_of(&self, address: &Address) -> U256;
            fn allowance(&self, owner: &Address, spender: &Address) -> U256;
            fn approve(&mut self, spender: &Address, amount: &U256);
        }
    }

    pub fn transfer(&mut self, recipient: &Address, amount: &U256) {
        self.assert_allowed_transfer();
        self.wcspr.transfer(recipient, amount);
    }

    pub fn transfer_from(&mut self, owner: &Address, recipient: &Address, amount: &U256) {
        self.assert_allowed_transfer();
        self.wcspr.transfer_from(owner, recipient, amount);
    }

    pub fn faucet(&mut self) {
        let caller = self.env().caller();
        if self.fauceted_accounts.get(&caller).unwrap_or(false) {
            self.env().revert(FaucetAlreadyUsed);
        }
        self.wcspr.raw_mint(&caller, &U256::from(FAUCET_AMOUNT));
        self.fauceted_accounts.set(&caller, true);
        self.participants.push(caller);
    }

    pub fn participants(&self) -> Vec<Address> {
        self.participants.iter().collect()
    }

    /// Add a new transfer manager (admin only)
    pub fn add_transfer_manager(&mut self, address: &Address) {
        let caller = self.env().caller();
        self.assert_admin(&caller);
        self.access_control
            .grant_role(&FaucetRole::TransferManager.role_id(), address);
    }

    /// Remove a transfer manager (admin only)
    pub fn remove_transfer_manager(&mut self, address: &Address) {
        let caller = self.env().caller();
        self.assert_admin(&caller);
        self.access_control
            .revoke_role(&FaucetRole::TransferManager.role_id(), address);
    }
}

impl FaucetableWcspr {
    pub fn assert_allowed_transfer(&self) {
        let caller = self.env().caller();
        if !self
            .access_control
            .has_role(&FaucetRole::TransferManager.role_id(), &caller)
        {
            self.env().revert(OnlyTransferManagerCanTransferFunds);
        }
    }

    fn assert_admin(&self, address: &Address) {
        if !self
            .access_control
            .has_role(&FaucetRole::Admin.role_id(), address)
        {
            self.env().revert(Error::Unauthorized);
        }
    }
}

#[odra::odra_error]
pub enum Error {
    OnlyTransferManagerCanTransferFunds = 10001,
    FaucetAlreadyUsed = 10002,
    Unauthorized = 10003,
}
