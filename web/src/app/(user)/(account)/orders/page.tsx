import type { Metadata } from "next";
import { MyOrders } from "@/components/MyOrders/MyOrders";

export const metadata: Metadata = { title: "My orders" };

export default function OrdersPage() {
  return <MyOrders />;
}
