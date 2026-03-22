import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { getRequestUserId } from "@/lib/auth/request-user";

type Ctx = { params: Promise<{ lineId: string }> };

const patchSchema = z.object({
  quantity: z.coerce.number().int().min(0).max(99),
});

export async function PATCH(req: Request, ctx: Ctx) {
  const userId = await getRequestUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lineId } = await ctx.params;
  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: row } = await supabase
    .from("cart_items")
    .select("id")
    .eq("id", lineId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (parsed.data.quantity <= 0) {
    await supabase.from("cart_items").delete().eq("id", lineId);
  } else {
    await supabase
      .from("cart_items")
      .update({ quantity: parsed.data.quantity })
      .eq("id", lineId);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const userId = await getRequestUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lineId } = await ctx.params;
  const supabase = createServiceClient();
  await supabase
    .from("cart_items")
    .delete()
    .eq("id", lineId)
    .eq("user_id", userId);

  return NextResponse.json({ ok: true });
}
