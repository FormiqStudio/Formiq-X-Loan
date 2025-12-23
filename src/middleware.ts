import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = {
  admin: ["/admin"],
  dsa: ["/dsa"],
  user: ["/user"],
};

const authRoutes = ["/login", "/register", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      const role = token.role as string;
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
    return NextResponse.next();
  }
  const isProtectedRoute = Object.values(protectedRoutes)
    .flat()
    .some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const userRole = token.role as keyof typeof protectedRoutes;
    const allowedRoutes = protectedRoutes[userRole] || [];

    const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!hasAccess) {
      return NextResponse.redirect(new URL(`/${userRole}`, request.url));
    }
    if (userRole === "dsa" && (!token.isVerified || !token.isActive)) {
      return NextResponse.redirect(
        new URL("/dsa/pending-verification", request.url)
      );
    }
  }
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public fold
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
