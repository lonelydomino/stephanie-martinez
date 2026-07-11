import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  verifySessionToken,
} from "./adminSession";

function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

export function isAdminConfigured(): boolean {
  return Boolean(getAdminPassword());
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  return password === expected;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(
    cookieStore.get(ADMIN_COOKIE)?.value,
    getAdminPassword(),
  );
}

export {
  ADMIN_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "./adminSession";
