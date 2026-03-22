import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(_req: Request, _ctx: Ctx) {
  return NextResponse.json(
    { error: "Product management is not available in this deployment." },
    { status: 503 }
  );
}

export async function DELETE(_req: Request, _ctx: Ctx) {
  return NextResponse.json(
    { error: "Product management is not available in this deployment." },
    { status: 503 }
  );
}
