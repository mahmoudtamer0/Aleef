import { api, toList } from "./client";
import { endpoints } from "@/config/endpoints";
import { env } from "@/config/env";
import { toIsoDate } from "@/lib/date";
import { mockAbout, mockDelay, mockDoctors, mockReviews } from "@/lib/mock";
import type { Doctor, DoctorProfileData, DoctorSchedule, Review } from "@/types";

export type DoctorSort = "top_rated" | "lowest_price";
export type DoctorsQuery = { page: number; search?: string; sort?: DoctorSort; lat?: number; lng?: number };
export type DoctorsPage = { doctors: Doctor[]; page: number; totalPages: number; totalDoctors: number };

// Field names come from the backend queries (getAvailableDoctors / getDoctor / getDoctorSchedual).
export const toDoctor = (raw: any): Doctor => {
  const km = raw?.distance_km ?? raw?.distance;
  return {
    id: String(raw?.id ?? raw?._id),
    name: raw?.name ?? raw?.fullName ?? "",
    specialty: raw?.specialization ?? raw?.specialty ?? "",
    rating: Number(raw?.rating ?? raw?.averageRating ?? 0) || 0,
    ratingsCount: raw?.ratingsCount != null ? Number(raw.ratingsCount) : undefined,
    city: raw?.city ?? undefined,
    about: raw?.about ?? undefined,
    address: raw?.address ?? undefined,
    phone: raw?.phone ?? undefined,
    distanceKm: km != null ? Number(km) : null,
    minutes: raw?.minutes != null ? Number(raw.minutes) : null,
    fee: raw?.finalFee != null ? Number(raw.finalFee) : raw?.appointmentFee != null ? Number(raw.appointmentFee) : undefined,
    originalFee: raw?.originalFee != null ? Number(raw.originalFee) : undefined,
    photo: raw?.profilePic ?? raw?.image ?? raw?.photo ?? raw?.avatar ?? null,
  };
};

const toReview = (raw: any): Review => ({
  id: String(raw?.id ?? raw?._id),
  rating: Number(raw?.rate ?? raw?.rating ?? 0) || 0,
  comment: raw?.comment ?? "",
  createdAt: raw?.createdAt ?? "",
  userName: raw?.user_name ?? raw?.userName ?? "",
  userPhoto: raw?.user_pic ?? raw?.userPhoto ?? null,
});

// ---------------- home: top-rated few ----------------
export async function getBestDoctors(limit = 4): Promise<Doctor[]> {
  if (env.useMock) return mockDelay(mockDoctors.slice(0, limit));
  const res = await api.get(endpoints.doctors);
  return toList(res.data, "doctors")
    .map(toDoctor)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// ---------------- appointments page: ONE page of doctors ----------------
export async function getAvailableDoctors({ page, search, sort, lat, lng }: DoctorsQuery): Promise<DoctorsPage> {
  if (env.useMock) return mockDoctorsPage({ page, search, sort, lat, lng });

  const res = await api.get(endpoints.availableDoctors, {
    params: { page, search: search || undefined, sort, user_lat: lat, user_lng: lng },
  });
  const body = res.data?.data ?? res.data;
  return {
    doctors: toList(res.data, "doctors").map(toDoctor),
    page: Number(body?.page ?? page),
    totalPages: Number(body?.totalPages ?? 1),
    totalDoctors: Number(body?.totalDoctors ?? 0),
  };
}

// ---------------- doctor profile: details + latest reviews ----------------
export async function getDoctorProfile(id: string): Promise<DoctorProfileData> {
  if (env.useMock) {
    const doctor = mockDoctors.find((d) => d.id === id) ?? mockDoctors[0];
    return mockDelay({ doctor: { ...doctor, id, about: mockAbout, address: "12 Example Street, " + (doctor.city ?? "Cairo") }, reviews: mockReviews });
  }
  const res = await api.get(endpoints.doctor(id));
  console.log("getDoctorProfile res.data:", res.data);
  const body = res.data ?? res.data;
  return { doctor: toDoctor(body?.doctorProfile.doctor), reviews: (body?.reviews ?? []).map(toReview) };
}

// ---------------- booking: available days (+ free times of the first day) ----------------
export async function getDoctorSchedule(id: string): Promise<DoctorSchedule> {
  if (env.useMock) {
    const doctor = mockDoctors.find((d) => d.id === id) ?? mockDoctors[0];
    const days = mockDays();
    return mockDelay({ doctor: { ...doctor, id, address: "12 Example Street, " + (doctor.city ?? "Cairo") }, days, firstDaySlots: mockSlots(days[0]) });
  }
  const res = await api.get(endpoints.doctorSchedule(id));
  console.log("getDoctorSchedule res.data:", res.data);
  const body = res.data ?? res.data;
  return {
    doctor: toDoctor({ ...body?.doctor, id }),
    // TODO: doctorDays comes from getNextDays(); this expects strings or objects with a `date`.
    days: (body?.schedual ?? []).map((d: any) => String(typeof d === "string" ? d : d?.date).slice(0, 10)),
    firstDaySlots: (body?.firstDaySlots ?? []).map(String),
  };
}

// ---------------- booking: free times of ONE day ----------------
export async function getDoctorSlots(id: string, date: string): Promise<string[]> {
  if (env.useMock) return mockDelay(mockSlots(date), 600);
  const res = await api.get(endpoints.doctorSlots(id), { params: { date } });
  const body = res.data?.data ?? res.data;
  return (body?.slots ?? []).map(String);
}

// ---------------- mock mode helpers ----------------
function mockDoctorsPage({ page, search, sort, lat, lng }: DoctorsQuery) {
  const PAGE_SIZE = 5;
  let list = [...mockDoctors];

  if (lat != null && lng != null) {
    list = list.map((d, i) => {
      const km = Math.round(1 + i * 1.6);
      return { ...d, distanceKm: km, minutes: Math.round(km * 1.5) };
    });
  }
  const term = search?.trim().toLowerCase();
  if (term) list = list.filter((d) => [d.name, d.specialty, d.city].some((v) => v?.toLowerCase().includes(term)));
  if (sort === "top_rated") list.sort((a, b) => b.rating - a.rating);
  if (sort === "lowest_price") list.sort((a, b) => (a.fee ?? 0) - (b.fee ?? 0));

  const start = (page - 1) * PAGE_SIZE;
  return mockDelay(
    { doctors: list.slice(start, start + PAGE_SIZE), page, totalPages: Math.max(1, Math.ceil(list.length / PAGE_SIZE)), totalDoctors: list.length },
    900,
  );
}

// next 7 days, no Fridays
function mockDays(): string[] {
  const now = new Date();
  const days: string[] = [];
  for (let i = 1; days.length < 7; i++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    if (day.getDay() !== 5) days.push(toIsoDate(day));
  }
  return days;
}

// 09:00 .. 16:30, with a few "already booked" holes that differ per day
function mockSlots(date: string): string[] {
  const seed = Number(date.slice(-2));
  const all: string[] = [];
  for (let h = 9; h < 17; h++) for (const m of ["00", "30"]) all.push(`${String(h).padStart(2, "0")}:${m}`);
  return all.filter((_, i) => (i + seed) % 4 !== 0);
}
