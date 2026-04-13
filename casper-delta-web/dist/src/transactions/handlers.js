import * as dom from "../dom.js";
import { getErrorDescription } from "../config.js";
import { showError, showErrorWithTransaction, showTransaction } from "../ui/modals.js";
import { enableTransactionButtons, cleanup, hideTransactionPopup, setCurrentTransaction } from "./monitor.js";
// Injected from main.ts to break a circular dependency with data/fetch.ts
let refreshAllData;
export function setRefreshFunction(fn) {
    refreshAllData = fn;
}
// ---------- Transaction Outcome Handlers ----------
/**
 * Handle successful transaction from CSPR.click
 */
export async function onTransactionSuccessFromCsprClick(data) {
    // Update UI to show success
    dom.txProgressBar.style.width = "100%";
    dom.txProgressBar.classList.remove("from-blue-500", "to-blue-600");
    dom.txProgressBar.classList.add("from-green-500", "to-green-600");
    dom.txProgressSpinner.classList.add("hidden");
    dom.txProgressStatus.textContent = "✅ Transaction successful!";
    dom.txProgressTime.textContent = "Refreshing data...";
    // Show the transaction link
    try {
        const txHash = data.txHash;
        if (txHash) {
            showTransaction(txHash);
        }
    }
    catch (e) {
        console.error('Error extracting transaction hash for success:', e);
    }
    try {
        // Wait a moment for blockchain data to be available
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Refresh all data and wait for completion
        if (refreshAllData) {
            await refreshAllData();
        }
        dom.txProgressTime.textContent = "✅ Data refreshed successfully";
    }
    catch (error) {
        console.error("Error refreshing data after transaction:", error);
        dom.txProgressTime.textContent = "⚠️ Transaction successful, but data refresh failed";
    }
    setCurrentTransaction(null);
    // Re-enable buttons after data refresh
    enableTransactionButtons();
    // Hide progress after a delay
    setTimeout(cleanup, 500);
}
/**
 * Handle failed transaction from CSPR.click
 */
export async function onTransactionFailureFromCsprClick(data) {
    console.error("Transaction failed:", data.error || data.errorCode || "unknown");
    // Update UI to show failure
    dom.txProgressBar.style.width = "100%";
    dom.txProgressBar.classList.remove("from-blue-500", "to-blue-600");
    dom.txProgressBar.classList.add("from-red-500", "to-red-600");
    dom.txProgressSpinner.classList.add("hidden");
    dom.txProgressStatus.textContent = "❌ Transaction failed";
    // Extract error information from WASM TransactionResult object
    let errorMsg = "Transaction failed";
    try {
        // The data is a WASM TransactionResult object with getter methods
        // We need to call the getter methods to get the actual values
        const error = data.error;
        const errorCode = data.errorCode;
        const isCancelled = data.isCancelled;
        // Also check TransactionData's errorMessage if available
        const transactionData = data.data;
        const dataErrorMessage = transactionData?.errorMessage;
        // Check if transaction was cancelled
        if (isCancelled) {
            errorMsg = "Transaction was cancelled by user";
        }
        else if (error) {
            // Use the error message from the WASM object
            errorMsg = error;
            // If we have an error code, try to get a user-friendly description
            if (errorCode !== null && errorCode !== undefined) {
                const description = getErrorDescription(errorCode);
                if (description !== `Unknown error (code: ${errorCode})`) {
                    errorMsg = description;
                }
            }
        }
        else if (dataErrorMessage) {
            // Use error message from TransactionData if available
            errorMsg = dataErrorMessage;
        }
        else if (errorCode !== null && errorCode !== undefined) {
            // We have an error code but no error message
            const description = getErrorDescription(errorCode);
            errorMsg = description;
        }
        else {
            // Fallback error message
            errorMsg = "Transaction failed - no specific error information available";
        }
    }
    catch (e) {
        console.error('Error extracting error information from WASM object:', e);
        errorMsg = "Transaction failed - error extracting details";
    }
    dom.txProgressTime.textContent = errorMsg;
    // Show error with transaction link
    try {
        const txHash = data.txHash;
        if (txHash) {
            showErrorWithTransaction(errorMsg, txHash);
            showTransaction(txHash);
        }
        else {
            showError(errorMsg);
        }
    }
    catch (e) {
        console.error('Error extracting transaction hash:', e);
        showError(errorMsg);
    }
    // Ensure the popup is visible by scrolling it into view
    if (dom.txProgressPanel) {
        setTimeout(() => {
            dom.txProgressPanel.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
        }, 100);
    }
    // For certain types of errors, we might still want to refresh data
    // (e.g., to get the latest state even if the transaction failed)
    const shouldRefreshOnFailure = shouldRefreshDataOnFailure(errorMsg);
    if (shouldRefreshOnFailure) {
        try {
            // Wait a moment for blockchain data to be available
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Refresh all data even though transaction failed
            if (refreshAllData) {
                await refreshAllData();
            }
        }
        catch (error) {
            console.error("Error refreshing data after transaction failure:", error);
        }
    }
    setCurrentTransaction(null);
    // Re-enable buttons after failure
    enableTransactionButtons();
    // Hide progress after a delay
    setTimeout(cleanup, 500);
}
/**
 * Helper method to determine if we should refresh data on failure
 */
function shouldRefreshDataOnFailure(errorMsg) {
    // For certain errors, we might want to refresh to get the latest state
    // even though the transaction failed
    const refreshOnFailureErrors = [
        "Faucet already used",
        "Insufficient balance",
        "Insufficient allowance",
        "Rate limited"
    ];
    return refreshOnFailureErrors.some(error => errorMsg.includes(error));
}
/**
 * Handle expired transaction
 */
export function onTransactionExpired() {
    console.warn("Transaction expired");
    // Update UI to show expiration
    dom.txProgressBar.style.width = "100%";
    dom.txProgressBar.classList.remove("from-blue-500", "to-blue-600");
    dom.txProgressBar.classList.add("from-yellow-500", "to-yellow-600");
    dom.txProgressSpinner.classList.add("hidden");
    dom.txProgressStatus.textContent = "⏰ Transaction expired";
    dom.txProgressTime.textContent = "Transaction TTL elapsed before execution";
    setCurrentTransaction(null);
    // Show warning
    showError("Transaction expired. The transaction's time-to-live (TTL) elapsed before execution.");
    // Hide progress after a delay
    setTimeout(cleanup, 500);
}
/**
 * Handle cancelled transaction
 */
export function onTransactionCancelled() {
    // Update UI to show cancellation
    dom.txProgressBar.style.width = "100%";
    dom.txProgressBar.classList.remove("from-blue-500", "to-blue-600");
    dom.txProgressBar.classList.add("from-gray-500", "to-gray-600");
    dom.txProgressSpinner.classList.add("hidden");
    dom.txProgressStatus.textContent = "❌ Transaction cancelled";
    dom.txProgressTime.textContent = "User rejected the signature request";
    // Re-enable buttons after cancellation
    enableTransactionButtons();
    setCurrentTransaction(null);
    // Hide progress after a delay
    setTimeout(cleanup, 500);
}
/**
 * Handle pre-submission transaction failure
 */
export function onTransactionSentFailure(error, message) {
    hideTransactionPopup();
    enableTransactionButtons();
    console.error(`[tx] ${message}:`, {
        errorMessage: error?.message,
        errorName: error?.name,
        errorStack: error?.stack?.split('\n').slice(0, 5).join('\n'),
        raw: String(error),
    });
    showError(`${message}: ${error.message || error}`);
}
