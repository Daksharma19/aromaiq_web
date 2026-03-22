import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { hashPassword } from "@/lib/auth/password";
import { signSessionToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME, sessionCookieBase } from "@/lib/auth/session-cookie";

function publicSignupError(err: { code?: string; message?: string }): string {
  const msg = (err.message ?? "").toLowerCase();
  if (
    err.code === "PGRST205" ||
    err.code === "42P01" ||
    msg.includes("schema cache") ||
    msg.includes("does not exist") ||
    (msg.includes("relation") && msg.includes("users"))
  ) {
    return "Your Supabase project is missing the users table. Open SQL Editor and run your schema migration, then try again.";
  }
  if (process.env.NODE_ENV === "development" && err.message) {
    return err.message;
  }
  return "Could not create account. Confirm NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env, then check the terminal for errors.";
}

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  mobile: z.string().max(32).optional().nullable(),
  /** Omit or null from client; never coerce null → 0 (breaks min(1)). */
  age: z.union([z.null(), z.number().int().min(1).max(120)]).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, mobile, age } = parsed.data;
    const supabase = createServiceClient();

    const passwordHash = await hashPassword(password);

    const { data: inserted, error } = await supabase
      .from("users")
      .insert({
        name,
        email: email.toLowerCase(),
        password: passwordHash,
        mobile: mobile ?? null,
        age: age ?? null,
        role: "user",
      })
      .select("id, name, email, mobile, age, role, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }
      console.error("signup insert error:", error.code, error.message, error);
      return NextResponse.json(
        { error: publicSignupError(error) },
        { status: 500 }
      );
    }

    const token = await signSessionToken({
      userId: inserted.id,
      email: inserted.email,
      role: inserted.role,
    });

    const jar = await cookies();
    jar.set(SESSION_COOKIE_NAME, token, sessionCookieBase());

    return NextResponse.json({ user: inserted });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
