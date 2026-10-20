import { Star } from "lucide-react";
import { Photo } from "@/components/Photo/Photo";
import type { Doctor } from "@/types";
import styles from "./DoctorSummary.module.css";

// Compact doctor card shown at the top of the booking page.
export function DoctorSummary({ doctor }: { doctor: Doctor }) {
  return (
    <section className={`rise ${styles.card}`} style={{ animationDelay: "100ms" }}>
      <Photo src={doctor.photo} alt={doctor.name} className={styles.photo} />
      <div className={styles.info}>
        <h2 className={styles.name}>{doctor.name}</h2>
        <p className={styles.meta}>{[doctor.specialty, doctor.city, doctor.address].filter(Boolean).join(" · ")}</p>
        <span className={styles.rating}>
          <Star aria-hidden size={16} fill="currentColor" />
          {doctor.rating.toFixed(1)}
          {doctor.ratingsCount != null && ` (${doctor.ratingsCount})`}
        </span>
      </div>
      {doctor.fee != null && (
        <div className={styles.fee}>
          <span className={styles.feeLabel}>FEE</span>
          <b className={styles.feeValue}>EGP {doctor.fee}</b>
        </div>
      )}
    </section>
  );
}
