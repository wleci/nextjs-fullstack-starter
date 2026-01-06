"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { THEME_COOKIE_NAME, DEFAULT_THEME, THEMES } from "./constants";

type Props = Omit<ThemeProviderProps, "attribute" | "storageKey" | "themes" | "defaultTheme">;

/**
 * Syncs theme changes to cookies
 */
function ThemeCookieSync() {
    const { theme, resolvedTheme } = useTheme();

    useEffect(() => {
        const value = theme ?? resolvedTheme ?? DEFAULT_THEME;
        document.cookie = `${THEME_COOKIE_NAME}=${value};path=/;max-age=31536000;SameSite=Lax`;
    }, [theme, resolvedTheme]);

    return null;
}

/**
 * Theme provider wrapper with cookie-based storage
 */
export function ThemeProvider({ children, ...props }: Props) {
    return (
        <NextThemesProvider
            attribute="class"
            storageKey={THEME_COOKIE_NAME}
            defaultTheme={DEFAULT_THEME}
            themes={[...THEMES]}
            enableSystem
            disableTransitionOnChange
            {...props}
        >
            <ThemeCookieSync />
            {children}
        </NextThemesProvider>
    );
}
