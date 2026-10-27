import { api, toList, toObject } from "./client";
import { endpoints } from "@/config/endpoints";
import { env } from "@/config/env";
import { mockDelay, mockProducts } from "@/lib/mock";
import { mockCalculate, mockProductDetails, mockProductsPage } from "@/lib/mockStore";
import type { CartTotals, OrderInput, Product, ProductDetailsData } from "@/types";

export type ProductSort = "popular" | "newest" | "price_asc" | "price_desc";
export type ProductsPage = { products: Product[]; page: number; totalPages: number; totalProducts: number };

// Field names come from the backend queries (getProducts / getProduct).
export const toProduct = (raw: any): Product => {
  const price = Number(raw?.finalPrice ?? raw?.price ?? 0) || 0;
  const original = raw?.originalPrice != null ? Number(raw.originalPrice) : undefined;
  return {
    id: String(raw?.id ?? raw?._id),
    name: raw?.title ?? raw?.name ?? "",
    price,
    currency: raw?.currency ?? "EGP",
    image: raw?.thumbnail?.url ?? raw?.image ?? raw?.imageUrl ?? raw?.images?.[0] ?? null,
    originalPrice: original && original > price ? original : undefined,
    description: raw?.description ?? undefined,
    stock: raw?.stock != null ? Number(raw.stock) : undefined,
    sold: raw?.buys != null ? Number(raw.buys) : undefined,
    rating: raw?.averageRate != null ? Number(raw.averageRate) : undefined,
    ratingsCount: raw?.ratingsQuantity != null ? Number(raw.ratingsQuantity) : undefined,
    categories: (raw?.categories ?? []).map((c: any) => c?.name).filter(Boolean),
  };
};

// ---------------- home: newest few ----------------
export async function getRecentProducts(limit = 4): Promise<Product[]> {
  if (env.useMock) return mockDelay(mockProducts.slice(0, limit));
  const res = await api.get(endpoints.products);
  const raw = toList(res.data, "products");
  const byNewest = [...raw].sort((a, b) => +new Date(b?.createdAt ?? 0) - +new Date(a?.createdAt ?? 0));
  return byNewest.map(toProduct).slice(0, limit);
}

// ---------------- store page: ONE page of products (the backend decides the size: 6) ----------------
export async function getProductsPage({ page, search, sort }: { page: number; search?: string; sort?: ProductSort }): Promise<ProductsPage> {
  if (env.useMock) return mockDelay(mockProductsPage({ page, search, sort }), 800);
  const res = await api.get(endpoints.products, { params: { page, search: search || undefined, sort } });
  const body = res.data?.data ?? res.data;
  return {
    products: toList(res.data, "products").map(toProduct),
    page: Number(body?.page ?? page),
    totalPages: Number(body?.totalPages ?? 1),
    totalProducts: Number(body?.totalProducts ?? 0),
  };
}

// ---------------- product page ----------------
export async function getProduct(id: string): Promise<ProductDetailsData> {
  if (env.useMock) return mockDelay(mockProductDetails(id), 700);
  const res = await api.get(endpoints.product(id));
  const raw = toObject(res.data, "product");
  const product = toProduct(raw);
  const images: string[] = (raw?.productImages ?? []).map((i: any) => i?.url).filter(Boolean);
  return { ...product, images: images.length > 0 ? images : product.image ? [product.image] : [] };
}

// ---------------- cart invoice: the backend prices the cart ----------------
export async function calculateCart(cart: { productId: string; quantity: number }[]): Promise<CartTotals> {
  if (env.useMock) return mockDelay(mockCalculate(cart), 500);
  // TODO: adjust the body if your route reads the cart differently.
  const res = await api.post(endpoints.calculateCart, { cart });
  const body = res.data?.data ?? res.data;
  return {
    subTotal: Number(body?.subTotal ?? 0),
    delivery: Number(body?.delivery ?? 0),
    taxPercent: String(body?.taxPercent ?? ""),
    tax: Number(body?.tax ?? 0),
    total: Number(body?.totalCart ?? body?.total ?? 0),
  };
}

// ---------------- place the order; resolves with the order id ----------------
export async function createOrder(input: OrderInput): Promise<string> {
  if (env.useMock) {
    await mockDelay(null, 1100);
    return "26b879d4-0000-4000-8000-000000000000";
  }

  const res = await api.post(endpoints.orders, input);
  const body = res.data?.data ?? res.data;
  return String(body?.orderId ?? body?.order?.id ?? body?.id ?? (typeof body === "string" ? body : ""));
}
