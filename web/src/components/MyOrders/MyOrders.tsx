"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { AccountHeader } from "@/components/AccountHeader/AccountHeader";
import { Button } from "@/components/Button/Button";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { OrderCard } from "@/components/OrderCard/OrderCard";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { routes } from "@/config/routes";
import { useOrders } from "@/hooks/useOrders";
import { getOrderStatus } from "@/lib/orderStatus";
import { cx } from "@/lib/utils";
import styles from "./MyOrders.module.css";

type Filter = "all" | "active" | "delivered";
const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "In progress" },
  { value: "delivered", label: "Delivered" },
];

export function MyOrders() {
  const { data: orders, isLoading, isError, refetch } = useOrders();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = (orders ?? []).filter((o) => {
    const tone = getOrderStatus(o.status).tone;
    if (filter === "delivered") return tone === "success";
    if (filter === "active") return tone === "warning" || tone === "info";
    return true;
  });

  return (
    <>
      <AccountHeader title="My orders" subtitle={orders ? `${orders.length} ${orders.length === 1 ? "order" : "orders"} so far` : "Everything you bought from the store."} action={<Button href={routes.store}>Shop more</Button>} />

      {isLoading ? (
        <>
          <Skeleton height={40} radius={20} />
          <Skeleton height={190} radius={24} />
          <Skeleton height={190} radius={24} />
        </>
      ) : isError ? (
        <ErrorState message="We couldn't load your orders." onRetry={() => refetch()} />
      ) : orders && orders.length === 0 ? (
        <div className={`rise ${styles.empty}`}>
          <span className={styles.emptyIcon}><Package aria-hidden size={38} /></span>
          <h2 className={styles.emptyTitle}>No orders yet</h2>
          <p className={styles.emptyText}>Food, toys and care products you order will show up here.</p>
          <Button href={routes.store}>Browse the store</Button>
        </div>
      ) : (
        <>
          <div role="group" aria-label="Filter orders" className={`rise ${styles.chips}`}>
            {filters.map(({ value, label }) => (
              <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={cx(styles.chip, filter === value && styles.chipOn)}>
                {label}
              </button>
            ))}
          </div>
          {visible.length === 0 ? (
            <p className={styles.emptyText}>No orders in this group.</p>
          ) : (
            visible.map((order, i) => (
              <div key={order.id} className="rise" style={{ animationDelay: `${i * 70}ms` }}><OrderCard order={order} /></div>
            ))
          )}
        </>
      )}
    </>
  );
}
