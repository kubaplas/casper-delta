import { setGas, U256 } from "casper-delta-wasm-client";
import { DEFAULT_GAS_AMOUNT } from "../config.js";
import * as dom from "../dom.js";
import { showError, clearError, hideTransaction } from "../ui/modals.js";
import { parseAmount, formatNumber } from "../ui/formatters.js";
import { showTransactionPopup, disableTransactionButtons } from "../transactions/monitor.js";
import { onTransactionSentFailure } from "../transactions/handlers.js";
import { resetLongCloseAmount, resetShortCloseAmount } from "./positions.js";
import { connected, address, market, wcspr, balances, marketAllowanceValue, currentLongClosePercentage, currentShortClosePercentage, currentLongCloseAmount, currentShortCloseAmount, } from "../data/state.js";
import { currentTransaction } from "../transactions/monitor.js";
// ---------- Transaction Pre-check ----------
/**
 * Pre-check before executing a transaction
 */
export function transactionPreCheck(errorMessage) {
    if (!connected || !address) {
        showError(errorMessage);
        return false;
    }
    if (currentTransaction) {
        showError("Please wait for the current transaction to complete");
        return false;
    }
    clearError();
    hideTransaction();
    return true;
}
// ---------- Trading Operations ----------
/**
 * Deposit to long position
 */
export async function depositLong() {
    if (!transactionPreCheck("Please connect your wallet to trade")) {
        return;
    }
    const amount = parseAmount(dom.longOpenAmountInput);
    if (!amount) {
        showError("Please enter a valid amount");
        return;
    }
    // Check allowance and balance
    if (!balances) {
        showError("Balances not loaded yet. Please refresh.");
        return;
    }
    const wcsprBalance = balances.wcspr;
    const allowance = marketAllowanceValue || U256.fromNumber(0);
    const maxSpendable = wcsprBalance.lt(allowance) ? wcsprBalance : allowance;
    if (amount.gt(maxSpendable)) {
        showError(`Insufficient available WCSPR. You can spend up to ${formatNumber(maxSpendable)} WCSPR (limited by balance or allowance).`);
        return;
    }
    // Show popup immediately when user clicks the button
    showTransactionPopup("Open Long position");
    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();
    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await market.depositLong(amount);
        dom.longOpenAmountInput.value = "";
    }
    catch (e) {
        onTransactionSentFailure(e, "Failed to open long position");
    }
}
/**
 * Withdraw from long position
 */
export async function withdrawLong() {
    if (!transactionPreCheck("Please connect your wallet to trade")) {
        return;
    }
    if (currentLongClosePercentage === 0) {
        showError("Please select a percentage to close");
        return;
    }
    if (!currentLongCloseAmount) {
        showError("Please select a percentage to close");
        return;
    }
    if (currentLongCloseAmount.toBigInt() === 0n) {
        showError("Amount to close must be greater than 0");
        return;
    }
    // Show popup immediately when user clicks the button
    showTransactionPopup("Close Long position");
    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();
    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await market.withdrawLong(currentLongCloseAmount);
        resetLongCloseAmount();
    }
    catch (e) {
        onTransactionSentFailure(e, "Failed to close long position");
    }
}
/**
 * Deposit to short position
 */
export async function depositShort() {
    if (!transactionPreCheck("Please connect your wallet to trade")) {
        return;
    }
    const amount = parseAmount(dom.shortOpenAmountInput);
    if (!amount) {
        showError("Please enter a valid amount");
        return;
    }
    // Check allowance and balance
    if (!balances) {
        showError("Balances not loaded yet. Please refresh.");
        return;
    }
    const wcsprBalance = balances.wcspr;
    const allowance = marketAllowanceValue || U256.fromNumber(0);
    const maxSpendable = wcsprBalance.lt(allowance) ? wcsprBalance : allowance;
    if (amount.gt(maxSpendable)) {
        showError(`Insufficient available WCSPR. You can spend up to ${formatNumber(maxSpendable)} WCSPR (limited by balance or allowance).`);
        return;
    }
    // Show popup immediately when user clicks the button
    showTransactionPopup("Open Short position");
    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();
    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await market.depositShort(amount);
        dom.shortOpenAmountInput.value = "";
    }
    catch (e) {
        onTransactionSentFailure(e, "Failed to open short position");
    }
}
/**
 * Withdraw from short position
 */
export async function withdrawShort() {
    if (!transactionPreCheck("Please connect your wallet to trade")) {
        return;
    }
    if (currentShortClosePercentage === 0) {
        showError("Please select a percentage to close");
        return;
    }
    if (!currentShortCloseAmount) {
        showError("Please select a percentage to close");
        return;
    }
    if (currentShortCloseAmount.toBigInt() === 0n) {
        showError("Amount to close must be greater than 0");
        return;
    }
    // Show popup immediately when user clicks the button
    showTransactionPopup("Close Short position");
    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();
    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await market.withdrawShort(currentShortCloseAmount);
        resetShortCloseAmount();
    }
    catch (e) {
        onTransactionSentFailure(e, "Failed to close short position");
    }
}
/**
 * Update market price
 */
export async function updatePrice() {
    if (!transactionPreCheck("Please connect your wallet to update price")) {
        return;
    }
    // Show popup immediately when user clicks the button
    showTransactionPopup("Price update");
    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();
    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await market.updatePrice();
    }
    catch (e) {
        onTransactionSentFailure(e, "Failed to update price");
    }
}
/**
 * Request faucet
 */
export async function requestFaucet() {
    if (!transactionPreCheck("Please connect your wallet to use the faucet")) {
        return;
    }
    // Show popup immediately when user clicks the button
    showTransactionPopup("Faucet request");
    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();
    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await wcspr.faucet();
    }
    catch (e) {
        onTransactionSentFailure(e, "Failed to request faucet");
    }
}
