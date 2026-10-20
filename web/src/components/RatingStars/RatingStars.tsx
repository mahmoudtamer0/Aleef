import { Star } from "lucide-react";
import styles from "./RatingStars.module.css";

// 5 stars, filled up to the rating.
export function RatingStars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span role="img" aria-label={`${value} out of 5`} className={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} aria-hidden size={size} className={i <= Math.round(value) ? styles.on : styles.off} />
      ))}
    </span>
  );
}
