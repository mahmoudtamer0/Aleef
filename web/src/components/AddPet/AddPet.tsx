"use client";

import { useRouter } from "next/navigation";
import { AccountHeader } from "@/components/AccountHeader/AccountHeader";
import { BackLink } from "@/components/BackLink/BackLink";
import { PetForm } from "@/components/PetForm/PetForm";
import { routes } from "@/config/routes";
import { useCreatePet } from "@/hooks/usePets";
import { getErrorMessage } from "@/lib/api/client";

export function AddPet() {
  const router = useRouter();
  const create = useCreatePet();

  return (
    <>
      <BackLink href={routes.pets} label="Back to my pets" />
      <AccountHeader title="Add a pet" subtitle="Tell us about your new family member." />
      <PetForm
        submitLabel="Add pet"
        busy={create.isPending}
        error={create.isError ? getErrorMessage(create.error) : undefined}
        onSubmit={(input) => create.mutate(input, { onSuccess: () => router.replace(routes.pets) })}
      />
    </>
  );
}
