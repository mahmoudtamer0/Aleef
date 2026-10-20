"use client";

import { BookingForm } from "@/components/BookingForm/BookingForm";
import { DoctorSummary } from "@/components/DoctorSummary/DoctorSummary";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { useDoctorSchedule } from "@/hooks/useDoctor";

// Loads the doctor + available days, then shows the doctor on top and the booking form below.
export function BookAppointment({ doctorId }: { doctorId: string }) {
  const { data, isLoading, isError, refetch } = useDoctorSchedule(doctorId);

  if (isLoading) {
    return (
      <>
        <Skeleton height={116} radius={24} />
        <Skeleton height={420} radius={24} />
      </>
    );
  }
  if (isError || !data) return <ErrorState message="We couldn't load this doctor's schedule." onRetry={() => refetch()} />;

  return (
    <>
      <DoctorSummary doctor={data.doctor} />
      <BookingForm doctorId={doctorId} schedule={data} />
    </>
  );
}
