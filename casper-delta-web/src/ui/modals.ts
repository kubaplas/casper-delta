import * as dom from "../dom.js";
import { EXPLORER_BASE, TRADING_INFO_DISMISSED_KEY } from "../config.js";
import { lockScroll, unlockScroll, escapeHtml, buildExplorerTxUrl, formatErrorMessageWithShortHashes } from "./utils.js";

// ---------- Error Modal Functions ----------

/**
 * Show error modal with a message
 */
export function showError(msg: string): void {
    // Update legacy inline error (kept for backward compatibility, but keep hidden)
    if (dom.errorText && dom.errorSection) {
        dom.errorText.textContent = msg;
        dom.errorSection.classList.add("hidden");
    }
    // Show modal
    if (dom.errorModalMessage && dom.errorModalOverlay) {
        // Shorten hashes but do not link for general errors (e.g., signing cancel)
        dom.errorModalMessage.innerHTML = formatErrorMessageWithShortHashes(msg);
        dom.errorModalOverlay.classList.remove("hidden");
        lockScroll();
        // Focus panel for accessibility and ensure visibility on small screens
        if (dom.errorModalPanel) {
            dom.errorModalPanel.focus();
        }
    }
    console.error(msg);
}

/**
 * Clear/hide error modal
 */
export function clearError(): void {
    // Hide legacy inline error
    if (dom.errorSection && dom.errorText) {
        dom.errorSection.classList.add("hidden");
        dom.errorText.textContent = "";
    }
    // Hide modal if open
    if (dom.errorModalOverlay) {
        dom.errorModalOverlay.classList.add("hidden");
        dom.errorModalMessage && (dom.errorModalMessage.textContent = "");
        unlockScroll();
    }
}

/**
 * Show error with transaction hash link
 */
export function showErrorWithTransaction(msg: string, hash: string): void {
    if (dom.errorModalMessage && dom.errorModalOverlay) {
        const shortened = `${hash.slice(0, 10)}…${hash.slice(-8)}`;
        const href = buildExplorerTxUrl(hash);
        const safeMsg = escapeHtml(msg);
        dom.errorModalMessage.innerHTML = `${safeMsg}<span class="block mt-2 text-xs text-red-800">Tx: <a href="${href}" target="_blank" rel="noopener noreferrer" class="font-mono underline break-all">${shortened}</a></span>`;
        dom.errorModalOverlay.classList.remove("hidden");
        lockScroll();
        if (dom.errorModalPanel) {
            dom.errorModalPanel.focus();
        }
    } else {
        console.error(msg, hash.toString());
    }
}

// ---------- Transaction Display Functions ----------

/**
 * Show transaction link in the notification section
 */
export function showTransaction(hash: string): void {
    const url = `${EXPLORER_BASE.replace(/\/+$/, "")}/transaction/${hash}`;
    dom.txLinkAnchor.href = url;
    dom.txSection.classList.remove("hidden");
}

/**
 * Hide transaction notification section
 */
export function hideTransaction(): void {
    dom.txSection.classList.add("hidden");
}

// ---------- Trading Info Panel Functions ----------

/**
 * Initialize trading info panel visibility based on localStorage
 */
export function initializeTradingInfo(): void {
    // Check if user has previously dismissed the trading info
    const isDismissed = localStorage.getItem(TRADING_INFO_DISMISSED_KEY) === 'true';

    if (isDismissed) {
        // Keep trading info hidden (it's hidden by default in HTML)
        dom.tradingInfoSection.classList.add('hidden');
        dom.showTradingInfoSection.classList.remove('hidden');
    } else {
        // Show trading info (remove the default hidden class)
        dom.tradingInfoSection.classList.remove('hidden');
        dom.showTradingInfoSection.classList.add('hidden');
    }
}

/**
 * Close/hide trading info panel
 */
export function closeTradingInfo(): void {
    // Hide the section with a smooth fade out
    dom.tradingInfoSection.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    dom.tradingInfoSection.style.opacity = '0';
    dom.tradingInfoSection.style.transform = 'translateY(-10px)';

    // After animation, hide the element and store preference
    setTimeout(() => {
        dom.tradingInfoSection.classList.add('hidden');
        dom.tradingInfoSection.style.opacity = '';
        dom.tradingInfoSection.style.transform = '';
        dom.tradingInfoSection.style.transition = '';

        // Show the "show guide" button
        dom.showTradingInfoSection.classList.remove('hidden');

        // Remember the user's preference
        localStorage.setItem(TRADING_INFO_DISMISSED_KEY, 'true');
    }, 300);
}

/**
 * Show trading info panel
 */
export function showTradingInfo(): void {
    // Show the section with a smooth fade in
    dom.tradingInfoSection.classList.remove('hidden');
    dom.tradingInfoSection.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    dom.tradingInfoSection.style.opacity = '0';
    dom.tradingInfoSection.style.transform = 'translateY(-10px)';

    // Trigger animation
    setTimeout(() => {
        dom.tradingInfoSection.style.opacity = '1';
        dom.tradingInfoSection.style.transform = 'translateY(0)';
    }, 10);

    // Clean up styles after animation
    setTimeout(() => {
        dom.tradingInfoSection.style.opacity = '';
        dom.tradingInfoSection.style.transform = '';
        dom.tradingInfoSection.style.transition = '';
    }, 310);

    // Hide the "show guide" button
    dom.showTradingInfoSection.classList.add('hidden');

    // Clear the dismissed preference
    localStorage.removeItem(TRADING_INFO_DISMISSED_KEY);
}
