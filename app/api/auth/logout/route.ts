import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, sessionCookieBase } from "@/lib/auth/session-cookie";

export async function POST() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, "", { ...sessionCookieBase(), maxAge: 0 });
  return NextResponse.json({ ok: true });
}
