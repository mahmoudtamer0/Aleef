import { api, toList } from "./client";
import { endpoints } from "@/config/endpoints";
import { env } from "@/config/env";
import { mockDelay } from "@/lib/mock";
import { mockOrders } from "@/lib/mockAccount";
import type { Order, OrderItem } from "@/types";

// Columns of the `order_items` table: product, title, price, image, quantity, total_price.
const toOrderItem = (raw: any, index: number): OrderItem => ({
  id: String(raw?.id ?? index),
  productId: raw?.product != null ? String(raw.product) : undefined,
  title: raw?.title ?? "",
  price: Number(raw?.price ?? 0),
  image: raw?.image ?? null,
  quantity: Number(raw?.quantity ?? 1),
  total: Number(raw?.total_price ?? raw?.totalPrice ?? Number(raw?.price ?? 0) * Number(raw?.quantity ?? 1)),
});

// Columns of the `orders` table: shipping_address, shipping_city, shipping_phone, "paymentMethod", "subTotal", delivery, "taxPayed", "totalOrder", status, "createdAt".
// TODO: the list may or may not include the items: tell me and I will adjust.
const toOrder = (raw: any): Order => {
  const items: OrderItem[] = (raw?.items ?? raw?.orderItems ?? raw?.order_items ?? []).map(toOrderItem);
  return {
    id: String(raw?.id),
    status: String(raw?.status ?? ""),
    createdAt: new Date(raw?.createdAt ?? raw?.created_at ?? Date.now()).toISOString(),
    subTotal: Number(raw?.subTotal ?? 0),
    delivery: Number(raw?.delivery ?? 0),
    tax: Number(raw?.taxPayed ?? raw?.tax ?? 0),
    total: Number(raw?.totalOrder ?? raw?.total ?? 0),
    paymentMethod: raw?.paymentMethod ?? "",
    shipping: { address: raw?.shipping_address ?? "", city: raw?.shipping_city ?? "", phone: raw?.shipping_phone ?? "" },
    items,
    itemsCount: Number(raw?.itemsCount ?? raw?.items_count ?? items.reduce((s, i) => s + i.quantity, 0)),
  };
};

export async function getMyOrders(): Promise<Order[]> {
  if (env.useMock) return mockDelay(mockOrders, 700);
  const res = await api.get(endpoints.myOrders);
  return toList(res.data, "orders").map(toOrder);
}

export async function getOrder(id: string): Promise<Order> {
  if (env.useMock) {
    const found = mockOrders.find((o) => o.id === id) ?? mockOrders[0];
    return mockDelay({ ...found, id }, 600);
  }
  const res = await api.get(endpoints.order(id));
  const body = res.data?.data ?? res.data;
  const raw = body?.order ?? body;
  return toOrder({ ...raw, items: body?.items ?? raw?.items });
}
