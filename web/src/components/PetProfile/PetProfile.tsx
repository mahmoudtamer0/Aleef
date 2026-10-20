"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, FileText, Pencil, PawPrint, Scale, Syringe, Trash2, VenusAndMars } from "lucide-react";
import { BackLink } from "@/components/BackLink/BackLink";
import { Button } from "@/components/Button/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { InfoTile } from "@/components/InfoTile/InfoTile";
import { Photo } from "@/components/Photo/Photo";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { routes } from "@/config/routes";
import { useDeletePet, usePet } from "@/hooks/usePets";
import { getErrorMessage } from "@/lib/api/client";
import { formatLongDate } from "@/lib/date";
import styles from "./PetProfile.module.css";

const ICON = 20;
const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

export function PetProfile({ petId }: { petId: string }) {
  const router = useRouter();
  const { data: pet, isLoading, isError, refetch } = usePet(petId);
  const remove = useDeletePet();
  const [confirming, setConfirming] = useState(false);

  if (isLoading) return <><Skeleton height={200} radius={36} /><Skeleton height={200} radius={24} /></>;
  if (isError) return <ErrorState message="We couldn't load this pet." onRetry={() => refetch()} />;
  if (!pet) return <EmptyState message="We couldn't find this pet. It may have been removed." />;

  const vaccines = pet.vaccines.overdue > 0 ? `${pet.vaccines.overdue} overdue` : `${pet.vaccines.upcoming} upcoming`;

  return (
    <>
      <BackLink href={routes.pets} label="Back to my pets" />

      <section className={`rise ${styles.hero}`} style={{ animationDelay: "100ms" }}>
        <div aria-hidden className={styles.orb} />
        <div className={styles.who}>
          <div className={styles.ring}><Photo src={pet.photo} alt={pet.name} glass className={styles.photo} /></div>
          <div>
            <h1 className={styles.name}>{pet.name}</h1>
            <p className={styles.meta}>{[pet.species, pet.breed].filter(Boolean).join(" · ")}</p>
            <div className={styles.chips}>
              {pet.ageLabel && <span className={styles.chip}>{pet.ageLabel}</span>}
              {pet.gender && <span className={styles.chip}>{cap(pet.gender)}</span>}
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Button href={routes.editPet(pet.id)} variant="white"><Pencil aria-hidden size={16} /> Edit</Button>
          <Button variant="outlineWhite" onClick={() => { remove.reset(); setConfirming(true); }}><Trash2 aria-hidden size={16} /> Remove</Button>
        </div>
      </section>

      <section className="rise" style={{ animationDelay: "200ms" }}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>About {pet.name}</h2>
          <div className={styles.tiles}>
            <InfoTile icon={<PawPrint size={ICON} />} label="Type" value={cap(pet.species)} />
            <InfoTile icon={<VenusAndMars size={ICON} />} label="Gender" value={cap(pet.gender) || "—"} />
            <InfoTile icon={<CalendarDays size={ICON} />} label="Birth date" value={pet.birthDate ? formatLongDate(pet.birthDate) : "—"} />
            <InfoTile icon={<Scale size={ICON} />} label="Weight" value={pet.weight != null ? `${pet.weight} kg` : "—"} />
            <InfoTile icon={<Syringe size={ICON} />} label="Vaccines" value={vaccines} />
            <InfoTile icon={<FileText size={ICON} />} label="Records" value={`${pet.recordsCount} saved`} />
          </div>
        </div>
      </section>

      <section className="rise" style={{ animationDelay: "300ms" }}>
        <Button href={routes.appointments} variant="outlineGreen">Book a visit for {pet.name} →</Button>
      </section>

      <ConfirmDialog
        open={confirming}
        title={`Remove ${pet.name}?`}
        text={`${pet.name}'s profile and records will be deleted. This can't be undone.`}
        confirmLabel="Remove pet"
        busy={remove.isPending}
        error={remove.isError ? getErrorMessage(remove.error) : undefined}
        onClose={() => setConfirming(false)}
        onConfirm={() => remove.mutate(pet.id, { onSuccess: () => router.replace(routes.pets) })}
      />
    </>
  );
}
