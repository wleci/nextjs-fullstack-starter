import { NextRequest, NextResponse } from "next/server";
import { handleI18n } from "./i18n";
import { applySecurityHeaders } from "./security";

export function runMiddleware(request: NextRequest): NextResponse {
    const i18nResponse = handleI18n(request);
    if (i18nResponse) return applySecurityHeaders(i18nResponse);

    return applySecurityHeaders(NextResponse.next());
}
