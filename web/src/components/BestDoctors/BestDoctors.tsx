"use client";

import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { DoctorCard } from "@/components/DoctorCard/DoctorCard";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Rail } from "@/components/Rail/Rail";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { routes } from "@/config/routes";
import { useBestDoctors } from "@/hooks/useDoctor";

export function BestDoctors() {
  const { data, isLoading, isError, refetch } = useBestDoctors();

  return (
    <section className="reveal">
      <SectionHeader title="Best doctors" href={routes.doctors} />
      {isError ? (
        <ErrorState message="We couldn't load doctors." onRetry={() => refetch()} />
      ) : !isLoading && data?.length === 0 ? (
        <EmptyState message="No doctors available yet." />
      ) : (
        <Rail>
          {isLoading
            ? [0, 1, 2, 3].map((i) => <Skeleton key={i} height={256} radius={24} />)
            : data?.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
        </Rail>
      )}
    </section>
  );
}
