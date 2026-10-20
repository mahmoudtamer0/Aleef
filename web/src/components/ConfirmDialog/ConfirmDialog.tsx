"use client";

import { useEffect, useRef } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/Button/Button";
import styles from "./ConfirmDialog.module.css";

type Props = {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  busy?: boolean;
  error?: string;
  onConfirm: () => void;
  onClose: () => void;
};

// "Are you sure?" popup for dangerous actions (delete a pet...). Built on the browser's <dialog>.
export function ConfirmDialog({ open, title, text, confirmLabel, busy = false, error, onConfirm, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      className={styles.dialog}
      onClose={onClose}
      onCancel={(e) => busy && e.preventDefault()}
      onClick={(e) => e.target === ref.current && !busy && onClose()}
    >
      <div className={styles.content}>
        <span className={styles.icon}><TriangleAlert aria-hidden size={26} /></span>
        <h2 id="confirm-title" className={styles.title}>{title}</h2>
        <p className={styles.text}>{text}</p>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <Button variant="outlineGreen" disabled={busy} onClick={onClose}>Keep it</Button>
          <Button variant="dangerSolid" disabled={busy} onClick={onConfirm}>{busy ? "Please wait…" : confirmLabel}</Button>
        </div>
      </div>
    </dialog>
  );
}
