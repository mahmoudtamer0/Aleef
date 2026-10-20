import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/Photo/Photo";
import { StatusPill } from "@/components/StatusPill/StatusPill";
import { routes } from "@/config/routes";
import { formatMoney, orderNumber } from "@/lib/format";
import { formatShortDate } from "@/lib/date";
import { getOrderStatus } from "@/lib/orderStatus";
import type { Order } from "@/types";
import styles from "./OrderCard.module.css";

export function OrderCard({ order }: { order: Order }) {
  const status = getOrderStatus(order.status);
  const shown = order.items.slice(0, 4);
  const rest = order.itemsCount - shown.reduce((s, i) => s + i.quantity, 0);

  return (
    <Link href={routes.order(order.id)} className={styles.card}>
      <div className={styles.top}>
        <div>
          <div className={styles.number}>{orderNumber(order.id)}</div>
          <div className={styles.date}>{formatShortDate(order.createdAt)}</div>
        </div>
        <StatusPill label={status.label} tone={status.tone} />
      </div>

      <div className={styles.items}>
        {shown.map((item) => <Photo key={item.id} src={item.image} alt={item.title} className={styles.thumb} />)}
        {rest > 0 && <span className={styles.more}>+{rest}</span>}
        <span className={styles.names}>{shown.map((i) => i.title).join(", ") || `${order.itemsCount} items`}</span>
      </div>

      <div className={styles.bottom}>
        <div>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.total}>{formatMoney(order.total)}</span>
        </div>
        <span className={styles.view}>View details <ArrowRight aria-hidden size={16} /></span>
      </div>
    </Link>
  );
}
