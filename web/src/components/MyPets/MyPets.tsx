"use client";

import Link from "next/link";
import { PawPrint, Plus } from "lucide-react";
import { AccountHeader } from "@/components/AccountHeader/AccountHeader";
import { Button } from "@/components/Button/Button";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { PetTile } from "@/components/PetTile/PetTile";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { routes } from "@/config/routes";
import { usePets } from "@/hooks/usePets";
import styles from "./MyPets.module.css";

const COLS = "col-12 col-sm-6 col-xl-4";

export function MyPets() {
  const { data: pets, isLoading, isError, refetch } = usePets();

  return (
    <>
      <AccountHeader
        title="My pets"
        subtitle={pets ? `${pets.length} ${pets.length === 1 ? "pet" : "pets"} in your family` : "Everyone in your family"}
        action={<Button href={routes.addPet}><Plus aria-hidden size={18} /> Add a pet</Button>}
      />

      {isLoading ? (
        <div className="row g-4">
          {[0, 1, 2].map((i) => <div key={i} className={COLS}><Skeleton height={360} radius={28} /></div>)}
        </div>
      ) : isError ? (
        <ErrorState message="We couldn't load your pets." onRetry={() => refetch()} />
      ) : pets && pets.length === 0 ? (
        <div className={`rise ${styles.empty}`}>
          <span className={styles.emptyIcon}><PawPrint aria-hidden size={44} /></span>
          <h2 className={styles.emptyTitle}>Add your first pet</h2>
          <p className={styles.emptyText}>Create a profile to book visits, keep records and get vaccine reminders.</p>
          <Button href={routes.addPet}>Add a pet</Button>
        </div>
      ) : (
        <div className="rise row g-4" style={{ animationDelay: "100ms" }}>
          {pets?.map((pet) => <div key={pet.id} className={COLS}><PetTile pet={pet} /></div>)}
          <div className={COLS}>
            <Link href={routes.addPet} className={styles.add}>
              <span className={styles.plus}><Plus aria-hidden size={30} /></span>
              Add another pet
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
