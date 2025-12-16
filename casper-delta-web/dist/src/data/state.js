// ---------- Application State ----------
// These variables hold the current state of the application
// Wallet connection state
export let connected = false;
export let address = null;
export let account;
// Contract client instances
export let client;
export let market;
export let wcspr;
export let longToken;
export let shortToken;
// Data state
export let balances = null;
export let marketState = null;
export let consolidatedData = null;
export let marketAllowanceValue = null;
// Position closing state
export let currentLongClosePercentage = 0;
export let currentShortClosePercentage = 0;
export let currentLongCloseAmount = null;
export let currentShortCloseAmount = null;
// ---------- State Setters ----------
// These functions allow other modules to update the application state
export function setConnected(value) {
    connected = value;
}
export function setAddress(value) {
    address = value;
}
export function setAccount(value) {
    account = value;
}
export function setClient(value) {
    client = value;
}
export function setMarket(value) {
    market = value;
}
export function setWcspr(value) {
    wcspr = value;
}
export function setLongToken(value) {
    longToken = value;
}
export function setShortToken(value) {
    shortToken = value;
}
export function setBalances(value) {
    balances = value;
}
export function setMarketState(value) {
    marketState = value;
}
export function setConsolidatedData(value) {
    consolidatedData = value;
}
export function setMarketAllowanceValue(value) {
    marketAllowanceValue = value;
}
export function setCurrentLongClosePercentage(value) {
    currentLongClosePercentage = value;
}
export function setCurrentShortClosePercentage(value) {
    currentShortClosePercentage = value;
}
export function setCurrentLongCloseAmount(value) {
    currentLongCloseAmount = value;
}
export function setCurrentShortCloseAmount(value) {
    currentShortCloseAmount = value;
}
