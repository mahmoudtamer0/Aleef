"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { Photo } from "@/components/Photo/Photo";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { routes } from "@/config/routes";
import { usePets } from "@/hooks/usePets";
import { cx } from "@/lib/utils";
import styles from "./PetPicker.module.css";

type Props = { selectedId: string | null; onSelect: (id: string) => void };

export function PetPicker({ selectedId, onSelect }: Props) {
  const { data: pets = [], isLoading, isError, refetch } = usePets();

  if (isLoading) return <Skeleton height={76} radius={20} />;
  if (isError) return <ErrorState message="We couldn't load your pets." onRetry={() => refetch()} />;
  if (pets.length === 0) {
    return (
      <div className={styles.empty}>
        <span>You need a pet profile before booking.</span>
        <Button href={routes.addPet} size="sm">Add a pet</Button>
      </div>
    );
  }

  return (
    <div role="radiogroup" aria-label="Choose your pet" className={styles.grid}>
      {pets.map((pet) => (
        <button key={pet.id} type="button" role="radio" aria-checked={pet.id === selectedId} onClick={() => onSelect(pet.id)} className={cx(styles.pet, pet.id === selectedId && styles.on)}>
          <Photo src={pet.photo} alt={pet.name} className={styles.photo} />
          <span className={styles.text}>
            <b className={styles.name}>{pet.name}</b>
            <span className={styles.meta}>{[pet.species, pet.ageLabel].filter(Boolean).join(" · ")}</span>
          </span>
          {pet.id === selectedId && <span className={styles.check}><Check aria-hidden size={14} /></span>}
        </button>
      ))}
    </div>
  );
}
