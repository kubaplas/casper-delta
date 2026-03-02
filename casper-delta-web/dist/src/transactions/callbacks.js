import { CsprClickCallbacks, TransactionStatus } from "casper-delta-wasm-client";
import * as dom from "../dom.js";
import { onTransactionSuccessFromCsprClick, onTransactionFailureFromCsprClick, onTransactionExpired, onTransactionCancelled, } from "./handlers.js";
import { showTransactionHashInProgress, setCurrentTransaction, currentTransaction, onTransactionTimeout } from "./monitor.js";
// Import functions that will be set from main.ts
let onConnectFn = null;
let onDisconnectFn = null;
export function setOnConnectCallback(fn) {
    onConnectFn = fn;
}
export function setOnDisconnectCallback(fn) {
    onDisconnectFn = fn;
}
// ---------- CSPR.click Integration ----------
/**
 * Fetch the active public key from the SDK and trigger the onConnect
 * callback.  Reads directly from window.csprclick (not the WASM wrapper)
 * because the WASM bridge crashes when getActivePublicKey() returns
 * undefined (no session).
 */
async function handleSignIn() {
    try {
        const csprclick = window.csprclick;
        const publicKey = await csprclick?.getActivePublicKey?.();
        if (publicKey) {
            if (onConnectFn) {
                await onConnectFn(publicKey);
            }
        }
    }
    catch (error) {
        console.error("Failed to get active account after sign-in:", error);
    }
}
/**
 * Set up CSPR.click callbacks.
 *
 * Account events (signed_in, switched_account, signed_out) are registered
 * directly on window.csprclick — the same pattern the ghostminter reference
 * app uses.  This avoids a layer of WASM indirection that was silently
 * swallowing events.
 *
 * Transaction status updates still go through the WASM CsprClickCallbacks
 * because they provide proper TransactionStatus / TransactionResult types.
 *
 * MUST be called after both WASM init() and waitForCsprClick() have
 * completed — at that point window.csprclick (from the CDN SDK) and the
 * WASM module are both available.
 */
export function setupCsprClickCallbacks() {
    const csprclick = window.csprclick;
    if (!csprclick) {
        throw new Error("window.csprclick not available — ensure waitForCsprClick() " +
            "resolved before calling setupCsprClickCallbacks().");
    }
    // --- Account events (direct SDK registration) ---
    csprclick.on('csprclick:signed_in', async () => {
        await handleSignIn();
    });
    csprclick.on('csprclick:switched_account', async () => {
        await handleSignIn();
    });
    csprclick.on('csprclick:signed_out', () => {
        if (onDisconnectFn) {
            onDisconnectFn();
        }
    });
    // --- Transaction events (WASM layer for type conversion) ---
    if (CsprClickCallbacks && typeof CsprClickCallbacks.onTransactionStatusUpdate === 'function') {
        CsprClickCallbacks.onTransactionStatusUpdate((status, result) => {
            handleCsprClickStatusUpdate(status, result);
        });
    }
    else {
        console.warn("CsprClickCallbacks.onTransactionStatusUpdate not available — transaction monitoring may not work");
    }
}
/**
 * Handle CSPR.click status updates according to the documentation
 */
function handleCsprClickStatusUpdate(status, result) {
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
                onTransactionFailureFromCsprClick(result).catch((error) => {
                    console.error("Error in transaction failure handler:", error);
                });
            }
            else {
                // No error indicators - assume success
                onTransactionSuccessFromCsprClick(result).catch((error) => {
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
            onTransactionFailureFromCsprClick(result).catch((error) => {
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
