"use client";

import { useMemo, useState } from "react";
import { ChevronsDown } from "lucide-react";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { StoreHero } from "@/components/StoreHero/StoreHero";
import { StoreProductCard } from "@/components/StoreProductCard/StoreProductCard";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useProducts } from "@/hooks/useProducts";
import type { ProductSort } from "@/lib/api/products";
import { cx } from "@/lib/utils";
import type { Product } from "@/types";
import styles from "./StoreProducts.module.css";

const COLS = "col-6 col-lg-4";

const sorts: { value?: ProductSort; label: string }[] = [
  { value: undefined, label: "Featured" },
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

function SkeletonCards({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={COLS}><Skeleton height={380} radius={24} /></div>
      ))}
    </>
  );
}

export function StoreProducts() {
  // 1) what the user chose
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ProductSort | undefined>();
  const debouncedSearch = useDebounce(search.trim(), 400);

  // 2) the data (page by page)
  const query = useProducts({ search: debouncedSearch, sort });
  const products = useMemo(() => {
    const all = query.data?.pages.flatMap((page) => page.products) ?? [];
    return [...new Map<string, Product>(all.map((p) => [p.id, p])).values()]; // never show the same product twice
  }, [query.data]);
  const total = query.data?.pages[0]?.totalProducts ?? 0;
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } = query;

  // 3) infinite scroll: when the bottom comes into view, load the next page
  const canLoadMore = !!hasNextPage && !isFetchingNextPage && !isFetchNextPageError;
  const sentinel = useInfiniteScroll(fetchNextPage, canLoadMore);

  return (
    <>
      <StoreHero search={search} onSearch={setSearch} />

      <section className="rise" style={{ animationDelay: "200ms" }}>
        <div className={styles.bar}>
          <p className={styles.count} aria-live="polite">{query.isSuccess ? `${total} ${total === 1 ? "product" : "products"}` : "\u00A0"}</p>
          <div role="group" aria-label="Sort products" className={styles.chips}>
            {sorts.map(({ value, label }) => (
              <button key={label} type="button" aria-pressed={sort === value} onClick={() => setSort(value)} className={cx(styles.chip, sort === value && styles.chipOn)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {query.isPending ? (
          <div className="row g-4"><SkeletonCards count={6} /></div>
        ) : query.isError ? (
          <ErrorState message="We couldn't load the store." onRetry={() => query.refetch()} />
        ) : products.length === 0 ? (
          <EmptyState message="No products match your search." />
        ) : (
          <>
            <div className="row g-4">
              {products.map((product) => (
                <div key={product.id} className={COLS}><StoreProductCard product={product} /></div>
              ))}
              {isFetchingNextPage && <SkeletonCards count={3} />}
            </div>

            <div className={styles.bottom}>
              {isFetchNextPageError ? (
                <ErrorState message="We couldn't load more products." onRetry={() => fetchNextPage()} />
              ) : isFetchingNextPage ? (
                <span className={styles.loading}>Loading more products…</span>
              ) : hasNextPage ? (
                <>
                  <div ref={sentinel} className={styles.sentinel} />
                  <div className={styles.hint}>
                    <ChevronsDown aria-hidden size={22} className={styles.arrows} />
                    Scroll for more · showing {products.length} of {total}
                  </div>
                  <button type="button" className={styles.more} onClick={() => fetchNextPage()}>Load more</button>
                </>
              ) : (
                <span className={styles.end}>You&apos;ve seen all {total} {total === 1 ? "product" : "products"}</span>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
