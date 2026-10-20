"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, CalendarCheck, MessageCircle, ShoppingBag, X } from "lucide-react";
import { useToasts, type Toast } from "@/hooks/useToasts";
import styles from "./Toasts.module.css";

const icons: Record<string, typeof Bell> = { appointment: CalendarCheck, chat: MessageCircle, shop: ShoppingBag, order: ShoppingBag };
const DURATION_MS = 6000;

function ToastItem({ toast }: { toast: Toast }) {
  const router = useRouter();
  const dismiss = useToasts((s) => s.dismiss);
  const Icon = icons[toast.type ?? ""] ?? Bell;

  // goes away by itself
  useEffect(() => {
    const id = setTimeout(() => dismiss(toast.id), DURATION_MS);
    return () => clearTimeout(id);
  }, [toast.id, dismiss]);

  return (
    <div className={styles.toast}>
      <button
        type="button"
        className={styles.main}
        onClick={() => {
          dismiss(toast.id);
          router.push(toast.href); // takes the user to the appointment / chat / product it is about
        }}
      >
        <span className={styles.icon}><Icon aria-hidden size={20} /></span>
        <span className={styles.text}>
          <b className={styles.title}>{toast.title}</b>
          <span className={styles.body}>{toast.body}</span>
        </span>
      </button>
      <button type="button" aria-label="Dismiss" className={styles.close} onClick={() => dismiss(toast.id)}><X aria-hidden size={16} /></button>
      <span aria-hidden className={styles.bar} />
    </div>
  );
}

// Live popups in the top right corner. They appear when the server sends a "notification".
export function Toasts() {
  const toasts = useToasts((s) => s.toasts);
  return (
    <div role="status" aria-live="polite" className={styles.stack}>
      {toasts.map((toast) => <ToastItem key={toast.id} toast={toast} />)}
    </div>
  );
}
