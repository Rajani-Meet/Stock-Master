import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value

  // Public routes that don't need authentication
  const publicRoutes = ["/login", "/signup", "/api/auth/login", "/api/auth/register", "/api/auth/otp-send", "/api/auth/otp-verify"]
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Check for token on protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!login|signup|_next/static|_next/image|favicon.ico|api/auth).*)"],
}

