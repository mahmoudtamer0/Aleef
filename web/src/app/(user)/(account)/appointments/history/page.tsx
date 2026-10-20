import type { Metadata } from "next";
import { MyAppointments } from "@/components/MyAppointments/MyAppointments";

export const metadata: Metadata = { title: "My appointments" };

export default function MyAppointmentsPage() {
  return <MyAppointments />;
}
