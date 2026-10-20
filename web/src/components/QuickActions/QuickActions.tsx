// Server Component: static links + CSS-only hover, so it needs no client JavaScript.
import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, MessageCircle, ShoppingBag } from "lucide-react";
import { routes } from "@/config/routes";
import { cx } from "@/lib/utils";
import styles from "./QuickActions.module.css";

const actions = [
  { href: routes.doctors, title: "Book a visit", hint: "Pick a vet in seconds", Icon: CalendarDays, tint: styles.tintBrand },
  { href: routes.store, title: "Pet shop", hint: "Food, toys and care", Icon: ShoppingBag, tint: styles.tintOrange },
  { href: routes.chats, title: "Ask ALEEF", hint: "Chat with the assistant", Icon: MessageCircle, tint: styles.tintBlue },
  { href: routes.pets, title: "Records", hint: "Vaccines and history", Icon: FileText, tint: styles.tintPurple },
];

export function QuickActions() {
  return (
    <section className="rise row g-3 g-lg-4" style={{ animationDelay: "200ms" }}>
      {actions.map(({ href, title, hint, Icon, tint }) => (
        <div key={title} className="col-6 col-lg-3">
          <Link href={href} className={styles.card}>
            <span className={cx(styles.icon, tint)}>
              <Icon aria-hidden size={24} />
            </span>
            <span className={styles.text}>
              <b className={styles.title}>{title}</b>
              <span className={styles.hint}>{hint}</span>
            </span>
            <ArrowRight aria-hidden size={20} className={styles.arrow} />
          </Link>
        </div>
      ))}
    </section>
  );
}
