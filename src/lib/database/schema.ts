import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Re-export auth schema tables
export {
    user,
    session,
    account,
    verification,
    twoFactor,
} from "@/lib/auth/schema";

export type {
    User,
    NewUser,
    Session,
    Account,
    Verification,
    TwoFactor,
} from "@/lib/auth/schema";

// Re-export blog schema tables
export {
    blogPost,
    blogCategory,
    blogSettings,
} from "@/lib/blog/schema";

export type {
    BlogPost,
    NewBlogPost,
    BlogCategory,
    BlogSettings,
} from "@/lib/blog/schema";

// Re-export feature flags schema
export {
    featureFlags,
} from "@/lib/features/schema";

export type {
    FeatureFlag,
    NewFeatureFlag,
} from "@/lib/features/schema";
