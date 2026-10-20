import type { Metadata } from "next";
import { PetProfile } from "@/components/PetProfile/PetProfile";

export const metadata: Metadata = { title: "Pet" };

export default async function PetPage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  return <PetProfile petId={petId} />;
}
