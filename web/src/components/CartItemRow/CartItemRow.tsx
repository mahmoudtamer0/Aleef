"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Photo } from "@/components/Photo/Photo";
import { QuantityStepper } from "@/components/QuantityStepper/QuantityStepper";
import { routes } from "@/config/routes";
import { formatMoney } from "@/lib/format";
import { cx } from "@/lib/utils";
import type { CartItem } from "@/types";
import styles from "./CartItemRow.module.css";

type Props = { item: CartItem; index: number; onQuantity: (quantity: number) => void; onRemove: () => void };

export function CartItemRow({ item, index, onQuantity, onRemove }: Props) {
  const [leaving, setLeaving] = useState(false);

  // slide out first, then remove
  function remove() {
    setLeaving(true);
    setTimeout(onRemove, 260);
  }

  return (
    <article className={cx("rise", styles.row, leaving && styles.leaving)} style={{ animationDelay: `${index * 60}ms` }}>
      <Photo src={item.image} alt={item.title} className={styles.photo} />

      <div className={styles.info}>
        <Link href={routes.product(item.productId)} className={styles.title}>{item.title}</Link>
        <p className={styles.unit}>{formatMoney(item.price)} each</p>
        {item.quantity >= item.stock && item.stock > 0 && <p className={styles.limit}>That&apos;s all we have in stock</p>}
      </div>

      <div className={styles.controls}>
        <QuantityStepper value={item.quantity} onChange={onQuantity} max={item.stock > 0 ? item.stock : 99} label={`Quantity of ${item.title}`} />
        <div className={styles.right}>
          <b className={styles.total}>{formatMoney(item.price * item.quantity)}</b>
          <button type="button" aria-label={`Remove ${item.title}`} onClick={remove} className={styles.remove}>
            <Trash2 aria-hidden size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}
