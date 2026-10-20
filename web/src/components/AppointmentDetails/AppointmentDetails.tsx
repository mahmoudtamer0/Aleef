"use client";

import { CalendarCheck, CalendarDays, Clock, FileText, MapPin, Phone, Star, Wallet } from "lucide-react";
import { AppointmentHero } from "@/components/AppointmentHero/AppointmentHero";
import { Button } from "@/components/Button/Button";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { InfoTile } from "@/components/InfoTile/InfoTile";
import { Photo } from "@/components/Photo/Photo";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { StatusBanner } from "@/components/StatusBanner/StatusBanner";
import { routes } from "@/config/routes";
import { useAppointmentDetails } from "@/hooks/useAppointments";
import { formatLongDate, formatShortDate } from "@/lib/date";
import styles from "./AppointmentDetails.module.css";

const ICON = 20;

// Loads one appointment, then shows: header, status, visit details, pet, notes, doctor contact.
export function AppointmentDetails({ appointmentId }: { appointmentId: string }) {
  const { data, isLoading, isError, refetch } = useAppointmentDetails(appointmentId);

  if (isLoading) {
    return (
      <>
        <Skeleton height={150} radius={36} />
        <Skeleton height={72} radius={24} />
        <Skeleton height={320} radius={24} />
      </>
    );
  }
  if (isError || !data) return <ErrorState message="We couldn't load this appointment." onRetry={() => refetch()} />;

  const { doctor, pet } = data;

  return (
    <>
      <AppointmentHero doctor={doctor} status={data.status} />
      <StatusBanner appointmentId={data.id} status={data.status} reason={data.rejectionReason ?? data.cancelledReason} chatId={data.chatId} doctorId={doctor.id} />

      <section className="rise row g-4" style={{ animationDelay: "200ms" }}>
        <div className="col-12 col-lg-8">
          <div className={styles.stack}>
            <div className={styles.card}>
              <h2 className={styles.title}>Visit details</h2>
              <div className={styles.tiles}>
                <InfoTile icon={<CalendarDays size={ICON} />} label="Date" value={formatLongDate(data.date)} />
                <InfoTile icon={<Clock size={ICON} />} label="Time" value={data.time} />
                <InfoTile icon={<FileText size={ICON} />} label="Reason" value={data.reason || "—"} />
                {data.fee != null && <InfoTile icon={<Wallet size={ICON} />} label="Fee" value={`EGP ${data.fee}`} />}
                {data.createdAt && <InfoTile icon={<CalendarCheck size={ICON} />} label="Booked on" value={formatShortDate(data.createdAt)} />}
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.title}>Pet</h2>
              <div className={styles.pet}>
                <Photo src={pet.photo} alt={pet.name} className={styles.petPhoto} />
                <div>
                  <b className={styles.petName}>{pet.name}</b>
                  <span className={styles.petMeta}>{[pet.species, pet.gender].filter(Boolean).join(" · ")}</span>
                </div>
              </div>
            </div>

            {data.notes && (
              <div className={styles.card}>
                <h2 className={styles.title}>Your notes</h2>
                <p className={styles.notes}>{data.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className={styles.card}>
            <h2 className={styles.title}>Doctor</h2>
            <div className={styles.doctorTiles}>
              {doctor.phone && <InfoTile icon={<Phone size={ICON} />} label="Phone" value={doctor.phone} href={`tel:${doctor.phone}`} />}
              {(doctor.address || doctor.city) && (
                <InfoTile icon={<MapPin size={ICON} />} label="Address" value={[doctor.address, doctor.city].filter(Boolean).join(", ")} />
              )}
              <InfoTile
                icon={<Star size={ICON} />}
                label="Rating"
                value={`${doctor.rating.toFixed(1)}${doctor.ratingsCount != null ? ` (${doctor.ratingsCount} reviews)` : ""}`}
              />
            </div>
            <Button href={routes.doctor(doctor.id)} variant="outlineGreen" className={styles.button}>View doctor profile</Button>
          </div>
        </div>
      </section>
    </>
  );
}
