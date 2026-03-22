import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";

const patchSchema = z.object({
  name: z.string().min(1).max(300).optional(),
  description: z.string().max(5000).optional().nullable(),
  price: z.coerce.number().positive().optional(),
  image_url: z.string().url().optional().nullable().or(z.literal("")),
  category: z.string().max(120).optional().nullable(),
  in_stock: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { ...parsed.data };
  if (updates.image_url === "") updates.image_url = null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not update product" }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const supabase = createServiceClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not delete" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
