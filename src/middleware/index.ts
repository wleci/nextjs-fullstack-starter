import { NextRequest, NextResponse } from "next/server";
import { handleI18n } from "./i18n";
import { handleAuth } from "./auth";
import { applySecurityHeaders } from "./security";

export async function runMiddleware(request: NextRequest): Promise<NextResponse> {
    // Auth check first (redirects if needed)
    const authResponse = await handleAuth(request);
    if (authResponse) return applySecurityHeaders(authResponse);

    // i18n handling
    const i18nResponse = handleI18n(request);
    if (i18nResponse) return applySecurityHeaders(i18nResponse);

    return applySecurityHeaders(NextResponse.next());
}
