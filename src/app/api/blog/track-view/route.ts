import { NextRequest, NextResponse } from "next/server";
import { trackBlogView } from "@/lib/blog/views";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { postId } = body;

        if (!postId || typeof postId !== "string") {
            return NextResponse.json(
                { error: "Invalid postId" },
                { status: 400 }
            );
        }

        const result = await trackBlogView(postId);

        if (!result.success) {
            return NextResponse.json(
                { error: "Failed to track view" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error tracking view:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
