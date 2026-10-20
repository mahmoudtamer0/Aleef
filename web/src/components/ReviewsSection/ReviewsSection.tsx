import { EmptyState } from "@/components/EmptyState/EmptyState";
import { RatingStars } from "@/components/RatingStars/RatingStars";
import { ReviewCard } from "@/components/ReviewCard/ReviewCard";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import type { Review } from "@/types";
import styles from "./ReviewsSection.module.css";

type Props = { reviews: Review[]; rating: number; ratingsCount?: number };

// The backend sends the 3 latest reviews, plus the doctor's overall rating.
export function ReviewsSection({ reviews, rating, ratingsCount }: Props) {
  return (
    <section className="rise" style={{ animationDelay: "300ms" }}>
      <SectionHeader title="Latest reviews" />
      {ratingsCount ? (
        <div className={styles.summary}>
          <span className={styles.average}>{rating.toFixed(1)}</span>
          <RatingStars value={rating} size={20} />
          <span className={styles.count}>{ratingsCount} {ratingsCount === 1 ? "review" : "reviews"}</span>
        </div>
      ) : null}

      {reviews.length === 0 ? (
        <EmptyState message="No reviews yet." />
      ) : (
        <div className="row g-4">
          {reviews.map((review) => (
            <div key={review.id} className="col-12 col-md-6 col-xl-4"><ReviewCard review={review} /></div>
          ))}
        </div>
      )}
    </section>
  );
}
