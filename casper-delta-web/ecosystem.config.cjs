const path = require('path');

module.exports = {
    apps: [
        {
            name: "casper-delta",
            script: "./dist/index.js",
            cwd: __dirname,
            env: {
                APP_MODE: "production",
                NODE_ENV: "production"
            }
        }
    ]
};
