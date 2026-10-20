"use client";

import { ErrorState } from "@/components/ErrorState/ErrorState";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { formatSlot } from "@/lib/date";
import { cx } from "@/lib/utils";
import styles from "./TimeSlots.module.css";

type Props = {
  slots?: string[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  selected: string | null;
  onSelect: (slot: string) => void;
};

export function TimeSlots({ slots, isLoading, isError, onRetry, selected, onSelect }: Props) {
  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} height={44} radius={14} />)}
      </div>
    );
  }
  if (isError) return <ErrorState message="We couldn't load the times." onRetry={onRetry} />;
  if (!slots || slots.length === 0) return <p className={styles.empty}>No free times on this day. Try another day.</p>;

  return (
    <div role="radiogroup" aria-label="Choose a time" className={styles.grid}>
      {slots.map((slot) => (
        <button key={slot} type="button" role="radio" aria-checked={slot === selected} onClick={() => onSelect(slot)} className={cx(styles.slot, slot === selected && styles.on)}>
          {formatSlot(slot)}
        </button>
      ))}
    </div>
  );
}
