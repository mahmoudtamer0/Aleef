import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink/BackLink";
import { OrderDetails } from "@/components/OrderDetails/OrderDetails";
import { routes } from "@/config/routes";

export const metadata: Metadata = { title: "Order" };

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <>
      <BackLink href={routes.orders} label="Back to my orders" />
      <OrderDetails orderId={orderId} />
    </>
  );
}
