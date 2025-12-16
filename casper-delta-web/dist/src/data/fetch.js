import { setGas } from "casper-delta-wasm-client";
import { HIGH_GAS_AMOUNT } from "../config.js";
import * as dom from "../dom.js";
import { showError } from "../ui/modals.js";
import { formatNumber, formatDollarPrice, formatAllowance } from "../ui/formatters.js";
import { showAllLoaders, hideAllLoaders } from "../ui/loaders.js";
import { connected, address, account, market, setBalances, setMarketState, setConsolidatedData, setMarketAllowanceValue, } from "./state.js";
import { resetLongCloseAmount, resetShortCloseAmount, updateCloseButtonsAvailability } from "../trading/positions.js";
// ---------- Request Helper Functions ----------
/**
 * Simple delay helper for rate limiting
 */
async function delayRequest(ms = 2000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Simple retry wrapper for API calls
 */
async function executeWithRetry(fn, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
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
// ---------- Data Fetching Functions ----------
/**
 * Refresh all data using consolidated endpoint
 */
export async function refreshAllDataConsolidated() {
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
        // Hide all loaders and show values
        hideAllLoaders();
    }
}
/**
 * Refresh market state only (for read-only mode)
 */
export async function refreshMarketStateOnly() {
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
    }
}
/**
 * Update UI from consolidated data
 */
function updateUIFromConsolidatedData() {
    // Import from state to get consolidatedData
    import("./state.js").then(({ consolidatedData }) => {
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
        // Compute total market value
        const totalMarketValue = data.marketState.long_liquidity.add(data.marketState.short_liquidity);
        dom.totalMarketValueSpan.textContent = formatNumber(totalMarketValue) + " WCSPR";
        // Update balances from consolidated data
        setBalances({
            wcspr: data.wcspr_balance,
            longToken: data.long_token_balance,
            shortToken: data.short_token_balance
        });
        dom.wcsprBalanceSpan.textContent = formatNumber(data.wcspr_balance) + " WCSPR";
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
        setMarketAllowanceValue(data.market_allowance);
        // Update position values
        // Total is WCSPR balance + long/short values
        const totalValueWithWcspr = data.total_position_value.add(data.wcspr_balance);
        dom.totalPositionValueSpan.textContent = formatNumber(totalValueWithWcspr) + " WCSPR";
    });
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
    dom.marketAllowanceSpan.textContent = "—";
    // Position-specific balance fallbacks
    dom.wcsprBalanceLong.textContent = "—";
    dom.wcsprBalanceShort.textContent = "—";
    // Position fallbacks
    dom.totalPositionValueSpan.textContent = "—";
}
/**
 * Legacy function for compatibility - delegates to consolidated refresh
 */
export async function refreshAllData() {
    await refreshAllDataConsolidated();
}
