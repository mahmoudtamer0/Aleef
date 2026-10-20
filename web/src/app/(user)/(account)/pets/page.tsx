import type { Metadata } from "next";
import { MyPets } from "@/components/MyPets/MyPets";

export const metadata: Metadata = { title: "My pets" };

export default function PetsPage() {
  return <MyPets />;
}
