import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // If the user is already authenticated, keep them off the landing page.
  if (pathname === "/") {
    if (token) {
      const url = req.nextUrl.clone()
      url.pathname = "/play"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Protect /play and /daily – require auth.
  if (pathname.startsWith("/play") || pathname.startsWith("/daily")) {
    if (!token) {
      const url = req.nextUrl.clone()
      url.pathname = "/"
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/play", "/play/:path*", "/daily", "/daily/:path*"],
}