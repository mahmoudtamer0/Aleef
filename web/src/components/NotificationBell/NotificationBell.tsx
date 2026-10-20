"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, BellRing, CalendarCheck, MessageCircle, ShoppingBag } from "lucide-react";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { useMarkAllNotificationsRead, useNotifications, useUnreadNotificationsCount } from "@/hooks/useNotifications";
import { getNotificationHref } from "@/lib/notificationRoutes";
import { timeAgo } from "@/lib/timeAgo";
import { cx } from "@/lib/utils";
import type { AppNotification } from "@/types";
import styles from "./NotificationBell.module.css";

const kinds: Record<string, { icon: ReactNode; tint: string }> = {
  appointment: { icon: <CalendarCheck aria-hidden size={20} />, tint: styles.tintAppointment },
  chat: { icon: <MessageCircle aria-hidden size={20} />, tint: styles.tintChat },
  shop: { icon: <ShoppingBag aria-hidden size={20} />, tint: styles.tintShop },
  order: { icon: <ShoppingBag aria-hidden size={20} />, tint: styles.tintShop },
};
const fallbackKind = { icon: <Bell aria-hidden size={20} />, tint: styles.tintOther };

// The bell in the navbar: the number of unread notifications, and a panel with the latest ones.
export function NotificationBell() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const unread = useUnreadNotificationsCount().data ?? 0; // goes up by itself when a live notification arrives
  const [open, setOpen] = useState(false);
  const list = useNotifications(open); // the list is only requested while the panel is open
  const markAll = useMarkAllNotificationsRead(queryClient);
  const ref = useRef<HTMLDivElement>(null);

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

  // opening the bell = "I have seen them": once the list is on screen, mark everything as read (the badge disappears)
  useEffect(() => {
    if (open && list.isSuccess && unread > 0 && !markAll.isPending) markAll.mutate();
  }, [open, list.isSuccess, unread, markAll]);

  function go(notification: AppNotification) {
    setOpen(false);
    router.push(getNotificationHref(notification.data));
  }

  return (
    <div ref={ref} className={styles.wrapper}>
      <button type="button" aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"} aria-expanded={open} onClick={() => setOpen((v) => !v)} className={cx(styles.button, open && styles.buttonOpen)}>
        {unread > 0 ? <BellRing aria-hidden size={20} className={styles.ring} /> : <Bell aria-hidden size={20} />}
        {unread > 0 && <span key={unread} className={styles.badge}>{unread > 99 ? "99+" : unread}</span>}
      </button>

      {open && (
        <div role="dialog" aria-label="Notifications" className={styles.panel}>
          <div className={styles.head}>
            <h2 className={styles.title}>Notifications</h2>
            {unread > 0 && <span className={styles.count}>{unread} new</span>}
          </div>

          <div className={styles.list}>
            {list.isLoading ? (
              <div className={styles.skeletons}>
                {[0, 1, 2].map((i) => <Skeleton key={i} height={56} radius={14} />)}
              </div>
            ) : list.isError ? (
              <div className={styles.error}><ErrorState message="We couldn't load your notifications." onRetry={() => list.refetch()} /></div>
            ) : list.data && list.data.length === 0 ? (
              <div className={styles.empty}>
                <Bell aria-hidden size={32} />
                <b className={styles.emptyTitle}>You&apos;re all caught up</b>
                <span>New notifications will show up here.</span>
              </div>
            ) : (
              list.data?.map((n) => {
                const kind = kinds[n.data.type ?? ""] ?? fallbackKind;
                return (
                  <button key={n.id} type="button" onClick={() => go(n)} className={cx(styles.item, !n.read && styles.unread)}>
                    <span className={cx(styles.icon, kind.tint)}>{kind.icon}</span>
                    <span className={styles.text}>
                      <b className={styles.itemTitle}>{n.title}</b>
                      <span className={styles.itemBody}>{n.body}</span>
                      <time dateTime={n.createdAt} className={styles.time}>{timeAgo(n.createdAt)}</time>
                    </span>
                    {!n.read && <span aria-label="Unread" className={styles.dot} />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
