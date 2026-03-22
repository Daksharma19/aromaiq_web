"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { isSupabaseStoragePublicUrl } from "@/lib/is-supabase-storage-url";

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  in_stock: boolean;
  created_at: string;
};

const PRESET_CATEGORIES = [
  "Scents",
  "Diffusers",
  "Kits",
  "Accessories",
  "Limited",
  "Other",
];

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function categorySelectValue(category: string | null) {
  if (!category) return "";
  return PRESET_CATEGORIES.includes(category) ? category : "Other";
}

export default function AdminProductsClient() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categorySelect, setCategorySelect] = useState("Scents");
  const [categoryCustom, setCategoryCustom] = useState("");
  const [inStock, setInStock] = useState(true);
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setProducts(data.products ?? []);
    } catch (e) {
      console.error(e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const resolvedCategory = useMemo(() => {
    if (categorySelect === "Other") return categoryCustom.trim() || null;
    return categorySelect || null;
  }, [categorySelect, categoryCustom]);

  function openCreate() {
    setEditing(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategorySelect("Scents");
    setCategoryCustom("");
    setInStock(true);
    setImageTab("upload");
    setImageUrl("");
    setError(null);
    setDrawerOpen(true);
  }

  function openEdit(p: ProductRow) {
    setEditing(p);
    setName(p.name);
    setDescription(p.description ?? "");
    setPrice(String(p.price));
    const sel = categorySelectValue(p.category);
    setCategorySelect(sel || "Scents");
    setCategoryCustom(
      sel === "Other" && p.category ? p.category : ""
    );
    setInStock(p.in_stock);
    setImageUrl(p.image_url ?? "");
    setImageTab(p.image_url ? "url" : "upload");
    setError(null);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditing(null);
  }

  async function onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setImageUrl(data.publicUrl);
      setImageTab("url");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price: Number(price),
      image_url: imageUrl.trim() || null,
      category: resolvedCategory,
      in_stock: inStock,
    };
    try {
      const url = editing
        ? `/api/admin/products/${editing.id}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      await loadProducts();
      closeDrawer();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStock(p: ProductRow, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ in_stock: !p.in_stock }),
    });
    loadProducts();
  }

  async function onDelete(p: ProductRow) {
    if (!window.confirm(`Delete “${p.name}”?`)) return;
    await fetch(`/api/admin/products/${p.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    loadProducts();
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-3xl font-light italic text-ivory">
          Products
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-[0.1em] text-obsidian transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Product
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-gold/15">
        <table className="w-full min-w-[640px] border-collapse text-left font-body text-sm">
          <thead>
            <tr className="border-b border-gold/15 bg-obsidian-light/40 text-[11px] uppercase tracking-[0.15em] text-ivory-muted">
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-ivory-muted"
                >
                  Loading products…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-ivory-muted"
                >
                  No products yet. Add one to show on the shop.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gold/10 transition hover:bg-gold/5"
                >
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-gold/15 bg-obsidian-mid">
                      {p.image_url ? (
                        isSupabaseStoragePublicUrl(p.image_url) ? (
                          <Image
                            src={p.image_url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image_url}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )
                      ) : (
                        <span className="flex h-full items-center justify-center font-display text-xs text-gold/40">
                          A
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-ivory">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-gold">
                    {formatInr(Number(p.price))}
                  </td>
                  <td className="px-4 py-3 text-ivory-muted">
                    {p.category ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => toggleStock(p, e)}
                      className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider transition ${
                        p.in_stock
                          ? "bg-emerald-500/20 text-emerald-200"
                          : "bg-red-500/15 text-red-200"
                      }`}
                    >
                      {p.in_stock ? "In stock" : "Out"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="mr-2 inline-flex rounded-lg border border-gold/25 p-2 text-ivory-muted transition hover:border-gold/40 hover:text-gold"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(p)}
                      className="inline-flex rounded-lg border border-red-500/30 p-2 text-red-300/90 transition hover:bg-red-500/10"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {drawerOpen ? (
        <>
          <button
            type="button"
            aria-label="Close drawer"
            className="fixed inset-0 z-40 bg-obsidian/70 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-gold/15 bg-shop-surface shadow-2xl dark:bg-obsidian-light/95">
            <div className="flex items-center justify-between border-b border-gold/10 px-5 py-4">
              <h2 className="font-display text-xl text-ivory">
                {editing ? "Edit product" : "Add product"}
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-lg p-2 text-ivory-muted hover:bg-gold/10 hover:text-ivory"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={onSave}
              className="flex flex-1 flex-col overflow-y-auto px-5 py-5"
            >
              {error ? (
                <p className="mb-4 rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </p>
              ) : null}

              <label className="mb-1 text-[11px] uppercase tracking-[0.15em] text-ivory-muted">
                Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4 rounded-lg border border-gold/20 bg-obsidian/40 px-3 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/25"
              />

              <label className="mb-1 text-[11px] uppercase tracking-[0.15em] text-ivory-muted">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="mb-4 min-h-[140px] resize-y rounded-lg border border-gold/20 bg-obsidian/40 px-3 py-2.5 text-sm leading-relaxed text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/25"
              />

              <label className="mb-1 text-[11px] uppercase tracking-[0.15em] text-ivory-muted">
                Price (INR)
              </label>
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mb-4 rounded-lg border border-gold/20 bg-obsidian/40 px-3 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/25"
              />

              <label className="mb-1 text-[11px] uppercase tracking-[0.15em] text-ivory-muted">
                Category
              </label>
              <select
                value={categorySelect}
                onChange={(e) => setCategorySelect(e.target.value)}
                className="mb-2 rounded-lg border border-gold/20 bg-obsidian/40 px-3 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/25"
              >
                {PRESET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {categorySelect === "Other" ? (
                <input
                  value={categoryCustom}
                  onChange={(e) => setCategoryCustom(e.target.value)}
                  placeholder="Custom category"
                  className="mb-4 rounded-lg border border-gold/20 bg-obsidian/40 px-3 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/25"
                />
              ) : (
                <div className="mb-4" />
              )}

              <div className="mb-4 flex items-center justify-between rounded-lg border border-gold/15 px-3 py-3">
                <span className="text-sm text-ivory">In stock</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={inStock}
                  onClick={() => setInStock((v) => !v)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    inStock ? "bg-gold" : "bg-obsidian-mid"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-obsidian transition ${
                      inStock ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <p className="mb-2 text-[11px] uppercase tracking-[0.15em] text-ivory-muted">
                Image
              </p>
              <div className="mb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setImageTab("upload")}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium uppercase tracking-wider ${
                    imageTab === "upload"
                      ? "bg-gold text-obsidian"
                      : "border border-gold/25 text-ivory-muted"
                  }`}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab("url")}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium uppercase tracking-wider ${
                    imageTab === "url"
                      ? "bg-gold text-obsidian"
                      : "border border-gold/25 text-ivory-muted"
                  }`}
                >
                  URL
                </button>
              </div>

              {imageTab === "upload" ? (
                <div className="mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onUploadFile}
                    disabled={uploading}
                    className="w-full text-sm text-ivory-muted file:mr-3 file:rounded-lg file:border-0 file:bg-gold/20 file:px-3 file:py-2 file:text-obsidian"
                  />
                  {uploading ? (
                    <p className="mt-2 text-xs text-ivory-muted">Uploading…</p>
                  ) : null}
                </div>
              ) : (
                <div className="mb-4">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://…"
                    className="w-full rounded-lg border border-gold/20 bg-obsidian/40 px-3 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/25"
                  />
                </div>
              )}

              {imageUrl ? (
                <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg border border-gold/15 bg-obsidian-mid">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="mb-6 flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-gold/20 text-sm text-ivory-muted">
                  No preview
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-auto rounded-lg bg-gold py-3.5 font-body text-sm font-semibold uppercase tracking-[0.1em] text-obsidian transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </form>
          </div>
        </>
      ) : null}
    </div>
  );
}
