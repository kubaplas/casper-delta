// ---------- DOM Element References ----------
// All DOM elements are initialized and exported for use throughout the application
// Connection elements
export const connectBtn = document.getElementById("connect-btn");
export const disconnectBtn = document.getElementById("disconnect-btn");
export const disconnectSection = document.getElementById('disconnect-section');
export const addressSpan = document.getElementById("address");
export const addressDropdownBtn = document.getElementById("address-dropdown-btn");
export const addressDropdownMenu = document.getElementById("address-dropdown-menu");
export const switchAccountBtn = document.getElementById("switch-account-btn");
// Theme toggle
export const themeToggle = document.getElementById("theme-toggle");
// Market state elements
export const currentPriceSpan = document.getElementById("current-price");
export const totalMarketValueSpan = document.getElementById("total-market-value");
export const totalMarketValueLoader = document.getElementById("total-market-value-loader");
export const longLiquiditySpan = document.getElementById("long-liquidity");
export const shortLiquiditySpan = document.getElementById("short-liquidity");
export const priceLoader = document.getElementById("price-loader");
export const longLiquidityLoader = document.getElementById("long-liquidity-loader");
export const shortLiquidityLoader = document.getElementById("short-liquidity-loader");
// Balance elements
export const wcsprBalanceSpan = document.getElementById("wcspr-balance");
export const wcsprBalanceLoader = document.getElementById("wcspr-balance-loader");
// Position value display elements
export const longPositionValueDisplay = document.getElementById("long-position-value-display");
export const shortPositionValueDisplay = document.getElementById("short-position-value-display");
export const longPositionValueLoader = document.getElementById("long-position-value-loader");
export const shortPositionValueLoader = document.getElementById("short-position-value-loader");
// Position-specific balance elements
export const wcsprBalanceLong = document.getElementById("wcspr-balance-long");
export const wcsprBalanceShort = document.getElementById("wcspr-balance-short");
export const wcsprBalanceLongLoader = document.getElementById("wcspr-balance-long-loader");
export const wcsprBalanceShortLoader = document.getElementById("wcspr-balance-short-loader");
// Position value elements
export const totalPositionValueSpan = document.getElementById("total-position-value");
export const longPositionLoader = document.getElementById("long-position-loader");
export const shortPositionLoader = document.getElementById("short-position-loader");
export const totalPositionLoader = document.getElementById("total-position-loader");
// Trading inputs and buttons
export const longOpenAmountInput = document.getElementById("long-open-amount");
export const shortOpenAmountInput = document.getElementById("short-open-amount");
// Position closing elements
export const longCloseAmountInput = document.getElementById("long-close-amount-input");
export const shortCloseAmountInput = document.getElementById("short-close-amount-input");
export const longCloseAmountDisplay = document.getElementById("long-close-amount-display");
export const shortCloseAmountDisplay = document.getElementById("short-close-amount-display");
export const longClosePercentage = document.getElementById("long-close-percentage");
export const shortClosePercentage = document.getElementById("short-close-percentage");
// Percentage buttons
export const longClose25Btn = document.getElementById("long-close-25");
export const longClose50Btn = document.getElementById("long-close-50");
export const longClose75Btn = document.getElementById("long-close-75");
export const longClose100Btn = document.getElementById("long-close-100");
export const shortClose25Btn = document.getElementById("short-close-25");
export const shortClose50Btn = document.getElementById("short-close-50");
export const shortClose75Btn = document.getElementById("short-close-75");
export const shortClose100Btn = document.getElementById("short-close-100");
export const depositLongBtn = document.getElementById("deposit-long-btn");
export const withdrawLongBtn = document.getElementById("withdraw-long-btn");
export const depositShortBtn = document.getElementById("deposit-short-btn");
export const withdrawShortBtn = document.getElementById("withdraw-short-btn");
// Action buttons
export const updatePriceBtn = document.getElementById("update-price-btn");
export const refreshBtn = document.getElementById("refresh-btn");
export const faucetBtn = document.getElementById("faucet-btn");
export const wrapCsprBtn = document.getElementById("wrap-cspr-btn");
export const unwrapCsprBtn = document.getElementById("unwrap-cspr-btn");
export const approveMarketBtn = document.getElementById("approve-market-btn");
// Wrap/Unwrap inputs
export const wrapAmountInput = document.getElementById("wrap-amount");
export const unwrapAmountInput = document.getElementById("unwrap-amount");
// Approve input and display
export const approveAmountInput = document.getElementById("approve-amount");
export const marketAllowanceSpan = document.getElementById("market-allowance");
export const marketAllowanceLoader = document.getElementById("market-allowance-loader");
// Notification elements
export const txSection = document.getElementById("tx-section");
export const txLinkAnchor = document.getElementById("tx-link");
export const errorSection = document.getElementById("error-section");
export const errorText = document.getElementById("error-text");
// Error modal elements
export const errorModalOverlay = document.getElementById("error-modal-overlay");
export const errorModalMessage = document.getElementById("error-modal-message");
export const errorModalPanel = document.getElementById("error-modal-panel");
export const errorModalClose = document.getElementById("error-modal-close");
export const marketStatusSpan = document.getElementById("market-status");
// Portfolio balances (long/short token counts in header widgets)
export const longTokenBalancePortfolio = document.getElementById("long-token-balance-portfolio");
export const shortTokenBalancePortfolio = document.getElementById("short-token-balance-portfolio");
// Transaction progress elements
export const txProgressOverlay = document.getElementById("tx-progress-overlay");
export const txProgressSpinner = document.getElementById("tx-progress-spinner");
export const txProgressStatus = document.getElementById("tx-progress-status");
export const txProgressHash = document.getElementById("tx-progress-hash");
export const txProgressBar = document.getElementById("tx-progress-bar");
export const txProgressTime = document.getElementById("tx-progress-time");
export const txProgressPanel = document.getElementById("tx-progress-panel");
// Trading info elements
export const tradingInfoSection = document.getElementById("trading-info-section");
export const showTradingInfoSection = document.getElementById("show-trading-info-section");
export const closeTradingInfoBtn = document.getElementById("close-trading-info");
export const showTradingInfoBtn = document.getElementById("show-trading-info");
