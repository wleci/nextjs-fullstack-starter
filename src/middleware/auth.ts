import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/** Routes that require user to be logged OUT */
const GUEST_ONLY_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password"];

/** Routes that require user to be logged IN */
const PROTECTED_ROUTES = ["/dashboard"];

/**
 * Check if pathname matches any of the route patterns
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
    // Remove locale prefix (e.g., /en, /pl)
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
 * Extract locale from pathname
 */
function getLocaleFromPath(pathname: string): string {
    const match = pathname.match(/^\/([a-z]{2})(?=\/|$)/);
    return match?.[1] ?? "en";
}

/**
 * Auth middleware - protects routes based on session state
 * - Logged in users cannot access /auth/* routes
 * - Logged out users cannot access /dashboard/* routes
 */
export async function handleAuth(request: NextRequest): Promise<NextResponse | null> {
    const { pathname } = request.nextUrl;
    const locale = getLocaleFromPath(pathname);

    const isGuestRoute = matchesRoute(pathname, GUEST_ONLY_ROUTES);
    const isProtectedRoute = matchesRoute(pathname, PROTECTED_ROUTES);

    // Skip if route doesn't need auth check
    if (!isGuestRoute && !isProtectedRoute) {
        return null;
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Logged in user trying to access guest-only route (login, register, etc.)
    if (isGuestRoute && session) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    // Logged out user trying to access protected route (dashboard, etc.)
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
    }

    return null;
}
