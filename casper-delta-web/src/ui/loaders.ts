import * as dom from "../dom.js";

// ---------- Loader Management Functions ----------

/**
 * Show all loaders (data is being fetched)
 */
export function showAllLoaders(): void {
    // Market state loaders
    dom.currentPriceSpan.classList.add("hidden");
    dom.longLiquiditySpan.classList.add("hidden");
    dom.shortLiquiditySpan.classList.add("hidden");
    dom.priceLoader.classList.remove("hidden");
    dom.longLiquidityLoader.classList.remove("hidden");
    dom.shortLiquidityLoader.classList.remove("hidden");

    // Balance loaders
    dom.wcsprBalanceSpan.classList.add("hidden");
    dom.wcsprBalanceLoader.classList.remove("hidden");

    // Position-specific balance loaders
    dom.wcsprBalanceLong.classList.add("hidden");
    dom.wcsprBalanceShort.classList.add("hidden");
    dom.wcsprBalanceLongLoader.classList.remove("hidden");
    dom.wcsprBalanceShortLoader.classList.remove("hidden");

    // Allowance loader
    dom.marketAllowanceSpan.classList.add("hidden");
    dom.marketAllowanceLoader.classList.remove("hidden");

    // Position loaders
    dom.totalPositionValueSpan.classList.add("hidden");
    dom.longPositionLoader.classList.remove("hidden");
    dom.shortPositionLoader.classList.remove("hidden");
    dom.totalPositionLoader.classList.remove("hidden");
}

/**
 * Hide all loaders (data has been loaded)
 */
export function hideAllLoaders(): void {
    // Market state loaders
    dom.currentPriceSpan.classList.remove("hidden");
    dom.longLiquiditySpan.classList.remove("hidden");
    dom.shortLiquiditySpan.classList.remove("hidden");
    dom.priceLoader.classList.add("hidden");
    dom.longLiquidityLoader.classList.add("hidden");
    dom.shortLiquidityLoader.classList.add("hidden");

    // Balance loaders
    dom.wcsprBalanceSpan.classList.remove("hidden");
    dom.wcsprBalanceLoader.classList.add("hidden");

    // Position-specific balance loaders
    dom.wcsprBalanceLong.classList.remove("hidden");
    dom.wcsprBalanceShort.classList.remove("hidden");
    dom.wcsprBalanceLongLoader.classList.add("hidden");
    dom.wcsprBalanceShortLoader.classList.add("hidden");

    // Allowance loader
    dom.marketAllowanceSpan.classList.remove("hidden");
    dom.marketAllowanceLoader.classList.add("hidden");

    // Position loaders
    dom.totalPositionValueSpan.classList.remove("hidden");
    dom.longPositionLoader.classList.add("hidden");
    dom.shortPositionLoader.classList.add("hidden");
    dom.totalPositionLoader.classList.add("hidden");
}
