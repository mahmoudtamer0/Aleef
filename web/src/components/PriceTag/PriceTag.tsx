import { discountPercent, formatMoney } from "@/lib/format";
import { cx } from "@/lib/utils";
import styles from "./PriceTag.module.css";

type Props = { price: number; originalPrice?: number; currency?: string; size?: "md" | "lg"; showBadge?: boolean };

// The price; when the product is on sale also the old price crossed out (and optionally "-20%").
export function PriceTag({ price, originalPrice, currency = "EGP", size = "md", showBadge = false }: Props) {
  const percent = discountPercent(price, originalPrice);
  return (
    <div className={cx(styles.wrap, size === "lg" && styles.lg)}>
      <b className={styles.price}>{formatMoney(price, currency)}</b>
      {percent > 0 && originalPrice && <s className={styles.old}>{formatMoney(originalPrice, currency)}</s>}
      {percent > 0 && showBadge && <span className={styles.badge}>-{percent}%</span>}
    </div>
  );
}
