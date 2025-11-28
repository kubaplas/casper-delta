use crate::common::{
    params::{Account, Amount},
    world::CasperShortsWorld,
};
use cucumber::{given, then, when};
use odra::prelude::Addressable;

#[given(expr = "{account} changed the wcspr to faucetable wcspr")]
fn go_long(world: &mut CasperShortsWorld, account: Account) {
    let mut cfg = world.market.get_config();
    cfg.wcspr_token = world.faucetable_wcspr.address();
    world
        .odra_env
        .set_caller(world.odra_env.get_account(account.index()));
    world.market.set_config(cfg);
}

#[given(expr = "{account} paused the market")]
fn pause_market(world: &mut CasperShortsWorld, account: Account) {
    let address = world.odra_env.get_account(account.index());
    world.odra_env.set_caller(address);
    world.market.pause();
}

#[given(expr = "{account} unpaused the market")]
fn unpause_market(world: &mut CasperShortsWorld, account: Account) {
    let address = world.odra_env.get_account(account.index());
    world.odra_env.set_caller(address);
    world.market.unpause();
}

#[then(expr = "market is paused")]
fn assert_market_paused(world: &mut CasperShortsWorld) {
    assert!(world.market.is_paused());
}

#[then(expr = "market is not paused")]
fn assert_market_not_paused(world: &mut CasperShortsWorld) {
    assert!(!world.market.is_paused());
}

#[when(expr = "{account} uses the faucet")]
fn use_faucet(world: &mut CasperShortsWorld, account: Account) {
    let address = world.odra_env.get_account(account.index());
    world.odra_env.set_caller(address);
    let _ = world.faucetable_wcspr.try_faucet();
}

#[when(expr = "{account} allows MarketContract to spend {amount} WCSPR")]
fn approve_wcspr(world: &mut CasperShortsWorld, account: Account, amount: Amount) {
    let address = world.odra_env.get_account(account.index());
    world.odra_env.set_caller(address);
    world
        .faucetable_wcspr
        .approve(&world.market.address(), &amount.value());
}

#[given(expr = "{account} disabled peer transfers")]
fn disable_peer_transfers(world: &mut CasperShortsWorld, account: Account) {
    let address = world.odra_env.get_account(account.index());
    world.odra_env.set_caller(address);
    world.long_token.disable_peer_transfers();
    world.short_token.disable_peer_transfers();
}

#[given(expr = "{account} enabled peer transfers")]
fn enable_peer_transfers(world: &mut CasperShortsWorld, account: Account) {
    let address = world.odra_env.get_account(account.index());
    world.odra_env.set_caller(address);
    world.long_token.enable_peer_transfers();
    world.short_token.enable_peer_transfers();
}
