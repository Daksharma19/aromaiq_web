import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "./constants";

export function sessionCookieBase() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true as const,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export { SESSION_COOKIE_NAME };
