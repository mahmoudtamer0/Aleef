import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Photo } from "@/components/Photo/Photo";
import { routes } from "@/config/routes";
import type { Doctor } from "@/types";
import styles from "./DoctorProfileHero.module.css";

export function DoctorProfileHero({ doctor }: { doctor: Doctor }) {
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
          <div className={styles.chips}>
            <span className={styles.chip}>
              <Star aria-hidden size={15} fill="currentColor" />
              {doctor.rating.toFixed(1)}
              {doctor.ratingsCount != null && ` (${doctor.ratingsCount})`}
            </span>
            {doctor.city && (
              <span className={styles.chip}>
                <MapPin aria-hidden size={15} /> {doctor.city}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.cta}>
        {doctor.fee != null && (
          <>
            <span className={styles.feeLabel}>CONSULTATION FEE</span>
            <b className={styles.fee}>EGP {doctor.fee}</b>
          </>
        )}
        <Button href={routes.bookDoctor(doctor.id)} variant="white" className={styles.button}>Book appointment →</Button>
      </div>
    </section>
  );
}
