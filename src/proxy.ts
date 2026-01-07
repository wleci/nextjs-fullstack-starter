import { NextRequest, NextResponse } from "next/server";
import { runMiddleware } from "./middleware";

export function proxy(request: NextRequest): NextResponse {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    return runMiddleware(request);
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
