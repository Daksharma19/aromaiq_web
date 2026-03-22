import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { getRequestUserId } from "@/lib/auth/request-user";

export async function GET() {
  const userId = await getRequestUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      product_id,
      products (
        id,
        name,
        price,
        image_url
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
  }

  const items =
    data?.map((row) => {
      const rel = row.products as unknown;
      const p = (Array.isArray(rel) ? rel[0] : rel) as {
        id: string;
        name: string;
        price: number | string;
        image_url: string | null;
      } | null;
      if (!p) return null;
      return {
        lineId: row.id,
        productId: p.id,
        name: p.name,
        price: Number(p.price),
        quantity: row.quantity,
        imageUrl: p.image_url ?? undefined,
      };
    }).filter(Boolean) ?? [];

  return NextResponse.json({ items });
}

const postSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).max(99).optional().default(1),
});

export async function POST(req: Request) {
  const userId = await getRequestUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { productId, quantity } = parsed.data;

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Could not update cart" }, { status: 500 });
    }
  } else {
    const { error } = await supabase.from("cart_items").insert({
      user_id: userId,
      product_id: productId,
      quantity,
    });
    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Could not add to cart" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
