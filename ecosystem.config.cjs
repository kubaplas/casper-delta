const path = require('path');

module.exports = {
    apps: [
        {
            name: "casper-delta",
            script: "./dist/index.js",
            cwd: "./casper-delta-web",
            env: {
                APP_MODE: "production",
                NODE_ENV: "production"
            }
        },
        {
            name: "casper-delta-collector",
            script: "cargo",
            args: "run -p casper-delta-collector",
            cwd: __dirname,
            env: {
                NODE_ENV: "production"
            }
        }
    ]
};
