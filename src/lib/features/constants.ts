/**
 * Available feature flags
 */
export const FEATURE_KEYS = {
    REGISTRATION: "registration",
    PASSWORD_RESET: "password_reset",
    SOCIAL_LOGIN: "social_login",
} as const;

export type FeatureKey = (typeof FEATURE_KEYS)[keyof typeof FEATURE_KEYS];
