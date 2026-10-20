"use client";

import { ArrowRight, CalendarCheck, CalendarDays, Clock, PawPrint } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { Photo } from "@/components/Photo/Photo";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { routes } from "@/config/routes";
import { useUpcomingAppointment } from "@/hooks/useAppointments";
import { getStatusInfo } from "@/lib/appointmentStatus";
import { cx } from "@/lib/utils";
import styles from "./UpcomingAppointment.module.css";

export function UpcomingAppointment() {
  const { data: appointment, isLoading, isError, refetch } = useUpcomingAppointment();
  const status = getStatusInfo(appointment?.status ?? "");

  if (appointment == null && !isLoading && !isError) {
    return;
  }
  return (
    <section className="rise" style={{ animationDelay: "100ms" }}>
      <SectionHeader title="Upcoming appointment" />

      {isLoading ? (
        <Skeleton height={300} radius={28} />
      ) : isError ? (
        <ErrorState message="We couldn't load your appointment." onRetry={() => refetch()} />
      ) : !appointment ? (
        <div className={styles.empty}>
          <div>
            <b className={styles.emptyTitle}>No upcoming appointments</b>
            <span className={styles.emptyHint}>Find a doctor below and book your pet&apos;s next visit.</span>
          </div>
          <Button href="#find-doctor">Find a doctor</Button>
        </div>
      ) : (
        <article className={styles.card}>
          {/* teal side: the doctor */}
          <div className={styles.head}>
            <div aria-hidden className={styles.shapeCircle} />
            <div aria-hidden className={styles.shapeSquare} />
            <div className={styles.doctor}>
              <div className={styles.ring}>
                <Photo src={appointment.doctorPhoto} alt={appointment.doctorName} glass className={styles.photo} />
              </div>
              <div>
                <h3 className={styles.doctorName}>{appointment.doctorName}</h3>
                <p className={styles.doctorRole}>{appointment.doctorRole}</p>
              </div>
            </div>
            <span className={styles.status}>
              <span className={cx(styles.dot, status.tone === "success" && styles.confirmed, status.tone === "warning" && styles.pending)} />
              {status.label}
            </span>
          </div>

          {/* white side: date, time, pet */}
          <div className={styles.body}>
            <div className={styles.details}>
              <div className={styles.when}>
                <div className={styles.tile}>
                  <span className={styles.tileIcon}><CalendarDays aria-hidden size={22} /></span>
                  <div>
                    <span className={styles.tileLabel}>Date</span>
                    <b className={styles.tileValue}>{appointment.date}</b>
                  </div>
                </div>
                <div className={styles.tile}>
                  <span className={styles.tileIcon}><Clock aria-hidden size={22} /></span>
                  <div>
                    <span className={styles.tileLabel}>Time</span>
                    <b className={styles.tileValue}>{appointment.time}</b>
                  </div>
                </div>
              </div>
              <div className={styles.pet}>
                <span className={styles.petIcon}><PawPrint aria-hidden size={22} /></span>
                <div>
                  <b className={styles.petName}>{appointment.petName}</b>
                  <span className={styles.petHint}>Pet appointment</span>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <span className={styles.footerText}>
                <span className={styles.footerIcon}><CalendarCheck aria-hidden size={20} /></span>
                Visit scheduled for {appointment.petName}
              </span>
              <Button href={routes.appointment(appointment.id)}>Details <ArrowRight aria-hidden size={18} /></Button>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}
