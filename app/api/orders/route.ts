import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getRequestUserId } from "@/lib/auth/request-user";

export async function GET() {
  const userId = await getRequestUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, total, status, created_at, address_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}
