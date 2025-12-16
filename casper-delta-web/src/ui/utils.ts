import { EXPLORER_BASE } from "../config.js";

// ---------- UI Utility Functions ----------

/**
 * Lock body scroll (used when modals are open)
 */
export function lockScroll(): void {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
}

/**
 * Unlock body scroll (used when modals close)
 */
export function unlockScroll(): void {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Build explorer transaction URL
 */
export function buildExplorerTxUrl(hash: string): string {
    const normalized = hash.replace(/^0x/i, '');
    return `${EXPLORER_BASE.replace(/\/+$/, "")}/transaction/${normalized}`;
}

/**
 * Format error messages with shortened transaction hashes
 */
export function formatErrorMessageWithShortHashes(message: string): string {
    const escaped = escapeHtml(message);
    const txHashRegex = /(0x)?[a-fA-F0-9]{64}/g;
    return escaped.replace(txHashRegex, (match) => {
        const cleanHash = match.replace(/^0x/i, '');
        const shortened = `${cleanHash.slice(0, 10)}…${cleanHash.slice(-8)}`;
        return `<span class="font-mono break-all">${shortened}</span>`;
    });
}

/**
 * Sanitize numeric input on the fly (for input fields)
 */
export function sanitizeNumericInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    if (sanitized !== input.value) input.value = sanitized;
}
