import { setGas, U256 } from "casper-delta-wasm-client";
import { DEFAULT_GAS_AMOUNT } from "../config.js";
import * as dom from "../dom.js";
import { showError, clearError, hideTransaction } from "../ui/modals.js";
import { parseAmount, formatNumber } from "../ui/formatters.js";
import { showTransactionPopup, disableTransactionButtons } from "../transactions/monitor.js";
import { onTransactionSentFailure } from "../transactions/handlers.js";
import { resetLongCloseAmount, resetShortCloseAmount } from "./positions.js";
import {
    connected,
    address,
    market,
    wcspr,
    balances,
    marketAllowanceValue,
    currentLongClosePercentage,
    currentShortClosePercentage,
    currentLongCloseAmount,
    currentShortCloseAmount,
} from "../data/state.js";
import { currentTransaction } from "../transactions/monitor.js";

// ---------- Transaction Pre-check ----------

/**
 * Pre-check before executing a transaction
 */
export function transactionPreCheck(errorMessage: string): boolean {
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
export async function depositLong(): Promise<void> {
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
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to open long position");
    }
}

/**
 * Withdraw from long position
 */
export async function withdrawLong(): Promise<void> {
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
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to close long position");
    }
}

/**
 * Deposit to short position
 */
export async function depositShort(): Promise<void> {
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
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to open short position");
    }
}

/**
 * Withdraw from short position
 */
export async function withdrawShort(): Promise<void> {
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
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to close short position");
    }
}

/**
 * Update market price
 */
export async function updatePrice(): Promise<void> {
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
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to update price");
    }
}

/**
 * Request faucet
 */
export async function requestFaucet(): Promise<void> {
    if (!transactionPreCheck("Please connect your wallet to use the faucet")) {
        return;
    }

    // Check if wcspr is FaucetableWcsprWasmClient (has faucet method)
    if (!('faucet' in wcspr)) {
        showError("Faucet is only available in competition mode");
        return;
    }

    // Show popup immediately when user clicks the button
    showTransactionPopup("Faucet request");

    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();
    try {
        setGas(DEFAULT_GAS_AMOUNT);
        await wcspr.faucet();
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to request faucet");
    }
}

/**
 * Wrap CSPR to WCSPR (production mode only)
 */
export async function wrapCspr(): Promise<void> {
    if (!transactionPreCheck("Please connect your wallet to wrap CSPR")) {
        return;
    }

    const amount = parseAmount(dom.wrapAmountInput);
    if (!amount) {
        showError("Please enter a valid amount");
        return;
    }

    // Convert U256 to U512 for the payable deposit call
    const amountU512 = amount.toBigInt();
    const attachedValue = new (await import("casper-delta-wasm-client")).U512(amountU512.toString());

    // Show popup immediately when user clicks the button
    showTransactionPopup("Wrap CSPR");

    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();

    try {
        setGas(DEFAULT_GAS_AMOUNT);
        // Check if wcspr is WrappedNativeTokenWasmClient (has deposit method)
        if ('deposit' in wcspr && typeof wcspr.deposit === 'function') {
            await wcspr.deposit(attachedValue);
            dom.wrapAmountInput.value = "";
        } else {
            throw new Error("Wrap functionality not available in this mode");
        }
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to wrap CSPR");
    }
}

/**
 * Unwrap WCSPR to CSPR (production mode only)
 */
export async function unwrapCspr(): Promise<void> {
    if (!transactionPreCheck("Please connect your wallet to unwrap WCSPR")) {
        return;
    }

    const amount = parseAmount(dom.unwrapAmountInput);
    if (!amount) {
        showError("Please enter a valid amount");
        return;
    }

    // Check balance
    if (!balances) {
        showError("Balances not loaded yet. Please refresh.");
        return;
    }

    if (amount.gt(balances.wcspr)) {
        showError(`Insufficient WCSPR balance. You have ${formatNumber(balances.wcspr)} WCSPR.`);
        return;
    }

    // Show popup immediately when user clicks the button
    showTransactionPopup("Unwrap CSPR");

    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();

    try {
        setGas(DEFAULT_GAS_AMOUNT);
        // Check if wcspr is WrappedNativeTokenWasmClient (has withdraw method)
        if ('withdraw' in wcspr && typeof wcspr.withdraw === 'function') {
            await wcspr.withdraw(amount);
            dom.unwrapAmountInput.value = "";
        } else {
            throw new Error("Unwrap functionality not available in this mode");
        }
    } catch (e: any) {
        onTransactionSentFailure(e, "Failed to unwrap CSPR");
    }
}
