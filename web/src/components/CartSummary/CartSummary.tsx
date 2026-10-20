"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/Button/Button";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { formatMoney } from "@/lib/format";
import { cx } from "@/lib/utils";
import type { CartTotals } from "@/types";
import styles from "./CartSummary.module.css";

type Props = {
  totals?: CartTotals;
  isLoading: boolean;
  isError: boolean;
  updating: boolean;
  onRetry: () => void;
  header?: ReactNode;
  children: ReactNode; // the buttons
};

// The invoice card. The numbers come from the backend (it knows the real prices, delivery and tax).
export function CartSummary({ totals, isLoading, isError, updating, onRetry, header, children }: Props) {
  return (
    <aside className={styles.card}>
      <div aria-hidden className={styles.orb} />
      <h2 className={styles.title}>Order summary</h2>
      {header && <div className={styles.header}>{header}</div>}

      {totals ? (
        <>
          <div className={cx(styles.rows, updating && styles.updating)}>
            <div className={styles.row}><span className={styles.label}>Subtotal</span><span className={styles.value}>{formatMoney(totals.subTotal)}</span></div>
            <div className={styles.row}><span className={styles.label}>Delivery</span><span className={styles.value}>{formatMoney(totals.delivery)}</span></div>
            <div className={styles.row}><span className={styles.label}>Tax{totals.taxPercent ? ` (${totals.taxPercent})` : ""}</span><span className={styles.value}>{formatMoney(totals.tax)}</span></div>
          </div>
          <div className={cx(styles.total, updating && styles.updating)}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{formatMoney(totals.total)}</span>
          </div>
        </>
      ) : isError ? (
        <div role="alert" className={styles.error}>
          <span>We couldn&apos;t calculate your total. One of the items may no longer be available.</span>
          <Button variant="white" size="sm" onClick={onRetry}>Try again</Button>
        </div>
      ) : isLoading ? (
        <div className={styles.skeletons}>
          <Skeleton height={18} radius={9} onDark />
          <Skeleton height={18} radius={9} onDark />
          <Skeleton height={18} radius={9} onDark />
          <Skeleton height={36} radius={12} onDark />
        </div>
      ) : null}

      <div className={styles.actions}>{children}</div>
    </aside>
  );
}
