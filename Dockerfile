# Stage 1: Rust build environment
FROM rust:1.84-bookworm AS rust-builder

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    wabt \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install binaryen (wasm-opt)
ARG BINARYEN_VERSION=version_116
RUN wget -q https://github.com/WebAssembly/binaryen/releases/download/${BINARYEN_VERSION}/binaryen-${BINARYEN_VERSION}-x86_64-linux.tar.gz \
    && tar -xzf binaryen-${BINARYEN_VERSION}-x86_64-linux.tar.gz \
    && cp binaryen-${BINARYEN_VERSION}/bin/wasm-opt /usr/local/bin/wasm-opt \
    && rm -rf binaryen-${BINARYEN_VERSION}* 

# Install nightly toolchain and wasm target
RUN rustup toolchain install nightly-2025-01-01 \
    && rustup default nightly-2025-01-01 \
    && rustup target add wasm32-unknown-unknown

# Install cargo-odra
ARG CARGO_ODRA_GIT_REPO=https://github.com/odradev/cargo-odra
ARG CARGO_ODRA_BRANCH=release/0.1.6
RUN rustup toolchain install stable \
    && cargo +stable install cargo-odra --git ${CARGO_ODRA_GIT_REPO} --branch ${CARGO_ODRA_BRANCH} --locked

# Install wasm-pack
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

WORKDIR /app

# Copy only Cargo files first for dependency caching
COPY Cargo.toml Cargo.lock rust-toolchain Odra.toml ./
COPY casper-delta-contracts/Cargo.toml casper-delta-contracts/
COPY casper-delta-cli/Cargo.toml casper-delta-cli/
COPY casper_delta_client/Cargo.toml casper_delta_client/
COPY casper-delta-collector/Cargo.toml casper-delta-collector/

# Create dummy source files to build dependencies
RUN mkdir -p casper-delta-contracts/src casper-delta-cli/src casper_delta_client/src casper-delta-collector/src \
    && echo "fn main() {}" > casper-delta-contracts/src/lib.rs \
    && echo "fn main() {}" > casper-delta-cli/src/lib.rs \
    && echo "fn main() {}" > casper_delta_client/src/lib.rs \
    && echo "fn main() {}" > casper-delta-collector/src/main.rs

# Copy actual source code
COPY . .

# Build Rust/WASM artifacts
# WASM_CLIENT_SK is required at build time for odra-wasm-client
ARG WASM_CLIENT_SK
ENV WASM_CLIENT_SK=${WASM_CLIENT_SK}
RUN cargo odra build && cargo odra generate-client

# The generated client goes to app_client/pkg-web - copy to expected location if needed
# Use local pre-built pkg-web if available (copied from host), otherwise use generated one
RUN if [ -d "/app/casper_delta_client/pkg-web" ] && [ -f "/app/casper_delta_client/pkg-web/casper_delta_wasm_client.js" ]; then \
        echo "Using pre-built pkg-web from host"; \
    elif [ -d "/app/app_client/pkg-web" ]; then \
        echo "Using generated pkg-web from app_client"; \
        rm -rf /app/casper_delta_client/pkg-web; \
        cp -r /app/app_client/pkg-web /app/casper_delta_client/pkg-web; \
    fi


# Stage 2: Node.js build environment
FROM node:22-bookworm-slim AS node-builder

WORKDIR /app/casper-delta-web

# Copy package files for npm caching
COPY casper-delta-web/package.json casper-delta-web/package-lock.json ./

# Copy the generated WASM client from rust builder
COPY --from=rust-builder /app/casper_delta_client/pkg-web ../casper_delta_client/pkg-web

# Install dependencies
RUN npm install

# Copy web source files
COPY casper-delta-web/ ./

# Replace the symlink with actual files (file: dependencies create symlinks)
RUN rm -rf node_modules/casper-delta-wasm-client \
    && cp -r ../casper_delta_client/pkg-web node_modules/casper-delta-wasm-client

# Build the web application
RUN npm run build


# Stage 3: Production runtime
FROM node:22-bookworm-slim AS runtime

WORKDIR /app

# Install only runtime dependencies
RUN apt-get update && apt-get install -y \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -s /bin/bash appuser

# Copy built artifacts from node builder (including node_modules for static serving)
COPY --from=node-builder /app/casper-delta-web ./casper-delta-web
COPY --from=node-builder /app/casper-delta-web/node_modules ./casper-delta-web/node_modules
COPY --from=node-builder /app/casper_delta_client/pkg-web ./casper_delta_client/pkg-web

# Set ownership
RUN chown -R appuser:appuser /app

USER appuser

WORKDIR /app/casper-delta-web

# Expose the default port
EXPOSE 3003

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run the production server
CMD ["npm", "run", "start"]
