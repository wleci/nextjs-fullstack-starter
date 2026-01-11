import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/database";
import { user } from "@/lib/auth/schema";

function generateNewsletterId(): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const newsletterId = generateNewsletterId();

        await db
            .update(user)
            .set({
                newsletterSubscribed: true,
                newsletterId,
            })
            .where(eq(user.id, userId));

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }
}
