import init, {
    Address,
    OdraWasmClient,
    U256,
} from "casper-delta-wasm-client";

import {
    MarketWasmClient,
    FaucetableWcsprWasmClient,
    WrappedNativeTokenWasmClient,
    PositionTokenWasmClient,
} from "casper-delta-wasm-client";

// Configuration and constants
import { CONTRACT_ADDRESSES, isProductionMode, isMarketGraphVisible, RPC_URL, SPECULATIVE_RPC_URL, CHAIN_NAME } from "./config.js";

// DOM elements
import * as dom from "./dom.js";

// UI utilities and modals
import { sanitizeNumericInput } from "./ui/utils.js";
import { initializeTradingInfo, showTradingInfo, closeTradingInfo, clearError, showError } from "./ui/modals.js";
import { initTheme, toggleTheme } from "./ui/theme.js";
import { MarketChart } from "./ui/Chart.js";

// State management
import {
    setClient,
    setMarket,
    setWcspr,
    setLongToken,
    setShortToken,
    setConnected,
    setAddress,
    client as stateClient,
    address as stateAddress,
} from "./data/state.js";

// Data fetching
import { refreshAllData, refreshMarketStateOnly } from "./data/fetch.js";

// Transaction handling
import { setRefreshFunction } from "./transactions/handlers.js";
import { setupCsprClickCallbacks, setOnConnectCallback, setOnDisconnectCallback } from "./transactions/callbacks.js";

// Trading operations
import {
    depositLong,
    withdrawLong,
    depositShort,
    withdrawShort,
    requestFaucet,
    wrapCspr,
    unwrapCspr,
    setUnwrapMax,
} from "./trading/operations.js";

import { approveMarket } from "./trading/approval.js";

import {
    updateLongCloseAmount,
    updateShortCloseAmount,
    handleLongCloseManualInput,
    handleShortCloseManualInput,
} from "./trading/positions.js";

// Wallet connection
import { connect, disconnect, onConnect, enableDisconnectedMode } from "./wallet/connection.js";
import { setCurrentLongCloseAmount, setCurrentShortCloseAmount } from "./data/state.js";

// Track whether CSPR.click auto-restored a wallet session during init
let walletRestoredDuringInit = false;
let resolveWalletCheck: (() => void) | null = null;

// During init phase: do UI setup only, don't load data (run() will handle it)
async function onConnectInitPhase(): Promise<void> {
    walletRestoredDuringInit = true;
    await onConnect(true);
    // Resolve the wait immediately — no need to wait the full timeout
    if (resolveWalletCheck) {
        resolveWalletCheck();
        resolveWalletCheck = null;
    }
}

/**
 * Wait for CSPR.click to potentially auto-restore a session.
 * Resolves immediately if onSignedIn fires, or after timeout.
 */
function waitForWalletRestore(timeoutMs: number = 2000): Promise<void> {
    if (walletRestoredDuringInit) return Promise.resolve();
    return new Promise<void>(resolve => {
        resolveWalletCheck = resolve;
        setTimeout(() => {
            resolveWalletCheck = null;
            resolve();
        }, timeoutMs);
    });
}

// ---------- Client Initialization ----------
async function initializeClients(): Promise<void> {
    // Initialize WASM
    await init();

    // Set refresh function for transaction handlers (resolve circular dependency)
    setRefreshFunction(refreshAllData);

    // Set up CSPR.click callbacks after WASM is initialized
    setupCsprClickCallbacks();

    // Set onConnect and disconnect callbacks
    // During init, use the init-phase callback that skips data loading
    setOnConnectCallback(onConnectInitPhase);
    setOnDisconnectCallback(disconnect);

    // Initialize position closing amounts
    setCurrentLongCloseAmount(U256.fromNumber(0));
    setCurrentShortCloseAmount(U256.fromNumber(0));

    // Initialize the base client
    const client = new OdraWasmClient(
        RPC_URL,
        SPECULATIVE_RPC_URL,
        CHAIN_NAME
    );
    setClient(client);

    // Initialize contract clients with deployed contract addresses
    const market = new MarketWasmClient(client, new Address(CONTRACT_ADDRESSES.market));

    // Initialize WCSPR client based on mode
    let wcspr;
    if (isProductionMode()) {
        // Production mode: Use WrappedNativeTokenWasmClient
        wcspr = new WrappedNativeTokenWasmClient(client, new Address(CONTRACT_ADDRESSES.wcspr));
    } else {
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
function setupEventListeners(): void {
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
            dom.addressSpan.textContent = "Switching...";
            stateClient.switchAccount();
        } catch (error) {
            console.error("Failed to switch account:", error);
            showError("Failed to switch account.");
            if (stateAddress) {
                dom.addressSpan.textContent = `${stateAddress.slice(0, 5)}...${stateAddress.slice(-5)}`;
            }
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
    dom.faucetBtn.addEventListener("click", requestFaucet);
    dom.wrapCsprBtn.addEventListener("click", wrapCspr);
    dom.unwrapCsprBtn.addEventListener("click", unwrapCspr);
    dom.unwrapMaxBtn.addEventListener("click", setUnwrapMax);
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

/**
 * Wait for CSPR.click SDK to be fully available.
 * The SDK loads synchronously before this module, but we add a safety check.
 */
async function waitForCsprClick(maxWaitMs: number = 5000): Promise<void> {
    if ((window as any).csprclick) return;
    
    const startTime = Date.now();
    while (!(window as any).csprclick) {
        if (Date.now() - startTime > maxWaitMs) {
            throw new Error("CSPR.click SDK failed to load - please refresh the page");
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

async function run(): Promise<void> {
    try {
        // Initialize theme
        initTheme();

        // Ensure buttons are disabled by default
        enableDisconnectedMode();

        // Wait for CSPR.click SDK to be available
        await waitForCsprClick();

        // Initialize with CSPR.click integration
        await initializeClients();

        // Initialize trading info visibility
        initializeTradingInfo();

        // Set up all event listeners
        setupEventListeners();

        // Enable the connect button now that everything is loaded
        dom.connectBtn.disabled = false;
        dom.connectBtn.textContent = "Sign In";

        if (dom.marketStatusSpan) dom.marketStatusSpan.textContent = "Ready";

        // Initialize and refresh chart (independent of data loading)
        if (isMarketGraphVisible()) {
            try {
                const chart = new MarketChart('market-chart');
                await chart.refresh();
                const originalRefreshAllData = refreshAllData;
                (window as any).refreshAllData = async () => {
                    await originalRefreshAllData();
                    await chart.refresh();
                };
            } catch (chartError) {
                console.warn("Failed to initialize chart:", chartError);
            }
        } else {
            const chartSection = document.querySelector('#market-chart')?.closest('section');
            if (chartSection) {
                (chartSection as HTMLElement).style.display = 'none';
            }
        }

        // Wait for CSPR.click to potentially auto-restore a wallet session.
        // Resolves immediately if onSignedIn already fired, or after 2s timeout.
        await waitForWalletRestore();

        // Make exactly one data call based on connection state.
        if (walletRestoredDuringInit) {
            try {
                await refreshAllData();
            } catch (e) {
                console.warn("Failed to load initial data:", e);
            }
        } else {
            try {
                await refreshMarketStateOnly();
            } catch (e) {
                console.warn("Failed to load initial market data:", e);
            }
        }

        // Switch to normal onConnect for all subsequent connections
        setOnConnectCallback(onConnect);
    } catch (err: any) {
        console.error("Failed to initialize:", err);
        const errorMessage = err.message || err.toString();

        if (errorMessage.toLowerCase().includes('wallet is locked') ||
            errorMessage.toLowerCase().includes('code":1')) {
            setConnected(false);
            setAddress(null);
            enableDisconnectedMode();
            try {
                await refreshMarketStateOnly();
            } catch (refreshError) {
                console.warn("Failed to refresh market state:", refreshError);
            }
        } else {
            showError(`Initialization failed: ${errorMessage}`);
        }

        if (dom.marketStatusSpan) dom.marketStatusSpan.textContent = "Error";
    }
}

// Start the application
setTimeout(run, 100);
