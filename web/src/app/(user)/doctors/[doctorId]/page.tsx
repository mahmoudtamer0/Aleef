// Server Component: reads the id from the URL and hands it to the client component that loads the data.
import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink/BackLink";
import { DoctorProfile } from "@/components/DoctorProfile/DoctorProfile";
import { routes } from "@/config/routes";

export const metadata: Metadata = { title: "Doctor" };

export default async function DoctorPage({ params }: { params: Promise<{ doctorId: string }> }) {
  const { doctorId } = await params;
  return (
    <>
      <BackLink href={routes.appointments} label="Back to doctors" />
      <DoctorProfile doctorId={doctorId} />
    </>
  );
}
