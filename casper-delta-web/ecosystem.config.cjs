module.exports = {
    apps: [
        {
            name: "casper-delta",
            script: "npm",
            args: "run start",
            env: {
                APP_MODE: "production",
                NODE_ENV: "production"
            }
        }
    ]
};
