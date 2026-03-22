import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/** Supabase-backed catalog must not be statically cached (stale/empty after admin adds rows). */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/products]", error);
      return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
    }

    return NextResponse.json(
      { products: data ?? [] },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
