export { auth as authMiddleware } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  // Check if the URL path starts with admin or other protected routes
  if (
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/api/admin") ||
    request.nextUrl.pathname.startsWith("/edit-test") ||
    request.nextUrl.pathname.startsWith("/api/edit-test")
  ) {
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
}

// Specify which paths should trigger this middleware
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/edit-test/:path*",
    "/api/edit-test/:path*",
    "/create-test",
  ],
};
