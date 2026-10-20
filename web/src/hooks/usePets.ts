import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPet, deletePet, getPets, updatePet } from "@/lib/api/pets";
import { create } from "zustand";
import type { PetInput } from "@/types";

export const usePets = () => useQuery({ queryKey: ["pets"], queryFn: getPets });

// One pet, taken from the same list (no extra request): data is undefined if the id is not one of my pets.
export function usePet(petId: string) {
  const query = usePets();
  return { ...query, data: query.data?.find((p) => p.id === petId) };
}

// After any change the pets list is old: ask for it again (home page, pets page and the booking picker all update).
export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (input: PetInput) => createPet(input), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pets"] }) });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ petId, input }: { petId: string; input: PetInput }) => updatePet(petId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pets"] }),
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (petId: string) => deletePet(petId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pets"] }) });
}


export const useSelectedPet = create<{ id: string | null; select: (id: string) => void }>((set) => ({
  id: null,
  select: (id) => set({ id }),
}));