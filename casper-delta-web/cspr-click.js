// CSPR.click configuration - values injected by server from environment variables
if (!window.CSPR_CLICK_APP_NAME) throw new Error('CSPR_CLICK_APP_NAME not configured');
if (!window.CSPR_CLICK_APP_ID) throw new Error('CSPR_CLICK_APP_ID not configured');

const clickUIOptions = {
    uiContainer: 'csprclick-ui',
    rootAppElement: 'body',
    showTopBar: false,
};

const clickSDKOptions = {
    appName: window.CSPR_CLICK_APP_NAME,
    appId: window.CSPR_CLICK_APP_ID,
    providers: ['casper-wallet', 'ledger'],
};
