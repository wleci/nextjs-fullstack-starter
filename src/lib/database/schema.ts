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
