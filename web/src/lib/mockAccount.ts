import type { AppointmentListItem, Order, Pet, PetInput, ProfileInput, User } from "@/types";
import { formatAge, toIsoDate } from "@/lib/date";
import { mockPets, mockUser } from "@/lib/mock";
import { mockCatalog } from "@/lib/mockStore";

// Mock mode only: an in-memory "server" for the user pages, so adding, editing and deleting really change what you see.
const ago = (days: number) => new Date(Date.now() - days * 86_400_000);

// ---------------- pets ----------------
let pets: Pet[] = mockPets.map((p, i) => ({ ...p, gender: i === 0 ? "male" : "female", birthDate: i === 0 ? "2026-01-20" : "2025-10-05", breed: "Persian", weight: i === 0 ? 3.4 : 4.1 }));
let nextPetId = 3;

export const mockPetList = () => pets;

const fromInput = (input: PetInput, base: Partial<Pet> = {}): Pet => ({
  id: base.id ?? `p${nextPetId++}`,
  name: input.name,
  species: input.type,
  ageLabel: formatAge(input.birthDate),
  photo: input.photo ? URL.createObjectURL(input.photo) : (base.photo ?? null),
  status: base.status ?? "ok",
  vaccines: base.vaccines ?? { upcoming: 0, overdue: 0 },
  recordsCount: base.recordsCount ?? 0,
  gender: input.gender,
  birthDate: input.birthDate,
  breed: input.breed || undefined,
  weight: input.weight ? Number(input.weight) : undefined,
});

export const createMockPet = (input: PetInput) => {
  pets = [...pets, fromInput(input)];
};
export const updateMockPet = (id: string, input: PetInput) => {
  pets = pets.map((p) => (p.id === id ? fromInput(input, p) : p));
};
export const deleteMockPet = (id: string) => {
  pets = pets.filter((p) => p.id !== id);
};

// ---------------- profile ----------------
let profile: User = { ...mockUser, phone: "01000000000" };
export const getMockProfile = () => profile;
export const updateMockProfile = (input: ProfileInput): User => {
  profile = { ...profile, name: input.name, phone: input.phone, avatar: input.photo ? URL.createObjectURL(input.photo) : profile.avatar };
  return profile;
};

// ---------------- previous appointments ----------------
const row = (id: string, doctor: string, role: string, pet: string, daysAgo: number, status: string, fee: number): AppointmentListItem => ({
  id,
  doctorName: doctor,
  doctorRole: role,
  doctorPhoto: null,
  petName: pet,
  date: toIsoDate(ago(daysAgo)),
  time: "10:30",
  status,
  fee,
});
export const mockAppointmentHistory: AppointmentListItem[] = [
  row("completed", "Dr. Sara Hassan", "Small animals", "Misho", 12, "completed", 200),
  row("cancelled", "Dr. Omar Fathy", "Surgery", "Mesho", 25, "cancelled-by-owner", 350),
  row("rejected", "Dr. Nour Adel", "Dermatology", "Misho", 41, "rejected", 300),
  row("completed", "Dr. Youssef Karim", "Vaccination", "Mesho", 63, "completed", 150),
];

// ---------------- orders ----------------
const item = (id: string, qty: number) => {
  const p = mockCatalog.find((x) => x.id === id)!;
  return { id: `${id}-${qty}`, productId: id, title: p.name, price: p.price, image: null, quantity: qty, total: p.price * qty };
};
const order = (id: string, status: string, daysAgo: number, items: ReturnType<typeof item>[]): Order => {
  const subTotal = items.reduce((s, i) => s + i.total, 0);
  const tax = Math.floor(subTotal * 0.14);
  return {
    id,
    status,
    createdAt: ago(daysAgo).toISOString(),
    subTotal,
    delivery: 20,
    tax,
    total: subTotal + 20 + tax,
    paymentMethod: "Cash",
    shipping: { address: "5th settlement, Gardenia 1", city: "New Cairo", phone: "01000000000" },
    items,
    itemsCount: items.reduce((s, i) => s + i.quantity, 0),
  };
};
export const mockOrders: Order[] = [
  order("26b879d4-0000-4000-8000-000000000001", "pending", 1, [item("r1", 2), item("r4", 1)]),
  order("9c41e0aa-0000-4000-8000-000000000002", "shipped", 4, [item("r7", 1)]),
  order("a77d12ef-0000-4000-8000-000000000003", "delivered", 19, [item("r5", 3), item("r9", 2), item("r3", 1)]),
  order("0d2f9b11-0000-4000-8000-000000000004", "cancelled", 40, [item("r10", 1)]),
];
