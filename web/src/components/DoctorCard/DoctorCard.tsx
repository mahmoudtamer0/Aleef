import { Star } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Photo } from "@/components/Photo/Photo";
import { routes } from "@/config/routes";
import type { Doctor } from "@/types";
import styles from "./DoctorCard.module.css";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className={styles.card}>
      <Photo src={doctor.photo} alt={doctor.name} className={styles.photo} />
      <h3 className={styles.name}>{doctor.name}</h3>
      <p className={styles.meta}>
        {doctor.specialty}
        {doctor.distanceKm != null && ` · ${doctor.distanceKm} km away`}
      </p>
      <div className={`d-flex justify-content-between align-items-center ${styles.footer}`}>
        <span className={styles.rating}>
          <Star aria-hidden size={16} className={styles.star} />
          {doctor.rating.toFixed(1)}
        </span>
        <Button size="sm" href={routes.doctor(doctor.id)}>Book</Button>
      </div>
    </article>
  );
}
