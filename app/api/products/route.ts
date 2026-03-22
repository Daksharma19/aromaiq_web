import { NextResponse } from "next/server";
import { CATALOG_PRODUCTS } from "@/lib/catalog";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(
    { products: CATALOG_PRODUCTS },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
