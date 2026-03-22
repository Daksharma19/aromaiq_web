import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
  const session = token ? await verifySessionToken(token) : null;

  const requestHeaders = new Headers(request.headers);
  if (session) {
    requestHeaders.set("x-user-id", session.userId);
    requestHeaders.set("x-user-role", session.role);
    requestHeaders.set("x-user-email", session.email);
  }

  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const protectedCartOrOrders =
    pathname === "/api/cart" ||
    pathname.startsWith("/api/cart/") ||
    pathname === "/api/orders" ||
    pathname.startsWith("/api/orders/");

  if (protectedCartOrOrders && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (pathname.startsWith("/api/admin")) {
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/cart",
    "/api/cart/:path*",
    "/api/orders",
    "/api/orders/:path*",
    "/api/admin/:path*",
    /*
     * Attach x-user-* headers for page routes (e.g. future RSC auth checks).
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
