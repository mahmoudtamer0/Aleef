"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, MessageCircle, PawPrint, Search, ShoppingBag } from "lucide-react";
import { routes } from "@/config/routes";
import { cx } from "@/lib/utils";
import { Container } from "@/components/Container/Container";
import { UserMenu } from "@/components/UserMenu/UserMenu";
import { NotificationBell } from "@/components/NotificationBell/NotificationBell";
import { useUnreadMessagesCount } from "@/hooks/useChats";
import { useCart } from "@/hooks/useCart";
import styles from "./Navbar.module.css";

const links = [
  { href: routes.home, label: "Home", Icon: Home },
  { href: routes.appointments, label: "Appointments", Icon: CalendarDays },
  { href: routes.store, label: "Store", Icon: ShoppingBag },
  { href: routes.chats, label: "Chats", Icon: MessageCircle },
  { href: routes.pets, label: "My pets", Icon: PawPrint },
];

// The bottom bar on phones. Picked by name, so adding or removing a link above can't break it.
const tabs = ["Home", "Appointments", "Chats", "Store", "My pets"]
  .map((label) => links.find((l) => l.label === label))
  .filter((l): l is (typeof links)[number] => !!l);

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path.startsWith(href));

export function Navbar() {
  const path = usePathname();
  const { count } = useCart();
  const unreadMessages = useUnreadMessagesCount().data ?? 0; // the number next to "Chats"
  const badgeFor = (href: string) => (href === routes.chats && unreadMessages > 0 ? unreadMessages : 0);

  return (
    <>
      <header className={styles.header}>
        <Container className={styles.inner}>
          <Link href={routes.home} className={styles.logo}>ALEEF</Link>

          <nav aria-label="Main" className={styles.links}>
            {links.map(({ href, label }) => (
              <Link key={label} href={href} aria-current={isActive(path, href) ? "page" : undefined} className={cx(styles.link, isActive(path, href) && styles.linkActive)}>
                {label}
                {badgeFor(href) > 0 && <span key={badgeFor(href)} className={styles.linkBadge}>{badgeFor(href) > 99 ? "99+" : badgeFor(href)}</span>}
              </Link>
            ))}
          </nav>

          <div className={styles.right}>
            <label className={styles.search}>
              <Search aria-hidden size={18} />
              <input type="search" placeholder="Search doctors, products…" className={styles.searchInput} />
            </label>
            <Link href={routes.cart} aria-label={count > 0 ? `Cart, ${count} items` : "Cart"} className={styles.iconButton}>
              <ShoppingBag aria-hidden size={20} />
              {count > 0 && <span key={count} className={styles.badge}>{count > 99 ? "99+" : count}</span>}
            </Link>
            <NotificationBell />
            <UserMenu />
          </div>
        </Container>
      </header>

      <nav aria-label="Tabs" className={styles.tabs}>
        {tabs.map(({ href, label, Icon }) => (
          <Link key={label} href={href} aria-label={label} aria-current={isActive(path, href) ? "page" : undefined} className={cx(styles.tab, isActive(path, href) && styles.tabActive)}>
            <Icon aria-hidden size={20} />
            {badgeFor(href) > 0 && <span key={badgeFor(href)} className={styles.tabBadge}>{badgeFor(href) > 99 ? "99+" : badgeFor(href)}</span>}
          </Link>
        ))}
      </nav>
    </>
  );
}