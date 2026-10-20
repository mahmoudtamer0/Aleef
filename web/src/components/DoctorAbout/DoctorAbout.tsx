import { MapPin } from "lucide-react";
import type { Doctor } from "@/types";
import styles from "./DoctorAbout.module.css";

export function DoctorAbout({ doctor }: { doctor: Doctor }) {
  return (
    <section className="rise row g-4" style={{ animationDelay: "200ms" }}>
      <div className="col-12 col-lg-8">
        <div className={styles.card}>
          <h2 className={styles.title}>About</h2>
          {doctor.about ? <p className={styles.text}>{doctor.about}</p> : <p className={styles.muted}>This doctor hasn&apos;t added a description yet.</p>}
        </div>
      </div>
      <div className="col-12 col-lg-4">
        <div className={styles.card}>
          <h2 className={styles.title}>Location</h2>
          {doctor.address || doctor.city ? (
            <p className={styles.row}>
              <MapPin aria-hidden size={18} className={styles.icon} />
              {[doctor.address, doctor.city].filter(Boolean).join(", ")}
            </p>
          ) : (
            <p className={styles.muted}>No address provided.</p>
          )}
        </div>
      </div>
    </section>
  );
}
