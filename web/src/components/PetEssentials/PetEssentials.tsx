"use client";

import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Rail } from "@/components/Rail/Rail";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { routes } from "@/config/routes";
import { useRecentProducts } from "@/hooks/useProducts";

export function PetEssentials() {
  const { data, isLoading, isError, refetch } = useRecentProducts();

  return (
    <section className="reveal">
      <SectionHeader title="Pet essentials" href={routes.store} linkLabel="Open store" />
      {isError ? (
        <ErrorState message="We couldn't load products." onRetry={() => refetch()} />
      ) : !isLoading && data?.length === 0 ? (
        <EmptyState message="The store is empty for now." />
      ) : (
        <Rail>
          {isLoading
            ? [0, 1, 2, 3].map((i) => <Skeleton key={i} height={240} radius={24} />)
            : data?.map((product) => <ProductCard key={product.id} product={product} />)}
        </Rail>
      )}
    </section>
  );
}
