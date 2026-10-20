import type { Metadata } from "next";
import { PageTitle } from "@/components/PageTitle/PageTitle";
import { UpcomingAppointment } from "@/components/UpcomingAppointment/UpcomingAppointment";
import { AvailableDoctors } from "@/components/AvailableDoctors/AvailableDoctors";

export const metadata: Metadata = { title: "Appointments" };

export default function AppointmentsPage() {
    return (
        <>
            <PageTitle title="Appointments" subtitle="Your next visit and the doctors available for booking." />
            <UpcomingAppointment />
            <AvailableDoctors />
        </>
    );
}
