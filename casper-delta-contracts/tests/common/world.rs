use casper_delta_contracts::{
    config::Config,
    market::{MarketHostRef, MarketInitArgs},
    system::MarketState,
};
use cucumber::World;
use odra::host::{Deployer, HostEnv, HostRef};
use odra::{casper_types::U256, host::NoArgs, uints::ToU512};
use odra_modules::wrapped_native::{WrappedNativeToken, WrappedNativeTokenHostRef};
use std::fmt::{Debug, Formatter};

use crate::common::params::{Account, TokenKind};
use casper_delta_contracts::faucetable_wcspr::{
    FaucetableWcspr, FaucetableWcsprHostRef, FaucetableWcsprInitArgs,
};
use casper_delta_contracts::market::Market;
use casper_delta_contracts::position_token::{
    LongOrShort, PositionToken, PositionTokenHostRef, PositionTokenInitArgs,
};
use odra::prelude::*;
use odra_modules::cep18_token::Cep18HostRef;
use styks_contracts::styks_price_feed::StyksPriceFeedRole::{ConfigManager, PriceSupplier};
use styks_contracts::styks_price_feed::{
    StyksPriceFeed, StyksPriceFeedConfig, StyksPriceFeedHostRef,
};

const INITIAL_WCSPR_BALANCE: u64 = 1_000_000_000_000u64; // 1000 CSPR
const PRICE_FEED_ID: &str = "CSPRUSD";

#[derive(World)]
pub struct CasperShortsWorld {
    pub odra_env: HostEnv,
    pub wcspr_token: WrappedNativeTokenHostRef,
    pub faucetable_wcspr: FaucetableWcsprHostRef,
    pub short_token: PositionTokenHostRef,
    pub long_token: PositionTokenHostRef,
    pub market: MarketHostRef,
    pub price_feed: StyksPriceFeedHostRef,
}

impl Default for CasperShortsWorld {
    fn default() -> Self {
        let odra_env = odra_test::env();
        let price_feed_id = String::from(PRICE_FEED_ID);

        let wcspr_token = WrappedNativeToken::deploy(&odra_env, NoArgs);
        let mut price_feed = StyksPriceFeed::deploy(&odra_env, NoArgs);
        let config = StyksPriceFeedConfig {
            heartbeat_interval: 100,
            heartbeat_tolerance: 10,
            twap_window: 3,
            twap_tolerance: 1,
            price_feed_ids: vec![price_feed_id.clone()],
        };
        price_feed.grant_role(&ConfigManager.role_id(), &odra_env.get_account(0));
        price_feed.grant_role(&PriceSupplier.role_id(), &odra_env.get_account(0));
        price_feed.set_config(config);
        price_feed.add_to_feed(vec![(price_feed_id.clone(), 100)]);

        // Move to the correct TWAP window.
        odra_env.advance_block_time(100 * 1000);
        price_feed.add_to_feed(vec![(price_feed_id.clone(), 100)]);

        let mut market = Market::deploy(
            &odra_env,
            MarketInitArgs {
                price_feed_address: price_feed.address(),
                price_feed_id,
            },
        );

        let faucetable_wcspr = FaucetableWcspr::deploy(
            &odra_env,
            FaucetableWcsprInitArgs {
                market: market.address(),
            },
        );

        let short_token = PositionToken::deploy(
            &odra_env,
            PositionTokenInitArgs {
                name: "CS_SHORT".to_string(),
                symbol: "SHORT".to_string(),
                decimals: 9,
                initial_supply: 0u64.into(),
                long_or_short: LongOrShort::Short,
                wcspr: wcspr_token.address(),
                market: market.address(),
                contract_name: "Casper Delta Short Token".to_string(),
                contract_description: "Casper Delta Short Token".to_string(),
            },
        );

        let long_token = PositionToken::deploy(
            &odra_env,
            PositionTokenInitArgs {
                name: "CS_LONG".to_string(),
                symbol: "LONG".to_string(),
                decimals: 9,
                initial_supply: 0u64.into(),
                long_or_short: LongOrShort::Long,
                wcspr: wcspr_token.address(),
                market: market.address(),
                contract_name: "Casper Delta Long Token".to_string(),
                contract_description: "Casper Delta Long Token".to_string(),
            },
        );

        // Update addresses.
        let cfg = Config {
            wcspr_token: wcspr_token.address().clone(),
            short_token: short_token.address().clone(),
            long_token: long_token.address().clone(),
            fee_collector: odra_env.get_account(Account::FeeCollector.index()),
        };

        odra_env.set_caller(odra_env.get_account(0));

        market.set_config(cfg.clone());
        // Make market minter of LONG and SHORT tokens.
        let mut world = CasperShortsWorld {
            wcspr_token,
            odra_env,
            short_token,
            long_token,
            market,
            price_feed,
            faucetable_wcspr,
        };
        world.mint(
            TokenKind::WCSPR,
            Account::Alice,
            U256::from(INITIAL_WCSPR_BALANCE),
        );
        world.mint(
            TokenKind::WCSPR,
            Account::Bob,
            U256::from(INITIAL_WCSPR_BALANCE),
        );

        world
    }
}

impl Debug for CasperShortsWorld {
    fn fmt(&self, f: &mut Formatter<'_>) -> core::fmt::Result {
        write!(f, "CasperShortsWorld")
    }
}

impl CasperShortsWorld {
    pub fn address(&self, account: Account) -> Address {
        match account {
            Account::MarketContract => self.market.address().clone(),
            Account::LongContract => self.long_token.address().clone(),
            Account::ShortContract => self.short_token.address().clone(),
            Account::WCSPRContract => self.wcspr_token.address().clone(),
            _ => self.odra_env.get_account(account.index()),
        }
    }

    pub fn balance_of(&self, token: TokenKind, account: Account) -> U256 {
        let address = self.address(account);
        match token {
            TokenKind::WCSPR => {
                let token_address = self.market.get_config().wcspr_token;
                let cep18 = Cep18HostRef::new(token_address, self.odra_env.clone());
                cep18.balance_of(&address)
            }
            TokenKind::SHORT => self.short_token.balance_of(&address),
            TokenKind::LONG => self.long_token.balance_of(&address),
        }
    }

    pub fn mint(&mut self, token: TokenKind, account: Account, amount: U256) {
        let address = self.address(account);
        match token {
            TokenKind::WCSPR => {
                let current_caller = self.odra_env.caller().clone();
                self.odra_env.set_caller(address);
                self.wcspr_token.with_tokens(amount.to_u512()).deposit();
                self.odra_env.set_caller(current_caller);
            }
            TokenKind::SHORT => self.short_token.mint(&address, &amount),
            TokenKind::LONG => self.long_token.mint(&address, &amount),
        }
    }

    pub fn go_long(&mut self, account: Account, amount: U256) {
        let address = self.address(account);
        self.odra_env.set_caller(address);
        self.wcspr_token.approve(&self.market.address(), &amount);
        self.market.deposit_long(amount);
    }

    pub fn go_short(&mut self, account: Account, amount: U256) {
        let address = self.address(account);
        self.odra_env.set_caller(address);
        self.wcspr_token.approve(&self.market.address(), &amount);
        self.market.deposit_short(amount);
    }

    pub fn withdraw_long(&mut self, account: Account, amount: U256) {
        let address = self.address(account);
        self.odra_env.set_caller(address);
        self.long_token.approve(&self.market.address(), &amount);
        self.market.withdraw_long(amount);
    }

    pub fn withdraw_short(&mut self, account: Account, amount: U256) {
        let address = self.address(account);
        self.odra_env.set_caller(address);
        self.short_token.approve(&self.market.address(), &amount);
        self.market.withdraw_short(amount);
    }

    pub fn set_price(&mut self, price: U256) {
        let price_feed_id = String::from(PRICE_FEED_ID);
        let price = styks_core::Price::from(price.as_u64());
        self.odra_env.set_caller(self.odra_env.get_account(0));
        // We need to add multiple entries to the price feed to update the TWAP.
        self.odra_env.advance_block_time(100 * 1000);
        self.price_feed
            .add_to_feed(vec![(price_feed_id.clone(), price)]);
        self.odra_env.advance_block_time(100 * 1000);
        self.price_feed
            .add_to_feed(vec![(price_feed_id.clone(), price)]);
        self.odra_env.advance_block_time(100 * 1000);
        self.price_feed.add_to_feed(vec![(price_feed_id, price)]);
        self.market.update_price();
    }

    pub fn get_market_state(&self) -> MarketState {
        self.market.get_market_state()
    }

    pub fn transfer(&mut self, token: TokenKind, sender: Account, amount: U256, receiver: Account) {
        self.try_transfer(token, sender, amount, receiver)
            .expect("Transfer failed");
    }

    pub fn try_transfer(
        &mut self,
        token: TokenKind,
        sender: Account,
        amount: U256,
        receiver: Account,
    ) -> OdraResult<()> {
        let sender = self.address(sender);
        let receiver = self.address(receiver);
        self.odra_env.set_caller(sender);
        match token {
            TokenKind::WCSPR => self.wcspr_token.try_transfer(&receiver, &amount),
            TokenKind::SHORT => self.short_token.try_transfer(&receiver, &amount),
            TokenKind::LONG => self.long_token.try_transfer(&receiver, &amount),
        }
    }
}
