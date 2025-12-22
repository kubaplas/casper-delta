// ---------- Configuration Constants ----------

// Application mode: 'production' or 'competition' (default)
// Injected by server as window.APP_MODE
export const APP_MODE = (window as any).APP_MODE || 'competition';

// Helper to check if running in production mode
export function isProductionMode(): boolean {
    return APP_MODE === 'production';
}

export const EXPLORER_BASE = "https://testnet.cspr.live/";
export const TOKEN_DECIMALS = 9;
export const DEFAULT_GAS_AMOUNT = BigInt(5_000_000_000); // 5 CSPR
export const HIGH_GAS_AMOUNT = BigInt(10_000_000_000); // 10 CSPR for complex operations
export const TRADING_INFO_DISMISSED_KEY = "casper-delta-trading-info-dismissed";

// Contract addresses - these would be configured based on deployment
export const CONTRACT_ADDRESSES = {
    market: "hash-3aaede19ed8b270d96f0fccf79d9dbb14307ea853de00f2f0835f5958f396bbd",
    // In production mode, use regular WCSPR; in competition mode, use faucetable WCSPR
    wcspr: isProductionMode()
        ? "hash-24e51b5a7a2977fd15f2d0aa4c0ba56d77b4f0db9574be74b5559a61372cfeec"  // Regular WCSPR for production
        : "hash-a2fc55eda5bf7e724520d36536c32ac19e0b75dbdf16b4bf85a4234f21d6aaf0", // Faucetable WCSPR for competition
    shortToken: "hash-51809ec40e24515f38f2b3d7c87f76358269428ca35bc79f732a52eac62fea5e",
    longToken: "hash-e374d41cf3b6405ba4c344bc15f12a1c6fdc201b51054479facfee1eaff30524",
};

// Map common error codes to user-friendly messages
export function getErrorDescription(code: number): string {
    const errorDescriptions: Record<number, string> = {
        // Token/Balance errors
        60001: "Insufficient balance",
        60002: "Insufficient allowance",
        60000: "Cannot target yourself",

        // Ownership errors
        20000: "Owner not set",
        20001: "Caller is not the owner",
        20002: "Caller is not the new owner",
        20003: "Missing required role",
        20004: "Cannot renounce role for another address",

        // Config errors
        45000: "Configuration not set",
        45001: "Heartbeat interval must be greater than zero",
        45002: "Heartbeat tolerance must be less than half of interval",
        45003: "TWAP window cannot be zero",
        45004: "TWAP tolerance must be less than window",
        45005: "Too many TWAP values",
        45006: "Price feed ID cannot be empty",
        45007: "Price feed ID is not unique",

        // Role errors
        45010: "Not admin role",
        45011: "Not config manager role",
        45012: "Not price supplier role",

        // Feed errors
        45020: "Not in heartbeat window",
        45021: "Feed already updated in current heartbeat window",
        45022: "Price feed IDs mismatch",

        // Market errors
        8001: "Last price not set",
        8002: "New price is too old",
        8003: "New price is from the future",
        8004: "Long share not set",
        8005: "Total deposit not set",
        8006: "Long token contract not a caller on deposit",
        8007: "Short token contract not a caller on deposit",
        8008: "Long token contract not a caller on withdrawal",
        8009: "Short token contract not a caller on withdrawal",
        8010: "System misconfigured",
        8011: "Price feed error",
        8401: "Unauthorized operation",

        // Faucet errors
        10001: "Only transfer manager can transfer funds",
        10002: "Faucet already used - you can only claim WCSPR once",
        10003: "Unauthorized faucet operation",

        // Generic Casper errors
        1: "Invalid account",
        2: "Invalid purse",
    };

    return errorDescriptions[code] || `Unknown error (code: ${code})`;
}
