use odra_modules::access::{Role, DEFAULT_ADMIN_ROLE};

#[derive(Debug)]
pub enum ShortsRole {
    Admin,
    Owner,
    PriceManager,
    ConfigManager,
}

#[derive(Debug)]
pub enum FaucetRole {
    Admin,
    TransferManager,
}

impl ShortsRole {
    pub fn role_id(&self) -> Role {
        match self {
            ShortsRole::Admin => DEFAULT_ADMIN_ROLE,
            ShortsRole::Owner => [5u8; 32],
            ShortsRole::PriceManager => [6u8; 32],
            ShortsRole::ConfigManager => [7u8; 32],
        }
    }
}

impl FaucetRole {
    pub fn role_id(&self) -> Role {
        match self {
            FaucetRole::Admin => DEFAULT_ADMIN_ROLE,
            FaucetRole::TransferManager => [8u8; 32],
        }
    }
}
