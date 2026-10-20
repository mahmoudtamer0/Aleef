"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LogOut, Package, PawPrint, UserRound } from "lucide-react";
import { ChatAvatar } from "@/components/ChatAvatar/ChatAvatar";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import styles from "./UserMenu.module.css";

const links = [
  { href: routes.profile, label: "Edit profile", Icon: UserRound },
  { href: routes.pets, label: "My pets", Icon: PawPrint },
  { href: routes.myAppointments, label: "My appointments", Icon: CalendarDays },
  { href: routes.orders, label: "My orders", Icon: Package },
];

export function UserMenu() {
  const { user, signOut } = useAuth();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // going to another page closes the menu
  useEffect(() => setOpen(false), [path]);

  // close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={styles.wrapper}>
      <button type="button" aria-label="Account menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={styles.avatarButton}>
        <ChatAvatar name={user?.name ?? "A"} src={user?.avatar} size={44} />
      </button>

      {open && (
        <div className={styles.menu}>
          <div className={styles.header}>
            <ChatAvatar name={user?.name ?? "A"} src={user?.avatar} size={44} onDark />
            <div className={styles.who}>
              <b className={styles.name}>{user?.name}</b>
              <span className={styles.email}>{user?.email}</span>
            </div>
          </div>
          <div className={styles.items}>
            {links.map(({ href, label, Icon }) => (
              <Link key={href} href={href} className={styles.item}>
                <Icon aria-hidden size={19} className={styles.icon} /> {label}
              </Link>
            ))}
            <div className={styles.divider} />
            <button type="button" onClick={() => signOut()} className={`${styles.item} ${styles.logout}`}>
              <LogOut aria-hidden size={19} className={styles.icon} /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
