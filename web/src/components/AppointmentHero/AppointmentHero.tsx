import { Photo } from "@/components/Photo/Photo";
import { getStatusInfo } from "@/lib/appointmentStatus";
import type { Doctor } from "@/types";
import styles from "./AppointmentHero.module.css";

// Teal header: who the appointment is with + its status.
export function AppointmentHero({ doctor, status }: { doctor: Doctor; status: string }) {
  const info = getStatusInfo(status);
  return (
    <section className={`rise ${styles.hero}`} style={{ animationDelay: "100ms" }}>
      <div aria-hidden className={styles.orb} />
      <div className={styles.who}>
        <div className={styles.ring}>
          <Photo src={doctor.photo} alt={doctor.name} glass className={styles.photo} />
        </div>
        <div>
          <h1 className={styles.name}>{doctor.name}</h1>
          <p className={styles.role}>{doctor.specialty}</p>
        </div>
      </div>
      {info.label && (
        <span className={styles.status}>
          <span className={`${styles.dot} ${styles[info.tone]}`} />
          {info.label}
        </span>
      )}
    </section>
  );
}
