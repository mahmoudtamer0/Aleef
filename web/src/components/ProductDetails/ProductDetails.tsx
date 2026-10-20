"use client";

import { ErrorState } from "@/components/ErrorState/ErrorState";
import { ProductBuyBox } from "@/components/ProductBuyBox/ProductBuyBox";
import { ProductGallery } from "@/components/ProductGallery/ProductGallery";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { useProduct } from "@/hooks/useProducts";
import styles from "./ProductDetails.module.css";

// Loads one product, then shows: photos | buy box, and the description below.
export function ProductDetails({ productId }: { productId: string }) {
  const { data, isLoading, isError, refetch } = useProduct(productId);

  if (isLoading) {
    return (
      <div className={styles.layout}>
        <Skeleton height={520} radius={28} />
        <Skeleton height={520} radius={28} />
      </div>
    );
  }
  if (isError || !data) return <ErrorState message="We couldn't load this product." onRetry={() => refetch()} />;

  return (
    <>
      <section className={`rise ${styles.layout}`} style={{ animationDelay: "100ms" }}>
        <ProductGallery images={data.images} alt={data.name} />
        <div className={styles.sticky}>
          <ProductBuyBox product={data} />
        </div>
      </section>

      {data.description && (
        <section className="rise" style={{ animationDelay: "200ms" }}>
          <SectionHeader title="About this product" />
          <div className={styles.about}>{data.description}</div>
        </section>
      )}
    </>
  );
}
