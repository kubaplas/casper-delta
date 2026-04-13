import { setGas, Address, U256 } from "casper-delta-wasm-client";
import { HIGH_GAS_AMOUNT } from "../config.js";
import * as dom from "../dom.js";
import { showError } from "../ui/modals.js";
import { formatNumber, formatDollarPrice, formatAllowance } from "../ui/formatters.js";
import { showAllLoaders, hideAllLoaders } from "../ui/loaders.js";
import { connected, address, market, client, consolidatedData, setBalances, setMarketState, setConsolidatedData, setMarketAllowanceValue, setCsprBalance, } from "./state.js";
import { resetLongCloseAmount, resetShortCloseAmount, updateCloseButtonsAvailability } from "../trading/positions.js";
// ---------- Request Helper Functions ----------
/**
 * Simple delay helper for rate limiting
 */
async function delayRequest(ms = 2000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// ---------- Global Rate Limiting State ----------
// Prevents rapid-fire RPC requests, especially during error scenarios
let lastRequestTime = 0;
let consecutiveErrors = 0;
const MIN_REQUEST_INTERVAL = 1000; // Minimum 1 second between requests
const MAX_BACKOFF_DELAY = 30000; // Maximum 30 second backoff
const ERROR_COOLDOWN_BASE = 2000; // Base cooldown after errors
/**
 * Check if we should throttle the request and wait if necessary
 */
async function throttleRequest() {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    // Calculate required delay based on consecutive errors
    let requiredDelay = MIN_REQUEST_INTERVAL;
    if (consecutiveErrors > 0) {
        // Exponential backoff: 2s, 4s, 8s, 16s, up to MAX_BACKOFF_DELAY
        requiredDelay = Math.min(ERROR_COOLDOWN_BASE * Math.pow(2, consecutiveErrors - 1), MAX_BACKOFF_DELAY);
    }
    if (timeSinceLastRequest < requiredDelay) {
        const waitTime = requiredDelay - timeSinceLastRequest;
        console.log(`Throttling request, waiting ${waitTime}ms (consecutive errors: ${consecutiveErrors})`);
        await delayRequest(waitTime);
    }
    lastRequestTime = Date.now();
}
/**
 * Record a successful request (resets error counter)
 */
function recordSuccess() {
    consecutiveErrors = 0;
}
/**
 * Record a failed request (increments error counter for backoff)
 */
function recordError() {
    consecutiveErrors = Math.min(consecutiveErrors + 1, 5); // Cap at 5 for max ~30s backoff
}
/**
 * Simple retry wrapper for API calls with exponential backoff for all errors
 */
async function executeWithRetry(fn, maxRetries = 3) {
    // Apply global throttling before any attempt
    await throttleRequest();
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await fn();
            recordSuccess();
            return result;
        }
        catch (error) {
            const isLastAttempt = attempt === maxRetries;
            const isRateLimit = error.message && error.message.includes('429');
            const isNetworkError = error.message && (error.message.includes('fetch') ||
                error.message.includes('network') ||
                error.message.includes('Failed to fetch') ||
                error.message.includes('NetworkError') ||
                error.message.includes('ECONNREFUSED') ||
                error.message.includes('timeout'));
            // Log full error details for debugging
            console.error(`[RPC] Request failed (attempt ${attempt + 1}/${maxRetries + 1}):`, {
                message: error.message,
                name: error.name,
                stack: error.stack?.split('\n').slice(0, 3).join('\n'),
            });
            // Apply backoff for rate limits and network errors (not last attempt)
            if ((isRateLimit || isNetworkError) && !isLastAttempt) {
                const backoffDelay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
                console.warn(`Request failed (${isRateLimit ? 'rate limited' : 'network error'}), retrying in ${backoffDelay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
                await delayRequest(backoffDelay);
                continue;
            }
            // Record the error for global throttling
            recordError();
            throw error;
        }
    }
    throw new Error('Max retries exceeded');
}
// ---------- Data Fetching Functions ----------
// Guard flags to prevent re-entrant refresh calls
let isRefreshingAllData = false;
let isRefreshingMarketState = false;
/**
 * Refresh all data using consolidated endpoint
 */
export async function refreshAllDataConsolidated() {
    if (!connected || !address) {
        // If not connected, only refresh market state for price display
        await refreshMarketStateOnly();
        return;
    }
    // Prevent re-entrant calls
    if (isRefreshingAllData) {
        console.log("Refresh already in progress, skipping duplicate call");
        return;
    }
    isRefreshingAllData = true;
    // Show all loaders
    showAllLoaders();
    try {
        // Get caller address from state (set during onConnect)
        if (!address) {
            console.warn("No address available for data fetch");
            setFallbackValues();
            return;
        }
        // Convert public key string to Address type
        // The address from cspr.click is a raw public key hex string
        const caller = Address.fromPublicKey(address);
        // Set higher gas limit for complex data fetching operation
        setGas(HIGH_GAS_AMOUNT);
        // Single call to get all data
        const addressMarketState = await executeWithRetry(() => market.getAddressMarketState(caller));
        // Store the consolidated data
        setConsolidatedData({
            addressMarketState,
            lastUpdated: Date.now()
        });
        // Update all UI elements from the consolidated data
        updateUIFromConsolidatedData();
    }
    catch (e) {
        console.error("Failed to fetch consolidated data:", e);
        // Handle rate limiting more gracefully
        if (e.message && e.message.includes('429')) {
            showError("Rate limited - please wait a moment before refreshing");
        }
        else {
            showError(`Failed to fetch data: ${e.message || e}`);
        }
        // Set fallback values
        setFallbackValues();
    }
    finally {
        // Hide all loaders and show values immediately (don't wait for CSPR balance)
        hideAllLoaders();
        isRefreshingAllData = false;
    }
    // Fetch native CSPR balance separately (non-blocking for UI)
    refreshCsprBalance().catch(e => console.warn("Failed to fetch CSPR balance:", e));
}
/**
 * Refresh market state only (for read-only mode)
 */
export async function refreshMarketStateOnly() {
    // Prevent re-entrant calls
    if (isRefreshingMarketState) {
        console.log("Market state refresh already in progress, skipping duplicate call");
        return;
    }
    isRefreshingMarketState = true;
    // Show only market state loaders
    dom.currentPriceSpan.classList.add("hidden");
    dom.longLiquiditySpan.classList.add("hidden");
    dom.shortLiquiditySpan.classList.add("hidden");
    dom.totalMarketValueSpan.classList.add("hidden");
    dom.priceLoader.classList.remove("hidden");
    dom.longLiquidityLoader.classList.remove("hidden");
    dom.shortLiquidityLoader.classList.remove("hidden");
    dom.totalMarketValueLoader.classList.remove("hidden");
    try {
        // Set higher gas limit for market data fetching
        setGas(HIGH_GAS_AMOUNT);
        const marketState = await executeWithRetry(() => market.getMarketState());
        setMarketState(marketState);
        dom.currentPriceSpan.textContent = formatDollarPrice(marketState.price);
        dom.longLiquiditySpan.textContent = formatNumber(marketState.long_liquidity);
        dom.shortLiquiditySpan.textContent = formatNumber(marketState.short_liquidity);
        // Compute and display total market value
        const totalMarketValue = marketState.long_liquidity.add(marketState.short_liquidity);
        dom.totalMarketValueSpan.textContent = formatNumber(totalMarketValue) + " WCSPR";
    }
    catch (e) {
        console.error("Failed to fetch market state:", e);
        // Handle rate limiting more gracefully
        if (e.message && e.message.includes('429')) {
            showError("Rate limited - please wait a moment before refreshing");
        }
        else {
            showError("Failed to fetch market state");
        }
        // Set fallback values
        dom.currentPriceSpan.textContent = "—";
        dom.longLiquiditySpan.textContent = "—";
        dom.shortLiquiditySpan.textContent = "—";
        dom.totalMarketValueSpan.textContent = "—";
    }
    finally {
        // Hide loaders and show values
        dom.currentPriceSpan.classList.remove("hidden");
        dom.longLiquiditySpan.classList.remove("hidden");
        dom.shortLiquiditySpan.classList.remove("hidden");
        dom.totalMarketValueSpan.classList.remove("hidden");
        dom.priceLoader.classList.add("hidden");
        dom.longLiquidityLoader.classList.add("hidden");
        dom.shortLiquidityLoader.classList.add("hidden");
        dom.totalMarketValueLoader.classList.add("hidden");
        isRefreshingMarketState = false;
    }
}
/**
 * Fetch native CSPR balance for the connected account
 */
export async function refreshCsprBalance() {
    if (!connected || !address) {
        setCsprBalance(null);
        dom.csprBalanceSpan.textContent = "—";
        return;
    }
    try {
        // Query account main purse balance using RPC
        const addressObj = Address.fromPublicKey(address);
        const balance = await executeWithRetry(() => client.getBalance(addressObj));
        // Balance is returned as U512 in motes (smallest unit)
        const balanceInMotes = balance.toString();
        const csprBalanceU256 = new U256(balanceInMotes);
        setCsprBalance(csprBalanceU256);
        dom.csprBalanceSpan.textContent = formatNumber(csprBalanceU256);
    }
    catch (e) {
        console.error("Failed to fetch CSPR balance:", e);
        setCsprBalance(null);
        dom.csprBalanceSpan.textContent = "—";
    }
}
/**
 * Update UI from consolidated data
 */
function updateUIFromConsolidatedData() {
    if (!consolidatedData)
        return;
    const data = consolidatedData.addressMarketState;
    if (!data) {
        console.error("addressMarketState is undefined in consolidatedData");
        return;
    }
    // Update market state from consolidated data
    setMarketState(data.marketState);
    dom.currentPriceSpan.textContent = formatDollarPrice(data.marketState.price);
    dom.longLiquiditySpan.textContent = formatNumber(data.marketState.long_liquidity) + " WCSPR";
    dom.shortLiquiditySpan.textContent = formatNumber(data.marketState.short_liquidity) + " WCSPR";
    const totalMarketValue = data.marketState.long_liquidity.add(data.marketState.short_liquidity);
    dom.totalMarketValueSpan.textContent = formatNumber(totalMarketValue) + " WCSPR";
    // Update balances from consolidated data
    setBalances({
        wcspr: data.wcspr_balance,
        longToken: data.long_token_balance,
        shortToken: data.short_token_balance
    });
    dom.wcsprBalanceSpan.textContent = formatNumber(data.wcspr_balance) + " WCSPR";
    dom.wcsprBalanceUnwrap.textContent = formatNumber(data.wcspr_balance);
    // Calculate available WCSPR (minimum of balance and allowance)
    const availableWcspr = data.wcspr_balance.lt(data.market_allowance) ? data.wcspr_balance : data.market_allowance;
    // Update position-specific WCSPR balances with available amount
    dom.wcsprBalanceLong.textContent = formatNumber(availableWcspr) + " WCSPR";
    dom.wcsprBalanceShort.textContent = formatNumber(availableWcspr) + " WCSPR";
    // Set click-to-fill for open positions (available WCSPR amount)
    dom.wcsprBalanceLong.onclick = () => {
        try {
            dom.longOpenAmountInput.value = formatNumber(availableWcspr);
        }
        catch { }
    };
    dom.wcsprBalanceShort.onclick = () => {
        try {
            dom.shortOpenAmountInput.value = formatNumber(availableWcspr);
        }
        catch { }
    };
    // Update portfolio position values in WCSPR
    dom.longTokenBalancePortfolio.textContent = `${formatNumber(data.long_position_value)} WCSPR`;
    dom.shortTokenBalancePortfolio.textContent = `${formatNumber(data.short_position_value)} WCSPR`;
    // Update position value displays in closing sections
    dom.longPositionValueDisplay.textContent = `${formatNumber(data.long_position_value)} WCSPR`;
    dom.shortPositionValueDisplay.textContent = `${formatNumber(data.short_position_value)} WCSPR`;
    // Reset closing amounts when position values change
    resetLongCloseAmount();
    resetShortCloseAmount();
    // Update close buttons availability based on token balances
    updateCloseButtonsAvailability();
    // Update market allowance
    dom.marketAllowanceSpan.textContent = formatAllowance(data.market_allowance);
    // For overview: show balance if allowed >= balance, otherwise show allowed amount
    const allowedDisplay = !data.market_allowance.lt(data.wcspr_balance)
        ? formatNumber(data.wcspr_balance)
        : formatAllowance(data.market_allowance);
    dom.marketAllowanceOverview.textContent = allowedDisplay + " WCSPR";
    setMarketAllowanceValue(data.market_allowance);
    // Update position values (WCSPR balance + long/short values)
    const totalValueWithWcspr = data.total_position_value.add(data.wcspr_balance);
    dom.totalPositionValueSpan.textContent = formatNumber(totalValueWithWcspr) + " WCSPR";
}
/**
 * Set fallback values for all UI elements
 */
export function setFallbackValues() {
    // Market state fallbacks
    dom.currentPriceSpan.textContent = "—";
    dom.longLiquiditySpan.textContent = "—";
    dom.shortLiquiditySpan.textContent = "—";
    // Balance fallbacks
    dom.wcsprBalanceSpan.textContent = "—";
    dom.wcsprBalanceUnwrap.textContent = "—";
    dom.marketAllowanceSpan.textContent = "—";
    dom.marketAllowanceOverview.textContent = "—";
    // Position-specific balance fallbacks
    dom.wcsprBalanceLong.textContent = "—";
    dom.wcsprBalanceShort.textContent = "—";
    // Position fallbacks
    dom.totalPositionValueSpan.textContent = "—";
}
/**
 * Refresh all application data.
 */
export async function refreshAllData() {
    await refreshAllDataConsolidated();
}
