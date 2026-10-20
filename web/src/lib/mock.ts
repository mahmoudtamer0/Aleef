import type { Appointment, Doctor, Pet, Product, Review, User } from "@/types";

// Mock mode only (NEXT_PUBLIC_USE_MOCK=true). The delay lets you see the loading skeletons.
export const mockDelay = <T,>(value: T, ms = 700) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export const mockUser: User = { id: "1", name: "Mohamed Mahmoud", email: "demo@aleef.app" };

export const mockPets: Pet[] = [
  { id: "p1", name: "Misho", species: "cat", ageLabel: "9 months", photo: null, status: "upcoming", vaccines: { upcoming: 1, overdue: 0 }, recordsCount: 1 },
  { id: "p2", name: "Mesho", species: "cat", ageLabel: "12 months", photo: null, status: "needs_care", vaccines: { upcoming: 0, overdue: 1 }, recordsCount: 1 },
];

export const mockDoctors: Doctor[] = [
  { id: "d1", name: "Dr. Sara Hassan", specialty: "Small animals", city: "Cairo", rating: 5, ratingsCount: 128, fee: 200, originalFee: 250, photo: null },
  { id: "d2", name: "Dr. Omar Fathy", specialty: "Surgery", city: "Giza", rating: 4.9, ratingsCount: 96, fee: 350, originalFee: 350, photo: null },
  { id: "d3", name: "Dr. Nour Adel", specialty: "Dermatology", city: "Cairo", rating: 4.8, ratingsCount: 74, fee: 300, originalFee: 300, photo: null },
  { id: "d4", name: "Dr. Youssef Karim", specialty: "Vaccination", city: "Cairo", rating: 4.8, ratingsCount: 61, fee: 150, originalFee: 150, photo: null },
  { id: "d5", name: "Dr. Mona Saeed", specialty: "Small animals", city: "Giza", rating: 4.7, ratingsCount: 52, fee: 180, originalFee: 180, photo: null },
  { id: "d6", name: "Dr. Tarek Nabil", specialty: "Dentistry", city: "Cairo", rating: 4.6, ratingsCount: 44, fee: 280, originalFee: 280, photo: null },
  { id: "d7", name: "Dr. Heba Mostafa", specialty: "Nutrition", city: "Alexandria", rating: 4.6, ratingsCount: 39, fee: 170, originalFee: 170, photo: null },
  { id: "d8", name: "Dr. Khaled Wael", specialty: "Surgery", city: "Cairo", rating: 4.5, ratingsCount: 33, fee: 400, originalFee: 400, photo: null },
  { id: "d9", name: "Dr. Salma Adham", specialty: "Small animals", city: "Giza", rating: 4.5, ratingsCount: 28, fee: 160, originalFee: 160, photo: null },
  { id: "d10", name: "Dr. Ali Barakat", specialty: "Vaccination", city: "Cairo", rating: 4.4, ratingsCount: 25, fee: 140, originalFee: 140, photo: null },
  { id: "d11", name: "Dr. Dina Ezzat", specialty: "Dermatology", city: "Alexandria", rating: 4.3, ratingsCount: 19, fee: 260, originalFee: 260, photo: null },
  { id: "d12", name: "Dr. Hany Lotfy", specialty: "Dentistry", city: "Cairo", rating: 4.2, ratingsCount: 14, fee: 220, originalFee: 220, photo: null },
];

export const mockAppointment: Appointment = {
  id: "a1",
  doctorName: "Ramy Medawer",
  doctorRole: "Veterinarian",
  doctorPhoto: null,
  status: "confirmed",
  date: "24/6/2026",
  time: "09:00",
  petName: "Cheetos",
};

export const mockProducts: Product[] = [
  { id: "r1", name: "Royal Canin 400gm", price: 445, currency: "EGP", image: null },
  { id: "r2", name: "Mera Exklusiv Dry Cat", price: 800, currency: "EGP", image: null },
  { id: "r3", name: "Rugged Leash X", price: 180, currency: "EGP", image: null },
  { id: "r4", name: "Catmania Litter", price: 295, currency: "EGP", image: null },
];

export const mockAbout =
  "Experienced veterinarian focused on small animals. Offers check-ups, vaccinations and everyday care in a calm, friendly clinic.";

export const mockReviews: Review[] = [
  { id: "r1", rating: 5, comment: "Very patient with my cat and explained everything clearly.", createdAt: "2026-10-02T10:00:00Z", userName: "Mona S.", userPhoto: null },
  { id: "r2", rating: 5, comment: "Quick appointment and a fair price. Will book again.", createdAt: "2026-09-21T10:00:00Z", userName: "Ahmed K.", userPhoto: null },
  { id: "r3", rating: 4, comment: "Great doctor, the waiting time was a little long.", createdAt: "2026-09-08T10:00:00Z", userName: "Layla M.", userPhoto: null },
];
