// CSPR.click configuration - values injected by server from environment variables
if (!window.CSPR_CLICK_APP_NAME) throw new Error('CSPR_CLICK_APP_NAME not configured');
if (!window.CSPR_CLICK_APP_ID) throw new Error('CSPR_CLICK_APP_ID not configured');

// Assign to window so the CDN script can reliably access them
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

// Dynamically load the CDN script and expose a promise that resolves
// when window.csprclick is fully initialised.  This eliminates the race
// condition caused by the CDN being in a different region than the app
// server — the previous <script> tag approach could not guarantee that
// the SDK's *async* internal initialisation finished before the app's
// module scripts started executing.
window.csprClickReady = new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.src = 'https://cdn.cspr.click/ui/v1.13.1/csprclick-client-1.13.1.js';

    script.onload = function () {
        // The CDN script itself performs async initialisation, so
        // window.csprclick may not be set the instant the script runs.
        var start = Date.now();
        var MAX_WAIT = 15000; // 15 s – generous for slow connections

        (function poll() {
            if (window.csprclick) {
                resolve(window.csprclick);
            } else if (Date.now() - start > MAX_WAIT) {
                reject(new Error('CSPR.click SDK loaded but failed to initialise within ' + MAX_WAIT + ' ms'));
            } else {
                setTimeout(poll, 50);
            }
        })();
    };

    script.onerror = function () {
        reject(new Error('Failed to load CSPR.click SDK from CDN'));
    };

    document.head.appendChild(script);
});
