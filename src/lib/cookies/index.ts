export const COOKIE_CONSENT_NAME = "cookie-consent";
export const COOKIE_CONSENT_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export type CookieConsent = "all" | "required" | null;

export function getCookieConsent(): CookieConsent {
    if (typeof document === "undefined") return null;

    const match = document.cookie.match(
        new RegExp(`(?:^|; )${COOKIE_CONSENT_NAME}=([^;]*)`)
    );
    const value = match?.[1];

    if (value === "all" || value === "required") {
        return value;
    }
    return null;
}

export function setCookieConsent(consent: "all" | "required"): void {
    document.cookie = `${COOKIE_CONSENT_NAME}=${consent}; path=/; max-age=${COOKIE_CONSENT_MAX_AGE}; SameSite=Lax`;
}

export function hasAnalyticsConsent(): boolean {
    return getCookieConsent() === "all";
}

export function hasRequiredConsent(): boolean {
    const consent = getCookieConsent();
    return consent === "all" || consent === "required";
}
