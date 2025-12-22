import * as dom from "../dom.js";
import { CurrentTransaction } from "../types.js";
import { lockScroll, unlockScroll, buildExplorerTxUrl } from "../ui/utils.js";
import { showError } from "../ui/modals.js";

// ---------- Transaction Monitor State ----------
export let currentTransaction: CurrentTransaction | null = null;

export function setCurrentTransaction(value: CurrentTransaction | null): void {
    currentTransaction = value;
}

// ---------- Button State Management ----------

/**
 * Disable all transaction buttons during transaction processing
 */
export function disableTransactionButtons(): void {
    // Trading buttons
    dom.depositLongBtn.disabled = true;
    dom.withdrawLongBtn.disabled = true;
    dom.depositShortBtn.disabled = true;
    dom.withdrawShortBtn.disabled = true;

    // Action buttons
    dom.faucetBtn.disabled = true;
    dom.wrapCsprBtn.disabled = true;
    dom.unwrapCsprBtn.disabled = true;
    dom.approveMarketBtn.disabled = true;

    // Add visual disabled state
    const buttons = [dom.depositLongBtn, dom.withdrawLongBtn, dom.depositShortBtn, dom.withdrawShortBtn,
    dom.updatePriceBtn, dom.faucetBtn, dom.wrapCsprBtn, dom.unwrapCsprBtn, dom.approveMarketBtn];
    buttons.forEach(btn => {
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    });
}

/**
 * Enable all transaction buttons after transaction completes
 */
export function enableTransactionButtons(): void {
    // Trading buttons
    dom.depositLongBtn.disabled = false;
    dom.withdrawLongBtn.disabled = false;
    dom.depositShortBtn.disabled = false;
    dom.withdrawShortBtn.disabled = false;

    // Action buttons
    dom.faucetBtn.disabled = false;
    dom.wrapCsprBtn.disabled = false;
    dom.unwrapCsprBtn.disabled = false;
    dom.approveMarketBtn.disabled = false;

    // Remove visual disabled state
    const buttons = [dom.depositLongBtn, dom.withdrawLongBtn, dom.depositShortBtn, dom.withdrawShortBtn,
    dom.updatePriceBtn, dom.faucetBtn, dom.wrapCsprBtn, dom.unwrapCsprBtn, dom.approveMarketBtn];
    buttons.forEach(btn => {
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    });
}

// ---------- Transaction Progress UI ----------

/**
 * Show transaction progress popup
 */
export function showTransactionPopup(description: string): void {
    // Show progress overlay as full screen modal
    dom.txProgressOverlay.classList.remove("hidden");
    // Match error modal behavior: lock scroll and focus panel
    lockScroll();

    // Ensure the modal is visible by scrolling the popup into view
    if (dom.txProgressPanel) {
        // Small delay to ensure the popup is fully rendered before scrolling
        setTimeout(() => {
            dom.txProgressPanel.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
            dom.txProgressPanel.focus();
        }, 100);
    }

    // Set initial state
    dom.txProgressHash.textContent = "Preparing transaction...";
    dom.txProgressStatus.textContent = `${description} starting...`;
    dom.txProgressTime.textContent = "Connecting to wallet...";
    dom.txProgressBar.style.width = "10%";

    // Hide the basic transaction section as we're now showing progress
    dom.txSection.classList.add("hidden");

    // Set a manual timeout as a fallback
    setTimeout(() => {
        console.warn('Manual timeout triggered - transaction taking too long');
        onTransactionTimeout();
    }, 3 * 60 * 1000); // 3 minutes fallback timeout
}

/**
 * Hide transaction progress popup
 */
export function hideTransactionPopup(): void {
    cleanup();
}

/**
 * Show transaction hash in progress popup
 */
export function showTransactionHashInProgress(hash: string): void {
    const url = buildExplorerTxUrl(hash);
    dom.txProgressHash.innerHTML = `<a href="${url}" target="_blank" class="text-orange-600 hover:text-orange-800 underline break-all">${hash}</a>`;
}

/**
 * Cleanup transaction progress UI
 */
export function cleanup(): void {
    // Reset progress UI and hide overlay
    dom.txProgressOverlay.classList.add("hidden");
    dom.txProgressBar.style.width = "0%";
    dom.txProgressBar.classList.remove("from-green-500", "to-green-600", "from-red-500", "to-red-600", "from-yellow-500", "to-yellow-600");
    dom.txProgressBar.classList.add("from-blue-500", "to-blue-600");
    dom.txProgressSpinner.classList.remove("hidden");

    // Re-enable body scrolling
    unlockScroll();

    // Ensure buttons are enabled when cleaning up
    enableTransactionButtons();
}

/**
 * Handle transaction timeout
 */
export function onTransactionTimeout(): void {
    console.warn("Transaction monitoring timed out");

    // Update UI to show timeout
    dom.txProgressBar.style.width = "100%";
    dom.txProgressBar.classList.remove("from-blue-500", "to-blue-600");
    dom.txProgressBar.classList.add("from-yellow-500", "to-yellow-600");
    dom.txProgressSpinner.classList.add("hidden");
    dom.txProgressStatus.textContent = "⏱️ Monitoring timeout";
    dom.txProgressTime.textContent = "Transaction may still be processing";

    // Show warning
    showError("Transaction monitoring timed out. The transaction may still be processing. Please check the explorer manually.");

    // Show the transaction link for manual checking
    if (currentTransaction) {
        const url = `${buildExplorerTxUrl(currentTransaction.hash)}`;
        dom.txLinkAnchor.href = url;
        dom.txSection.classList.remove("hidden");
    }

    // Re-enable buttons after timeout
    enableTransactionButtons();
    currentTransaction = null;
    // Hide progress after a delay
    setTimeout(cleanup, 1000);
}
