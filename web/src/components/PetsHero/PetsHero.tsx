"use client";

import Link from "next/link";
import { PawPrint } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { PetCard } from "@/components/PetCard/PetCard";
import { PetAlert } from "@/components/PetAlert/PetAlert";
import { HeroPromos } from "@/components/HeroPromos/HeroPromos";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { useGreeting } from "@/hooks/useGreeting";
import { usePets } from "@/hooks/usePets";
import { useSelectedPet } from "@/hooks/usePets";
import styles from "./PetsHero.module.css";

export function PetsHero() {
  const greeting = useGreeting();
  const { user } = useAuth();
  const { data: pets = [], isLoading, isError, refetch } = usePets();
  const selectedId = useSelectedPet((s) => s.id);
  const select = useSelectedPet((s) => s.select);

  const selected = pets.find((p) => p.id === selectedId) ?? pets[0];
  const alerts = pets.filter((p) => p.vaccines.overdue > 0 || p.vaccines.upcoming > 0).slice(0, 2);
  const firstName = user?.name?.split(" ")[0];

  return (
    <section className={`rise ${styles.hero}`} style={{ animationDelay: "100ms" }}>
      {/* background layers: moving gradient, drifting paw prints, floating circles */}
      <div aria-hidden className={styles.bg} />
      <div aria-hidden className={styles.paws}>
        {[0, 1, 2, 3, 4, 5].map((i) => <PawPrint key={i} className={styles.paw} />)}
      </div>
      <div aria-hidden className={`${styles.orb} ${styles.orbTop}`} />
      <div aria-hidden className={`${styles.orb} ${styles.orbBottom}`} />

      {/* left: greeting + pets */}
      <div className={styles.left}>
        <span className={styles.greeting}>{greeting}</span>
        {firstName ? <h1 className={styles.name}>{firstName}</h1> : <Skeleton width={192} height={55} onDark />}
        <p className={styles.subtitle}>Book visits, ask ALEEF, and track your pets&apos; records.</p>

        <div className={`d-flex justify-content-between align-items-baseline ${styles.petsHeader}`}>
          <b className={styles.petsLabel}>YOUR PETS</b>
          <Link href={routes.pets} className={styles.manage}>Manage →</Link>
        </div>

        {isLoading ? (
          <div className={styles.skeletons}>
            {[0, 1, 2].map((i) => <Skeleton key={i} height={170} radius={24} onDark />)}
          </div>
        ) : isError ? (
          <ErrorState message="We couldn't load your pets." onRetry={() => refetch()} />
        ) : pets.length === 0 ? (
          <Link href={routes.addPet} className={styles.firstPet}>
            <span className={styles.plus}>+</span>
            <span>
              <b className={styles.firstPetTitle}>Add your first pet</b>
              <span className={styles.firstPetHint}>Create a profile to track visits and care.</span>
            </span>
          </Link>
        ) : (
          <div className={styles.petsRow}>
            {pets.map((pet, i) => (
              <PetCard key={pet.id} pet={pet} active={pet.id === selected?.id} onSelect={() => select(pet.id)} delay={300 + i * 90} />
            ))}
            <Link href={routes.addPet} className={styles.addTile}>
              <span className={styles.plus}>+</span>
              Add a pet
            </Link>
          </div>
        )}

        <div className={styles.actions}>
          <Button href={routes.doctors} variant="white">Book a visit →</Button>
          <Button href={routes.chats} variant="outlineWhite">Ask ALEEF</Button>
        </div>
      </div>

      {/* right: three cards (alerts first, then static ones) + stats */}
      <div className={styles.right}>
        <div className={styles.cards}>
          {isLoading ? (
            [0, 1, 2].map((i) => <Skeleton key={i} height={144} radius={28} onDark />)
          ) : (
            <>
              {alerts.map((pet) => <PetAlert key={pet.id} pet={pet} />)}
              <HeroPromos count={3 - alerts.length} hasPets={pets.length > 0} />
            </>
          )}
        </div>

        {!isLoading && selected && (
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Vaccines</div>
              <b>{selected.vaccines.overdue > 0 ? `${selected.vaccines.overdue} overdue` : `${selected.vaccines.upcoming} upcoming`}</b>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Records</div>
              <b>{selected.recordsCount} saved</b>
            </div>
            <Link href={routes.doctors} className={`${styles.stat} ${styles.statLink}`}>
              <div className={styles.statLabel}>Next visit</div>
              <b className={styles.accent}>Book now</b>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
