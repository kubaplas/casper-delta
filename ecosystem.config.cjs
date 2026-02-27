require('dotenv').config();
const path = require('path');

module.exports = {
    apps: [
        {
            name: "casper-delta",
            script: "./dist/index.js",
            cwd: "./casper-delta-web",
            env: {
                APP_MODE: process.env.APP_MODE || "production",
                NODE_ENV: process.env.NODE_ENV || "production",
                RPC_URL: process.env.RPC_URL,
                SPECULATIVE_RPC_URL: process.env.SPECULATIVE_RPC_URL,
                CHAIN_NAME: process.env.CHAIN_NAME,
                EXPLORER_BASE: process.env.EXPLORER_BASE,
                MARKET_CONTRACT_ADDRESS: process.env.MARKET_CONTRACT_ADDRESS,
                WCSPR_CONTRACT_ADDRESS: process.env.WCSPR_CONTRACT_ADDRESS,
                LONG_TOKEN_CONTRACT_ADDRESS: process.env.LONG_TOKEN_CONTRACT_ADDRESS,
                SHORT_TOKEN_CONTRACT_ADDRESS: process.env.SHORT_TOKEN_CONTRACT_ADDRESS,
                CSPR_CLICK_APP_NAME: process.env.CSPR_CLICK_APP_NAME,
                CSPR_CLICK_APP_ID: process.env.CSPR_CLICK_APP_ID
            }
        },
        {
            name: "casper-delta-collector",
            script: "cargo",
            args: "run -p casper-delta-collector",
            cwd: __dirname,
            env: {
                NODE_ENV: process.env.NODE_ENV || "production"
            }
        }
    ]
};
