import { HeroCard } from "@/components/HeroCard/HeroCard";
import { routes } from "@/config/routes";

// Static cards that fill the hero's right column when there are no (or few) alerts.
export function HeroPromos({ count, hasPets }: { count: number; hasPets: boolean }) {
  const promos = [
    {
      key: "free-visit",
      tone: "navy" as const,
      eyebrow: "Gift coupon",
      title: "Free first visit",
      cta: hasPets ? "Book now" : "Add pet",
      href: hasPets ? routes.doctors : routes.addPet,
    },

    { key: "assistant", tone: "wine" as const, eyebrow: "ALEEF assistant", title: "Ask anything about your pet.", cta: "Start chat", href: routes.chats },
  ];

  return (
    <>
      {promos.slice(0, count).map(({ key, ...card }) => (
        <HeroCard key={key} {...card} />
      ))}
    </>
  );
}
