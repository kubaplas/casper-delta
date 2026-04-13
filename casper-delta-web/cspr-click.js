// CSPR.click configuration - values injected by server from environment variables
if (!window.CSPR_CLICK_APP_NAME) throw new Error('CSPR_CLICK_APP_NAME not configured');
if (!window.CSPR_CLICK_APP_ID) throw new Error('CSPR_CLICK_APP_ID not configured');

// Assign to window so the CDN script can reliably access them
// (the SDK reads these globals during its own initialisation)
window.clickUIOptions = {
    uiContainer: 'csprclick-ui',
    rootAppElement: 'body',
    showTopBar: false,
};

window.clickSDKOptions = {
    appName: window.CSPR_CLICK_APP_NAME,
    appId: window.CSPR_CLICK_APP_ID,
    providers: ['casper-wallet', 'ledger'],
};

// Normalise CSPR.click account event data so the WASM binary's
// into_serde::<WrappedAccountInfo>() always succeeds.  The WASM struct
// expects { account: { provider, public_key, connected_at (i64), … } }.
// Different SDK versions may send slightly different shapes (camelCase vs
// snake_case, string vs number for connected_at, extra unknown fields).
function normalizeAccountEvent(data) {
    if (!data || typeof data !== 'object') {
        console.warn('[cspr-click] normalizeAccountEvent: received non-object data:', data);
        return data;
    }
    var a = data.account;
    if (!a || typeof a !== 'object') {
        console.warn('[cspr-click] normalizeAccountEvent: missing or invalid account field. Full data:', JSON.stringify(data, null, 2));
        return data;
    }
    // Coerce connected_at to integer (some versions send a string)
    var connAt = a.connected_at != null ? a.connected_at : a.connectedAt;
    if (typeof connAt === 'string') connAt = parseInt(connAt, 10) || 0;
    if (typeof connAt !== 'number') connAt = 0;
    a.connected_at = connAt;
    // Ensure balance fields are strings (serde expects Option<String>)
    if (a.balance != null && typeof a.balance !== 'string') a.balance = String(a.balance);
    if (a.liquid_balance != null && typeof a.liquid_balance !== 'string') a.liquid_balance = String(a.liquid_balance);
    return data;
}

// Wrap window.csprclick.on BEFORE the WASM module registers its listeners.
// This listener fires before the WASM's csprclick:loaded handler because
// cspr-click.js is loaded before the WASM init() call.
//
// We capture all registered callbacks per event so they can be re-invoked
// from JS if the WASM's internal ACCOUNT is not set (race condition workaround).
window._csprClickCallbacksByEvent = {};
window._csprClickLastEventData = {};

window.addEventListener('csprclick:loaded', function patchCsprClickOn() {
    window.removeEventListener('csprclick:loaded', patchCsprClickOn);
    if (!window.csprclick || !window.csprclick.on) {
        console.error('[cspr-click] csprclick:loaded fired but window.csprclick.on is not available');
        return;
    }
    console.log('[cspr-click] SDK loaded, patching csprclick.on for account event normalization');
    var realOn = window.csprclick.on.bind(window.csprclick);
    window.csprclick.on = function (event, callback) {
        if (event === 'csprclick:signed_in' ||
            event === 'csprclick:switched_account' ||
            event === 'csprclick:unsolicited_account_change') {
            // Store the original callback for re-triggering
            if (!window._csprClickCallbacksByEvent[event]) {
                window._csprClickCallbacksByEvent[event] = [];
            }
            window._csprClickCallbacksByEvent[event].push(callback);

            return realOn(event, function (eventData) {
                console.log('[cspr-click] Account event "' + event + '" raw data:', JSON.stringify(eventData, null, 2));
                var normalized = normalizeAccountEvent(eventData);
                if (!normalized || !normalized.account) {
                    console.error('[cspr-click] Account event "' + event + '" has null/missing account after normalization. This will cause WrappedAccountInfo parse failure.');
                }
                // Store last event data for re-triggering
                window._csprClickLastEventData[event] = normalized;
                callback(normalized);
            });
        }
        return realOn(event, callback);
    };
});

// Expose a promise that resolves when the CSPR.click SDK is fully
// initialised (window.csprclick is available).
//
// The SDK dispatches a 'csprclick:loaded' CustomEvent on `window` once
// it finishes its async bootstrap — this is the official mechanism
// recommended in the docs and used in the ghostminter reference app.
window.csprClickReady = new Promise(function (resolve, reject) {
    // If somehow already loaded (cached), resolve immediately
    if (window.csprclick) {
        resolve(window.csprclick);
        return;
    }

    // Listen for the official SDK-ready event
    window.addEventListener('csprclick:loaded', function onLoaded() {
        window.removeEventListener('csprclick:loaded', onLoaded);
        if (window.csprclick) {
            resolve(window.csprclick);
        } else {
            reject(new Error('csprclick:loaded fired but window.csprclick is not set'));
        }
    });

    // Safety timeout — if the SDK never loads, reject so the app can
    // show a meaningful error instead of hanging forever.
    setTimeout(function () {
        if (!window.csprclick) {
            reject(new Error('CSPR.click SDK failed to load within 30 s'));
        }
    }, 30000);

    // Dynamically inject the CDN script (avoids <script> tag ordering issues)
    var script = document.createElement('script');
    script.src = 'https://cdn.cspr.click/ui/v1.13.1/csprclick-client-1.13.1.js';
    script.async = true;
    script.onerror = function () {
        reject(new Error('Failed to load CSPR.click SDK from CDN'));
    };
    document.head.appendChild(script);
});
