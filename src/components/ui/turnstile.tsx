"use client";

import { Turnstile as TurnstileWidget, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";
import { useRef, useCallback } from "react";
import { env } from "@/lib/env";

interface TurnstileProps {
    onSuccess: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
}

/**
 * Cloudflare Turnstile captcha component
 * Only renders when NEXT_PUBLIC_TURNSTILE_SITE_KEY is configured
 */
export function Turnstile({ onSuccess, onError, onExpire }: TurnstileProps) {
    const { resolvedTheme } = useTheme();
    const ref = useRef<TurnstileInstance>(null);

    const handleError = useCallback(() => {
        onError?.();
        ref.current?.reset();
    }, [onError]);

    const handleExpire = useCallback(() => {
        onExpire?.();
        ref.current?.reset();
    }, [onExpire]);

    const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    if (!siteKey) {
        return null;
    }

    return (
        <TurnstileWidget
            ref={ref}
            siteKey={siteKey}
            onSuccess={onSuccess}
            onError={handleError}
            onExpire={handleExpire}
            options={{
                theme: resolvedTheme === "dark" ? "dark" : "light",
                size: "flexible",
            }}
        />
    );
}

/**
 * Check if Turnstile is enabled
 */
export function isTurnstileEnabled(): boolean {
    return !!env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
}
