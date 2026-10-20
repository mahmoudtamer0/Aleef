import type { Metadata } from "next";
import { AppointmentDetails } from "@/components/AppointmentDetails/AppointmentDetails";
import { BackLink } from "@/components/BackLink/BackLink";
import { routes } from "@/config/routes";

export const metadata: Metadata = { title: "Appointment details" };

export default async function AppointmentPage({ params }: { params: Promise<{ appointmentId: string }> }) {
  const { appointmentId } = await params;
  return (
    <>
      <BackLink href={routes.appointments} label="Back to appointments" />
      <AppointmentDetails appointmentId={appointmentId} />
    </>
  );
}
