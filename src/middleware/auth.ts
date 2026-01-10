import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/** Routes that require user to be logged OUT */
const GUEST_ONLY_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"];

/** Routes that require user to be logged IN and VERIFIED */
const PROTECTED_ROUTES = ["/dashboard"];

/** Route for email verification - accessible by both logged in (unverified) and guests with pending verification */
const VERIFY_EMAIL_ROUTE = "/auth/verify-email";

/**
 * Check if pathname matches any of the route patterns
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");

    return routes.some((route) => {
        if (route.endsWith("/*")) {
            const base = route.slice(0, -2);
            return pathWithoutLocale.startsWith(base);
        }
        return pathWithoutLocale === route || pathWithoutLocale.startsWith(route + "/");
    });
}

/**
 * Check if pathname is the verify email route
 */
function isVerifyEmailRoute(pathname: string): boolean {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    return pathWithoutLocale === VERIFY_EMAIL_ROUTE || pathWithoutLocale.startsWith(VERIFY_EMAIL_ROUTE + "/");
}

/**
 * Extract locale from pathname
 */
function getLocaleFromPath(pathname: string): string {
    const match = pathname.match(/^\/([a-z]{2})(?=\/|$)/);
    return match?.[1] ?? "en";
}

/**
 * Auth middleware - protects routes based on session state and email verification
 * - Logged out users: can access guest routes and verify-email (for pending verification)
 * - Logged in but NOT verified: can only access verify-email page
 * - Logged in and verified: can access dashboard, cannot access auth pages
 */
export async function handleAuth(request: NextRequest): Promise<NextResponse | null> {
    const { pathname } = request.nextUrl;
    const locale = getLocaleFromPath(pathname);

    const isGuestRoute = matchesRoute(pathname, GUEST_ONLY_ROUTES);
    const isProtectedRoute = matchesRoute(pathname, PROTECTED_ROUTES);
    const isVerifyRoute = isVerifyEmailRoute(pathname);

    // Skip if route doesn't need auth check
    if (!isGuestRoute && !isProtectedRoute && !isVerifyRoute) {
        return null;
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isLoggedIn = !!session;
    const isVerified = session?.user?.emailVerified ?? false;

    // CASE 1: Not logged in
    if (!isLoggedIn) {
        // Can access guest routes and verify-email (for pending verification from login)
        if (isGuestRoute || isVerifyRoute) return null;
        // Cannot access protected routes
        return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
    }

    // CASE 2: Logged in but NOT verified
    if (!isVerified) {
        // Can only access verify-email page
        if (isVerifyRoute) return null;
        // Redirect everything else to verify-email
        return NextResponse.redirect(new URL(`/${locale}/auth/verify-email`, request.url));
    }

    // CASE 3: Logged in and verified
    // Cannot access guest routes or verify-email
    if (isGuestRoute || isVerifyRoute) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    // Can access protected routes
    return null;
}
