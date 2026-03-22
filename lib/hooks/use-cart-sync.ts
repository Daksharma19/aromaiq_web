"use client";

import { useCallback } from "react";
import { useCartStore, type CartItem } from "@/lib/cart-store";

type ApiCartLine = {
  lineId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export function useCartSync() {
  const setFromServer = useCartStore((s) => s.setFromServer);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { credentials: "include" });
      if (res.status === 401) {
        setFromServer([]);
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      const items: CartItem[] = (data.items as ApiCartLine[]).map((row) => ({
        lineId: row.lineId,
        productId: row.productId,
        name: row.name,
        price: row.price,
        quantity: row.quantity,
        imageUrl: row.imageUrl,
      }));
      setFromServer(items);
    } catch {
      /* ignore */
    }
  }, [setFromServer]);

  return { refresh };
}
