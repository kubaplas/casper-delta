#![cfg_attr(not(test), no_std)]
#![cfg_attr(not(test), no_main)]
extern crate alloc;

pub mod config;
pub mod events;
pub mod faucetable_wcspr;
pub mod market;
pub mod position_token;
pub mod price_data;
pub mod roles;
pub mod system;
