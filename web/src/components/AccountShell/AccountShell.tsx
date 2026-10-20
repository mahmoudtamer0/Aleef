"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, PawPrint, Package, UserRound } from "lucide-react";
import { ChatAvatar } from "@/components/ChatAvatar/ChatAvatar";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { cx } from "@/lib/utils";
import styles from "./AccountShell.module.css";

const links = [
  { href: routes.pets, label: "My pets", Icon: PawPrint },
  { href: routes.myAppointments, label: "My appointments", Icon: CalendarDays },
  { href: routes.orders, label: "My orders", Icon: Package },
  { href: routes.profile, label: "Edit profile", Icon: UserRound },
];

// The frame of every "my account" page: a menu on the left, the page on the right.
export function AccountShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { user } = useAuth();

  return (
    <div className={styles.layout}>
      <aside className={`rise ${styles.sidebar}`}>
        <div className={styles.card}>
          <div className={styles.profile}>
            <div aria-hidden className={styles.orb} />
            <ChatAvatar name={user?.name ?? "A"} src={user?.avatar} size={56} onDark />
            <div className={styles.who}>
              <div className={styles.name}>{user?.name}</div>
              <div className={styles.email}>{user?.email}</div>
            </div>
          </div>
          <nav aria-label="My account" className={styles.nav}>
            {links.map(({ href, label, Icon }) => (
              <Link key={href} href={href} aria-current={path.startsWith(href) ? "page" : undefined} className={cx(styles.link, path.startsWith(href) && styles.active)}>
                <Icon aria-hidden size={20} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
