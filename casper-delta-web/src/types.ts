import {
    Address,
    OdraWasmClient,
    U256,
    AccountInfo,
} from "casper-delta-wasm-client";

import {
    MarketWasmClient,
    FaucetableWcsprWasmClient,
    PositionTokenWasmClient,
    MarketState,
    AddressMarketState,
} from "casper-delta-wasm-client";

// ---------- Type Definitions ----------

export interface Balances {
    wcspr: U256;
    longToken: U256;
    shortToken: U256;
}

export interface CurrentTransaction {
    hash: string;
    startTime: number;
}

export interface ConsolidatedData {
    addressMarketState: AddressMarketState;
    lastUpdated: number;
}

// Re-export types that are used throughout the application
export type {
    Address,
    OdraWasmClient,
    U256,
    AccountInfo,
    MarketWasmClient,
    FaucetableWcsprWasmClient,
    PositionTokenWasmClient,
    MarketState,
    AddressMarketState,
};
