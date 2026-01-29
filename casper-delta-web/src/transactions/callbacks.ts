import { CsprClickCallbacks, TransactionResult, TransactionStatus, AccountInfo } from "casper-delta-wasm-client";
import * as dom from "../dom.js";
import { setAccount } from "../data/state.js";
import {
    onTransactionSuccessFromCsprClick,
    onTransactionFailureFromCsprClick,
    onTransactionExpired,
    onTransactionCancelled,
} from "./handlers.js";
import { showTransactionHashInProgress, setCurrentTransaction, onTransactionTimeout } from "./monitor.js";

// Import functions that will be set from main.ts
let onConnectFn: (publicKey?: string) => Promise<void>;
let onDisconnectFn: () => void;

export function setOnConnectCallback(fn: (publicKey?: string) => Promise<void>): void {
    onConnectFn = fn;
}

export function setOnDisconnectCallback(fn: () => void): void {
    onDisconnectFn = fn;
}

// ---------- CSPR.click Integration ----------

/**
 * Set up CSPR.click callbacks
 * According to cspr.click docs, event handlers should be registered after 'csprclick:loaded' event.
 * The caller (main.ts) ensures this function is only called after the SDK is fully loaded.
 * @see https://docs.cspr.click/cspr.click-sdk/javascript/handling-events
 */
export function setupCsprClickCallbacks(): void {
    // Set up the native window.csprclick.on() event handlers (as per cspr.click docs)
    // These are the primary handlers for cspr.click events, especially for session restoration
    const csprclick = (window as any).csprclick;
    if (csprclick && typeof csprclick.on === 'function') {
        console.log("Setting up CSPR.click event handlers via window.csprclick.on()...");
        
        csprclick.on('csprclick:signed_in', async (evt: any) => {
            console.log("csprclick:signed_in event received", evt);
            // Extract public key from native event (uses snake_case: public_key)
            const publicKey = evt?.account?.public_key || evt?.activeKey || evt?.publicKey;
            if (publicKey && onConnectFn) {
                console.log("Calling onConnect with publicKey from native event:", publicKey);
                await onConnectFn(publicKey);
            }
        });

        csprclick.on('csprclick:switched_account', async (evt: any) => {
            console.log("csprclick:switched_account event received", evt);
            const publicKey = evt?.account?.public_key || evt?.activeKey || evt?.publicKey;
            if (publicKey && onConnectFn) {
                console.log("Calling onConnect with publicKey from native event:", publicKey);
                await onConnectFn(publicKey);
            }
        });

        csprclick.on('csprclick:signed_out', async (evt: any) => {
            console.log("csprclick:signed_out event received", evt);
            if (onDisconnectFn) {
                onDisconnectFn();
            }
        });

        csprclick.on('csprclick:disconnected', async (evt: any) => {
            console.log("csprclick:disconnected event received", evt);
            if (onDisconnectFn) {
                onDisconnectFn();
            }
        });
        
        console.log("CSPR.click event handlers registered via window.csprclick.on()");
    } else {
        console.warn("window.csprclick.on() not available - using fallback WASM callbacks");
    }
    
    // Also set up the WASM CsprClickCallbacks as a fallback/supplement
    if (CsprClickCallbacks && typeof CsprClickCallbacks.onSignedIn === 'function') {
        console.log("Setting up CSPR.click WASM callbacks...");
        
        CsprClickCallbacks.onSignedIn(async (accountInfo: AccountInfo) => {
            console.log("CSPR.click WASM onSignedIn callback fired", accountInfo);
            setAccount(accountInfo);
            if (onConnectFn) {
                await onConnectFn();
            }
        });

        CsprClickCallbacks.onSwitchedAccount(async (accountInfo: AccountInfo) => {
            console.log("CSPR.click WASM onSwitchedAccount callback fired", accountInfo);
            setAccount(accountInfo);
            if (onConnectFn) {
                await onConnectFn();
            }
        });

        CsprClickCallbacks.onSignedOut(() => {
            console.log("CSPR.click WASM onSignedOut callback fired");
            if (onDisconnectFn) {
                onDisconnectFn();
            }
        });

        CsprClickCallbacks.onTransactionStatusUpdate((status: TransactionStatus, result: TransactionResult) => {
            handleCsprClickStatusUpdate(status, result);
        });
        
        console.log("CSPR.click WASM callbacks setup complete");
    } else {
        console.warn("CsprClickCallbacks WASM module not available");
    }
    
    console.log("CSPR.click callbacks setup complete");
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
            // If we're monitoring a transaction and receiving heartbeats, 
            // check if we've been waiting too long
            import("./monitor.js").then(({ currentTransaction }) => {
                if (currentTransaction) {
                    const elapsed = Date.now() - currentTransaction.startTime;
                    // Use a shorter timeout for heartbeat scenarios (2 minutes instead of 5)
                    const heartbeatTimeout = 2 * 60 * 1000; // 2 minutes
                    // Update progress bar based on elapsed time
                    const progressPercentage = Math.min(20 + (elapsed / heartbeatTimeout) * 60, 80);
                    dom.txProgressBar.style.width = `${progressPercentage}%`;
                    dom.txProgressTime.textContent = `Waiting for processing... (${Math.floor(elapsed / 1000)}s elapsed)`;
                }
            });
            break;
        default:
            console.warn('Unknown CSPR.click status:', status);
            break;
    }
}
