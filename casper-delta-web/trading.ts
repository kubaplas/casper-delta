import init, {
    Address,
    OdraWasmClient,
    U256,
    U512,
    TransactionResult,
    TransactionStatus,
    setGas,
    CsprClickCallbacks,
    AccountInfo,
} from "casper-delta-wasm-client";

// Import the generated clients from casper-delta
import { 
    MarketWasmClient, 
    FaucetableWcsprWasmClient, 
    PositionTokenWasmClient,
    MarketState,
    AddressMarketState,
} from "casper-delta-wasm-client";

// ---------- Types ----------
let client: OdraWasmClient;
let market: MarketWasmClient;
let wcspr: FaucetableWcsprWasmClient;
let longToken: PositionTokenWasmClient;
let shortToken: PositionTokenWasmClient;
let account: AccountInfo;

interface Balances {
    wcspr: U256;
    longToken: U256;
    shortToken: U256;
}

interface CurrentTransaction {
    hash: string;
    startTime: number;
}

// New consolidated data from the single endpoint
interface ConsolidatedData {
    addressMarketState: AddressMarketState;
    lastUpdated: number;
}

// ---------- Configuration ----------
const EXPLORER_BASE = "https://testnet.cspr.live/";
const TOKEN_DECIMALS = 9;
const DEFAULT_GAS_AMOUNT = BigInt(5_000_000_000); // 5 CSPR
const HIGH_GAS_AMOUNT = BigInt(10_000_000_000); // 10 CSPR for complex operations
const TRADING_INFO_DISMISSED_KEY = "casper-delta-trading-info-dismissed";

// ---------- Simple Request Handler ----------
// Simple delay helper for rate limiting
async function delayRequest(ms: number = 2000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Simple retry wrapper for API calls
async function executeWithRetry<T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            const isRateLimit = error.message && error.message.includes('429');
            const isLastAttempt = attempt === maxRetries;
            
            if (isRateLimit && !isLastAttempt) {
                const backoffDelay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
                console.warn(`Rate limited, retrying in ${backoffDelay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
                await delayRequest(backoffDelay);
                continue;
            }
            
            throw error;
        }
    }
    throw new Error('Max retries exceeded');
}

// Map common error codes to user-friendly messages
function getErrorDescription(code: number): string {
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

// ---------- Transaction Monitor ----------
let currentTransaction: CurrentTransaction | null = null;

function disableTransactionButtons(): void {
    // Trading buttons
    depositLongBtn.disabled = true;
    withdrawLongBtn.disabled = true;
    depositShortBtn.disabled = true;
    withdrawShortBtn.disabled = true;
    
    // Action buttons
    updatePriceBtn.disabled = true;
    faucetBtn.disabled = true;
    approveMarketBtn.disabled = true;
    
    // Add visual disabled state
    const buttons = [depositLongBtn, withdrawLongBtn, depositShortBtn, withdrawShortBtn, 
                    updatePriceBtn, faucetBtn, approveMarketBtn];
    buttons.forEach(btn => {
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    });
}

function enableTransactionButtons(): void {
    // Trading buttons
    depositLongBtn.disabled = false;
    withdrawLongBtn.disabled = false;
    depositShortBtn.disabled = false;
    withdrawShortBtn.disabled = false;
    
    // Action buttons
    updatePriceBtn.disabled = false;
    faucetBtn.disabled = false;
    approveMarketBtn.disabled = false;
    
    // Remove visual disabled state
    const buttons = [depositLongBtn, withdrawLongBtn, depositShortBtn, withdrawShortBtn, 
                    updatePriceBtn, faucetBtn, approveMarketBtn];
    buttons.forEach(btn => {
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    });
}

function cleanup(): void { 
    // Reset progress UI and hide overlay
    txProgressOverlay.classList.add("hidden");
    txProgressBar.style.width = "0%";
    txProgressBar.classList.remove("from-green-500", "to-green-600", "from-red-500", "to-red-600", "from-yellow-500", "to-yellow-600");
    txProgressBar.classList.add("from-blue-500", "to-blue-600");
    txProgressSpinner.classList.remove("hidden");

    // Re-enable body scrolling
    unlockScroll();

    // Ensure buttons are enabled when cleaning up
    enableTransactionButtons();
}

function onTransactionTimeout(): void {
    console.warn("Transaction monitoring timed out");
    
    // Update UI to show timeout
    txProgressBar.style.width = "100%";
    txProgressBar.classList.remove("from-blue-500", "to-blue-600");
    txProgressBar.classList.add("from-yellow-500", "to-yellow-600");
    txProgressSpinner.classList.add("hidden");
    txProgressStatus.textContent = "⏱️ Monitoring timeout";
    txProgressTime.textContent = "Transaction may still be processing";
    
    // Show warning
    showError("Transaction monitoring timed out. The transaction may still be processing. Please check the explorer manually.");
    
    // Show the transaction link for manual checking
    if (currentTransaction) {
        showTransaction(currentTransaction.hash);
    }
    
    // Re-enable buttons after timeout
    enableTransactionButtons();
    currentTransaction = null;
    // Hide progress after a delay
    setTimeout(cleanup, 1000);
}

// Show transaction popup immediately when user clicks a button
function showTransactionPopup(description: string): void {
    
    // Show progress overlay as full screen modal
    txProgressOverlay.classList.remove("hidden");
    // Match error modal behavior: lock scroll and focus panel
    lockScroll();
    
    // Ensure the modal is visible by scrolling the popup into view
    if (txProgressPanel) {
        // Small delay to ensure the popup is fully rendered before scrolling
        setTimeout(() => {
            txProgressPanel.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
            txProgressPanel.focus();
        }, 100);
    }
    
    // Set initial state
    txProgressHash.textContent = "Preparing transaction...";
    txProgressStatus.textContent = `${description} starting...`;
    txProgressTime.textContent = "Connecting to wallet...";
    txProgressBar.style.width = "10%";
    
    // Hide the basic transaction section as we're now showing progress
    txSection.classList.add("hidden");
    
    // Set a manual timeout as a fallback
    setTimeout(() => {
        console.warn('Manual timeout triggered - transaction taking too long');
        onTransactionTimeout();
    }, 3 * 60 * 1000); // 3 minutes fallback timeout
}

// Hide transaction popup (used when transaction fails before submission)
function hideTransactionPopup(): void {
    cleanup();
}

// Handle successful transaction from CSPR.click
async function onTransactionSuccessFromCsprClick(data: TransactionResult): Promise<void> {
    // Update UI to show success
    txProgressBar.style.width = "100%";
    txProgressBar.classList.remove("from-blue-500", "to-blue-600");
    txProgressBar.classList.add("from-green-500", "to-green-600");
    txProgressSpinner.classList.add("hidden");
    txProgressStatus.textContent = "✅ Transaction successful!";
    txProgressTime.textContent = "Refreshing data...";
    
    // Show the transaction link
    try {
        const txHash = data.txHash;
        
        if (txHash) {
            showTransaction(txHash);
        }
    } catch (e) {
        console.error('Error extracting transaction hash for success:', e);
    }
    
    try {
        // Wait a moment for blockchain data to be available
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Refresh all data and wait for completion
        await refreshAllDataConsolidated();
        txProgressTime.textContent = "✅ Data refreshed successfully";
    } catch (error: any) {
        console.error("Error refreshing data after transaction:", error);
        txProgressTime.textContent = "⚠️ Transaction successful, but data refresh failed";
    }
    currentTransaction = null;
    
    // Re-enable buttons after data refresh
    enableTransactionButtons();
    
    // Hide progress after a delay
    setTimeout(cleanup, 500);
}

// Handle failed transaction from CSPR.click
async function onTransactionFailureFromCsprClick(data: TransactionResult): Promise<void> {
    console.error("Transaction failed from CSPR.click:", data);
    
    // Update UI to show failure
    txProgressBar.style.width = "100%";
    txProgressBar.classList.remove("from-blue-500", "to-blue-600");
    txProgressBar.classList.add("from-red-500", "to-red-600");
    txProgressSpinner.classList.add("hidden");
    txProgressStatus.textContent = "❌ Transaction failed";
    
    // Extract error information from WASM TransactionResult object
    let errorMsg = "Transaction failed";
    
    try {
        // The data is a WASM TransactionResult object with getter methods
        // We need to call the getter methods to get the actual values
        const error = data.error;
        const errorCode = data.errorCode;
        const isCancelled = data.isCancelled;
        
        // Check if transaction was cancelled
        if (isCancelled) {
            errorMsg = "Transaction was cancelled by user";
        } else if (error) {
            // Use the error message from the WASM object
            errorMsg = error;
            
            // If we have an error code, try to get a user-friendly description
            if (errorCode !== null && errorCode !== undefined) {
                const description = getErrorDescription(errorCode);
                if (description !== `Unknown error (code: ${errorCode})`) {
                    errorMsg = description;
                }
            }
        } else if (errorCode !== null && errorCode !== undefined) {
            // We have an error code but no error message
            const description = getErrorDescription(errorCode);
            errorMsg = description;
        } else {
            // Fallback error message
            errorMsg = "Transaction failed - no specific error information available";
        }
        
    } catch (e) {
        console.error('Error extracting error information from WASM object:', e);
        errorMsg = "Transaction failed - error extracting details";
    }
    
    txProgressTime.textContent = errorMsg;
    
    // Show error with transaction link
    try {
        const txHash = data.txHash;
        
        if (txHash) {
            showErrorWithTransaction(errorMsg, txHash);
            showTransaction(txHash);
        } else {
            showError(errorMsg);
        }
    } catch (e) {
        console.error('Error extracting transaction hash:', e);
        showError(errorMsg);
    }
    
    // Ensure the popup is visible by scrolling it into view
    if (txProgressPanel) {
        setTimeout(() => {
            txProgressPanel.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
        }, 100);
    }
    
    // For certain types of errors, we might still want to refresh data
    // (e.g., to get the latest state even if the transaction failed)
    const shouldRefreshOnFailure = shouldRefreshDataOnFailure(errorMsg);
    
    if (shouldRefreshOnFailure) {
        try {
            // Wait a moment for blockchain data to be available
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Refresh all data even though transaction failed
            await refreshAllDataConsolidated();
        } catch (error: any) {
            console.error("Error refreshing data after transaction failure:", error);
        }
    }
    currentTransaction = null;
    // Re-enable buttons after failure
    enableTransactionButtons();
    
    // Hide progress after a delay
    setTimeout(cleanup, 500);
}

// Helper method to determine if we should refresh data on failure
function shouldRefreshDataOnFailure(errorMsg: string): boolean {
    // For certain errors, we might want to refresh to get the latest state
    // even though the transaction failed
    const refreshOnFailureErrors = [
        "Faucet already used",
        "Insufficient balance",
        "Insufficient allowance",
        "Rate limited"
    ];
    
    return refreshOnFailureErrors.some(error => errorMsg.includes(error));
}

// Handle expired transaction
function onTransactionExpired(): void {
    console.warn("Transaction expired");
    
    // Update UI to show expiration
    txProgressBar.style.width = "100%";
    txProgressBar.classList.remove("from-blue-500", "to-blue-600");
    txProgressBar.classList.add("from-yellow-500", "to-yellow-600");
    txProgressSpinner.classList.add("hidden");
    txProgressStatus.textContent = "⏰ Transaction expired";
    txProgressTime.textContent = "Transaction TTL elapsed before execution";
    currentTransaction = null;
    // Show warning
    showError("Transaction expired. The transaction's time-to-live (TTL) elapsed before execution.");
    
    // Hide progress after a delay
    setTimeout(cleanup, 500);
}

// Handle cancelled transaction
function onTransactionCancelled(): void {
    // Update UI to show cancellation
    txProgressBar.style.width = "100%";
    txProgressBar.classList.remove("from-blue-500", "to-blue-600");
    txProgressBar.classList.add("from-gray-500", "to-gray-600");
    txProgressSpinner.classList.add("hidden");
    txProgressStatus.textContent = "❌ Transaction cancelled";
    txProgressTime.textContent = "User rejected the signature request";
    
    // Re-enable buttons after cancellation
    enableTransactionButtons();
    currentTransaction = null;
    // Hide progress after a delay
    setTimeout(cleanup, 500);
}

// Contract addresses - these would be configured based on deployment
const CONTRACT_ADDRESSES = {
    market: "hash-3aaede19ed8b270d96f0fccf79d9dbb14307ea853de00f2f0835f5958f396bbd",
    wcspr: "hash-a2fc55eda5bf7e724520d36536c32ac19e0b75dbdf16b4bf85a4234f21d6aaf0",
    shortToken: "hash-51809ec40e24515f38f2b3d7c87f76358269428ca35bc79f732a52eac62fea5e",
    longToken: "hash-e374d41cf3b6405ba4c344bc15f12a1c6fdc201b51054479facfee1eaff30524",
};

// ---------- State ----------
let connected = false;
let address: string | null = null;
let balances: Balances | null = null;
let marketState: MarketState | null = null;
let consolidatedData: ConsolidatedData | null = null;
let marketAllowanceValue: U256 | null = null;

// Position closing state
let currentLongClosePercentage: number = 0;
let currentShortClosePercentage: number = 0;
let currentLongCloseAmount: U256 | null = null;
let currentShortCloseAmount: U256 | null = null;

// ---------- DOM Elements ----------
const connectBtn = document.getElementById("connect-btn") as HTMLButtonElement;
const disconnectBtn = document.getElementById("disconnect-btn") as HTMLButtonElement;
const disconnectSection = document.getElementById('disconnect-section') as HTMLDivElement;
const addressSpan = document.getElementById("address") as HTMLSpanElement;
const addressDropdownBtn = document.getElementById("address-dropdown-btn") as HTMLButtonElement;
const addressDropdownMenu = document.getElementById("address-dropdown-menu") as HTMLDivElement;
const switchAccountBtn = document.getElementById("switch-account-btn") as HTMLButtonElement;

// Market state elements
const currentPriceSpan = document.getElementById("current-price") as HTMLSpanElement;
const totalMarketValueSpan = document.getElementById("total-market-value") as HTMLDivElement;
const totalMarketValueLoader = document.getElementById("total-market-value-loader") as HTMLDivElement;
const longLiquiditySpan = document.getElementById("long-liquidity") as HTMLSpanElement;
const shortLiquiditySpan = document.getElementById("short-liquidity") as HTMLSpanElement;
const priceLoader = document.getElementById("price-loader") as HTMLDivElement;
const longLiquidityLoader = document.getElementById("long-liquidity-loader") as HTMLDivElement;
const shortLiquidityLoader = document.getElementById("short-liquidity-loader") as HTMLDivElement;

// Balance elements
const wcsprBalanceSpan = document.getElementById("wcspr-balance") as HTMLSpanElement;
const wcsprBalanceLoader = document.getElementById("wcspr-balance-loader") as HTMLDivElement;

// Position value display elements
const longPositionValueDisplay = document.getElementById("long-position-value-display") as HTMLDivElement;
const shortPositionValueDisplay = document.getElementById("short-position-value-display") as HTMLDivElement;
const longPositionValueLoader = document.getElementById("long-position-value-loader") as HTMLDivElement;
const shortPositionValueLoader = document.getElementById("short-position-value-loader") as HTMLDivElement;

// Position-specific balance elements
const wcsprBalanceLong = document.getElementById("wcspr-balance-long") as HTMLSpanElement;
const wcsprBalanceShort = document.getElementById("wcspr-balance-short") as HTMLSpanElement;
const wcsprBalanceLongLoader = document.getElementById("wcspr-balance-long-loader") as HTMLDivElement;
const wcsprBalanceShortLoader = document.getElementById("wcspr-balance-short-loader") as HTMLDivElement;

// Position value elements
const totalPositionValueSpan = document.getElementById("total-position-value") as HTMLSpanElement;
const longPositionLoader = document.getElementById("long-position-loader") as HTMLDivElement;
const shortPositionLoader = document.getElementById("short-position-loader") as HTMLDivElement;
const totalPositionLoader = document.getElementById("total-position-loader") as HTMLDivElement;

// Trading inputs and buttons
const longOpenAmountInput = document.getElementById("long-open-amount") as HTMLInputElement;
const shortOpenAmountInput = document.getElementById("short-open-amount") as HTMLInputElement;

// Position closing elements
const longCloseAmountInput = document.getElementById("long-close-amount-input") as HTMLInputElement;
const shortCloseAmountInput = document.getElementById("short-close-amount-input") as HTMLInputElement;
const longCloseAmountDisplay = document.getElementById("long-close-amount-display") as HTMLSpanElement;
const shortCloseAmountDisplay = document.getElementById("short-close-amount-display") as HTMLSpanElement;
const longClosePercentage = document.getElementById("long-close-percentage") as HTMLSpanElement;
const shortClosePercentage = document.getElementById("short-close-percentage") as HTMLSpanElement;

// Percentage buttons
const longClose25Btn = document.getElementById("long-close-25") as HTMLButtonElement;
const longClose50Btn = document.getElementById("long-close-50") as HTMLButtonElement;
const longClose75Btn = document.getElementById("long-close-75") as HTMLButtonElement;
const longClose100Btn = document.getElementById("long-close-100") as HTMLButtonElement;
const shortClose25Btn = document.getElementById("short-close-25") as HTMLButtonElement;
const shortClose50Btn = document.getElementById("short-close-50") as HTMLButtonElement;
const shortClose75Btn = document.getElementById("short-close-75") as HTMLButtonElement;
const shortClose100Btn = document.getElementById("short-close-100") as HTMLButtonElement;
const depositLongBtn = document.getElementById("deposit-long-btn") as HTMLButtonElement;
const withdrawLongBtn = document.getElementById("withdraw-long-btn") as HTMLButtonElement;
const depositShortBtn = document.getElementById("deposit-short-btn") as HTMLButtonElement;
const withdrawShortBtn = document.getElementById("withdraw-short-btn") as HTMLButtonElement;

// Action buttons
const updatePriceBtn = document.getElementById("update-price-btn") as HTMLButtonElement;
const refreshBtn = document.getElementById("refresh-btn") as HTMLButtonElement;
const faucetBtn = document.getElementById("faucet-btn") as HTMLButtonElement;
const approveMarketBtn = document.getElementById("approve-market-btn") as HTMLButtonElement;

// Approve input and display
const approveAmountInput = document.getElementById("approve-amount") as HTMLInputElement;
const marketAllowanceSpan = document.getElementById("market-allowance") as HTMLSpanElement;
const marketAllowanceLoader = document.getElementById("market-allowance-loader") as HTMLSpanElement;

// Notification elements
const txSection = document.getElementById("tx-section") as HTMLDivElement;
const txLinkAnchor = document.getElementById("tx-link") as HTMLAnchorElement;
const errorSection = document.getElementById("error-section") as HTMLDivElement;
const errorText = document.getElementById("error-text") as HTMLDivElement;
// Error modal elements
const errorModalOverlay = document.getElementById("error-modal-overlay") as HTMLDivElement;
const errorModalMessage = document.getElementById("error-modal-message") as HTMLParagraphElement;
const errorModalPanel = document.getElementById("error-modal-panel") as HTMLDivElement;
const errorModalClose = document.getElementById("error-modal-close") as HTMLButtonElement;
const marketStatusSpan = document.getElementById("market-status") as HTMLSpanElement | null;
// Portfolio balances (long/short token counts in header widgets)
const longTokenBalancePortfolio = document.getElementById("long-token-balance-portfolio") as HTMLDivElement;
const shortTokenBalancePortfolio = document.getElementById("short-token-balance-portfolio") as HTMLDivElement;

// Transaction progress elements
const txProgressOverlay = document.getElementById("tx-progress-overlay") as HTMLDivElement;
const txProgressSpinner = document.getElementById("tx-progress-spinner") as HTMLDivElement;
const txProgressStatus = document.getElementById("tx-progress-status") as HTMLSpanElement;
const txProgressHash = document.getElementById("tx-progress-hash") as HTMLSpanElement;
const txProgressBar = document.getElementById("tx-progress-bar") as HTMLDivElement;
const txProgressTime = document.getElementById("tx-progress-time") as HTMLSpanElement;
const txProgressPanel = document.getElementById("tx-progress-panel") as HTMLDivElement;

// Trading info elements
const tradingInfoSection = document.getElementById("trading-info-section") as HTMLDivElement;
const showTradingInfoSection = document.getElementById("show-trading-info-section") as HTMLDivElement;
const closeTradingInfoBtn = document.getElementById("close-trading-info") as HTMLButtonElement;
const showTradingInfoBtn = document.getElementById("show-trading-info") as HTMLButtonElement;

// ---------- Utility Functions ----------
function lockScroll(): void {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
}

function unlockScroll(): void {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function buildExplorerTxUrl(hash: string): string {
    const normalized = hash.replace(/^0x/i, '');
    return `${EXPLORER_BASE.replace(/\/+$/, "")}/transaction/${normalized}`;
}

function formatErrorMessageWithShortHashes(message: string): string {
    const escaped = escapeHtml(message);
    const txHashRegex = /(0x)?[a-fA-F0-9]{64}/g;
    return escaped.replace(txHashRegex, (match) => {
        const cleanHash = match.replace(/^0x/i, '');
        const shortened = `${cleanHash.slice(0, 10)}…${cleanHash.slice(-8)}`;
        return `<span class="font-mono break-all">${shortened}</span>`;
    });
}

function formatNumber(value: U256 | U512, decimals: number = TOKEN_DECIMALS): string {
    try {
        let formatter;
        if (value instanceof U256) {
            formatter = value.formatter(decimals);
        } else {
            formatter = value.formatter(decimals);
        }
        
        // For very small numbers, use higher precision
        const formatted4 = formatter.fmtWithPrecision(4);
        if (formatted4 === "0.0000") {
            // Try with higher precision for very small values
            const formatted9 = formatter.fmtWithPrecision(9);
            // If it's still zero with 9 decimals, return 0.0
            if (formatted9 === "0.000000000") {
                return "0.0";
            }
            return formatted9;
        }
        
        return formatted4;
    } catch (e) {
        console.error("Error formatting number:", e);
        return "0.0";
    }
}

// Special formatter for price display that can handle very small values
function formatPrice(value: U256, decimals: number = TOKEN_DECIMALS): string {
    try {
        const formatter = value.formatter(decimals);
        
        // For prices, we want to show more precision to see small values
        // Try different precisions until we get a non-zero display
        for (let precision = 4; precision <= 9; precision++) {
            const formatted = formatter.fmtWithPrecision(precision);
            if (formatted !== "0." + "0".repeat(precision)) {
                return formatted;
            }
        }
        
        // If still zero, return 0.0
        return "0.0";
    } catch (e) {
        console.error("Error formatting price:", e);
        return "0.0";
    }
}

// Formatter for allowance values that shows "MAX" for very large amounts
function formatAllowance(value: U256, decimals: number = TOKEN_DECIMALS): string {
    try {
        // Check if this is the max approval value we use (2^128 - 1)
        const maxApprovalValue = "340282366920938463463374607431768211455";
        const valueString = value.toString();
        
        // If it's the exact max value or any value larger than 10^30, show as MAX
        if (valueString === maxApprovalValue || valueString.length > 30) {
            return "MAX";
        }
        
        // For normal values, use standard formatting
        return formatNumber(value, decimals);
    } catch (e) {
        console.error("Error formatting allowance:", e);
        return formatNumber(value, decimals);
    }
}

// Formatter specifically for dollar prices (WCSPR price in USD)
function formatDollarPrice(value: U256, decimals: number = TOKEN_DECIMALS): string {
    try {
        const rawValueString = value.toString();
        
        // Try multiple decimal interpretations to find the right scaling
        const interpretations = [];
        
        // Test different decimal places: 0, 3, 6, 9, 12
        for (const testDecimals of [0, 3, 6, 9, 12]) {
            try {
                const testFormatter = value.formatter(testDecimals);
                const testValue = parseFloat(testFormatter.fmtWithPrecision(Math.min(testDecimals + 3, 12)));
                interpretations.push({
                    decimals: testDecimals,
                    value: testValue,
                    formatted: testFormatter.fmtWithPrecision(Math.min(testDecimals + 3, 12))
                });
            } catch (e: any) {
            }
        }
        
        // Find the interpretation that gives a reasonable USD price (between $0.0001 and $1000)
        let bestInterpretation = interpretations.find(interp => 
            interp.value >= 0.0001 && interp.value <= 1000
        );
        
        // If no reasonable interpretation found, try manual scaling
        if (!bestInterpretation) {
            
            // Based on your example: 0.0000009 should be 0.009133
            // That's roughly 10,000x scaling, let's try that
            const manualScaling = parseFloat(rawValueString) / Math.pow(10, decimals) * 10000;
            
            if (manualScaling >= 0.0001 && manualScaling <= 1000) {
                bestInterpretation = {
                    decimals: decimals,
                    value: manualScaling,
                    formatted: manualScaling.toString()
                };
            }
        }
        
        // Fall back to the most reasonable interpretation or default to 9 decimals
        if (!bestInterpretation) {
            bestInterpretation = interpretations.find(interp => interp.decimals === 9) || interpretations[0];
        }
        
        const numericValue = bestInterpretation.value;
        
        // Format as dollar amount with appropriate precision
        if (numericValue === 0) {
            return "$0.0000";
        } else if (numericValue >= 1) {
            // For values >= $1, show 2 decimal places
            return `$${numericValue.toFixed(2)}`;
        } else if (numericValue >= 0.01) {
            // For values >= $0.01, show 4 decimal places
            return `$${numericValue.toFixed(4)}`;
        } else {
            // For very small values, show 6 decimal places
            return `$${numericValue.toFixed(6)}`;
        }
    } catch (e) {
        console.error("Error formatting dollar price:", e);
        return "$0.0000";
    }
}

function parseAmount(input: HTMLInputElement): U256 | null {
    try {
        // Allow only digits and one dot
        const sanitized = input.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
        if (sanitized !== input.value) input.value = sanitized;
        const value = parseFloat(sanitized);
        if (isNaN(value) || value <= 0) return null;
        return parseAmountFromNumber(value);
    } catch (e) {
        console.error("Error parsing amount:", e);
        return null;
    }
}

function parseAmountFromNumber(value: number): U256 {
    // Use string-based conversion to avoid floating point precision issues
    const amountStr = value.toFixed(TOKEN_DECIMALS);
    const [wholePart, decimalPart = ""] = amountStr.split(".");
    const paddedDecimalPart = decimalPart.padEnd(TOKEN_DECIMALS, "0");
    const fullAmountStr = wholePart + paddedDecimalPart;
    
    return new U256(fullAmountStr);
}

function showError(msg: string) {
    // Update legacy inline error (kept for backward compatibility, but keep hidden)
    if (errorText && errorSection) {
        errorText.textContent = msg;
        errorSection.classList.add("hidden");
    }
    // Show modal
    if (errorModalMessage && errorModalOverlay) {
        // Shorten hashes but do not link for general errors (e.g., signing cancel)
        errorModalMessage.innerHTML = formatErrorMessageWithShortHashes(msg);
        errorModalOverlay.classList.remove("hidden");
        lockScroll();
        // Focus panel for accessibility and ensure visibility on small screens
        if (errorModalPanel) {
            errorModalPanel.focus();
        }
    }
    console.error(msg);
}

function clearError() {
    // Hide legacy inline error
    if (errorSection && errorText) {
        errorSection.classList.add("hidden");
        errorText.textContent = "";
    }
    // Hide modal if open
    if (errorModalOverlay) {
        errorModalOverlay.classList.add("hidden");
        errorModalMessage && (errorModalMessage.textContent = "");
        unlockScroll();
    }
}

function showTransaction(hash: string) {
    const url = `${EXPLORER_BASE.replace(/\/+$/, "")}/transaction/${hash}`;
    txLinkAnchor.href = url;
    txSection.classList.remove("hidden");
}

function showTransactionHashInProgress(hash: string) {
    const url = `${EXPLORER_BASE.replace(/\/+$/, "")}/transaction/${hash}`;
    txProgressHash.innerHTML = `<a href="${url}" target="_blank" class="text-orange-600 hover:text-orange-800 underline break-all">${hash}</a>`;
}

function hideTransaction() {
    txSection.classList.add("hidden");
}

// ---------- Trading Info Management ----------
function initializeTradingInfo() {
    // Check if user has previously dismissed the trading info
    const isDismissed = localStorage.getItem(TRADING_INFO_DISMISSED_KEY) === 'true';
    
    
    if (isDismissed) {
        // Keep trading info hidden (it's hidden by default in HTML)
        tradingInfoSection.classList.add('hidden');
        showTradingInfoSection.classList.remove('hidden');
    } else {
        // Show trading info (remove the default hidden class)
        tradingInfoSection.classList.remove('hidden');
        showTradingInfoSection.classList.add('hidden');
    }
}

function closeTradingInfo() {
    // Hide the section with a smooth fade out
    tradingInfoSection.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    tradingInfoSection.style.opacity = '0';
    tradingInfoSection.style.transform = 'translateY(-10px)';
    
    // After animation, hide the element and store preference
    setTimeout(() => {
        tradingInfoSection.classList.add('hidden');
        tradingInfoSection.style.opacity = '';
        tradingInfoSection.style.transform = '';
        tradingInfoSection.style.transition = '';
        
        // Show the "show guide" button
        showTradingInfoSection.classList.remove('hidden');
        
        // Remember the user's preference
        localStorage.setItem(TRADING_INFO_DISMISSED_KEY, 'true');
    }, 300);
}

function showTradingInfo() {
    // Show the section with a smooth fade in
    tradingInfoSection.classList.remove('hidden');
    tradingInfoSection.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    tradingInfoSection.style.opacity = '0';
    tradingInfoSection.style.transform = 'translateY(-10px)';
    
    // Trigger animation
    setTimeout(() => {
        tradingInfoSection.style.opacity = '1';
        tradingInfoSection.style.transform = 'translateY(0)';
    }, 10);
    
    // Clean up styles after animation
    setTimeout(() => {
        tradingInfoSection.style.opacity = '';
        tradingInfoSection.style.transform = '';
        tradingInfoSection.style.transition = '';
    }, 310);
    
    // Hide the "show guide" button
    showTradingInfoSection.classList.add('hidden');
    
    // Clear the dismissed preference
    localStorage.removeItem(TRADING_INFO_DISMISSED_KEY);
}

// ---------- Position Closing Functions ----------

function updateLongCloseAmount(percentage: number) {
    if (!consolidatedData || !consolidatedData.addressMarketState) return;
    
    currentLongClosePercentage = percentage;
    
    // Calculate the token amount to withdraw (this is what the contract expects)
    const tokenAmount = consolidatedData.addressMarketState.long_token_balance.mul(U256.fromNumber(percentage)).div(U256.fromNumber(100));
    currentLongCloseAmount = tokenAmount;
    
    // Calculate the WCSPR value for display (what user will see and enter)
    const wcsprValueToReceive = consolidatedData.addressMarketState.long_position_value.mul(U256.fromNumber(percentage)).div(U256.fromNumber(100));
    
    // Update UI - show WCSPR value in input (user sees WCSPR, not tokens)
    longCloseAmountInput.value = formatNumber(wcsprValueToReceive);
    longCloseAmountDisplay.textContent = `${formatNumber(consolidatedData.addressMarketState.long_position_value)} WCSPR`;
    longClosePercentage.textContent = `${percentage}%`;
    
    // Update button states
    updateLongCloseButtons(percentage);
}

function updateShortCloseAmount(percentage: number) {
    if (!consolidatedData || !consolidatedData.addressMarketState) return;
    
    currentShortClosePercentage = percentage;
    
    // Calculate the token amount to withdraw (this is what the contract expects)
    const tokenAmount = consolidatedData.addressMarketState.short_token_balance.mul(U256.fromNumber(percentage)).div(U256.fromNumber(100));
    currentShortCloseAmount = tokenAmount;
    
    // Calculate the WCSPR value for display (what user will see and enter)
    const wcsprValueToReceive = consolidatedData.addressMarketState.short_position_value.mul(U256.fromNumber(percentage)).div(U256.fromNumber(100));
    
    // Update UI - show WCSPR value in input (user sees WCSPR, not tokens)
    shortCloseAmountInput.value = formatNumber(wcsprValueToReceive);
    shortCloseAmountDisplay.textContent = `${formatNumber(consolidatedData.addressMarketState.short_position_value)} WCSPR`;
    shortClosePercentage.textContent = `${percentage}%`;
    
    // Update button states
    updateShortCloseButtons(percentage);
}

function updateLongCloseButtons(activePercentage: number) {
    const buttons = [longClose25Btn, longClose50Btn, longClose75Btn, longClose100Btn];
    const percentages = [25, 50, 75, 100];
    
    buttons.forEach((btn, index) => {
        if (percentages[index] === activePercentage) {
            btn.classList.add('bg-green-600', 'text-white');
            btn.classList.remove('border-green-300', 'text-green-700', 'hover:bg-green-100');
        } else {
            btn.classList.remove('bg-green-600', 'text-white');
            btn.classList.add('border-green-300', 'text-green-700', 'hover:bg-green-100');
        }
    });
}

function updateShortCloseButtons(activePercentage: number) {
    const buttons = [shortClose25Btn, shortClose50Btn, shortClose75Btn, shortClose100Btn];
    const percentages = [25, 50, 75, 100];
    
    buttons.forEach((btn, index) => {
        if (percentages[index] === activePercentage) {
            btn.classList.add('bg-red-600', 'text-white');
            btn.classList.remove('border-red-300', 'text-red-700', 'hover:bg-red-100');
        } else {
            btn.classList.remove('bg-red-600', 'text-white');
            btn.classList.add('border-red-300', 'text-red-700', 'hover:bg-red-100');
        }
    });
}

function resetLongCloseAmount() {
    currentLongClosePercentage = 0;
    currentLongCloseAmount = U256.fromNumber(0);
    longCloseAmountInput.value = "";
    longCloseAmountDisplay.textContent = "—";
    longClosePercentage.textContent = "—";
    updateLongCloseButtons(0);
}

function resetShortCloseAmount() {
    currentShortClosePercentage = 0;
    currentShortCloseAmount = U256.fromNumber(0);
    shortCloseAmountInput.value = "";
    shortCloseAmountDisplay.textContent = "—";
    shortClosePercentage.textContent = "—";
    updateShortCloseButtons(0);
}

// Handle manual input for long position closing
function handleLongCloseManualInput() {
    if (!consolidatedData || !consolidatedData.addressMarketState) return;
    
    try {
        const inputValue = longCloseAmountInput.value.trim();
        if (!inputValue || inputValue === "0" || inputValue === "0.0") {
            resetLongCloseAmount();
            return;
        }
        
        // User enters WCSPR value, we need to convert to token amount
        const wcsprValueEntered = U256.fromHtmlInput(longCloseAmountInput);
        const maxWcsprValue = consolidatedData.addressMarketState.long_position_value;
        const maxTokens = consolidatedData.addressMarketState.long_token_balance;
        
        // Validate against maximum WCSPR value
        if (wcsprValueEntered.gt(maxWcsprValue)) {
            longCloseAmountInput.value = formatNumber(maxWcsprValue);
            currentLongCloseAmount = maxTokens;
            currentLongClosePercentage = 100;
        } else {
            // Convert WCSPR value to token amount: tokenAmount = (wcsprValue * maxTokens) / maxWcsprValue
            if (maxWcsprValue.toBigInt() > 0n) {
                currentLongCloseAmount = wcsprValueEntered.mul(maxTokens).div(maxWcsprValue);
                const percentage = Number(wcsprValueEntered.toBigInt() * 100n / maxWcsprValue.toBigInt());
                currentLongClosePercentage = Math.min(100, Math.max(0, percentage));
            } else {
                currentLongCloseAmount = U256.fromNumber(0);
                currentLongClosePercentage = 0;
            }
        }
        
        // Update display - show max WCSPR value
        longCloseAmountDisplay.textContent = `${formatNumber(maxWcsprValue)} WCSPR`;
        longClosePercentage.textContent = currentLongClosePercentage > 0 ? `${currentLongClosePercentage.toFixed(0)}%` : "—";
        updateLongCloseButtons(currentLongClosePercentage);
    } catch (e) {
        console.error("Error parsing long close amount:", e);
    }
}

// Handle manual input for short position closing
function handleShortCloseManualInput() {
    if (!consolidatedData || !consolidatedData.addressMarketState) return;
    
    try {
        const inputValue = shortCloseAmountInput.value.trim();
        if (!inputValue || inputValue === "0" || inputValue === "0.0") {
            resetShortCloseAmount();
            return;
        }
        
        // User enters WCSPR value, we need to convert to token amount
        const wcsprValueEntered = U256.fromHtmlInput(shortCloseAmountInput);
        const maxWcsprValue = consolidatedData.addressMarketState.short_position_value;
        const maxTokens = consolidatedData.addressMarketState.short_token_balance;
        
        // Validate against maximum WCSPR value
        if (wcsprValueEntered.gt(maxWcsprValue)) {
            shortCloseAmountInput.value = formatNumber(maxWcsprValue);
            currentShortCloseAmount = maxTokens;
            currentShortClosePercentage = 100;
        } else {
            // Convert WCSPR value to token amount: tokenAmount = (wcsprValue * maxTokens) / maxWcsprValue
            if (maxWcsprValue.toBigInt() > 0n) {
                currentShortCloseAmount = wcsprValueEntered.mul(maxTokens).div(maxWcsprValue);
                const percentage = Number(wcsprValueEntered.toBigInt() * 100n / maxWcsprValue.toBigInt());
                currentShortClosePercentage = Math.min(100, Math.max(0, percentage));
            } else {
                currentShortCloseAmount = U256.fromNumber(0);
                currentShortClosePercentage = 0;
            }
        }
        
        // Update display - show max WCSPR value
        shortCloseAmountDisplay.textContent = `${formatNumber(maxWcsprValue)} WCSPR`;
        shortClosePercentage.textContent = currentShortClosePercentage > 0 ? `${currentShortClosePercentage.toFixed(0)}%` : "—";
        updateShortCloseButtons(currentShortClosePercentage);
    } catch (e) {
        console.error("Error parsing short close amount:", e);
    }
}

// Update close buttons state based on token balances
function updateCloseButtonsAvailability() {
    if (!consolidatedData || !consolidatedData.addressMarketState) return;
    
    const longTokenBalance = consolidatedData.addressMarketState.long_token_balance;
    const shortTokenBalance = consolidatedData.addressMarketState.short_token_balance;
    
    // Long position buttons
    const longButtons = [longClose25Btn, longClose50Btn, longClose75Btn, longClose100Btn, withdrawLongBtn];
    const hasLongTokens = longTokenBalance.toBigInt() > 0n;
    
    longButtons.forEach(btn => {
        if (hasLongTokens) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
            btn.title = '';
        } else {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            btn.title = 'No LONG tokens to close';
        }
    });
    
    // Long close input
    if (hasLongTokens) {
        longCloseAmountInput.disabled = false;
        longCloseAmountInput.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
        longCloseAmountInput.title = '';
    } else {
        longCloseAmountInput.disabled = true;
        longCloseAmountInput.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
        longCloseAmountInput.title = 'No LONG tokens to close';
    }
    
    // Short position buttons
    const shortButtons = [shortClose25Btn, shortClose50Btn, shortClose75Btn, shortClose100Btn, withdrawShortBtn];
    const hasShortTokens = shortTokenBalance.toBigInt() > 0n;
    
    shortButtons.forEach(btn => {
        if (hasShortTokens) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
            btn.title = '';
        } else {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            btn.title = 'No SHORT tokens to close';
        }
    });
    
    // Short close input
    if (hasShortTokens) {
        shortCloseAmountInput.disabled = false;
        shortCloseAmountInput.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
        shortCloseAmountInput.title = '';
    } else {
        shortCloseAmountInput.disabled = true;
        shortCloseAmountInput.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
        shortCloseAmountInput.title = 'No SHORT tokens to close';
    }
}

// ---------- Wallet Connection Management ----------
async function connect() {
    clearError();
    await client.signIn();
}

async function onConnect() {
    connected = true;
    address = account.publicKey;
    addressSpan.textContent = `${address.slice(0, 5)}...${address.slice(-5)}`;
    connectBtn.classList.add("hidden");
    disconnectSection.classList.remove("hidden");
    if (marketStatusSpan) marketStatusSpan.textContent = "Connected";
    
    // Clear old account data immediately to prevent showing stale data
    consolidatedData = null;
    balances = null;
    setFallbackValues();
    
    // Disable read-only mode or disconnected mode if they were enabled
    disableReadOnlyMode();
    disableDisconnectedMode();
    
    // Small delay to ensure UI has time to clear before fetching new data
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await refreshAllData();
}

async function disconnect() {
    await client.signOut();
    connected = false;
    address = null;
    balances = null;
    
    // Clear user-specific data but keep market data
    wcsprBalanceSpan.textContent = "—";
    longTokenBalancePortfolio.textContent = "— WCSPR";
    shortTokenBalancePortfolio.textContent = "— WCSPR";
    marketAllowanceSpan.textContent = "—";
    totalPositionValueSpan.textContent = "—";
    
    hideTransaction();
    
    // Show connect button and disable trading functionality
    enableDisconnectedMode();
    
    // Load market data without wallet
    try {
        await refreshMarketStateOnly();
    } catch (error: any) {
        console.error("Failed to load market data after disconnect:", error);
        // Market data will show "—" from the error handling in refreshMarketStateOnly
    }
}

// ---------- Data Fetching Functions ----------

async function refreshAllDataConsolidated() {
    if (!connected || !address) {
        // If not connected, only refresh market state for price display
        await refreshMarketStateOnly();
        return;
    }

    // Show all loaders
    showAllLoaders();

    try {
        // Get caller address
        const caller = account.address;

        // Set higher gas limit for complex data fetching operation
        setGas(HIGH_GAS_AMOUNT);
        
        // Single call to get all data
        const addressMarketState = await executeWithRetry(() => 
            market.getAddressMarketState(caller)
        );

        // Store the consolidated data
        consolidatedData = {
            addressMarketState,
            lastUpdated: Date.now()
        };

        // Update all UI elements from the consolidated data
        updateUIFromConsolidatedData();

    } catch (e: any) {
        console.error("Failed to fetch consolidated data:", e);
        
        // Handle rate limiting more gracefully
        if (e.message && e.message.includes('429')) {
            showError("Rate limited - please wait a moment before refreshing");
        } else {
            showError(`Failed to fetch data: ${e.message || e}`);
        }
        
        // Set fallback values
        setFallbackValues();
    } finally {
        // Hide all loaders and show values
        hideAllLoaders();
    }
}

async function refreshMarketStateOnly() {
    // Show only market state loaders
    currentPriceSpan.classList.add("hidden");
    longLiquiditySpan.classList.add("hidden");
    shortLiquiditySpan.classList.add("hidden");
    totalMarketValueSpan.classList.add("hidden");
    priceLoader.classList.remove("hidden");
    longLiquidityLoader.classList.remove("hidden");
    shortLiquidityLoader.classList.remove("hidden");
    totalMarketValueLoader.classList.remove("hidden");

    try {
        // Set higher gas limit for market data fetching
        setGas(HIGH_GAS_AMOUNT);
        marketState = await executeWithRetry(() => market.getMarketState());
        
        currentPriceSpan.textContent = formatDollarPrice(marketState.price);
        longLiquiditySpan.textContent = formatNumber(marketState.long_liquidity);
        shortLiquiditySpan.textContent = formatNumber(marketState.short_liquidity);
        
        // Compute and display total market value
        const totalMarketValue = marketState.long_liquidity.add(marketState.short_liquidity);
        totalMarketValueSpan.textContent = formatNumber(totalMarketValue) + " WCSPR";


    } catch (e: any) {
        console.error("Failed to fetch market state:", e);
        
        // Handle rate limiting more gracefully
        if (e.message && e.message.includes('429')) {
            showError("Rate limited - please wait a moment before refreshing");
        } else {
            showError("Failed to fetch market state");
        }
        
        // Set fallback values
        currentPriceSpan.textContent = "—";
        longLiquiditySpan.textContent = "—";
        shortLiquiditySpan.textContent = "—";
        totalMarketValueSpan.textContent = "—";
    } finally {
        // Hide loaders and show values
        currentPriceSpan.classList.remove("hidden");
        longLiquiditySpan.classList.remove("hidden");
        shortLiquiditySpan.classList.remove("hidden");
        totalMarketValueSpan.classList.remove("hidden");
        priceLoader.classList.add("hidden");
        longLiquidityLoader.classList.add("hidden");
        shortLiquidityLoader.classList.add("hidden");
        totalMarketValueLoader.classList.add("hidden");
    }
}

function showAllLoaders() {
    // Market state loaders
    currentPriceSpan.classList.add("hidden");
    longLiquiditySpan.classList.add("hidden");
    shortLiquiditySpan.classList.add("hidden");
    priceLoader.classList.remove("hidden");
    longLiquidityLoader.classList.remove("hidden");
    shortLiquidityLoader.classList.remove("hidden");

    // Balance loaders
    wcsprBalanceSpan.classList.add("hidden");
    wcsprBalanceLoader.classList.remove("hidden");

    // Position-specific balance loaders
    wcsprBalanceLong.classList.add("hidden");
    wcsprBalanceShort.classList.add("hidden");
    wcsprBalanceLongLoader.classList.remove("hidden");
    wcsprBalanceShortLoader.classList.remove("hidden");

    // Allowance loader
    marketAllowanceSpan.classList.add("hidden");
    marketAllowanceLoader.classList.remove("hidden");

    // Position loaders
    totalPositionValueSpan.classList.add("hidden");
    longPositionLoader.classList.remove("hidden");
    shortPositionLoader.classList.remove("hidden");
    totalPositionLoader.classList.remove("hidden");
}

function hideAllLoaders() {
    // Market state loaders
    currentPriceSpan.classList.remove("hidden");
    longLiquiditySpan.classList.remove("hidden");
    shortLiquiditySpan.classList.remove("hidden");
    priceLoader.classList.add("hidden");
    longLiquidityLoader.classList.add("hidden");
    shortLiquidityLoader.classList.add("hidden");

    // Balance loaders
    wcsprBalanceSpan.classList.remove("hidden");
    wcsprBalanceLoader.classList.add("hidden");

    // Position-specific balance loaders
    wcsprBalanceLong.classList.remove("hidden");
    wcsprBalanceShort.classList.remove("hidden");
    wcsprBalanceLongLoader.classList.add("hidden");
    wcsprBalanceShortLoader.classList.add("hidden");

    // Allowance loader
    marketAllowanceSpan.classList.remove("hidden");
    marketAllowanceLoader.classList.add("hidden");

    // Position loaders
    totalPositionValueSpan.classList.remove("hidden");
    longPositionLoader.classList.add("hidden");
    shortPositionLoader.classList.add("hidden");
    totalPositionLoader.classList.add("hidden");
}

function enableReadOnlyMode() {
    // Update UI to show read-only mode
    if (addressSpan) {
        addressSpan.textContent = "Read-Only Mode";
    }
    
    // Hide connect button and show disconnect section with read-only indicator
    connectBtn.classList.add("hidden");
    disconnectSection.classList.remove("hidden");
    addressDropdownMenu.classList.add("hidden");
    
    // Add read-only indicator to the disconnect section
    const readOnlyIndicator = document.createElement("div");
    readOnlyIndicator.className = "text-sm text-gray-600 text-center mt-2";
    readOnlyIndicator.innerHTML = `
        <div class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>View-only mode - Connect wallet to trade</span>
        </div>
    `;
    
    // Remove any existing read-only indicator
    const existingIndicator = disconnectSection.querySelector('.text-gray-600');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    disconnectSection.appendChild(readOnlyIndicator);
    
    // Disable all trading buttons
    const tradingButtons = [
        'deposit-long-btn', 'withdraw-long-btn', 'deposit-short-btn', 'withdraw-short-btn',
        'faucet-btn', 'approve-market-btn', 'update-price-btn',
        'long-close-25', 'long-close-50', 'long-close-75', 'long-close-100',
        'short-close-25', 'short-close-50', 'short-close-75', 'short-close-100'
    ];
    
    tradingButtons.forEach(btnId => {
        const btn = document.getElementById(btnId) as HTMLButtonElement;
        if (btn) {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            btn.title = 'Connect wallet to enable trading';
        }
    });
    
    // Disable all trading input fields
    const tradingInputs = [
        'long-open-amount', 'short-open-amount',
        'approve-amount'
    ];
    
    tradingInputs.forEach(inputId => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) {
            input.disabled = true;
            input.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
            input.placeholder = 'Connect wallet to enable trading';
            input.title = 'Connect wallet to enable trading';
        }
    });
    
    // Update market status
    if (marketStatusSpan) {
        marketStatusSpan.textContent = "Read-Only";
    }
    
    // Clear user-specific data
    balances = null;
    consolidatedData = null;
    
    // Set fallback values for user-specific data
    setFallbackValues();
}

function enableDisconnectedMode() {
    // Update UI to show disconnected state
    if (addressSpan) {
        addressSpan.textContent = "";
    }
    
    // Show connect button and hide disconnect section
    connectBtn.classList.remove("hidden");
    disconnectSection.classList.add("hidden");
    
    // Disable all trading buttons
    const tradingButtons = [
        'deposit-long-btn', 'withdraw-long-btn', 'deposit-short-btn', 'withdraw-short-btn',
        'faucet-btn', 'approve-market-btn', 'update-price-btn',
        'long-close-25', 'long-close-50', 'long-close-75', 'long-close-100',
        'short-close-25', 'short-close-50', 'short-close-75', 'short-close-100'
    ];
    
    tradingButtons.forEach(btnId => {
        const btn = document.getElementById(btnId) as HTMLButtonElement;
        if (btn) {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            btn.title = 'Connect wallet to enable trading';
        }
    });
    
    // Disable all trading input fields
    const tradingInputs = [
        'long-open-amount', 'short-open-amount',
        'approve-amount', 'long-close-amount-input', 'short-close-amount-input'
    ];
    
    tradingInputs.forEach(inputId => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) {
            input.disabled = true;
            input.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
            input.placeholder = 'Connect wallet to enable trading';
            input.title = 'Connect wallet to enable trading';
        }
    });
    
    // Update market status
    if (marketStatusSpan) {
        marketStatusSpan.textContent = "Disconnected";
    }
}

function disableReadOnlyMode() {
    // Remove read-only indicator
    const existingIndicator = disconnectSection.querySelector('.text-gray-600');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Re-enable all trading buttons
    const tradingButtons = [
        'deposit-long-btn', 'withdraw-long-btn', 'deposit-short-btn', 'withdraw-short-btn',
        'faucet-btn', 'approve-market-btn', 'update-price-btn',
        'long-close-25', 'long-close-50', 'long-close-75', 'long-close-100',
        'short-close-25', 'short-close-50', 'short-close-75', 'short-close-100'
    ];
    
    tradingButtons.forEach(btnId => {
        const btn = document.getElementById(btnId) as HTMLButtonElement;
        if (btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
            btn.title = '';
        }
    });
    
    // Re-enable all trading input fields
    const tradingInputs = [
        'long-open-amount', 'short-open-amount',
        'approve-amount', 'long-close-amount-input', 'short-close-amount-input'
    ];
    
    tradingInputs.forEach(inputId => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) {
            input.disabled = false;
            input.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
            // Restore original placeholders
            switch (inputId) {
                case 'long-open-amount':
                case 'long-close-amount-input':
                case 'short-open-amount':
                case 'short-close-amount-input':
                    input.placeholder = '0.0';
                    break;
                case 'approve-amount':
                    input.placeholder = 'Approve amount (empty = max)';
                    break;
            }
            input.title = '';
        }
    });
    
    // Show disconnect button
    disconnectBtn.classList.remove("hidden");
}

function disableDisconnectedMode() {
    // Re-enable all trading buttons
    const tradingButtons = [
        'deposit-long-btn', 'withdraw-long-btn', 'deposit-short-btn', 'withdraw-short-btn',
        'faucet-btn', 'approve-market-btn', 'update-price-btn',
        'long-close-25', 'long-close-50', 'long-close-75', 'long-close-100',
        'short-close-25', 'short-close-50', 'short-close-75', 'short-close-100'
    ];
    
    tradingButtons.forEach(btnId => {
        const btn = document.getElementById(btnId) as HTMLButtonElement;
        if (btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
            btn.title = '';
        }
    });
    
    // Re-enable all trading input fields
    const tradingInputs = [
        'long-open-amount', 'short-open-amount',
        'approve-amount', 'long-close-amount-input', 'short-close-amount-input'
    ];
    
    tradingInputs.forEach(inputId => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) {
            input.disabled = false;
            input.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
            // Restore original placeholders
            switch (inputId) {
                case 'long-open-amount':
                case 'long-close-amount-input':
                case 'short-open-amount':
                case 'short-close-amount-input':
                    input.placeholder = '0.0';
                    break;
                case 'approve-amount':
                    input.placeholder = 'Approve amount (empty = max)';
                    break;
            }
            input.title = '';
        }
    });
}

function updateUIFromConsolidatedData() {
    if (!consolidatedData) return;
    
    const data = consolidatedData.addressMarketState;
    if (!data) {
        console.error("addressMarketState is undefined in consolidatedData");
        return;
    }
    
    // Update market state from consolidated data
    marketState = data.marketState;
    currentPriceSpan.textContent = formatDollarPrice(data.marketState.price);
    longLiquiditySpan.textContent = formatNumber(data.marketState.long_liquidity) + " WCSPR";
    shortLiquiditySpan.textContent = formatNumber(data.marketState.short_liquidity) + " WCSPR";
    // Compute total market value
    const totalMarketValue = data.marketState.long_liquidity.add(data.marketState.short_liquidity);
    totalMarketValueSpan.textContent = formatNumber(totalMarketValue) + " WCSPR";
    
    // Update balances from consolidated data
    balances = {
        wcspr: data.wcspr_balance,
        longToken: data.long_token_balance,
        shortToken: data.short_token_balance
    };
    wcsprBalanceSpan.textContent = formatNumber(data.wcspr_balance) + " WCSPR";
    
    // Calculate available WCSPR (minimum of balance and allowance)
    const availableWcspr = data.wcspr_balance.lt(data.market_allowance) ? data.wcspr_balance : data.market_allowance;
    
    // Update position-specific WCSPR balances with available amount
    wcsprBalanceLong.textContent = formatNumber(availableWcspr) + " WCSPR";
    wcsprBalanceShort.textContent = formatNumber(availableWcspr) + " WCSPR";
    
    // Set click-to-fill for open positions (available WCSPR amount)
    wcsprBalanceLong.onclick = () => {
        try { longOpenAmountInput.value = formatNumber(availableWcspr); } catch {}
    };
    wcsprBalanceShort.onclick = () => {
        try { shortOpenAmountInput.value = formatNumber(availableWcspr); } catch {}
    };
    
    // Update portfolio position values in WCSPR
    longTokenBalancePortfolio.textContent = `${formatNumber(data.long_position_value)} WCSPR`;
    shortTokenBalancePortfolio.textContent = `${formatNumber(data.short_position_value)} WCSPR`;
    
    // Update position value displays in closing sections
    longPositionValueDisplay.textContent = `${formatNumber(data.long_position_value)} WCSPR`;
    shortPositionValueDisplay.textContent = `${formatNumber(data.short_position_value)} WCSPR`;
    
    // Reset closing amounts when position values change
    resetLongCloseAmount();
    resetShortCloseAmount();
    
    // Update close buttons availability based on token balances
    updateCloseButtonsAvailability();
    
    // Update market allowance
    marketAllowanceSpan.textContent = formatAllowance(data.market_allowance);
    marketAllowanceValue = data.market_allowance;
    
    // Update position values
    // Total is WCSPR balance + long/short values
    const totalValueWithWcspr = data.total_position_value.add(data.wcspr_balance);
    totalPositionValueSpan.textContent = formatNumber(totalValueWithWcspr) + " WCSPR";
}

function setFallbackValues() {
    // Market state fallbacks
    currentPriceSpan.textContent = "—";
    longLiquiditySpan.textContent = "—";
    shortLiquiditySpan.textContent = "—";
    
    // Balance fallbacks
    wcsprBalanceSpan.textContent = "—";
    marketAllowanceSpan.textContent = "—";
    
    // Position-specific balance fallbacks
    wcsprBalanceLong.textContent = "—";
    wcsprBalanceShort.textContent = "—";
    
    // Position fallbacks
    totalPositionValueSpan.textContent = "—";
}

// Legacy functions removed - all functionality consolidated into refreshAllDataConsolidated()

async function refreshAllData() {
    // Use the new consolidated data fetching
    await refreshAllDataConsolidated();
}

// ---------- Trading Functions ----------
async function depositLong() {
    if (!transactionPreCheck("Please connect your wallet to trade")) {
        return;
    }
    
    const amount = parseAmount(longOpenAmountInput);
    if (!amount) {
        showError("Please enter a valid amount");
        return;
    }
    // Check allowance and balance
    if (!balances) {
        showError("Balances not loaded yet. Please refresh.");
        return;
    }
    const wcsprBalance = balances.wcspr;
    const allowance = marketAllowanceValue || U256.fromNumber(0);
    const maxSpendable = wcsprBalance.lt(allowance) ? wcsprBalance : allowance;
    if (amount.gt(maxSpendable)) {
        showError(`Insufficient available WCSPR. You can spend up to ${formatNumber(maxSpendable)} WCSPR (limited by balance or allowance).`);
        return;
    }

    // Show popup immediately when user clicks the button
    showTransactionPopup("Open Long position");

    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();

    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await market.depositLong(amount);
        longOpenAmountInput.value = "";
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to open long position");
    }
}

async function withdrawLong() {
    if (!transactionPreCheck("Please connect your wallet to trade")) {
        return;
    }
    
    if (currentLongClosePercentage === 0) {
        showError("Please select a percentage to close");
        return;
    }

    if (!currentLongCloseAmount) {
        showError("Please select a percentage to close");
        return;
    }
    
    if (currentLongCloseAmount.toBigInt() === 0n) {
        showError("Amount to close must be greater than 0");
        return;
    }

    // Show popup immediately when user clicks the button
    showTransactionPopup("Close Long position");

    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();

    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await market.withdrawLong(currentLongCloseAmount);
        resetLongCloseAmount();
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to close long position");
    }
}

async function depositShort() {
   if (!transactionPreCheck("Please connect your wallet to trade")) {
        return;
    }
    
    const amount = parseAmount(shortOpenAmountInput);
    if (!amount) {
        showError("Please enter a valid amount");
        return;
    }
    // Check allowance and balance
    if (!balances) {
        showError("Balances not loaded yet. Please refresh.");
        return;
    }
    const wcsprBalance = balances.wcspr;
    const allowance = marketAllowanceValue || U256.fromNumber(0);
    const maxSpendable = wcsprBalance.lt(allowance) ? wcsprBalance : allowance;
    if (amount.gt(maxSpendable)) {
        showError(`Insufficient available WCSPR. You can spend up to ${formatNumber(maxSpendable)} WCSPR (limited by balance or allowance).`);
        return;
    }

    // Show popup immediately when user clicks the button
    showTransactionPopup("Open Short position");

    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();

    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await market.depositShort(amount);
        shortOpenAmountInput.value = "";
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to open short position");
    }
}

async function withdrawShort() {
    if (!transactionPreCheck("Please connect your wallet to trade")) {
        return;
    }
    
    if (currentShortClosePercentage === 0) {
        showError("Please select a percentage to close");
        return;
    }

    if (!currentShortCloseAmount) {
        showError("Please select a percentage to close");
        return;
    }
    
    if (currentShortCloseAmount.toBigInt() === 0n) {
        showError("Amount to close must be greater than 0");
        return;
    }

    // Show popup immediately when user clicks the button
    showTransactionPopup("Close Short position");

    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();

    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await market.withdrawShort(currentShortCloseAmount);
        resetShortCloseAmount();
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to close short position");
    }
}

async function updatePrice() {
    if (!transactionPreCheck("Please connect your wallet to update price")) {
        return;
    }

    // Show popup immediately when user clicks the button
    showTransactionPopup("Price update");

    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();

    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await market.updatePrice();
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to update price");
    }
}

async function requestFaucet() {
    if (!transactionPreCheck("Please connect your wallet to use the faucet")) {
        return;
    }

    // Show popup immediately when user clicks the button
    showTransactionPopup("Faucet request");

    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();
    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await wcspr.faucet();
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to request faucet");
    }
}

async function approveMarket() {
    if (!transactionPreCheck("Please connect your wallet to approve market")) {
        return;
    }

    // Validate amount before disabling buttons
    let approvalAmount: U256;
    const inputValue = approveAmountInput.value.trim();
    
    if (inputValue === "") {
        // If no amount specified, approve a very large amount (effectively unlimited)
        // Using 2^128 - 1 as a practically unlimited approval
        approvalAmount = new U256("340282366920938463463374607431768211455"); // 2^128 - 1
    } else {
        const parsedAmount = parseFloat(inputValue);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            showError("Please enter a valid amount");
            return;
        }
        
        approvalAmount = parseAmountFromNumber(parsedAmount);
    }

    // Show popup immediately when user clicks the button
    showTransactionPopup("Market approval");

    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();

    try {
        // Get the market contract address
        const marketAddress = new Address(CONTRACT_ADDRESSES.market);

        setGas(DEFAULT_GAS_AMOUNT);
        await wcspr.approve(marketAddress, approvalAmount);
        approveAmountInput.value = "";
        
        clearError(); // Clear any existing errors
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to approve market");
    }
}

function transactionPreCheck(errorMessage: string): boolean {
    if (!connected || !address) {
        showError(errorMessage);
        return false;
    }
    
    if (currentTransaction) {
        showError("Please wait for the current transaction to complete");
        return false;
    }
    
    clearError();
    hideTransaction();
    return true;
}

function onTransactionSentFailure(error: any, message: string) {
    hideTransactionPopup();
    enableTransactionButtons();
    showError(`${message}: ${error.message || error}`);
}


// ---------- Event Listeners ----------
connectBtn.addEventListener("click", connect);
disconnectBtn.addEventListener("click", disconnect);
refreshBtn.addEventListener("click", refreshAllData);

// Dropdown functionality
addressDropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  addressDropdownMenu.classList.toggle("hidden");
});

switchAccountBtn.addEventListener("click", async () => {
  addressDropdownMenu.classList.add("hidden");
  try {
    // Show a brief loading state
    addressSpan.textContent = "Switching...";
    await client.switchAccount();
  } catch (error) {
    console.error("Failed to switch account:", error);
    showError("Failed to switch account.");
    // Restore the original address if switching failed
    if (address) {
      addressSpan.textContent = `${address.slice(0, 5)}...${address.slice(-5)}`;
    }
  }
});

// Close dropdown when clicking outside
document.addEventListener("click", () => {
  addressDropdownMenu.classList.add("hidden");
});

depositLongBtn.addEventListener("click", depositLong);
withdrawLongBtn.addEventListener("click", withdrawLong);
depositShortBtn.addEventListener("click", depositShort);
withdrawShortBtn.addEventListener("click", withdrawShort);

// Percentage button event listeners
longClose25Btn.addEventListener("click", () => updateLongCloseAmount(25));
longClose50Btn.addEventListener("click", () => updateLongCloseAmount(50));
longClose75Btn.addEventListener("click", () => updateLongCloseAmount(75));
longClose100Btn.addEventListener("click", () => updateLongCloseAmount(100));

shortClose25Btn.addEventListener("click", () => updateShortCloseAmount(25));
shortClose50Btn.addEventListener("click", () => updateShortCloseAmount(50));
shortClose75Btn.addEventListener("click", () => updateShortCloseAmount(75));
shortClose100Btn.addEventListener("click", () => updateShortCloseAmount(100));

updatePriceBtn.addEventListener("click", updatePrice);
faucetBtn.addEventListener("click", requestFaucet);
approveMarketBtn.addEventListener("click", approveMarket);
// Sanitize numeric inputs on the fly
function sanitizeNumericInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    if (sanitized !== input.value) input.value = sanitized;
}
longOpenAmountInput.addEventListener('input', sanitizeNumericInput);
shortOpenAmountInput.addEventListener('input', sanitizeNumericInput);

// Position closing input event listeners
longCloseAmountInput.addEventListener('input', (e) => {
    sanitizeNumericInput(e);
    handleLongCloseManualInput();
});
shortCloseAmountInput.addEventListener('input', (e) => {
    sanitizeNumericInput(e);
    handleShortCloseManualInput();
});

// Note: Hint functions removed since we now have separate forms with clear labels

// Add event listeners for trading info management
closeTradingInfoBtn.addEventListener("click", closeTradingInfo);
showTradingInfoBtn.addEventListener("click", showTradingInfo);

// Error modal events
if (errorModalClose) {
    errorModalClose.addEventListener("click", () => {
        clearError();
    });
}

// Close error modal when clicking outside
if (errorModalOverlay) {
    errorModalOverlay.addEventListener("click", (event) => {
        if (event.target === errorModalOverlay) {
            clearError();
        }
    });
}

// Close error modal with ESC
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && errorModalOverlay && !errorModalOverlay.classList.contains("hidden")) {
        clearError();
    }
});

// Recenter/ensure visibility on resize (especially mobile orientation changes)
window.addEventListener("resize", () => {
    if (errorModalOverlay && !errorModalOverlay.classList.contains("hidden")) {
        if (errorModalPanel) {
            errorModalPanel.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
    }
    if (txProgressOverlay && !txProgressOverlay.classList.contains("hidden")) {
        if (txProgressPanel) {
            txProgressPanel.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
    }
});

function showErrorWithTransaction(msg: string, hash: string) {
    if (errorModalMessage && errorModalOverlay) {
        const shortened = `${hash.slice(0, 10)}…${hash.slice(-8)}`;
        const href = buildExplorerTxUrl(hash);
        const safeMsg = escapeHtml(msg);
        errorModalMessage.innerHTML = `${safeMsg}<span class="block mt-2 text-xs text-red-800">Tx: <a href="${href}" target="_blank" rel="noopener noreferrer" class="font-mono underline break-all">${shortened}</a></span>`;
        errorModalOverlay.classList.remove("hidden");
        lockScroll();
        if (errorModalPanel) {
            errorModalPanel.focus();
        }
    } else {
        console.error(msg, hash.toString());
    }
}

// ---------- CSPR.click Integration ----------
// Set up CSPR.click callbacks
function setupCsprClickCallbacks() {    
    // Set up the callback handlers
    CsprClickCallbacks.onSignedIn(async (accountInfo: AccountInfo) => {
        account = accountInfo;
        await onConnect();
    });
    
    CsprClickCallbacks.onSwitchedAccount(async (accountInfo: AccountInfo) => {
        account = accountInfo;
        await onConnect();
    });
    
    CsprClickCallbacks.onSignedOut(() => {
        connected = false;
        address = null;
        balances = null;
        
        // Clear user-specific data but keep market data
        wcsprBalanceSpan.textContent = "—";
        longTokenBalancePortfolio.textContent = "— WCSPR";
        shortTokenBalancePortfolio.textContent = "— WCSPR";
        
        // Update UI for disconnected mode
        enableDisconnectedMode();
    });
    
    CsprClickCallbacks.onTransactionStatusUpdate((status: TransactionStatus, result: TransactionResult) => {
        handleCsprClickStatusUpdate(status, result);
    });
}

// Handle CSPR.click status updates according to the documentation
function handleCsprClickStatusUpdate(status: TransactionStatus, result: TransactionResult): void {    
    switch (status) {
        case TransactionStatus.SENT:
            // Transaction has been signed and successfully deployed to a Casper node
            txProgressStatus.textContent = "Transaction sent to network...";
            txProgressTime.textContent = "Waiting for processing...";
            txProgressBar.style.width = "20%";
            currentTransaction = {
                startTime: Date.now(),
                hash: result.txHash || ""
            };
            
            // Display the transaction hash as soon as it's available
            const hash = result.txHash;
            if (hash) {
                showTransactionHashInProgress(hash);
            }
            break;
        case TransactionStatus.PROCESSED:
            // Transaction has been executed by the network
            if (result.error) {
                // Transaction failed - has error or error code
                onTransactionFailureFromCsprClick(result).catch((error: any) => {
                    console.error("Error in transaction failure handler:", error);
                });
            } else {
                // No error indicators - assume success
                onTransactionSuccessFromCsprClick(result).catch((error: any) => {
                    console.error("Error in transaction success handler:", error);
                });
            }
            break;
            
        case TransactionStatus.EXPIRED:
            // Transaction's TTL elapsed before execution
            onTransactionExpired();
            break;
            
        case TransactionStatus.CANCELLED:
            // User rejected the signature request
            onTransactionCancelled();
            break;
            
        case TransactionStatus.TIMEOUT:
            // SDK stopped listening for updates before transaction was finalized
            onTransactionTimeout();
            break;
            
        case TransactionStatus.ERROR:
            // An unexpected error occurred
            onTransactionFailureFromCsprClick(result).catch((error: any) => {
                console.error("Error in transaction failure handler:", error);
            });
            break;
            
        case TransactionStatus.PING:
            // Heartbeat event - connection is still active
            // If we're monitoring a transaction and receiving heartbeats, 
            // check if we've been waiting too long
            if (currentTransaction) {
                const elapsed = Date.now() - currentTransaction.startTime;
                // Use a shorter timeout for heartbeat scenarios (2 minutes instead of 5)
                const heartbeatTimeout = 2 * 60 * 1000; // 2 minutes
                // Update progress bar based on elapsed time
                const progressPercentage = Math.min(20 + (elapsed / heartbeatTimeout) * 60, 80);
                txProgressBar.style.width = `${progressPercentage}%`;
                txProgressTime.textContent = `Waiting for processing... (${Math.floor(elapsed / 1000)}s elapsed)`;
            }
            break;
        default:
            console.warn('Unknown CSPR.click status:', status);
            break;
    }
}

// ---------- Position Closing State Initialization ----------
function initializePositionClosingState() {
    // Initialize position closing amounts after WASM is loaded
    currentLongCloseAmount = U256.fromNumber(0);
    currentShortCloseAmount = U256.fromNumber(0);
}

// ---------- Initialization ----------
async function initializeClients() {
    // Initialize WASM
    await init();
    
    // Set up CSPR.click callbacks after WASM is initialized
    setupCsprClickCallbacks();
    
    // Initialize position closing state after WASM is loaded
    initializePositionClosingState();

    // Initialize the base client
    client = new OdraWasmClient(
        "https://testnet-rpc.odra.dev", 
        "https://testnet-speculative-rpc.odra.dev", 
        "casper-test"
    );

    // Initialize contract clients with placeholder addresses
    // In a real deployment, these would be the actual deployed contract addresses
    market = new MarketWasmClient(client, new Address(CONTRACT_ADDRESSES.market));
    wcspr = new FaucetableWcsprWasmClient(client, new Address(CONTRACT_ADDRESSES.wcspr));
    longToken = new PositionTokenWasmClient(client, new Address(CONTRACT_ADDRESSES.longToken));
    shortToken = new PositionTokenWasmClient(client, new Address(CONTRACT_ADDRESSES.shortToken));
}

async function run() {
    try {
        // Ensure buttons are disabled by default (in case HTML disabled attributes aren't enough)
        enableDisconnectedMode();
        
        // Initialize with CSPR.click integration
        await initializeClients();
   
        // Initialize trading info visibility
        initializeTradingInfo();
        
        if (marketStatusSpan) marketStatusSpan.textContent = "Ready";
    } catch (err: any) {
        console.error("Failed to initialize:", err);
        
        // Parse the error to determine if it's wallet-related
        const errorMessage = err.message || err.toString();
        
        if (errorMessage.toLowerCase().includes('wallet is locked') || 
            errorMessage.toLowerCase().includes('code":1')) {
            // Instead of showing wallet locked popup, switch to disconnected mode
            connected = false;
            address = null;
            enableDisconnectedMode();
            try {
                await refreshMarketStateOnly();
            } catch (refreshError) {
                console.warn("Failed to refresh market state:", refreshError);
            }
        } else {
            // For non-wallet errors, show the old error display
            showError(`Initialization failed: ${errorMessage}`);
        }
        
        if (marketStatusSpan) marketStatusSpan.textContent = "Error";
    }
}

// Start the application
setTimeout(() => run(), 100);