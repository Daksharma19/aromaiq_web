import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Account creation is not available in this deployment." },
    { status: 503 }
  );
}
