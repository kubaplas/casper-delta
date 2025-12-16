import * as dom from "../dom.js";
import { setConnected, setAddress, setBalances, setConsolidatedData, client, account } from "../data/state.js";
import { refreshAllData, refreshMarketStateOnly, setFallbackValues } from "../data/fetch.js";
import { hideTransaction } from "../ui/modals.js";
// ---------- Wallet Connection Functions ----------
/**
 * Connect wallet (trigger CSPR.click sign in)
 */
export async function connect() {
    await client.signIn();
}
/**
 * Handle successful connection
 */
export async function onConnect() {
    setConnected(true);
    const addr = account.publicKey;
    setAddress(addr);
    dom.addressSpan.textContent = `${addr.slice(0, 5)}...${addr.slice(-5)}`;
    dom.connectBtn.classList.add("hidden");
    dom.disconnectSection.classList.remove("hidden");
    if (dom.marketStatusSpan)
        dom.marketStatusSpan.textContent = "Connected";
    // Clear old account data immediately to prevent showing stale data
    setConsolidatedData(null);
    setBalances(null);
    setFallbackValues();
    // Disable read-only mode or disconnected mode if they were enabled
    disableReadOnlyMode();
    disableDisconnectedMode();
    // Small delay to ensure UI has time to clear before fetching new data
    await new Promise(resolve => setTimeout(resolve, 100));
    await refreshAllData();
}
/**
 * Disconnect wallet
 */
export async function disconnect() {
    await client.signOut();
    setConnected(false);
    setAddress(null);
    setBalances(null);
    // Clear user-specific data but keep market data
    dom.wcsprBalanceSpan.textContent = "—";
    dom.longTokenBalancePortfolio.textContent = "— WCSPR";
    dom.shortTokenBalancePortfolio.textContent = "— WCSPR";
    dom.marketAllowanceSpan.textContent = "—";
    dom.totalPositionValueSpan.textContent = "—";
    hideTransaction();
    // Show connect button and disable trading functionality
    enableDisconnectedMode();
    // Load market data without wallet
    try {
        await refreshMarketStateOnly();
    }
    catch (error) {
        console.error("Failed to load market data after disconnect:", error);
        // Market data will show "—" from the error handling in refreshMarketStateOnly
    }
}
// ---------- Mode Management Functions ----------
/**
 * Enable read-only mode (view market data without wallet)
 */
export function enableReadOnlyMode() {
    // Update UI to show read-only mode
    if (dom.addressSpan) {
        dom.addressSpan.textContent = "Read-Only Mode";
    }
    // Hide connect button and show disconnect section with read-only indicator
    dom.connectBtn.classList.add("hidden");
    dom.disconnectSection.classList.remove("hidden");
    dom.addressDropdownMenu.classList.add("hidden");
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
    const existingIndicator = dom.disconnectSection.querySelector('.text-gray-600');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    dom.disconnectSection.appendChild(readOnlyIndicator);
    // Disable all trading buttons
    disableTradingControls("Connect wallet to enable trading");
    // Update market status
    if (dom.marketStatusSpan) {
        dom.marketStatusSpan.textContent = "Read-Only";
    }
    // Clear user-specific data
    setBalances(null);
    setConsolidatedData(null);
    // Set fallback values for user-specific data
    setFallbackValues();
}
/**
 * Enable disconnected mode (no wallet, show connect button)
 */
export function enableDisconnectedMode() {
    // Update UI to show disconnected state
    if (dom.addressSpan) {
        dom.addressSpan.textContent = "";
    }
    // Show connect button and hide disconnect section
    dom.connectBtn.classList.remove("hidden");
    dom.disconnectSection.classList.add("hidden");
    // Disable all trading controls
    disableTradingControls("Connect wallet to enable trading");
    // Update market status
    if (dom.marketStatusSpan) {
        dom.marketStatusSpan.textContent = "Disconnected";
    }
}
/**
 * Disable read-only mode
 */
export function disableReadOnlyMode() {
    // Remove read-only indicator
    const existingIndicator = dom.disconnectSection.querySelector('.text-gray-600');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    // Re-enable all trading controls
    enableTradingControls();
    // Show disconnect button
    dom.disconnectBtn.classList.remove("hidden");
}
/**
 * Disable disconnected mode (enable trading when connected)
 */
export function disableDisconnectedMode() {
    // Re-enable all trading controls
    enableTradingControls();
}
// ---------- Helper Functions ----------
/**
 * Disable all trading controls
 */
function disableTradingControls(message) {
    const tradingButtons = [
        'deposit-long-btn', 'withdraw-long-btn', 'deposit-short-btn', 'withdraw-short-btn',
        'faucet-btn', 'approve-market-btn', 'update-price-btn',
        'long-close-25', 'long-close-50', 'long-close-75', 'long-close-100',
        'short-close-25', 'short-close-50', 'short-close-75', 'short-close-100'
    ];
    tradingButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            btn.title = message;
        }
    });
    // Disable all trading input fields
    const tradingInputs = [
        'long-open-amount', 'short-open-amount',
        'approve-amount', 'long-close-amount-input', 'short-close-amount-input'
    ];
    tradingInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.disabled = true;
            input.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
            input.placeholder = message;
            input.title = message;
        }
    });
}
/**
 * Enable all trading controls
 */
function enableTradingControls() {
    const tradingButtons = [
        'deposit-long-btn', 'withdraw-long-btn', 'deposit-short-btn', 'withdraw-short-btn',
        'faucet-btn', 'approve-market-btn', 'update-price-btn',
        'long-close-25', 'long-close-50', 'long-close-75', 'long-close-100',
        'short-close-25', 'short-close-50', 'short-close-75', 'short-close-100'
    ];
    tradingButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
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
        const input = document.getElementById(inputId);
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
