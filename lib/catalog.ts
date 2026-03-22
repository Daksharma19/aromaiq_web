/**
 * Static product catalog for frontend-only deployments (no database).
 * Shape matches the former Supabase `products` rows consumed by the shop UI.
 */
export type CatalogProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  in_stock: boolean;
  created_at: string;
};

export const CATALOG_PRODUCTS: CatalogProductRow[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name: "AromaIQ Diffuser",
    description:
      "Room-filling cold mist with a warm, minimal silhouette. Designed to pair with our scent library.",
    price: 4999,
    image_url: "/images/diffuser.png",
    category: "featured, popular",
    in_stock: true,
    created_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name: "Scent Discovery Set",
    description:
      "A curated flight of bestsellers so you can find your signature before you commit to a full bottle.",
    price: 1899,
    image_url: "/images/image1.png",
    category: "save20",
    in_stock: true,
    created_at: "2025-01-02T00:00:00.000Z",
  },
];
