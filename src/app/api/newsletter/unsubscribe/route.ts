import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/database";
import { user } from "@/lib/auth/schema";

export async function POST(request: Request) {
    try {
        const { newsletterId } = await request.json();

        if (!newsletterId) {
            return NextResponse.json({ error: "Newsletter ID required" }, { status: 400 });
        }

        await db
            .update(user)
            .set({
                newsletterSubscribed: false,
            })
            .where(eq(user.newsletterId, newsletterId));

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
    }
}
