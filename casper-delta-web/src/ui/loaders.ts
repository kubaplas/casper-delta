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
    dom.totalMarketValueSpan.classList.add("hidden");
    dom.priceLoader.classList.remove("hidden");
    dom.longLiquidityLoader.classList.remove("hidden");
    dom.shortLiquidityLoader.classList.remove("hidden");
    dom.totalMarketValueLoader.classList.remove("hidden");

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
    dom.marketAllowanceOverview.classList.add("hidden");
    dom.marketAllowanceOverviewLoader.classList.remove("hidden");

    // Position loaders
    dom.totalPositionValueSpan.classList.add("hidden");
    dom.longTokenBalancePortfolio.classList.add("hidden");
    dom.shortTokenBalancePortfolio.classList.add("hidden");
    dom.longPositionValueDisplay.classList.add("hidden");
    dom.shortPositionValueDisplay.classList.add("hidden");
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
    dom.totalMarketValueSpan.classList.remove("hidden");
    dom.priceLoader.classList.add("hidden");
    dom.longLiquidityLoader.classList.add("hidden");
    dom.shortLiquidityLoader.classList.add("hidden");
    dom.totalMarketValueLoader.classList.add("hidden");

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
    dom.marketAllowanceOverview.classList.remove("hidden");
    dom.marketAllowanceOverviewLoader.classList.add("hidden");

    // Position loaders
    dom.totalPositionValueSpan.classList.remove("hidden");
    dom.longTokenBalancePortfolio.classList.remove("hidden");
    dom.shortTokenBalancePortfolio.classList.remove("hidden");
    dom.longPositionValueDisplay.classList.remove("hidden");
    dom.shortPositionValueDisplay.classList.remove("hidden");
    dom.longPositionLoader.classList.add("hidden");
    dom.shortPositionLoader.classList.add("hidden");
    dom.totalPositionLoader.classList.add("hidden");
}
