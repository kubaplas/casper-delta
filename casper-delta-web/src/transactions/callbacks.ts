import { CsprClickCallbacks, TransactionResult, TransactionStatus, AccountInfo } from "casper-delta-wasm-client";
import * as dom from "../dom.js";
import { setAccount } from "../data/state.js";
import {
    onTransactionSuccessFromCsprClick,
    onTransactionFailureFromCsprClick,
    onTransactionExpired,
    onTransactionCancelled,
} from "./handlers.js";
import { showTransactionHashInProgress, setCurrentTransaction, currentTransaction, onTransactionTimeout } from "./monitor.js";

// Import functions that will be set from main.ts
let onConnectFn: () => Promise<void>;
let onDisconnectFn: () => void;

export function setOnConnectCallback(fn: () => Promise<void>): void {
    onConnectFn = fn;
}

export function setOnDisconnectCallback(fn: () => void): void {
    onDisconnectFn = fn;
}

// ---------- CSPR.click Integration ----------

/**
 * Set up CSPR.click callbacks
 */
export function setupCsprClickCallbacks(): void {
    if (!CsprClickCallbacks || typeof CsprClickCallbacks.onSignedIn !== 'function') {
        console.error("CsprClickCallbacks not available - wallet integration may fail");
        setTimeout(setupCsprClickCallbacks, 1000);
        return;
    }
    
    CsprClickCallbacks.onSignedIn(async (accountInfo: AccountInfo) => {
        console.log("[TRACE] CsprClick.onSignedIn fired");
        setAccount(accountInfo);
        if (onConnectFn) {
            await onConnectFn();
        }
    });

    CsprClickCallbacks.onSwitchedAccount(async (accountInfo: AccountInfo) => {
        console.log("[TRACE] CsprClick.onSwitchedAccount fired");
        setAccount(accountInfo);
        if (onConnectFn) {
            await onConnectFn();
        }
    });

    CsprClickCallbacks.onSignedOut(() => {
        console.log("[TRACE] CsprClick.onSignedOut fired");
        if (onDisconnectFn) {
            onDisconnectFn();
        }
    });

    CsprClickCallbacks.onTransactionStatusUpdate((status: TransactionStatus, result: TransactionResult) => {
        handleCsprClickStatusUpdate(status, result);
    });
}

/**
 * Handle CSPR.click status updates according to the documentation
 */
function handleCsprClickStatusUpdate(status: TransactionStatus, result: TransactionResult): void {
    switch (status) {
        case TransactionStatus.SENT:
            // Transaction has been signed and successfully deployed to a Casper node
            dom.txProgressStatus.textContent = "Transaction sent to network...";
            dom.txProgressTime.textContent = "Waiting for processing...";
            dom.txProgressBar.style.width = "20%";
            setCurrentTransaction({
                startTime: Date.now(),
                hash: result.txHash || ""
            });

            // Display the transaction hash as soon as it's available
            const hash = result.txHash;
            if (hash) {
                showTransactionHashInProgress(hash);
            }
            break;
        case TransactionStatus.PROCESSED:
            // Transaction has been executed by the network
            if (result.error) {
                // Transaction failed - has error or error code
                onTransactionFailureFromCsprClick(result).catch((error: any) => {
                    console.error("Error in transaction failure handler:", error);
                });
            } else {
                // No error indicators - assume success
                onTransactionSuccessFromCsprClick(result).catch((error: any) => {
                    console.error("Error in transaction success handler:", error);
                });
            }
            break;

        case TransactionStatus.EXPIRED:
            // Transaction's TTL elapsed before execution
            onTransactionExpired();
            break;

        case TransactionStatus.CANCELLED:
            // User rejected the signature request
            onTransactionCancelled();
            break;

        case TransactionStatus.TIMEOUT:
            // SDK stopped listening for updates before transaction was finalized
            onTransactionTimeout();
            break;

        case TransactionStatus.ERROR:
            // An unexpected error occurred
            onTransactionFailureFromCsprClick(result).catch((error: any) => {
                console.error("Error in transaction failure handler:", error);
            });
            break;

        case TransactionStatus.PING:
            // Heartbeat event - connection is still active
            if (currentTransaction) {
                const elapsed = Date.now() - currentTransaction.startTime;
                const heartbeatTimeout = 2 * 60 * 1000;
                const progressPercentage = Math.min(20 + (elapsed / heartbeatTimeout) * 60, 80);
                dom.txProgressBar.style.width = `${progressPercentage}%`;
                dom.txProgressTime.textContent = `Waiting for processing... (${Math.floor(elapsed / 1000)}s elapsed)`;
            }
            break;
        default:
            console.warn('Unknown CSPR.click status:', status);
            break;
    }
}
