import { CsprClickCallbacks, TransactionResult, TransactionStatus } from "casper-delta-wasm-client";
import * as dom from "../dom.js";
import { client } from "../data/state.js";
import {
    onTransactionSuccessFromCsprClick,
    onTransactionFailureFromCsprClick,
    onTransactionExpired,
    onTransactionCancelled,
} from "./handlers.js";
import { showTransactionHashInProgress, setCurrentTransaction, currentTransaction, onTransactionTimeout } from "./monitor.js";

// Import functions that will be set from main.ts
let onConnectFn: ((publicKey: string) => Promise<void>) | null = null;
let onDisconnectFn: (() => void) | null = null;

// The last known-good active public key, extracted from CSPR.click events.
// The WASM binary's internal `getActiveAccountAsync` callback often fails to
// parse the SDK's account format ("Failed to parse account info"), leaving
// the WASM's cached signing key stale.  We track the key ourselves so we can
// fix it up before the SDK's `send()` rejects with "signing public key is not
// active".
let knownActivePublicKey: string | null = null;

export function setOnConnectCallback(fn: (publicKey: string) => Promise<void>): void {
    onConnectFn = fn;
}

export function setOnDisconnectCallback(fn: () => void): void {
    onDisconnectFn = fn;
}

// ---------- CSPR.click Integration ----------

/**
 * Fetch the active public key from the SDK and trigger the onConnect
 * callback.  Prefers the public key passed directly from the event data
 * (avoids stale getActivePublicKey() after account switch).  Falls back
 * to reading window.csprclick (not the WASM wrapper) because the WASM
 * bridge crashes when getActivePublicKey() returns undefined (no session).
 */
async function handleSignIn(eventPublicKey?: string): Promise<void> {
    try {
        const publicKey = eventPublicKey
            || await (window as any).csprclick?.getActivePublicKey?.();
        if (publicKey) {
            knownActivePublicKey = publicKey;
            if (onConnectFn) {
                await onConnectFn(publicKey);
            }
        }
    } catch (error) {
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
export function setupCsprClickCallbacks(): void {
    const csprclick = (window as any).csprclick;
    if (!csprclick) {
        throw new Error(
            "window.csprclick not available — ensure waitForCsprClick() " +
            "resolved before calling setupCsprClickCallbacks()."
        );
    }

    // --- Account events (direct SDK registration) ---

    csprclick.on('csprclick:signed_in', async (eventData: any) => {
        await handleSignIn(eventData?.account?.public_key);
    });

    csprclick.on('csprclick:switched_account', async (eventData: any) => {
        await handleSignIn(eventData?.account?.public_key);
    });

    csprclick.on('csprclick:signed_out', () => {
        knownActivePublicKey = null;
        if (onDisconnectFn) {
            onDisconnectFn();
        }
    });

    // --- Monkey-patch getActivePublicKey / send ---
    //
    // The WASM binary registers a `getActiveAccountAsync` callback with the
    // SDK but often fails to parse the response ("Failed to parse account
    // info"), so its internal cached signing key can be stale or undefined.
    // When the WASM then calls `send(deployJson, signingKey, accountInfo)`,
    // the SDK rejects with "signing public key is not active".
    //
    // We fix this by:
    // 1. Patching `getActivePublicKey` to fall back to our event-sourced key.
    // 2. Patching `send` to replace a stale signing key with the correct one.

    const originalGetActivePublicKey = csprclick.getActivePublicKey?.bind(csprclick);
    csprclick.getActivePublicKey = async function () {
        if (originalGetActivePublicKey) {
            try {
                const key = await originalGetActivePublicKey();
                if (key) return key;
            } catch { /* fall through */ }
        }
        return knownActivePublicKey;
    };

    const originalSend = csprclick.send?.bind(csprclick);
    if (originalSend) {
        csprclick.send = function (deployJson: string, signingPublicKey: string, accountInfo: any) {
            const keyToUse = knownActivePublicKey || signingPublicKey;
            if (accountInfo && knownActivePublicKey) {
                accountInfo.public_key = knownActivePublicKey;
            }
            return originalSend(deployJson, keyToUse, accountInfo);
        };
    }

    // --- Transaction events (WASM layer for type conversion) ---

    if (CsprClickCallbacks && typeof CsprClickCallbacks.onTransactionStatusUpdate === 'function') {
        CsprClickCallbacks.onTransactionStatusUpdate((status: TransactionStatus, result: TransactionResult) => {
            handleCsprClickStatusUpdate(status, result);
        });
    } else {
        console.warn("CsprClickCallbacks.onTransactionStatusUpdate not available — transaction monitoring may not work");
    }
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
