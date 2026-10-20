import { HeroCard } from "@/components/HeroCard/HeroCard";
import { routes } from "@/config/routes";
import type { Pet } from "@/types";

// A real alert for one pet: overdue vaccine (red) or upcoming vaccine (blue).
export function PetAlert({ pet }: { pet: Pet }) {
  const overdue = pet.vaccines.overdue > 0;
  return (
    <HeroCard
      tone={overdue ? "wine" : "navy"}
      eyebrow={`Today for ${pet.name}`}
      title={overdue ? "Some care items need attention." : "Upcoming vaccine reminder is ready."}
      cta={overdue ? "Check now" : "Open profile"}
      href={routes.pet(pet.id)}
    />
  );
}
