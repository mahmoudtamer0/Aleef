// Server Component (static).
import { Button } from "@/components/Button/Button";
import { routes } from "@/config/routes";
import styles from "./FreeVisitCard.module.css";

export function FreeVisitCard() {
  return (
    <div className={styles.card}>
      <div className={styles.body}>
        <span className={styles.tag}>Gift coupon</span>
        <b className={styles.title}>Free first visit</b>
        <span>Add your pet to claim it.</span>
      </div>
      <Button href={routes.addPet} variant="cream">Add pet</Button>
    </div>
  );
}
