import { CsprClickCallbacks, TransactionResult, TransactionStatus, getCurrentAccount } from "casper-delta-wasm-client";
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

/**
 * Normalise a TransactionResult object in-place so that
 * csprCloudTransaction fields match the types the WASM binary expects.
 * The CSPR.click SDK can return null for fields the Rust struct defines
 * as non-optional String/u64 (contract_hash, contract_package_hash,
 * entry_point_id).
 */
function normalizeTransactionResult(result: any): void {
    if (!result || typeof result !== 'object') return;
    const tx = result.csprCloudTransaction;
    if (!tx || typeof tx !== 'object') return;
    if (tx.contract_hash == null) tx.contract_hash = "";
    if (tx.contract_package_hash == null) tx.contract_package_hash = "";
    if (tx.entry_point_id == null) tx.entry_point_id = 0;
}

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
        let publicKey = eventPublicKey;
        if (!publicKey) {
            console.warn("[callbacks] No public key from event data, falling back to getActivePublicKey()");
            publicKey = await (window as any).csprclick?.getActivePublicKey?.();
        }
        if (publicKey) {
            console.log("[callbacks] handleSignIn: public key =", publicKey.slice(0, 10) + "...");
            knownActivePublicKey = publicKey;
            if (onConnectFn) {
                await onConnectFn(publicKey);
            }
            // Safety check: verify the WASM internal ACCOUNT is set.
            // The main fix is the synthetic csprclick:loaded dispatch in main.ts,
            // but this catches edge cases where events fire in unexpected order.
            try {
                getCurrentAccount();
            } catch (wasmErr) {
                console.warn("[callbacks] WASM ACCOUNT not set after sign-in, attempting re-trigger...");
                const lastData = (window as any)._csprClickLastEventData?.['csprclick:signed_in'];
                const callbacks = (window as any)._csprClickCallbacksByEvent?.['csprclick:signed_in'];
                if (lastData && callbacks) {
                    for (const cb of callbacks) {
                        try { cb(lastData); } catch (e) { /* ignore */ }
                    }
                    try {
                        getCurrentAccount();
                        console.log("[callbacks] WASM ACCOUNT set after re-trigger");
                    } catch {
                        console.error("[callbacks] WASM ACCOUNT still not set after re-trigger");
                    }
                }
            }
        } else {
            console.error("[callbacks] handleSignIn: no public key available from event or SDK");
        }
    } catch (error) {
        console.error("[callbacks] handleSignIn failed:", error);
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

    // --- WASM account callbacks ---
    // Register callbacks via CsprClickCallbacks so the WASM event closure
    // stores the account in its internal ACCOUNT thread-local.  Without
    // this, get_account() (used by caller_and_public_key()) always fails
    // because ACCOUNT stays JsValue::NULL.
    CsprClickCallbacks.onSignedIn(() => {});
    CsprClickCallbacks.onSwitchedAccount(() => {});

    // --- Account events (direct SDK registration) ---

    csprclick.on('csprclick:signed_in', async (eventData: any) => {
        console.log("[callbacks] csprclick:signed_in event, account:", eventData?.account ? 
            `provider=${eventData.account.provider}, public_key=${eventData.account.public_key?.slice(0, 10)}...` :
            `null/missing (raw: ${JSON.stringify(eventData)?.slice(0, 500)})`);
        await handleSignIn(eventData?.account?.public_key);
    });

    csprclick.on('csprclick:switched_account', async (eventData: any) => {
        console.log("[callbacks] csprclick:switched_account event, account:", eventData?.account ?
            `provider=${eventData.account.provider}, public_key=${eventData.account.public_key?.slice(0, 10)}...` :
            `null/missing (raw: ${JSON.stringify(eventData)?.slice(0, 500)})`);
        await handleSignIn(eventData?.account?.public_key);
    });

    csprclick.on('csprclick:signed_out', () => {
        console.log("[callbacks] csprclick:signed_out event");
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
        csprclick.send = function (deployJson: string, signingPublicKey: string, onStatusUpdate: any, ...rest: any[]) {
            const keyToUse = knownActivePublicKey || signingPublicKey;

            // Wrap the status update callback to normalise the result
            // before the WASM binary tries into_serde::<TransactionResult>.
            const wrappedOnStatusUpdate = typeof onStatusUpdate === 'function'
                ? function (status: any, result: any) {
                    normalizeTransactionResult(result);
                    return onStatusUpdate(status, result);
                }
                : onStatusUpdate;

            const promise = originalSend(deployJson, keyToUse, wrappedOnStatusUpdate, ...rest);

            // Also normalise the final resolved value of the send() promise.
            if (promise && typeof promise.then === 'function') {
                return promise.then((result: any) => {
                    normalizeTransactionResult(result);
                    return result;
                });
            }
            return promise;
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
