import { setGas, U256, Address } from "casper-delta-wasm-client";
import { DEFAULT_GAS_AMOUNT, CONTRACT_ADDRESSES } from "../config.js";
import * as dom from "../dom.js";
import { showError, clearError } from "../ui/modals.js";
import { parseAmountFromNumber } from "../ui/formatters.js";
import { showTransactionPopup, disableTransactionButtons } from "../transactions/monitor.js";
import { onTransactionSentFailure } from "../transactions/handlers.js";
import { transactionPreCheck } from "./operations.js";
import { wcspr } from "../data/state.js";
// ---------- Token Approval ----------
/**
 * Approve market contract to spend WCSPR
 */
export async function approveMarket() {
    if (!transactionPreCheck("Please connect your wallet to approve market")) {
        return;
    }
    // Validate amount before disabling buttons
    let approvalAmount;
    const inputValue = dom.approveAmountInput.value.trim();
    if (inputValue === "") {
        // If no amount specified, approve a very large amount (effectively unlimited)
        // Using 2^128 - 1 as a practically unlimited approval
        approvalAmount = new U256("340282366920938463463374607431768211455"); // 2^128 - 1
    }
    else {
        const parsedAmount = parseFloat(inputValue);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            showError("Please enter a valid amount");
            return;
        }
        approvalAmount = parseAmountFromNumber(parsedAmount);
    }
    // Show popup immediately when user clicks the button
    showTransactionPopup("Market approval");
    // Disable all buttons immediately before wallet interaction
    disableTransactionButtons();
    try {
        // Get the market contract address
        const marketAddress = new Address(CONTRACT_ADDRESSES.market);
        setGas(DEFAULT_GAS_AMOUNT);
        await wcspr.approve(marketAddress, approvalAmount);
        dom.approveAmountInput.value = "";
        clearError(); // Clear any existing errors
    }
    catch (e) {
        onTransactionSentFailure(e, "Failed to approve market");
    }
}
