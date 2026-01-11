/**
 * Avatar upload configuration
 */
export const AVATAR_CONFIG = {
    /** Maximum file size in bytes (2MB) */
    maxSize: 2 * 1024 * 1024,
    /** Allowed MIME types */
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"] as const,
    /** Avatar storage directory (relative to public) */
    directory: "avatars",
    /** Default avatar dimensions */
    dimensions: {
        width: 256,
        height: 256,
    },
} as const;

export type AllowedImageType = (typeof AVATAR_CONFIG.allowedTypes)[number];
