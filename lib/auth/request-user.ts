import { headers } from "next/headers";

export async function getRequestUserId(): Promise<string | null> {
  const h = await headers();
  return h.get("x-user-id");
}

export async function getRequestUserRole(): Promise<string | null> {
  const h = await headers();
  return h.get("x-user-role");
}
