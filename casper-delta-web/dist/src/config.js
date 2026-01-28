// ---------- Configuration Constants ----------
// Application mode: 'production' or 'competition' (default)
// Injected by server as window.APP_MODE
export const APP_MODE = window.APP_MODE || 'competition';
// RPC configuration - injected by server from environment variables
// Will throw if not configured
if (!window.RPC_URL)
    throw new Error('RPC_URL not configured');
if (!window.SPECULATIVE_RPC_URL)
    throw new Error('SPECULATIVE_RPC_URL not configured');
if (!window.CHAIN_NAME)
    throw new Error('CHAIN_NAME not configured');
if (!window.EXPLORER_BASE)
    throw new Error('EXPLORER_BASE not configured');
export const RPC_URL = window.RPC_URL;
export const SPECULATIVE_RPC_URL = window.SPECULATIVE_RPC_URL;
export const CHAIN_NAME = window.CHAIN_NAME;
export const EXPLORER_BASE = window.EXPLORER_BASE;
// Helper to check if running in production mode
export function isProductionMode() {
    return APP_MODE === 'production';
}
export function isMarketGraphVisible() {
    const params = new URLSearchParams(window.location.search);
    return params.get('graph') === 'true';
}
// UI and API configuration
export const TOKEN_DECIMALS = 9;
export const DEFAULT_GAS_AMOUNT = BigInt(100000000000); // 5 CSPR
export const HIGH_GAS_AMOUNT = BigInt(200000000000); // 10 CSPR for complex operations
export const TRADING_INFO_DISMISSED_KEY = "casper-delta-trading-info-dismissed";
// Contract addresses - injected by server from environment variables
if (!window.MARKET_CONTRACT_ADDRESS)
    throw new Error('MARKET_CONTRACT_ADDRESS not configured');
if (!window.WCSPR_CONTRACT_ADDRESS)
    throw new Error('WCSPR_CONTRACT_ADDRESS not configured');
if (!window.LONG_TOKEN_CONTRACT_ADDRESS)
    throw new Error('LONG_TOKEN_CONTRACT_ADDRESS not configured');
if (!window.SHORT_TOKEN_CONTRACT_ADDRESS)
    throw new Error('SHORT_TOKEN_CONTRACT_ADDRESS not configured');
export const CONTRACT_ADDRESSES = {
    market: window.MARKET_CONTRACT_ADDRESS,
    wcspr: window.WCSPR_CONTRACT_ADDRESS,
    longToken: window.LONG_TOKEN_CONTRACT_ADDRESS,
    shortToken: window.SHORT_TOKEN_CONTRACT_ADDRESS,
};
// Map common error codes to user-friendly messages
export function getErrorDescription(code) {
    const errorDescriptions = {
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
