// ---------- DOM Element References ----------
// All DOM elements are initialized and exported for use throughout the application

// Connection elements
export const connectBtn = document.getElementById("connect-btn") as HTMLButtonElement;
export const disconnectBtn = document.getElementById("disconnect-btn") as HTMLButtonElement;
export const disconnectSection = document.getElementById('disconnect-section') as HTMLDivElement;
export const addressSpan = document.getElementById("address") as HTMLSpanElement;
export const addressDropdownBtn = document.getElementById("address-dropdown-btn") as HTMLButtonElement;
export const addressDropdownMenu = document.getElementById("address-dropdown-menu") as HTMLDivElement;
export const switchAccountBtn = document.getElementById("switch-account-btn") as HTMLButtonElement;

// Market state elements
export const currentPriceSpan = document.getElementById("current-price") as HTMLSpanElement;
export const totalMarketValueSpan = document.getElementById("total-market-value") as HTMLDivElement;
export const totalMarketValueLoader = document.getElementById("total-market-value-loader") as HTMLDivElement;
export const longLiquiditySpan = document.getElementById("long-liquidity") as HTMLSpanElement;
export const shortLiquiditySpan = document.getElementById("short-liquidity") as HTMLSpanElement;
export const priceLoader = document.getElementById("price-loader") as HTMLDivElement;
export const longLiquidityLoader = document.getElementById("long-liquidity-loader") as HTMLDivElement;
export const shortLiquidityLoader = document.getElementById("short-liquidity-loader") as HTMLDivElement;

// Balance elements
export const wcsprBalanceSpan = document.getElementById("wcspr-balance") as HTMLSpanElement;
export const wcsprBalanceLoader = document.getElementById("wcspr-balance-loader") as HTMLDivElement;

// Position value display elements
export const longPositionValueDisplay = document.getElementById("long-position-value-display") as HTMLDivElement;
export const shortPositionValueDisplay = document.getElementById("short-position-value-display") as HTMLDivElement;
export const longPositionValueLoader = document.getElementById("long-position-value-loader") as HTMLDivElement;
export const shortPositionValueLoader = document.getElementById("short-position-value-loader") as HTMLDivElement;

// Position-specific balance elements
export const wcsprBalanceLong = document.getElementById("wcspr-balance-long") as HTMLSpanElement;
export const wcsprBalanceShort = document.getElementById("wcspr-balance-short") as HTMLSpanElement;
export const wcsprBalanceLongLoader = document.getElementById("wcspr-balance-long-loader") as HTMLDivElement;
export const wcsprBalanceShortLoader = document.getElementById("wcspr-balance-short-loader") as HTMLDivElement;

// Position value elements
export const totalPositionValueSpan = document.getElementById("total-position-value") as HTMLSpanElement;
export const longPositionLoader = document.getElementById("long-position-loader") as HTMLDivElement;
export const shortPositionLoader = document.getElementById("short-position-loader") as HTMLDivElement;
export const totalPositionLoader = document.getElementById("total-position-loader") as HTMLDivElement;

// Trading inputs and buttons
export const longOpenAmountInput = document.getElementById("long-open-amount") as HTMLInputElement;
export const shortOpenAmountInput = document.getElementById("short-open-amount") as HTMLInputElement;

// Position closing elements
export const longCloseAmountInput = document.getElementById("long-close-amount-input") as HTMLInputElement;
export const shortCloseAmountInput = document.getElementById("short-close-amount-input") as HTMLInputElement;
export const longCloseAmountDisplay = document.getElementById("long-close-amount-display") as HTMLSpanElement;
export const shortCloseAmountDisplay = document.getElementById("short-close-amount-display") as HTMLSpanElement;
export const longClosePercentage = document.getElementById("long-close-percentage") as HTMLSpanElement;
export const shortClosePercentage = document.getElementById("short-close-percentage") as HTMLSpanElement;

// Percentage buttons
export const longClose25Btn = document.getElementById("long-close-25") as HTMLButtonElement;
export const longClose50Btn = document.getElementById("long-close-50") as HTMLButtonElement;
export const longClose75Btn = document.getElementById("long-close-75") as HTMLButtonElement;
export const longClose100Btn = document.getElementById("long-close-100") as HTMLButtonElement;
export const shortClose25Btn = document.getElementById("short-close-25") as HTMLButtonElement;
export const shortClose50Btn = document.getElementById("short-close-50") as HTMLButtonElement;
export const shortClose75Btn = document.getElementById("short-close-75") as HTMLButtonElement;
export const shortClose100Btn = document.getElementById("short-close-100") as HTMLButtonElement;
export const depositLongBtn = document.getElementById("deposit-long-btn") as HTMLButtonElement;
export const withdrawLongBtn = document.getElementById("withdraw-long-btn") as HTMLButtonElement;
export const depositShortBtn = document.getElementById("deposit-short-btn") as HTMLButtonElement;
export const withdrawShortBtn = document.getElementById("withdraw-short-btn") as HTMLButtonElement;

// Action buttons
export const updatePriceBtn = document.getElementById("update-price-btn") as HTMLButtonElement;
export const refreshBtn = document.getElementById("refresh-btn") as HTMLButtonElement;
export const faucetBtn = document.getElementById("faucet-btn") as HTMLButtonElement;
export const approveMarketBtn = document.getElementById("approve-market-btn") as HTMLButtonElement;

// Approve input and display
export const approveAmountInput = document.getElementById("approve-amount") as HTMLInputElement;
export const marketAllowanceSpan = document.getElementById("market-allowance") as HTMLSpanElement;
export const marketAllowanceLoader = document.getElementById("market-allowance-loader") as HTMLSpanElement;

// Notification elements
export const txSection = document.getElementById("tx-section") as HTMLDivElement;
export const txLinkAnchor = document.getElementById("tx-link") as HTMLAnchorElement;
export const errorSection = document.getElementById("error-section") as HTMLDivElement;
export const errorText = document.getElementById("error-text") as HTMLDivElement;

// Error modal elements
export const errorModalOverlay = document.getElementById("error-modal-overlay") as HTMLDivElement;
export const errorModalMessage = document.getElementById("error-modal-message") as HTMLParagraphElement;
export const errorModalPanel = document.getElementById("error-modal-panel") as HTMLDivElement;
export const errorModalClose = document.getElementById("error-modal-close") as HTMLButtonElement;
export const marketStatusSpan = document.getElementById("market-status") as HTMLSpanElement | null;

// Portfolio balances (long/short token counts in header widgets)
export const longTokenBalancePortfolio = document.getElementById("long-token-balance-portfolio") as HTMLDivElement;
export const shortTokenBalancePortfolio = document.getElementById("short-token-balance-portfolio") as HTMLDivElement;

// Transaction progress elements
export const txProgressOverlay = document.getElementById("tx-progress-overlay") as HTMLDivElement;
export const txProgressSpinner = document.getElementById("tx-progress-spinner") as HTMLDivElement;
export const txProgressStatus = document.getElementById("tx-progress-status") as HTMLSpanElement;
export const txProgressHash = document.getElementById("tx-progress-hash") as HTMLSpanElement;
export const txProgressBar = document.getElementById("tx-progress-bar") as HTMLDivElement;
export const txProgressTime = document.getElementById("tx-progress-time") as HTMLSpanElement;
export const txProgressPanel = document.getElementById("tx-progress-panel") as HTMLDivElement;

// Trading info elements
export const tradingInfoSection = document.getElementById("trading-info-section") as HTMLDivElement;
export const showTradingInfoSection = document.getElementById("show-trading-info-section") as HTMLDivElement;
export const closeTradingInfoBtn = document.getElementById("close-trading-info") as HTMLButtonElement;
export const showTradingInfoBtn = document.getElementById("show-trading-info") as HTMLButtonElement;
