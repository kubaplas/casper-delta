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
