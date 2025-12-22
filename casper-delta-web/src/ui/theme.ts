/**
 * Theme Management for Casper Delta
 * Handles light/dark mode persistence and application
 */

const THEME_KEY = "casper-delta-theme";

export type Theme = "light" | "dark";

/**
 * Initialize theme based on user preference or system settings
 */
export function initTheme(): void {
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const systemTheme: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const themeToApply = savedTheme || systemTheme;
    applyTheme(themeToApply);
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): void {
    const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    const newTheme: Theme = currentTheme === "light" ? "dark" : "light";

    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
}

/**
 * Apply the theme class to the document element
 */
function applyTheme(theme: Theme): void {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}
