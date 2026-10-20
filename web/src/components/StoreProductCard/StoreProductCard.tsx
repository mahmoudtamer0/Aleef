"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag, Star } from "lucide-react";
import { Photo } from "@/components/Photo/Photo";
import { PriceTag } from "@/components/PriceTag/PriceTag";
import { routes } from "@/config/routes";
import { useCart } from "@/hooks/useCart";
import { discountPercent } from "@/lib/format";
import { cx } from "@/lib/utils";
import type { Product } from "@/types";
import styles from "./StoreProductCard.module.css";

export function StoreProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock === 0;
  const percent = discountPercent(product.price, product.originalPrice);

  // show the green check for a moment after adding
  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(id);
  }, [added]);

  function quickAdd() {
    add({ productId: product.id, title: product.name, price: product.price, image: product.image, stock: product.stock ?? 99 }, 1);
    setAdded(true);
  }

  return (
    <article className={styles.card}>
      <Link href={routes.product(product.id)} className={styles.media} aria-label={product.name}>
        <Photo src={product.image} alt={product.name} className={styles.photo} />
        {percent > 0 && <span className={styles.badge}>-{percent}%</span>}
        {soldOut && <span className={styles.soldOut}>OUT OF STOCK</span>}
      </Link>

      <div className={styles.body}>
        {product.categories?.[0] && <span className={styles.category}>{product.categories[0]}</span>}
        <h3 className={styles.title}><Link href={routes.product(product.id)}>{product.name}</Link></h3>
        {product.rating != null && product.ratingsCount ? (
          <span className={styles.rating}>
            <Star aria-hidden size={14} className={styles.star} />
            {product.rating.toFixed(1)}
            <span className={styles.count}>({product.ratingsCount})</span>
          </span>
        ) : null}

        <div className={styles.bottom}>
          <PriceTag price={product.price} originalPrice={product.originalPrice} currency={product.currency} />
          <button type="button" disabled={soldOut} onClick={quickAdd} aria-label={added ? `${product.name} added` : `Add ${product.name} to cart`} className={cx(styles.add, added && styles.added)}>
            {added ? <Check aria-hidden size={20} /> : <ShoppingBag aria-hidden size={20} />}
          </button>
        </div>
      </div>
    </article>
  );
}
