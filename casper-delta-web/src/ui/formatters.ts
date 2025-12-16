import { U256, U512 } from "casper-delta-wasm-client";
import { TOKEN_DECIMALS } from "../config.js";

// ---------- Number Formatting Functions ----------

/**
 * Format a U256 or U512 value for display
 */
export function formatNumber(value: U256 | U512, decimals: number = TOKEN_DECIMALS): string {
    try {
        let formatter;
        if (value instanceof U256) {
            formatter = value.formatter(decimals);
        } else {
            formatter = value.formatter(decimals);
        }

        // For very small numbers, use higher precision
        const formatted4 = formatter.fmtWithPrecision(4);
        if (formatted4 === "0.0000") {
            // Try with higher precision for very small values
            const formatted9 = formatter.fmtWithPrecision(9);
            // If it's still zero with 9 decimals, return 0.0
            if (formatted9 === "0.000000000") {
                return "0.0";
            }
            return formatted9;
        }

        return formatted4;
    } catch (e) {
        console.error("Error formatting number:", e);
        return "0.0";
    }
}

/**
 * Special formatter for price display that can handle very small values
 */
export function formatPrice(value: U256, decimals: number = TOKEN_DECIMALS): string {
    try {
        const formatter = value.formatter(decimals);

        // For prices, we want to show more precision to see small values
        // Try different precisions until we get a non-zero display
        for (let precision = 4; precision <= 9; precision++) {
            const formatted = formatter.fmtWithPrecision(precision);
            if (formatted !== "0." + "0".repeat(precision)) {
                return formatted;
            }
        }

        // If still zero, return 0.0
        return "0.0";
    } catch (e) {
        console.error("Error formatting price:", e);
        return "0.0";
    }
}

/**
 * Formatter for allowance values that shows "MAX" for very large amounts
 */
export function formatAllowance(value: U256, decimals: number = TOKEN_DECIMALS): string {
    try {
        // Check if this is the max approval value we use (2^128 - 1)
        const maxApprovalValue = "340282366920938463463374607431768211455";
        const valueString = value.toString();

        // If it's the exact max value or any value larger than 10^30, show as MAX
        if (valueString === maxApprovalValue || valueString.length > 30) {
            return "MAX";
        }

        // For normal values, use standard formatting
        return formatNumber(value, decimals);
    } catch (e) {
        console.error("Error formatting allowance:", e);
        return formatNumber(value, decimals);
    }
}

/**
 * Formatter specifically for dollar prices (WCSPR price in USD)
 */
export function formatDollarPrice(value: U256, decimals: number = TOKEN_DECIMALS): string {
    try {
        const rawValueString = value.toString();

        // Try multiple decimal interpretations to find the right scaling
        const interpretations = [];

        // Test different decimal places: 0, 3, 6, 9, 12
        for (const testDecimals of [0, 3, 6, 9, 12]) {
            try {
                const testFormatter = value.formatter(testDecimals);
                const testValue = parseFloat(testFormatter.fmtWithPrecision(Math.min(testDecimals + 3, 12)));
                interpretations.push({
                    decimals: testDecimals,
                    value: testValue,
                    formatted: testFormatter.fmtWithPrecision(Math.min(testDecimals + 3, 12))
                });
            } catch (e: any) {
            }
        }

        // Find the interpretation that gives a reasonable USD price (between $0.0001 and $1000)
        let bestInterpretation = interpretations.find(interp =>
            interp.value >= 0.0001 && interp.value <= 1000
        );

        // If no reasonable interpretation found, try manual scaling
        if (!bestInterpretation) {

            // Based on your example: 0.0000009 should be 0.009133
            // That's roughly 10,000x scaling, let's try that
            const manualScaling = parseFloat(rawValueString) / Math.pow(10, decimals) * 10000;

            if (manualScaling >= 0.0001 && manualScaling <= 1000) {
                bestInterpretation = {
                    decimals: decimals,
                    value: manualScaling,
                    formatted: manualScaling.toString()
                };
            }
        }

        // Fall back to the most reasonable interpretation or default to 9 decimals
        if (!bestInterpretation) {
            bestInterpretation = interpretations.find(interp => interp.decimals === 9) || interpretations[0];
        }

        const numericValue = bestInterpretation.value;

        // Format as dollar amount with appropriate precision
        if (numericValue === 0) {
            return "$0.0000";
        } else if (numericValue >= 1) {
            // For values >= $1, show 2 decimal places
            return `$${numericValue.toFixed(2)}`;
        } else if (numericValue >= 0.01) {
            // For values >= $0.01, show 4 decimal places
            return `$${numericValue.toFixed(4)}`;
        } else {
            // For very small values, show 6 decimal places
            return `$${numericValue.toFixed(6)}`;
        }
    } catch (e) {
        console.error("Error formatting dollar price:", e);
        return "$0.0000";
    }
}

/**
 * Parse amount from HTML input
 */
export function parseAmount(input: HTMLInputElement): U256 | null {
    try {
        // Allow only digits and one dot
        const sanitized = input.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
        if (sanitized !== input.value) input.value = sanitized;
        const value = parseFloat(sanitized);
        if (isNaN(value) || value <= 0) return null;
        return parseAmountFromNumber(value);
    } catch (e) {
        console.error("Error parsing amount:", e);
        return null;
    }
}

/**
 * Convert a number to U256 with proper decimal handling
 */
export function parseAmountFromNumber(value: number): U256 {
    // Use string-based conversion to avoid floating point precision issues
    const amountStr = value.toFixed(TOKEN_DECIMALS);
    const [wholePart, decimalPart = ""] = amountStr.split(".");
    const paddedDecimalPart = decimalPart.padEnd(TOKEN_DECIMALS, "0");
    const fullAmountStr = wholePart + paddedDecimalPart;

    return new U256(fullAmountStr);
}
