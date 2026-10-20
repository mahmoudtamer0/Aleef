"use client";

import { useMemo, useState } from "react";
import { ChevronsDown } from "lucide-react";
import { DoctorListCard } from "@/components/DoctorListCard/DoctorListCard";
import { DoctorToolbar } from "@/components/DoctorToolbar/DoctorToolbar";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { useAvailableDoctors } from "@/hooks/useDoctor";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useUserLocation } from "@/hooks/useUserLocation";
import type { DoctorSort } from "@/lib/api/doctors";
import type { Doctor } from "@/types";
import styles from "./AvailableDoctors.module.css";

const COLS = "col-12 col-md-6 col-xl-4";

function SkeletonCards({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={COLS}><Skeleton height={190} radius={24} /></div>
      ))}
    </>
  );
}

export function AvailableDoctors() {
  // 1) what the user chose
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<DoctorSort | undefined>();
  const { coords, status: locationStatus, request, clear } = useUserLocation();
  const debouncedSearch = useDebounce(search.trim(), 400);

  // 2) the data (page by page)
  const query = useAvailableDoctors({ search: debouncedSearch, sort, coords });
  const doctors = useMemo(() => {
    const all = query.data?.pages.flatMap((page) => page.doctors) ?? [];
    return [...new Map<string, Doctor>(all.map((d) => [d.id, d])).values()];
  }, [query.data]);
  const total = query.data?.pages[0]?.totalDoctors ?? 0;
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } = query;

  // 3) infinite scroll: when the bottom comes into view, load the next page
  const canLoadMore = !!hasNextPage && !isFetchingNextPage && !isFetchNextPageError;
  const sentinel = useInfiniteScroll(fetchNextPage, canLoadMore);

  return (
    <section id="find-doctor" className="rise" style={{ animationDelay: "200ms" }}>
      <SectionHeader title="Find a doctor" />

      <div className={styles.toolbar}>
        <DoctorToolbar
          search={search}
          onSearch={setSearch}
          sort={sort}
          onSort={setSort}
          nearActive={!!coords}
          locationStatus={locationStatus}
          onToggleNear={coords ? clear : request}
        />
      </div>

      {query.isPending ? (
        <div className="row g-4"><SkeletonCards count={6} /></div>
      ) : query.isError ? (
        <ErrorState message="We couldn't load doctors." onRetry={() => query.refetch()} />
      ) : doctors.length === 0 ? (
        <EmptyState message="No doctors match your search." />
      ) : (
        <>
          <p className={styles.count} aria-live="polite">
            {total} {total === 1 ? "doctor" : "doctors"}
            {coords && " · closest first"}
          </p>

          <div className="row g-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className={COLS}><DoctorListCard doctor={doctor} /></div>
            ))}
            {isFetchingNextPage && <SkeletonCards count={3} />}
          </div>

          <div className={styles.bottom}>
            {isFetchNextPageError ? (
              <ErrorState message="We couldn't load more doctors." onRetry={() => fetchNextPage()} />
            ) : isFetchingNextPage ? (
              <span className={styles.loading}>Loading more doctors…</span>
            ) : hasNextPage ? (
              <>
                <div ref={sentinel} className={styles.sentinel} />
                <div className={styles.hint}>
                  <ChevronsDown aria-hidden size={22} className={styles.arrows} />
                  Scroll for more · showing {doctors.length} of {total}
                </div>
                <button type="button" className={styles.more} onClick={() => fetchNextPage()}>Load more</button>
              </>
            ) : (
              <span className={styles.end}>You&apos;ve seen all {total} {total === 1 ? "doctor" : "doctors"}</span>
            )}
          </div>
        </>
      )}
    </section>
  );
}
