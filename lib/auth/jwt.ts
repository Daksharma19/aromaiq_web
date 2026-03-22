import { SignJWT, jwtVerify } from "jose";

export type SessionPayload = {
  userId: string;
  email: string;
  role: string;
};

function getSecret(): Uint8Array | null {
  const s = process.env.JWT_SECRET?.trim();
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const secret = getSecret();
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  const secret = getSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const sub = payload.sub;
    if (!sub || typeof payload.email !== "string") return null;
    return {
      userId: sub,
      email: payload.email,
      role: typeof payload.role === "string" ? payload.role : "user",
    };
  } catch {
    return null;
  }
}
