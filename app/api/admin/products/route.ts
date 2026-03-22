import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const productSchema = z.object({
  name: z.string().min(1).max(300),
  description: z.string().max(5000).optional().nullable(),
  price: z.coerce.number().positive(),
  image_url: z.string().url().optional().nullable().or(z.literal("")),
  category: z.string().max(120).optional().nullable(),
  in_stock: z.boolean().optional().default(true),
});

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, description, price, image_url, category, in_stock } = parsed.data;
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      description: description ?? null,
      price,
      image_url: image_url || null,
      category: category ?? null,
      in_stock,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not create product" }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}
