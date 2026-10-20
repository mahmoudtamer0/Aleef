import { Photo } from "@/components/Photo/Photo";
import { cx } from "@/lib/utils";
import type { Pet } from "@/types";
import styles from "./PetCard.module.css";

type Props = { pet: Pet; active: boolean; onSelect: () => void; /** ms to wait before the entrance animation */ delay?: number };

const chipLabel = { ok: "All good", upcoming: "Upcoming", needs_care: "Needs care" } as const;

export function PetCard({ pet, active, onSelect, delay = 0 }: Props) {
  return (
    <button type="button" onClick={onSelect} aria-pressed={active} className={cx(styles.card, active && styles.active)} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.photoWrap}>
        <Photo src={pet.photo} alt={pet.name} glass={!active} className={styles.photo} />
        {active && <span className={styles.dot} />}
      </div>
      <div>
        <b className={styles.name}>{pet.name}</b>
        <span className={styles.meta}>
          {pet.species}
          {pet.ageLabel && ` · ${pet.ageLabel}`}
        </span>
      </div>
      <span className={cx(styles.chip, pet.status === "needs_care" ? styles.chipCare : styles.chipGood)}>{chipLabel[pet.status]}</span>
    </button>
  );
}
