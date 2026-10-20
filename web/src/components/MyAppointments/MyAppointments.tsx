"use client";

import { useState } from "react";
import { AccountHeader } from "@/components/AccountHeader/AccountHeader";
import { AppointmentRow } from "@/components/AppointmentRow/AppointmentRow";
import { Button } from "@/components/Button/Button";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { UpcomingAppointment } from "@/components/UpcomingAppointment/UpcomingAppointment";
import { routes } from "@/config/routes";
import { useMyAppointments } from "@/hooks/useAppointments";
import { getStatusInfo } from "@/lib/appointmentStatus";
import { cx } from "@/lib/utils";
import styles from "./MyAppointments.module.css";

type Filter = "all" | "completed" | "cancelled";
const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function MyAppointments() {
  const { data, isLoading, isError, refetch } = useMyAppointments();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = (data ?? []).filter((a) => {
    const tone = getStatusInfo(a.status).tone;
    if (filter === "completed") return tone === "info";
    if (filter === "cancelled") return tone === "danger" || tone === "neutral";
    return true;
  });

  return (
    <>
      <AccountHeader title="My appointments" subtitle="Your next visit and everything before it." action={<Button href={routes.appointments}>Book a visit</Button>} />

      <UpcomingAppointment />

      <section className="rise" style={{ animationDelay: "200ms" }}>
        <SectionHeader title="Previous appointments" />
        <div role="group" aria-label="Filter appointments" className={styles.chips}>
          {filters.map(({ value, label }) => (
            <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={cx(styles.chip, filter === value && styles.chipOn)}>
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className={styles.list}>{[0, 1, 2].map((i) => <Skeleton key={i} height={104} radius={24} />)}</div>
        ) : isError ? (
          <ErrorState message="We couldn't load your appointments." onRetry={() => refetch()} />
        ) : visible.length === 0 ? (
          <EmptyState message={filter === "all" ? "No previous appointments yet." : "Nothing here."} />
        ) : (
          <div className={styles.list}>
            {visible.map((a) => <AppointmentRow key={a.id} appointment={a} />)}
          </div>
        )}
      </section>
    </>
  );
}
