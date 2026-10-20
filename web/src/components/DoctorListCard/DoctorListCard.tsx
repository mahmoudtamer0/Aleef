import { Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Photo } from "@/components/Photo/Photo";
import { routes } from "@/config/routes";
import Link from "next/link";
import type { Doctor } from "@/types";
import styles from "./DoctorListCard.module.css";

export function DoctorListCard({ doctor }: { doctor: Doctor }) {
  const hasDiscount = doctor.fee != null && doctor.originalFee != null && doctor.fee < doctor.originalFee;

  return (
    <Link className={styles.card} href={routes.doctor(doctor.id)}>
      <Photo src={doctor.photo} alt={doctor.name} className={styles.photo} />

      <div className={styles.info}>
        <h3 className={styles.name}>{doctor.name}</h3>
        <p className={styles.meta}>{[doctor.specialty, doctor.city].filter(Boolean).join(" · ")}</p>
        <span className={styles.rating}>
          <Star aria-hidden size={16} className={styles.star} />
          {doctor.rating.toFixed(1)}
          {doctor.ratingsCount != null && <span className={styles.count}>({doctor.ratingsCount})</span>}
        </span>
        {/* only when the user shared their location */}
        {doctor.distanceKm != null && (
          <span className={styles.distance}>
            <MapPin aria-hidden size={13} /> {doctor.distanceKm} km
            {doctor.minutes != null && (
              <>
                <span aria-hidden> · </span>
                <Clock aria-hidden size={13} /> ~{doctor.minutes} min
              </>
            )}
          </span>
        )}
      </div>

      <div className={styles.footer}>
        <div>
          {doctor.fee != null && <b className={styles.price}>EGP {doctor.fee}</b>}
          {hasDiscount && <span className={styles.oldPrice}>{doctor.originalFee}</span>}
        </div>
        <Button size="sm" href={routes.doctor(doctor.id)}>Book</Button>
      </div>
    </Link>
  );
}