import init, { Address, OdraWasmClient, U256, } from "casper-delta-wasm-client";
import { MarketWasmClient, FaucetableWcsprWasmClient, WrappedNativeTokenWasmClient, PositionTokenWasmClient, } from "casper-delta-wasm-client";
// Configuration and constants
import { CONTRACT_ADDRESSES, isProductionMode, isMarketGraphVisible } from "./config.js";
// DOM elements
import * as dom from "./dom.js";
// UI utilities and modals
import { sanitizeNumericInput } from "./ui/utils.js";
import { initializeTradingInfo, showTradingInfo, closeTradingInfo, clearError } from "./ui/modals.js";
import { initTheme, toggleTheme } from "./ui/theme.js";
import { MarketChart } from "./ui/Chart.js";
// State management
import { setClient, setMarket, setWcspr, setLongToken, setShortToken, } from "./data/state.js";
// Data fetching
import { refreshAllData, refreshMarketStateOnly } from "./data/fetch.js";
// Transaction handling
import { setRefreshFunction } from "./transactions/handlers.js";
import { setupCsprClickCallbacks, setOnConnectCallback, setOnDisconnectCallback } from "./transactions/callbacks.js";
// Trading operations
import { depositLong, withdrawLong, depositShort, withdrawShort, updatePrice, requestFaucet, wrapCspr, unwrapCspr, } from "./trading/operations.js";
import { approveMarket } from "./trading/approval.js";
import { updateLongCloseAmount, updateShortCloseAmount, handleLongCloseManualInput, handleShortCloseManualInput, } from "./trading/positions.js";
// Wallet connection
import { connect, disconnect, onConnect, enableDisconnectedMode } from "./wallet/connection.js";
// ---------- Position Closing State Initialization ----------
function initializePositionClosingState() {
    // Initialize position closing amounts after WASM is loaded
    import("./data/state.js").then(({ setCurrentLongCloseAmount, setCurrentShortCloseAmount }) => {
        setCurrentLongCloseAmount(U256.fromNumber(0));
        setCurrentShortCloseAmount(U256.fromNumber(0));
    });
}
// ---------- Client Initialization ----------
async function initializeClients() {
    // Initialize WASM
    await init();
    // Set refresh function for transaction handlers (resolve circular dependency)
    setRefreshFunction(refreshAllData);
    // Set up CSPR.click callbacks after WASM is initialized
    setupCsprClickCallbacks();
    // Set onConnect and disconnect callbacks
    setOnConnectCallback(onConnect);
    setOnDisconnectCallback(() => {
        import("./wallet/connection.js").then(({ disconnect }) => {
            disconnect();
        });
    });
    // Initialize position closing state after WASM is loaded
    initializePositionClosingState();
    // Initialize the base client
    const client = new OdraWasmClient("https://testnet-rpc.odra.dev", "https://testnet-speculative-rpc.odra.dev", "casper-test");
    setClient(client);
    // Initialize contract clients with deployed contract addresses
    const market = new MarketWasmClient(client, new Address(CONTRACT_ADDRESSES.market));
    // Initialize WCSPR client based on mode
    let wcspr;
    if (isProductionMode()) {
        // Production mode: Use WrappedNativeTokenWasmClient
        wcspr = new WrappedNativeTokenWasmClient(client, new Address(CONTRACT_ADDRESSES.wcspr));
    }
    else {
        // Competition mode: Use FaucetableWcsprWasmClient
        wcspr = new FaucetableWcsprWasmClient(client, new Address(CONTRACT_ADDRESSES.wcspr));
    }
    const longToken = new PositionTokenWasmClient(client, new Address(CONTRACT_ADDRESSES.longToken));
    const shortToken = new PositionTokenWasmClient(client, new Address(CONTRACT_ADDRESSES.shortToken));
    setMarket(market);
    setWcspr(wcspr);
    setLongToken(longToken);
    setShortToken(shortToken);
}
// ---------- Event Listeners ----------
function setupEventListeners() {
    // Connection buttons
    dom.connectBtn.addEventListener("click", connect);
    dom.disconnectBtn.addEventListener("click", disconnect);
    dom.refreshBtn.addEventListener("click", refreshAllData);
    // Dropdown functionality
    dom.addressDropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dom.addressDropdownMenu.classList.toggle("hidden");
    });
    dom.switchAccountBtn.addEventListener("click", async () => {
        dom.addressDropdownMenu.classList.add("hidden");
        try {
            // Show a brief loading state
            dom.addressSpan.textContent = "Switching...";
            import("./data/state.js").then(({ client }) => {
                client.switchAccount();
            });
        }
        catch (error) {
            console.error("Failed to switch account:", error);
            import("./ui/modals.js").then(({ showError }) => {
                showError("Failed to switch account.");
            });
            // Restore the original address if switching failed
            import("./data/state.js").then(({ address }) => {
                if (address) {
                    dom.addressSpan.textContent = `${address.slice(0, 5)}...${address.slice(-5)}`;
                }
            });
        }
    });
    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
        dom.addressDropdownMenu.classList.add("hidden");
    });
    // Trading buttons
    dom.depositLongBtn.addEventListener("click", depositLong);
    dom.withdrawLongBtn.addEventListener("click", withdrawLong);
    dom.depositShortBtn.addEventListener("click", depositShort);
    dom.withdrawShortBtn.addEventListener("click", withdrawShort);
    // Percentage button event listeners
    dom.longClose25Btn.addEventListener("click", () => updateLongCloseAmount(25));
    dom.longClose50Btn.addEventListener("click", () => updateLongCloseAmount(50));
    dom.longClose75Btn.addEventListener("click", () => updateLongCloseAmount(75));
    dom.longClose100Btn.addEventListener("click", () => updateLongCloseAmount(100));
    dom.shortClose25Btn.addEventListener("click", () => updateShortCloseAmount(25));
    dom.shortClose50Btn.addEventListener("click", () => updateShortCloseAmount(50));
    dom.shortClose75Btn.addEventListener("click", () => updateShortCloseAmount(75));
    dom.shortClose100Btn.addEventListener("click", () => updateShortCloseAmount(100));
    // Action buttons
    dom.updatePriceBtn.addEventListener("click", updatePrice);
    dom.faucetBtn.addEventListener("click", requestFaucet);
    dom.wrapCsprBtn.addEventListener("click", wrapCspr);
    dom.unwrapCsprBtn.addEventListener("click", unwrapCspr);
    dom.approveMarketBtn.addEventListener("click", approveMarket);
    // Sanitize numeric inputs on the fly
    dom.longOpenAmountInput.addEventListener('input', sanitizeNumericInput);
    dom.shortOpenAmountInput.addEventListener('input', sanitizeNumericInput);
    dom.wrapAmountInput.addEventListener('input', sanitizeNumericInput);
    dom.unwrapAmountInput.addEventListener('input', sanitizeNumericInput);
    // Position closing input event listeners
    dom.longCloseAmountInput.addEventListener('input', (e) => {
        sanitizeNumericInput(e);
        handleLongCloseManualInput();
    });
    dom.shortCloseAmountInput.addEventListener('input', (e) => {
        sanitizeNumericInput(e);
        handleShortCloseManualInput();
    });
    // Add event listeners for trading info management
    dom.closeTradingInfoBtn.addEventListener("click", closeTradingInfo);
    dom.showTradingInfoBtn.addEventListener("click", showTradingInfo);
    // Theme toggle
    if (dom.themeToggle) {
        dom.themeToggle.addEventListener("click", toggleTheme);
    }
    // Error modal events
    if (dom.errorModalClose) {
        dom.errorModalClose.addEventListener("click", () => {
            clearError();
        });
    }
    // Close error modal when clicking outside
    if (dom.errorModalOverlay) {
        dom.errorModalOverlay.addEventListener("click", (event) => {
            if (event.target === dom.errorModalOverlay) {
                clearError();
            }
        });
    }
    // Close error modal with ESC
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && dom.errorModalOverlay && !dom.errorModalOverlay.classList.contains("hidden")) {
            clearError();
        }
    });
    // Recenter/ensure visibility on resize (especially mobile orientation changes)
    window.addEventListener("resize", () => {
        if (dom.errorModalOverlay && !dom.errorModalOverlay.classList.contains("hidden")) {
            if (dom.errorModalPanel) {
                dom.errorModalPanel.scrollIntoView({ block: 'center', inline: 'nearest' });
            }
        }
        if (dom.txProgressOverlay && !dom.txProgressOverlay.classList.contains("hidden")) {
            if (dom.txProgressPanel) {
                dom.txProgressPanel.scrollIntoView({ block: 'center', inline: 'nearest' });
            }
        }
    });
}
// ---------- Application Entry Point ----------
async function run() {
    try {
        // Initialize theme
        initTheme();
        // Ensure buttons are disabled by default (in case HTML disabled attributes aren't enough)
        enableDisconnectedMode();
        // Initialize with CSPR.click integration
        await initializeClients();
        // Initialize trading info visibility
        initializeTradingInfo();
        // Set up all event listeners
        setupEventListeners();
        if (dom.marketStatusSpan)
            dom.marketStatusSpan.textContent = "Ready";
        // Initialize and refresh chart
        if (isMarketGraphVisible()) {
            try {
                const chart = new MarketChart('market-chart');
                await chart.refresh();
                // Refresh chart whenever data is refreshed
                const originalRefreshAllData = refreshAllData;
                window.refreshAllData = async () => {
                    await originalRefreshAllData();
                    await chart.refresh();
                };
            }
            catch (chartError) {
                console.warn("Failed to initialize chart:", chartError);
            }
        }
        else {
            // Hide chart section if not enabled
            const chartSection = document.querySelector('#market-chart')?.closest('section');
            if (chartSection) {
                chartSection.style.display = 'none';
            }
        }
    }
    catch (err) {
        console.error("Failed to initialize:", err);
        // Parse the error to determine if it's wallet-related
        const errorMessage = err.message || err.toString();
        if (errorMessage.toLowerCase().includes('wallet is locked') ||
            errorMessage.toLowerCase().includes('code":1')) {
            // Instead of showing wallet locked popup, switch to disconnected mode
            import("./data/state.js").then(({ setConnected, setAddress }) => {
                setConnected(false);
                setAddress(null);
            });
            enableDisconnectedMode();
            try {
                await refreshMarketStateOnly();
            }
            catch (refreshError) {
                console.warn("Failed to refresh market state:", refreshError);
            }
        }
        else {
            // For non-wallet errors, show the error display
            import("./ui/modals.js").then(({ showError }) => {
                showError(`Initialization failed: ${errorMessage}`);
            });
        }
        if (dom.marketStatusSpan)
            dom.marketStatusSpan.textContent = "Error";
    }
}
// Start the application
setTimeout(() => run(), 100);
