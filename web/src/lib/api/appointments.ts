import axios from "axios";
import { api, toList, toObject } from "./client";
import { endpoints } from "@/config/endpoints";
import { env } from "@/config/env";
import { mockAppointment, mockDelay } from "@/lib/mock";
import { mockAppointmentHistory } from "@/lib/mockAccount";
import { toDoctor } from "./doctors";
import { formatSlot } from "@/lib/date";
import type { Appointment, AppointmentDetailsData, AppointmentListItem, NewAppointment } from "@/types";

// 2026-06-24 -> 24/6/2026
function formatDate(value?: string): string {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return value ?? "";
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

// TODO: adjust to your real appointment response. This is the only place that knows its shape.
const toAppointment = (raw: any): Appointment => ({
  id: String(raw?.id ?? raw?._id),
  doctorName: raw?.doctor?.name ?? raw?.doctorName ?? "",
  doctorRole: raw?.doctor?.specialization ?? "Veterinarian",
  doctorPhoto: raw?.doctor?.profilePic ?? raw?.doctorPhoto ?? null,
  status: raw?.status ?? "confirmed",
  date: formatDate(raw?.date ?? raw?.appointmentDate),
  time: String(raw?.time ?? raw?.appointmentTime ?? "").slice(0, 5),
  petName: raw?.pet?.name ?? raw?.petName ?? "",
});

// null = the user has no upcoming appointment.
export async function getUpcomingAppointment(): Promise<Appointment | null> {
  if (env.useMock) return mockDelay(mockAppointment, 800);
  try {
    const res = await api.get(endpoints.upcomingAppointment);
    const raw = toObject(res.data, "appointment");
    return raw && (raw.id ?? raw._id) ? toAppointment(raw) : null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}

// TODO: adjust the payload keys / route to your real "book appointment" endpoint.
export async function createAppointment(data: NewAppointment): Promise<{ id: string }> {
  if (env.useMock) return mockDelay({ id: "new" }, 900);
  const res = await api.post(endpoints.appointments, data);
  const raw = toObject(res.data, "appointment");
  return { id: String(raw?.id ?? raw?._id ?? "") };
}

// ---------------- one appointment (for the details page) ----------------
// Field names come from the backend's getAppointmentDetailsForUser query.
const toAppointmentDetails = (raw: any, chat: any): AppointmentDetailsData => ({
  id: String(raw?.id),
  status: String(raw?.status ?? ""),
  date: String(raw?.date ?? "").slice(0, 10),
  time: formatSlot(String(raw?.time ?? "")),
  reason: raw?.reason ?? "",
  notes: raw?.notes || undefined,
  rejectionReason: raw?.rejectionReason || undefined,
  cancelledReason: raw?.cancelledReason || undefined,
  fee: raw?.appointmentFee != null ? Number(raw.appointmentFee) : undefined,
  createdAt: raw?.createdAt ?? "",
  doctor: toDoctor(raw?.doctor),
  pet: {
    id: String(raw?.pet?.id),
    name: raw?.pet?.name ?? "",
    species: raw?.pet?.type ?? "pet",
    gender: raw?.pet?.gender ?? undefined,
    photo: raw?.pet?.profilePic ?? null,
  },
  chatId: chat?.id != null ? String(chat.id) : null,
});

export async function getAppointmentDetails(id: string): Promise<AppointmentDetailsData> {
  if (env.useMock) return mockDelay(mockDetails(id), 800);
  const res = await api.get(endpoints.appointment(id));
  const body = res.data?.data ?? res.data;
  return toAppointmentDetails(body?.appointment, body?.chat);
}

// Mock mode: the id picks the state, so you can preview them all:
// /appointments/pending, /appointments/rejected, /appointments/completed, /appointments/cancelled (anything else = accepted)
function mockDetails(id: string): AppointmentDetailsData {
  const status = ["pending", "rejected", "completed", "cancelled"].includes(id) ? id : "accepted";
  return {
    id,
    status,
    date: "2026-11-24",
    time: "09:00",
    reason: "Vaccination",
    notes: "Cheetos was sneezing a little last week.",
    rejectionReason: status === "rejected" ? "The doctor is unavailable on this day. Please pick another day." : undefined,
    fee: 200,
    createdAt: "2026-10-12T10:00:00Z",
    doctor: {
      id: "d1",
      name: "Ramy Medawer",
      specialty: "Veterinarian",
      rating: 4.9,
      ratingsCount: 128,
      city: "Cairo",
      address: "12 Example Street, Maadi",
      phone: "01000000000",
      photo: null,
    },
    pet: { id: "p1", name: "Cheetos", species: "cat", gender: "male", photo: null },
    chatId: status === "accepted" ? "c1" : null,
  };
}

// TODO: adjust the route / body to your real "cancel appointment" endpoint.
export async function cancelAppointment(appointmentId: string, reason: string): Promise<void> {
  if (env.useMock) {
    await mockDelay(null, 900);
    return;
  }
  await api.patch(endpoints.cancelAppointment(appointmentId), { reason });
}

// ---------------- "My appointments": the previous ones ----------------
// TODO: adjust to your real response (same idea as toAppointmentDetails, but a lighter row).
const toListItem = (raw: any): AppointmentListItem => ({
  id: String(raw?.id),
  doctorName: raw?.doctor?.name ?? raw?.doctorName ?? raw?.doctor_name ?? "",
  doctorRole: raw?.doctor?.specialization ?? raw?.specialization ?? "Veterinarian",
  doctorPhoto: raw?.doctor?.profilePic ?? raw?.doctorPic ?? null,
  petName: raw?.pet?.name ?? raw?.petName ?? raw?.pet_name ?? "",
  date: String(raw?.date ?? "").slice(0, 10),
  time: formatSlot(String(raw?.time ?? "")),
  status: String(raw?.status ?? ""),
  fee: raw?.appointmentFee != null ? Number(raw.appointmentFee) : undefined,
});

export async function getMyAppointments(): Promise<AppointmentListItem[]> {
  if (env.useMock) return mockDelay(mockAppointmentHistory, 700);
  const res = await api.get(endpoints.myAppointments);
  return toList(res.data, "appointments").map(toListItem);
}
