import { create } from "zustand";

export type CartItem = {
  /** Server cart line id when synced from Supabase */
  lineId?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type CartState = {
  items: CartItem[];
  setFromServer: (items: CartItem[]) => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  setFromServer: (items) => set({ items }),
  addItem: (item) =>
    set((state) => {
      const quantityToAdd = item.quantity ?? 1;
      const idx = state.items.findIndex((x) => x.productId === item.productId);

      if (idx >= 0) {
        const next = [...state.items];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantityToAdd };
        return { items: next };
      }

      return {
        items: [
          ...state.items,
          {
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: quantityToAdd,
            imageUrl: item.imageUrl,
          },
        ],
      };
    }),
  setQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((x) => x.productId !== productId) };
      }
      return {
        items: state.items.map((x) =>
          x.productId === productId ? { ...x, quantity } : x
        ),
      };
    }),
  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((x) => x.productId !== productId) })),
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));

