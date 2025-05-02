import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  try {
    // Check if there's a maintenance override cookie
    const overrideCookie = request.cookies.get("maintenance_override");
    if (overrideCookie?.value === "true") {
      return NextResponse.next();
    }

    // Skip maintenance check for API and static routes
    if (
      request.nextUrl.pathname.startsWith("/api") ||
      request.nextUrl.pathname.startsWith("/_next") ||
      request.nextUrl.pathname === "/favicon.ico" ||
      request.nextUrl.pathname === "/manifest.json" ||
      request.nextUrl.pathname === "/robots.txt" ||
      request.nextUrl.pathname.startsWith("/create-test/maintenance") ||
      request.nextUrl.pathname.startsWith("/maintenance") ||
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname === "/" // Allow access to the home page
    ) {
      return NextResponse.next();
    }

    // Check maintenance status from API
    const baseUrl = request.nextUrl.origin;
    const maintenanceResponse = await fetch(`${baseUrl}/api/maintenance`, {
      cache: "no-store",
    });

    if (maintenanceResponse.ok) {
      const { isMaintenanceMode } = await maintenanceResponse.json();

      if (isMaintenanceMode) {
        // Get token with appropriate secret
        const token = await getToken({
          req: request,
          secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
        });

        console.log(
          "Token from middleware:",
          JSON.stringify({
            exists: !!token,
            role: token?.role,
            email: token?.email,
          })
        );

        // If user is admin, let them through
        if (token?.role === "ADMIN") {
          return NextResponse.next();
        }

        // For non-admins, redirect to maintenance page
        const url = new URL("/maintenance", request.url);
        // Preserve the original URL as a query parameter
        url.searchParams.set(
          "returnUrl",
          request.nextUrl.pathname + request.nextUrl.search
        );

        return NextResponse.redirect(url);
      }
    }

    // Check if the URL path starts with admin or other protected routes
    if (
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/api/admin") ||
      request.nextUrl.pathname.startsWith("/edit-test") ||
      request.nextUrl.pathname.startsWith("/api/edit-test") ||
      request.nextUrl.pathname === "/maintenance-control" ||
      request.nextUrl.pathname === "/dashboard"
    ) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
      });

      // If not logged in, redirect to login
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // If logged in but not an admin, redirect to unauthorized
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    // In case of an error, allow the request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, manifest.json, robots.txt (public files)
     */
    "/((?!_next/static|_next/image).*)",
  ],
};
