"use client";

import { useRouter } from "next/navigation";
import { AccountHeader } from "@/components/AccountHeader/AccountHeader";
import { BackLink } from "@/components/BackLink/BackLink";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { PetForm } from "@/components/PetForm/PetForm";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { routes } from "@/config/routes";
import { usePet, useUpdatePet } from "@/hooks/usePets";
import { getErrorMessage } from "@/lib/api/client";

export function EditPet({ petId }: { petId: string }) {
  const router = useRouter();
  const { data: pet, isLoading, isError, refetch } = usePet(petId);
  const update = useUpdatePet();

  if (isLoading) return <Skeleton height={420} radius={28} />;
  if (isError) return <ErrorState message="We couldn't load this pet." onRetry={() => refetch()} />;
  if (!pet) return <EmptyState message="We couldn't find this pet." />;

  return (
    <>
      <BackLink href={routes.pet(pet.id)} label={`Back to ${pet.name}`} />
      <AccountHeader title={`Edit ${pet.name}`} subtitle="Update the details and save." />
      <PetForm
        key={pet.id}
        initial={pet}
        submitLabel="Save changes"
        busy={update.isPending}
        error={update.isError ? getErrorMessage(update.error) : undefined}
        onSubmit={(input) => update.mutate({ petId: pet.id, input }, { onSuccess: () => router.replace(routes.pet(pet.id)) })}
      />
    </>
  );
}
