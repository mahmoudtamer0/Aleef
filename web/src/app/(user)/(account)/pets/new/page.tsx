import type { Metadata } from "next";
import { AddPet } from "@/components/AddPet/AddPet";

export const metadata: Metadata = { title: "Add a pet" };

export default function NewPetPage() {
  return <AddPet />;
}
