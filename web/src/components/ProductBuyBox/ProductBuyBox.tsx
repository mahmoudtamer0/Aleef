"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { PriceTag } from "@/components/PriceTag/PriceTag";
import { QuantityStepper } from "@/components/QuantityStepper/QuantityStepper";
import { RatingStars } from "@/components/RatingStars/RatingStars";
import { routes } from "@/config/routes";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/format";
import { cx } from "@/lib/utils";
import type { ProductDetailsData } from "@/types";
import styles from "./ProductBuyBox.module.css";

// Title, price, stock, quantity and the Add to cart button.
export function ProductBuyBox({ product }: { product: ProductDetailsData }) {
  const { add, items } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const stock = product.stock ?? 99;
  const inCart = items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const remaining = stock - inCart; // how many more the user can still add
  const quantity = Math.min(qty, Math.max(remaining, 1));
  const soldOut = stock <= 0;
  const allInCart = !soldOut && remaining <= 0;

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(id);
  }, [added]);

  function addToCart() {
    add({ productId: product.id, title: product.name, price: product.price, image: product.image, stock }, quantity);
    setAdded(true);
    setQty(1);
  }

  const stockState = soldOut ? { label: "Out of stock", dot: styles.out } : stock <= 5 ? { label: `Only ${stock} left`, dot: styles.low } : { label: "In stock", dot: styles.inStock };

  return (
    <div className={styles.box}>
      {product.categories?.[0] && <span className={styles.category}>{product.categories[0]}</span>}
      <h1 className={styles.title}>{product.name}</h1>

      <div className={styles.meta}>
        {product.rating != null && product.ratingsCount ? (
          <>
            <RatingStars value={product.rating} />
            <span className={styles.rating}>{product.rating.toFixed(1)}</span>
            <span>({product.ratingsCount} reviews)</span>
          </>
        ) : null}
        {product.sold ? <span>{product.sold} sold</span> : null}
      </div>

      <PriceTag price={product.price} originalPrice={product.originalPrice} currency={product.currency} size="lg" showBadge />

      <span className={styles.stock}>
        <span className={cx(styles.dot, stockState.dot)} />
        {stockState.label}
      </span>

      {!soldOut && (
        <div className={styles.row}>
          <QuantityStepper value={quantity} onChange={setQty} max={Math.max(remaining, 1)} />
          <div className={styles.lineTotal}>
            <span className={styles.lineLabel}>Total</span>
            <span className={styles.lineValue}>{formatMoney(product.price * quantity, product.currency)}</span>
          </div>
        </div>
      )}

      <Button className={cx(styles.add, added && styles.addDone, added && styles.pop)} disabled={soldOut || allInCart} onClick={addToCart}>
        {added ? <Check aria-hidden size={18} /> : <ShoppingBag aria-hidden size={18} />}
        {soldOut ? "Out of stock" : allInCart ? "All available stock is in your cart" : added ? "Added to cart" : "Add to cart"}
      </Button>

      {inCart > 0 && (
        <p className={styles.inCart}>
          {inCart} in your cart · <Link href={routes.cart}>View cart →</Link>
        </p>
      )}
    </div>
  );
}
