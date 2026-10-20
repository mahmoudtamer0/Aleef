import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/Photo/Photo";
import { routes } from "@/config/routes";
import { cx } from "@/lib/utils";
import type { Pet } from "@/types";
import styles from "./PetTile.module.css";

const chipLabel = { ok: "All good", upcoming: "Vaccine soon", needs_care: "Needs care" } as const;

export function PetTile({ pet }: { pet: Pet }) {
  return (
    <Link href={routes.pet(pet.id)} className={styles.card}>
      <div className={styles.media}>
        <Photo src={pet.photo} alt={pet.name} className={styles.photo} />
        <div aria-hidden className={styles.fade} />
        <span className={cx(styles.chip, pet.status === "needs_care" && styles.chipCare)}>{chipLabel[pet.status]}</span>
      </div>
      <div className={styles.body}>
        <h2 className={styles.name}>{pet.name}</h2>
        <p className={styles.meta}>{[pet.species, pet.breed, pet.ageLabel].filter(Boolean).join(" · ")}</p>
        <span className={styles.more}>View profile <ArrowRight aria-hidden size={16} /></span>
      </div>
    </Link>
  );
}
