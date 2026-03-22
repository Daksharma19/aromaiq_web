import { NextResponse } from "next/server";
import { CATALOG_PRODUCTS } from "@/lib/catalog";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ products: CATALOG_PRODUCTS });
}

export async function POST() {
  return NextResponse.json(
    { error: "Product management is not available in this deployment." },
    { status: 503 }
  );
}
