import Link from "next/link";
import { ArrowRight, Clock, PawPrint } from "lucide-react";
import { StatusPill } from "@/components/StatusPill/StatusPill";
import { routes } from "@/config/routes";
import { getStatusInfo } from "@/lib/appointmentStatus";
import { formatDayParts } from "@/lib/date";
import { cx } from "@/lib/utils";
import type { AppointmentListItem } from "@/types";
import styles from "./AppointmentRow.module.css";

export function AppointmentRow({ appointment }: { appointment: AppointmentListItem }) {
  const status = getStatusInfo(appointment.status);
  const { day, month } = formatDayParts(appointment.date);
  const done = status.tone !== "success" && status.tone !== "warning"; // finished / cancelled ones look calmer

  return (
    <Link href={routes.appointment(appointment.id)} className={cx(styles.row, done && styles.muted)}>
      <div aria-hidden className={styles.date}>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>{month}</span>
      </div>
      <div className={styles.info}>
        <div className={styles.doctor}>{appointment.doctorName}</div>
        <div className={styles.meta}>
          <span>{appointment.doctorRole}</span>
          <span className={styles.metaItem}><Clock aria-hidden size={14} /> {appointment.time}</span>
          {appointment.petName && <span className={styles.metaItem}><PawPrint aria-hidden size={14} /> {appointment.petName}</span>}
        </div>
      </div>
      <div className={styles.side}>
        <StatusPill label={status.label} tone={status.tone} />
        <ArrowRight aria-hidden size={20} className={styles.arrow} />
      </div>
    </Link>
  );
}
