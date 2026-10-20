"use client";

import Link from "next/link";
import { CreditCard, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { CartSummary } from "@/components/CartSummary/CartSummary";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { InfoTile } from "@/components/InfoTile/InfoTile";
import { OrderProgress } from "@/components/OrderProgress/OrderProgress";
import { Photo } from "@/components/Photo/Photo";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { StatusPill } from "@/components/StatusPill/StatusPill";
import { routes } from "@/config/routes";
import { useOrder } from "@/hooks/useOrders";
import { formatLongDate } from "@/lib/date";
import { formatMoney, orderNumber } from "@/lib/format";
import { getOrderStatus } from "@/lib/orderStatus";
import styles from "./OrderDetails.module.css";

export function OrderDetails({ orderId }: { orderId: string }) {
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);

  if (isLoading) return <><Skeleton height={60} radius={20} /><Skeleton height={110} radius={24} /><Skeleton height={300} radius={24} /></>;
  if (isError || !order) return <ErrorState message="We couldn't load this order." onRetry={() => refetch()} />;

  const status = getOrderStatus(order.status);

  return (
    <>
      <div className={`rise ${styles.head}`}>
        <div>
          <h1 className={styles.title}>Order {orderNumber(order.id)}</h1>
          <p className={styles.date}>Placed on {formatLongDate(order.createdAt)}</p>
        </div>
        <StatusPill label={status.label} tone={status.tone} />
      </div>

      {status.step >= 0 ? <OrderProgress step={status.step} /> : status.tone === "danger" ? <div className={styles.cancelled}>This order was cancelled.</div> : null}

      <section className="rise row g-4" style={{ animationDelay: "250ms" }}>
        <div className="col-12 col-xl-7">
          <div className={styles.stack}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Items ({order.itemsCount})</h2>
              <div className={styles.items}>
                {order.items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <Photo src={item.image} alt={item.title} className={styles.thumb} />
                    <div className={styles.itemText}>
                      {item.productId ? <Link href={routes.product(item.productId)} className={styles.itemTitle}>{item.title}</Link> : <span className={styles.itemTitle}>{item.title}</span>}
                      <span className={styles.itemMeta}>{item.quantity} × {formatMoney(item.price)}</span>
                    </div>
                    <b className={styles.itemTotal}>{formatMoney(item.total)}</b>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Delivery</h2>
              <div className={styles.tiles}>
                <InfoTile icon={<MapPin size={20} />} label="Address" value={[order.shipping.address, order.shipping.city].filter(Boolean).join(", ") || "—"} />
                <InfoTile icon={<Phone size={20} />} label="Phone" value={order.shipping.phone || "—"} href={order.shipping.phone ? `tel:${order.shipping.phone}` : undefined} />
                <InfoTile icon={<CreditCard size={20} />} label="Payment" value={order.paymentMethod || "—"} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <CartSummary totals={{ subTotal: order.subTotal, delivery: order.delivery, tax: order.tax, total: order.total, taxPercent: "" }} isLoading={false} isError={false} updating={false} onRetry={() => undefined}>
            <Button href={routes.orders} variant="white">Back to my orders</Button>
          </CartSummary>
        </div>
      </section>
    </>
  );
}
