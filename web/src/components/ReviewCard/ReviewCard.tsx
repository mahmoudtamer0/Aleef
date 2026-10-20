import Image from "next/image";
import { RatingStars } from "@/components/RatingStars/RatingStars";
import { formatReviewDate } from "@/lib/date";
import type { Review } from "@/types";
import styles from "./ReviewCard.module.css";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.avatar}>
          {review.userPhoto ? <Image src={review.userPhoto} alt="" fill sizes="44px" className={styles.image} /> : review.userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <b className={styles.name}>{review.userName}</b>
          <span className={styles.date}>{formatReviewDate(review.createdAt)}</span>
        </div>
      </div>
      <RatingStars value={review.rating} />
      {review.comment && <p className={styles.comment}>{review.comment}</p>}
    </article>
  );
}
