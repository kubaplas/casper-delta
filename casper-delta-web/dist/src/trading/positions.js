import { U256 } from "casper-delta-wasm-client";
import * as dom from "../dom.js";
import { formatNumber } from "../ui/formatters.js";
import { consolidatedData, setCurrentLongClosePercentage, setCurrentShortClosePercentage, setCurrentLongCloseAmount, setCurrentShortCloseAmount, currentLongClosePercentage, currentShortClosePercentage, } from "../data/state.js";
// ---------- Position Closing Functions ----------
/**
 * Update long close amount based on percentage
 */
export function updateLongCloseAmount(percentage) {
    if (!consolidatedData || !consolidatedData.addressMarketState)
        return;
    setCurrentLongClosePercentage(percentage);
    // Calculate the token amount to withdraw (this is what the contract expects)
    const tokenAmount = consolidatedData.addressMarketState.long_token_balance.mul(U256.fromNumber(percentage)).div(U256.fromNumber(100));
    setCurrentLongCloseAmount(tokenAmount);
    // Calculate the WCSPR value for display (what user will see and enter)
    const wcsprValueToReceive = consolidatedData.addressMarketState.long_position_value.mul(U256.fromNumber(percentage)).div(U256.fromNumber(100));
    // Update UI - show WCSPR value in input (user sees WCSPR, not tokens)
    dom.longCloseAmountInput.value = formatNumber(wcsprValueToReceive);
    dom.longCloseAmountDisplay.textContent = `${formatNumber(consolidatedData.addressMarketState.long_position_value)} WCSPR`;
    dom.longClosePercentage.textContent = `${percentage}%`;
    // Update button states
    updateLongCloseButtons(percentage);
}
/**
 * Update short close amount based on percentage
 */
export function updateShortCloseAmount(percentage) {
    if (!consolidatedData || !consolidatedData.addressMarketState)
        return;
    setCurrentShortClosePercentage(percentage);
    // Calculate the token amount to withdraw (this is what the contract expects)
    const tokenAmount = consolidatedData.addressMarketState.short_token_balance.mul(U256.fromNumber(percentage)).div(U256.fromNumber(100));
    setCurrentShortCloseAmount(tokenAmount);
    // Calculate the WCSPR value for display (what user will see and enter)
    const wcsprValueToReceive = consolidatedData.addressMarketState.short_position_value.mul(U256.fromNumber(percentage)).div(U256.fromNumber(100));
    // Update UI - show WCSPR value in input (user sees WCSPR, not tokens)
    dom.shortCloseAmountInput.value = formatNumber(wcsprValueToReceive);
    dom.shortCloseAmountDisplay.textContent = `${formatNumber(consolidatedData.addressMarketState.short_position_value)} WCSPR`;
    dom.shortClosePercentage.textContent = `${percentage}%`;
    // Update button states
    updateShortCloseButtons(percentage);
}
/**
 * Update button states for long position closing
 */
function updateLongCloseButtons(activePercentage) {
    const buttons = [dom.longClose25Btn, dom.longClose50Btn, dom.longClose75Btn, dom.longClose100Btn];
    const percentages = [25, 50, 75, 100];
    buttons.forEach((btn, index) => {
        if (percentages[index] === activePercentage) {
            btn.classList.add('bg-green-600', 'text-white');
            btn.classList.remove('border-green-300', 'text-green-700', 'hover:bg-green-100');
        }
        else {
            btn.classList.remove('bg-green-600', 'text-white');
            btn.classList.add('border-green-300', 'text-green-700', 'hover:bg-green-100');
        }
    });
}
/**
 * Update button states for short position closing
 */
function updateShortCloseButtons(activePercentage) {
    const buttons = [dom.shortClose25Btn, dom.shortClose50Btn, dom.shortClose75Btn, dom.shortClose100Btn];
    const percentages = [25, 50, 75, 100];
    buttons.forEach((btn, index) => {
        if (percentages[index] === activePercentage) {
            btn.classList.add('bg-red-600', 'text-white');
            btn.classList.remove('border-red-300', 'text-red-700', 'hover:bg-red-100');
        }
        else {
            btn.classList.remove('bg-red-600', 'text-white');
            btn.classList.add('border-red-300', 'text-red-700', 'hover:bg-red-100');
        }
    });
}
/**
 * Reset long close amount
 */
export function resetLongCloseAmount() {
    setCurrentLongClosePercentage(0);
    setCurrentLongCloseAmount(U256.fromNumber(0));
    dom.longCloseAmountInput.value = "";
    dom.longCloseAmountDisplay.textContent = "—";
    dom.longClosePercentage.textContent = "—";
    updateLongCloseButtons(0);
}
/**
 * Reset short close amount
 */
export function resetShortCloseAmount() {
    setCurrentShortClosePercentage(0);
    setCurrentShortCloseAmount(U256.fromNumber(0));
    dom.shortCloseAmountInput.value = "";
    dom.shortCloseAmountDisplay.textContent = "—";
    dom.shortClosePercentage.textContent = "—";
    updateShortCloseButtons(0);
}
/**
 * Handle manual input for long position closing
 */
export function handleLongCloseManualInput() {
    if (!consolidatedData || !consolidatedData.addressMarketState)
        return;
    try {
        const inputValue = dom.longCloseAmountInput.value.trim();
        if (!inputValue || inputValue === "0" || inputValue === "0.0") {
            resetLongCloseAmount();
            return;
        }
        // User enters WCSPR value, we need to convert to token amount
        const wcsprValueEntered = U256.fromHtmlInput(dom.longCloseAmountInput);
        const maxWcsprValue = consolidatedData.addressMarketState.long_position_value;
        const maxTokens = consolidatedData.addressMarketState.long_token_balance;
        // Validate against maximum WCSPR value
        if (wcsprValueEntered.gt(maxWcsprValue)) {
            dom.longCloseAmountInput.value = formatNumber(maxWcsprValue);
            setCurrentLongCloseAmount(maxTokens);
            setCurrentLongClosePercentage(100);
        }
        else {
            // Convert WCSPR value to token amount: tokenAmount = (wcsprValue * maxTokens) / maxWcsprValue
            if (maxWcsprValue.toBigInt() > 0n) {
                setCurrentLongCloseAmount(wcsprValueEntered.mul(maxTokens).div(maxWcsprValue));
                const percentage = Number(wcsprValueEntered.toBigInt() * 100n / maxWcsprValue.toBigInt());
                setCurrentLongClosePercentage(Math.min(100, Math.max(0, percentage)));
            }
            else {
                setCurrentLongCloseAmount(U256.fromNumber(0));
                setCurrentLongClosePercentage(0);
            }
        }
        // Update display - show max WCSPR value
        dom.longCloseAmountDisplay.textContent = `${formatNumber(maxWcsprValue)} WCSPR`;
        dom.longClosePercentage.textContent = currentLongClosePercentage > 0 ? `${currentLongClosePercentage.toFixed(0)}%` : "—";
        updateLongCloseButtons(currentLongClosePercentage);
    }
    catch (e) {
        console.error("Error parsing long close amount:", e);
    }
}
/**
 * Handle manual input for short position closing
 */
export function handleShortCloseManualInput() {
    if (!consolidatedData || !consolidatedData.addressMarketState)
        return;
    try {
        const inputValue = dom.shortCloseAmountInput.value.trim();
        if (!inputValue || inputValue === "0" || inputValue === "0.0") {
            resetShortCloseAmount();
            return;
        }
        // User enters WCSPR value, we need to convert to token amount
        const wcsprValueEntered = U256.fromHtmlInput(dom.shortCloseAmountInput);
        const maxWcsprValue = consolidatedData.addressMarketState.short_position_value;
        const maxTokens = consolidatedData.addressMarketState.short_token_balance;
        // Validate against maximum WCSPR value
        if (wcsprValueEntered.gt(maxWcsprValue)) {
            dom.shortCloseAmountInput.value = formatNumber(maxWcsprValue);
            setCurrentShortCloseAmount(maxTokens);
            setCurrentShortClosePercentage(100);
        }
        else {
            // Convert WCSPR value to token amount: tokenAmount = (wcsprValue * maxTokens) / maxWcsprValue
            if (maxWcsprValue.toBigInt() > 0n) {
                setCurrentShortCloseAmount(wcsprValueEntered.mul(maxTokens).div(maxWcsprValue));
                const percentage = Number(wcsprValueEntered.toBigInt() * 100n / maxWcsprValue.toBigInt());
                setCurrentShortClosePercentage(Math.min(100, Math.max(0, percentage)));
            }
            else {
                setCurrentShortCloseAmount(U256.fromNumber(0));
                setCurrentShortClosePercentage(0);
            }
        }
        // Update display - show max WCSPR value
        dom.shortCloseAmountDisplay.textContent = `${formatNumber(maxWcsprValue)} WCSPR`;
        dom.shortClosePercentage.textContent = currentShortClosePercentage > 0 ? `${currentShortClosePercentage.toFixed(0)}%` : "—";
        updateShortCloseButtons(currentShortClosePercentage);
    }
    catch (e) {
        console.error("Error parsing short close amount:", e);
    }
}
/**
 * Update close buttons availability based on token balances
 */
export function updateCloseButtonsAvailability() {
    if (!consolidatedData || !consolidatedData.addressMarketState)
        return;
    const longTokenBalance = consolidatedData.addressMarketState.long_token_balance;
    const shortTokenBalance = consolidatedData.addressMarketState.short_token_balance;
    // Long position buttons
    const longButtons = [dom.longClose25Btn, dom.longClose50Btn, dom.longClose75Btn, dom.longClose100Btn, dom.withdrawLongBtn];
    const hasLongTokens = longTokenBalance.toBigInt() > 0n;
    longButtons.forEach(btn => {
        if (hasLongTokens) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
            btn.title = '';
        }
        else {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            btn.title = 'No LONG tokens to close';
        }
    });
    // Long close input
    if (hasLongTokens) {
        dom.longCloseAmountInput.disabled = false;
        dom.longCloseAmountInput.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
        dom.longCloseAmountInput.title = '';
    }
    else {
        dom.longCloseAmountInput.disabled = true;
        dom.longCloseAmountInput.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
        dom.longCloseAmountInput.title = 'No LONG tokens to close';
    }
    // Short position buttons
    const shortButtons = [dom.shortClose25Btn, dom.shortClose50Btn, dom.shortClose75Btn, dom.shortClose100Btn, dom.withdrawShortBtn];
    const hasShortTokens = shortTokenBalance.toBigInt() > 0n;
    shortButtons.forEach(btn => {
        if (hasShortTokens) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
            btn.title = '';
        }
        else {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            btn.title = 'No SHORT tokens to close';
        }
    });
    // Short close input
    if (hasShortTokens) {
        dom.shortCloseAmountInput.disabled = false;
        dom.shortCloseAmountInput.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
        dom.shortCloseAmountInput.title = '';
    }
    else {
        dom.shortCloseAmountInput.disabled = true;
        dom.shortCloseAmountInput.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
        dom.shortCloseAmountInput.title = 'No SHORT tokens to close';
    }
}
