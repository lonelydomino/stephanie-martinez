import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionTokenEdge } from "@/lib/adminSession";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api/admin")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await verifySessionTokenEdge(
    token,
    process.env.ADMIN_PASSWORD,
  );

  if (ok) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
