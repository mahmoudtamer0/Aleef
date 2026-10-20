import type { Metadata } from "next";
import { EditPet } from "@/components/EditPet/EditPet";

export const metadata: Metadata = { title: "Edit pet" };

export default async function EditPetPage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  return <EditPet petId={petId} />;
}
