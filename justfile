set dotenv-load := true
CARGO_ODRA_GIT_REPO := "https://github.com/odradev/cargo-odra"
CARGO_ODRA_BRANCH := "release/0.1.6"
BINARYEN_VERSION := "version_116"
BINARYEN_CHECKSUM := "c55b74f3109cdae97490faf089b0286d3bba926bb6ea5ed00c8c784fc53718fd"

install-cargo-odra:
    rustup toolchain install stable
    cargo +stable install cargo-odra --git {{CARGO_ODRA_GIT_REPO}} --branch {{CARGO_ODRA_BRANCH}} --locked

prepare-test-env: install-cargo-odra
    rustup target add wasm32-unknown-unknown
    rustup component add llvm-tools-preview
    cargo +stable install grcov
    sudo apt install wabt
    wget https://github.com/WebAssembly/binaryen/releases/download/{{BINARYEN_VERSION}}/binaryen-{{BINARYEN_VERSION}}-x86_64-linux.tar.gz || { echo "Download failed"; exit 1; }
    sha256sum binaryen-{{BINARYEN_VERSION}}-x86_64-linux.tar.gz | grep {{BINARYEN_CHECKSUM}} || { echo "Checksum verification failed"; exit 1; }
    tar -xzf binaryen-{{BINARYEN_VERSION}}-x86_64-linux.tar.gz || { echo "Extraction failed"; exit 1; }
    sudo cp binaryen-{{BINARYEN_VERSION}}/bin/wasm-opt /usr/local/bin/wasm-opt

test:
    cargo odra test
    cargo odra test -b casper

clippy:
    cargo clippy --all-targets -- -D warnings

lint:
    cargo fmt

check-lint: clippy
    cargo fmt -- --check

prepare:

build:
    cargo odra build
    cargo odra generate-client
    cd casper-delta-web && npm install && npm run build

run-web:
    cd casper-delta-web && npm run build && npm run dev:production

run-web-competition:
    cd casper-delta-web && npm run build && npm run dev:competition

run-nctl:
    docker run --rm -it --name mynctl -d -p 11101:11101 -p 14101:14101 -p 18101:18101 -p 25101:25101 makesoftware/casper-nctl:v203

# Docker commands
docker-build:
    docker build --build-arg WASM_CLIENT_SK="$WASM_CLIENT_SK" -t casper-delta .

docker-run:
    docker run --rm -it --env-file .env -p 3003:3003 casper-delta

docker-run-detached:
    docker run --rm -d --env-file .env -p 3003:3003 --name casper-delta casper-delta

docker-stop:
    docker stop casper-delta

cli *ARGS:
    cargo run --bin casper-delta-cli -- {{ARGS}}

cli-on-nctl *args="":
    set shell := bash
    mkdir -p .node-keys
    # Extract the secret keys from the local Casper node
    docker exec mynctl /bin/bash -c "cat /home/casper/casper-nctl/assets/net-1/users/user-1/secret_key.pem" > .node-keys/secret_key.pem
    docker exec mynctl /bin/bash -c "cat  /home/casper/casper-nctl/assets/net-1/users/user-2/secret_key.pem" > .node-keys/secret_key_1.pem
    # Run the command
    ODRA_CASPER_LIVENET_SECRET_KEY_PATH=.node-keys/secret_key.pem ODRA_CASPER_LIVENET_NODE_ADDRESS=http://localhost:11101 ODRA_CASPER_LIVENET_EVENTS_URL=http://localhost:18101/events ODRA_CASPER_LIVENET_CHAIN_NAME=casper-net-1 ODRA_CASPER_LIVENET_KEY_1=.node-keys/secret_key_1.pem  cargo run --bin casper-delta-cli -- {{args}}

    rm -rf examples/.node-keys

#plots:
#    cargo run -p casper-delta-charts
#
#deploy-contracts:
#    cargo run -p casper-delta-client deploy-contracts
#
#set-config:
#    cargo run -p casper-delta-client set-config
#
#update-price:
#    cargo run -p casper-delta-client update-price
#
#update-price-deamon SEC:
#    cargo run -p casper-delta-client update-price-deamon {{SEC}}
#
#print-balances:
#    cargo run -p casper-delta-client print-balances
#
#go-long:
#    cargo run -p casper-delta-client go-long
#
#random-bot SEC:
#    cargo run -p casper-delta-client run-bot random -i {{SEC}}