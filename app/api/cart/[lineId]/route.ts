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

  const { data: row, error: selectError } = await supabase
    .from("cart_items")
    .select("id")
    .eq("id", lineId)
    .eq("user_id", userId)
    .maybeSingle();

  if (selectError) {
    console.error("[api/cart PATCH select]", selectError);
    return NextResponse.json({ error: "Could not load cart line" }, { status: 500 });
  }

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (parsed.data.quantity <= 0) {
    const { error } = await supabase.from("cart_items").delete().eq("id", lineId);
    if (error) {
      console.error("[api/cart PATCH delete]", error);
      return NextResponse.json({ error: "Could not update cart" }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: parsed.data.quantity })
      .eq("id", lineId);
    if (error) {
      console.error("[api/cart PATCH update]", error);
      return NextResponse.json({ error: "Could not update cart" }, { status: 500 });
    }
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
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", lineId)
    .eq("user_id", userId);

  if (error) {
    console.error("[api/cart DELETE]", error);
    return NextResponse.json({ error: "Could not remove cart item" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
