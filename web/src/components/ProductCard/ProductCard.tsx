import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo } from "@/components/Photo/Photo";
import { routes } from "@/config/routes";
import type { Product } from "@/types";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={routes.product(product.id)} className={styles.card}>
      <Photo src={product.image} alt={product.name} className={styles.photo} />
      <h3 className={styles.name}>{product.name}</h3>
      <div className={`d-flex justify-content-between align-items-center ${styles.footer}`}>
        <b className={styles.price}>
          {product.currency} {product.price.toLocaleString("en-US")}
        </b>
        <span aria-hidden className={styles.go}>
          <ArrowUpRight size={20} className={styles.goIcon} />
        </span>
      </div>
    </Link>
  );
}
