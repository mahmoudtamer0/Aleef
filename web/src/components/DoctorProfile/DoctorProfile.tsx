"use client";

import { DoctorAbout } from "@/components/DoctorAbout/DoctorAbout";
import { DoctorProfileHero } from "@/components/DoctorProfileHero/DoctorProfileHero";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { ReviewsSection } from "@/components/ReviewsSection/ReviewsSection";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { useDoctorProfile } from "@/hooks/useDoctor";

// Loads the doctor + reviews, then shows the three parts of the page.
export function DoctorProfile({ doctorId }: { doctorId: string }) {
  const { data, isLoading, isError, refetch } = useDoctorProfile(doctorId);

  if (isLoading) {
    return (
      <>
        <Skeleton height={230} radius={36} />
        <Skeleton height={140} radius={24} />
        <Skeleton height={200} radius={24} />
      </>
    );
  }
  if (isError || !data) return <ErrorState message="We couldn't load this doctor." onRetry={() => refetch()} />;

  return (
    <>
      <DoctorProfileHero doctor={data.doctor} />
      <DoctorAbout doctor={data.doctor} />
      <ReviewsSection reviews={data.reviews} rating={data.doctor.rating} ratingsCount={data.doctor.ratingsCount} />
    </>
  );
}
