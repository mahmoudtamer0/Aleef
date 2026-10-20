import type { Metadata } from "next";
import { PetsHero } from "@/components/PetsHero/PetsHero";
import { QuickActions } from "@/components/QuickActions/QuickActions";
import { BestDoctors } from "@/components/BestDoctors/BestDoctors";
import { AssistantBanner } from "@/components/AssistantBanner/AssistantBanner";
import { FreeVisitCard } from "@/components/FreeVisitCard/FreeVisitCard";
import { CareTip } from "@/components/CareTip/CareTip";
import { PetEssentials } from "@/components/PetEssentials/PetEssentials";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return (
    <>
      <PetsHero />
      <QuickActions />
      <BestDoctors />
      <AssistantBanner />
      <section className="reveal row g-4">
        <div className="col-12 col-md-6"><FreeVisitCard /></div>
        <div className="col-12 col-md-6"><CareTip /></div>
      </section>
      <PetEssentials />
    </>
  );
}
