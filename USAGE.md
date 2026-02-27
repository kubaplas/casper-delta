# Installation
This step is needed for local development and deployment of the contracts.

If you don't have odra and cargo odra set up, you need to do so. Follow the steps in https://odra.dev/docs/getting-started/installation. There's also a command for setting up linux enviroment:

```bash
just prepare
```

Now, copy `.env.example` to `.env`, fill missing keys and set variables for the chain you want to use.
Defaults are set for deploying and running web app on the testnet. Hashes of the contracts will be available after the deployment in `resources/chain-name-contracts.toml`

# Building contracts and the web app

```bash
just build
```

# Deploying contracts

The general tool used to deploy and manage contracts can be run using

```bash
just cli
```

To run the deploy script, which will deploy all needed contracts on the network configured in `.env`, use 
```bash
just cli deploy
```

To call contracts directly, use
```bash
just cli contract
```

And to run custom scenarios, use
```bash
just cli scenario
```

# Building docker

To build the docker image, run
```bash
just docker-build
```

To run it locally, use
```
just docker-run
```

It will expose the app on the port 3003.