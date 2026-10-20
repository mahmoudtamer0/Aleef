import type { StatusTone } from "@/lib/appointmentStatus";
import styles from "./StatusPill.module.css";

// A small colored label: "Confirmed", "Delivered", "Cancelled"...
export function StatusPill({ label, tone }: { label: string; tone: StatusTone }) {
  if (!label) return null;
  return (
    <span className={`${styles.pill} ${styles[tone]}`}>
      <span aria-hidden className={styles.dot} />
      {label}
    </span>
  );
}
