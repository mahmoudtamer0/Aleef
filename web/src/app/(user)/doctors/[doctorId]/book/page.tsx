// Server Component: reads the id from the URL and hands it to the client component that loads the data.
import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink/BackLink";
import { BookAppointment } from "@/components/BookAppointment/BookAppointment";
import { PageTitle } from "@/components/PageTitle/PageTitle";
import { routes } from "@/config/routes";

export const metadata: Metadata = { title: "Book an appointment" };

export default async function BookPage({ params }: { params: Promise<{ doctorId: string }> }) {
  const { doctorId } = await params;
  return (
    <>
      <BackLink href={routes.doctor(doctorId)} label="Back to profile" />
      <PageTitle title="Book an appointment" subtitle="Choose your pet, a day and a time." />
      <BookAppointment doctorId={doctorId} />
    </>
  );
}
