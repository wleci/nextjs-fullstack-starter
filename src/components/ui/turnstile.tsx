"use client";

import { Turnstile as TurnstileWidget, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";
import { useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import { env } from "@/lib/env";

interface TurnstileProps {
    onSuccess: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
}

export interface TurnstileRef {
    reset: () => void;
}

/**
 * Cloudflare Turnstile captcha component
 * Only renders when captcha is enabled and site key is configured
 */
export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
    function Turnstile({ onSuccess, onError, onExpire }, ref) {
        const { resolvedTheme } = useTheme();
        const widgetRef = useRef<TurnstileInstance>(null);

        useImperativeHandle(ref, () => ({
            reset: () => {
                widgetRef.current?.reset();
            },
        }));

        const handleError = useCallback(() => {
            onError?.();
            widgetRef.current?.reset();
        }, [onError]);

        const handleExpire = useCallback(() => {
            onExpire?.();
            widgetRef.current?.reset();
        }, [onExpire]);

        if (!isTurnstileEnabled()) {
            return null;
        }

        return (
            <TurnstileWidget
                ref={widgetRef}
                siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
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
);

/**
 * Check if Turnstile is enabled via env flag and site key exists
 */
export function isTurnstileEnabled(): boolean {
    return env.NEXT_PUBLIC_ENABLE_CAPTCHA && !!env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
}
