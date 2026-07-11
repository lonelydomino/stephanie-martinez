export const ADMIN_COOKIE = "sss_admin_session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function signExpiresEdge(
  expires: string,
  secret: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(expires),
  );

  return bytesToHex(signature);
}

export async function verifySessionTokenEdge(
  token: string | undefined,
  secret: string | undefined,
): Promise<boolean> {
  if (!secret || !token) return false;

  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (Date.now() > Number(expires)) return false;

  const expected = await signExpiresEdge(expires, secret);
  return signature === expected;
}

export function createSessionToken(secret: string): string {
  const { createHmac } = require("crypto") as typeof import("crypto");
  const expires = Date.now() + SESSION_MS;
  const signature = createHmac("sha256", secret)
    .update(String(expires))
    .digest("hex");

  return `${expires}.${signature}`;
}

export function verifySessionToken(
  token: string | undefined,
  secret: string | undefined,
): boolean {
  if (!secret || !token) return false;

  const { createHmac, timingSafeEqual } = require("crypto") as typeof import("crypto");
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (Date.now() > Number(expires)) return false;

  const expected = createHmac("sha256", secret)
    .update(expires)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function sessionCookieOptions(token: string) {
  return {
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MS / 1000,
  };
}
