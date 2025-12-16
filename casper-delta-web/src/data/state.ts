import type {
    OdraWasmClient,
    MarketWasmClient,
    FaucetableWcsprWasmClient,
    PositionTokenWasmClient,
    MarketState,
    AccountInfo,
} from "casper-delta-wasm-client";
import type { Balances, ConsolidatedData } from "../types.js";
import { U256 } from "casper-delta-wasm-client";

// ---------- Application State ----------
// These variables hold the current state of the application

// Wallet connection state
export let connected = false;
export let address: string | null = null;
export let account: AccountInfo;

// Contract client instances
export let client: OdraWasmClient;
export let market: MarketWasmClient;
export let wcspr: FaucetableWcsprWasmClient;
export let longToken: PositionTokenWasmClient;
export let shortToken: PositionTokenWasmClient;

// Data state
export let balances: Balances | null = null;
export let marketState: MarketState | null = null;
export let consolidatedData: ConsolidatedData | null = null;
export let marketAllowanceValue: U256 | null = null;

// Position closing state
export let currentLongClosePercentage: number = 0;
export let currentShortClosePercentage: number = 0;
export let currentLongCloseAmount: U256 | null = null;
export let currentShortCloseAmount: U256 | null = null;

// ---------- State Setters ----------
// These functions allow other modules to update the application state

export function setConnected(value: boolean): void {
    connected = value;
}

export function setAddress(value: string | null): void {
    address = value;
}

export function setAccount(value: AccountInfo): void {
    account = value;
}

export function setClient(value: OdraWasmClient): void {
    client = value;
}

export function setMarket(value: MarketWasmClient): void {
    market = value;
}

export function setWcspr(value: FaucetableWcsprWasmClient): void {
    wcspr = value;
}

export function setLongToken(value: PositionTokenWasmClient): void {
    longToken = value;
}

export function setShortToken(value: PositionTokenWasmClient): void {
    shortToken = value;
}

export function setBalances(value: Balances | null): void {
    balances = value;
}

export function setMarketState(value: MarketState | null): void {
    marketState = value;
}

export function setConsolidatedData(value: ConsolidatedData | null): void {
    consolidatedData = value;
}

export function setMarketAllowanceValue(value: U256 | null): void {
    marketAllowanceValue = value;
}

export function setCurrentLongClosePercentage(value: number): void {
    currentLongClosePercentage = value;
}

export function setCurrentShortClosePercentage(value: number): void {
    currentShortClosePercentage = value;
}

export function setCurrentLongCloseAmount(value: U256 | null): void {
    currentLongCloseAmount = value;
}

export function setCurrentShortCloseAmount(value: U256 | null): void {
    currentShortCloseAmount = value;
}
