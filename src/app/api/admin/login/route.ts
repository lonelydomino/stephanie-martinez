import { NextResponse } from "next/server";
import {
  createSessionToken,
  isAdminConfigured,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin login is not configured yet." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { password?: string };
  const password = body.password?.trim();

  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = createSessionToken(process.env.ADMIN_PASSWORD!);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieOptions(token));
  return response;
}
