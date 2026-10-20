import { api, toList } from "./client";
import { endpoints } from "@/config/endpoints";
import { env } from "@/config/env";
import { mockDelay } from "@/lib/mock";
import { formatAge } from "@/lib/date";
import { createMockPet, deleteMockPet, mockPetList, updateMockPet } from "@/lib/mockAccount";
import type { Pet, PetInput, PetStatus } from "@/types";

// TODO: adjust to your real pet response. This is the only place that knows the backend shape.
const toPet = (raw: any): Pet => {
  const upcoming = Number(raw?.upcomingVaccines ?? raw?.upcoming_vaccines ?? 0);
  const overdue = Number(raw?.overdueVaccines ?? raw?.overdue_vaccines ?? 0);
  const status: PetStatus = overdue > 0 ? "needs_care" : upcoming > 0 ? "upcoming" : "ok";
  const birth = (raw?.birthDate ?? raw?.birth_date ?? raw?.dob)?.toString().slice(0, 10) as string | undefined;
  return {
    id: String(raw?.id ?? raw?._id),
    name: raw?.name ?? "",
    species: raw?.type ?? raw?.species ?? "pet",
    ageLabel: birth ? formatAge(birth) : raw?.age ? String(raw.age) : "",
    photo: raw?.profilePic ?? raw?.photo ?? raw?.imageUrl ?? null,
    status,
    vaccines: { upcoming, overdue },
    recordsCount: Number(raw?.recordsCount ?? raw?.records?.length ?? 0),
    gender: raw?.gender ?? undefined,
    birthDate: birth,
    breed: raw?.breed ?? undefined,
    weight: raw?.weight != null ? Number(raw.weight) : undefined,
  };
};

export async function getPets(): Promise<Pet[]> {
  if (env.useMock) return mockDelay(mockPetList());
  const res = await api.get(endpoints.pets);
  return toList(res.data, "pets").map(toPet);
}

// The add / edit form has a photo, so it travels as multipart form data.
// TODO: adjust the field names to what your backend (multer) expects.
function toPetForm(input: PetInput): FormData {
  const form = new FormData();
  form.append("name", input.name);
  form.append("type", input.type);
  form.append("gender", input.gender);
  form.append("birthDate", input.birthDate);
  if (input.breed) form.append("breed", input.breed);
  if (input.weight) form.append("weight", input.weight);
  if (input.photo) form.append("profilePic", input.photo);
  return form;
}

export async function createPet(input: PetInput): Promise<void> {
  if (env.useMock) {
    await mockDelay(null, 900);
    return createMockPet(input);
  }
  await api.post(endpoints.createPet, toPetForm(input));
}

export async function updatePet(petId: string, input: PetInput): Promise<void> {
  if (env.useMock) {
    await mockDelay(null, 900);
    return updateMockPet(petId, input);
  }
  await api.patch(endpoints.pet(petId), toPetForm(input));
}

export async function deletePet(petId: string): Promise<void> {
  if (env.useMock) {
    await mockDelay(null, 700);
    return deleteMockPet(petId);
  }
  await api.delete(endpoints.pet(petId));
}
