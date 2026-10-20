"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { CartItemRow } from "@/components/CartItemRow/CartItemRow";
import { CartSummary } from "@/components/CartSummary/CartSummary";
import { CheckoutSteps } from "@/components/CheckoutSteps/CheckoutSteps";
import { routes } from "@/config/routes";
import { useCart } from "@/hooks/useCart";
import { useCartTotals } from "@/hooks/useProducts";
import styles from "./CartView.module.css";

// The cart is read from localStorage; the invoice is calculated by the backend.
export function CartView() {
  const router = useRouter();
  const { items, count, setQuantity, remove, clear } = useCart();
  const totals = useCartTotals(items);

  if (items.length === 0) {
    return (
      <div className={`rise ${styles.empty}`}>
        <span className={styles.emptyIcon}><ShoppingBag aria-hidden size={40} /></span>
        <h1 className={styles.emptyTitle}>Your cart is empty</h1>
        <p className={styles.emptyText}>Add food, toys or care products and they will show up here.</p>
        <Button href={routes.store}>Browse the store</Button>
      </div>
    );
  }

  return (
    <>
      <div className={`rise ${styles.head}`}>
        <div>
          <h1 className={styles.title}>Your cart</h1>
          <p className={styles.subtitle}>{count} {count === 1 ? "item" : "items"}</p>
        </div>
        <CheckoutSteps current={0} />
      </div>

      <div className={styles.layout}>
        <div className={styles.list}>
          {items.map((item, i) => (
            <CartItemRow key={item.productId} item={item} index={i} onQuantity={(q) => setQuantity(item.productId, q)} onRemove={() => remove(item.productId)} />
          ))}
          <button type="button" className={styles.clear} onClick={clear}>Clear cart</button>
        </div>

        <div className={styles.aside}>
          <CartSummary totals={totals.data} isLoading={totals.isLoading} isError={totals.isError} updating={totals.updating} onRetry={() => totals.refetch()}>
            <Button variant="white" disabled={!totals.data || totals.updating} onClick={() => router.push(routes.checkout)}>Proceed to checkout →</Button>
            <Button href={routes.store} variant="outlineWhite">Continue shopping</Button>
          </CartSummary>
        </div>
      </div>
    </>
  );
}
