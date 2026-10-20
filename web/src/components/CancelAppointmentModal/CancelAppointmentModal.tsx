"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button/Button";
import { cancelReasons, OTHER_REASON } from "@/lib/cancelReasons";
import { cx } from "@/lib/utils";
import styles from "./CancelAppointmentModal.module.css";

type Props = {
  open: boolean;
  busy: boolean;
  error?: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};


export function CancelAppointmentModal({ open, busy, error, onClose, onConfirm }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [choice, setChoice] = useState<string | null>(null);
  const [custom, setCustom] = useState("");

  // open / close the dialog when `open` changes (and start fresh next time)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) {
      setChoice(null);
      setCustom("");
    }
  }, [open]);

  const reason = choice === OTHER_REASON ? custom.trim() : choice;
  const canSubmit = !!reason && !busy;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cancel-title"
      className={styles.dialog}
      onClose={onClose}
      onCancel={(e) => busy && e.preventDefault()} // Esc does nothing while we are cancelling
      onClick={(e) => e.target === dialogRef.current && !busy && onClose()} // click on the dark area closes it
    >
      <div className={styles.content}>
        <h2 id="cancel-title" className={styles.title}>Cancel this appointment?</h2>
        <p className={styles.text}>The doctor will be notified. This can&apos;t be undone.</p>

        <span className={styles.label}>Why are you cancelling?</span>
        <div role="radiogroup" aria-label="Reason for cancelling" className={styles.reasons}>
          {cancelReasons.map((r) => (
            <button key={r} type="button" role="radio" aria-checked={r === choice} onClick={() => setChoice(r)} className={cx(styles.reason, r === choice && styles.reasonOn)}>
              <span aria-hidden className={styles.radio} />
              {r}
            </button>
          ))}
        </div>

        {choice === OTHER_REASON && (
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            maxLength={200}
            autoFocus
            aria-label="Write your reason"
            placeholder="Tell the doctor why…"
            className={styles.textarea}
          />
        )}

        {error && <p role="alert" className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <Button variant="outlineGreen" disabled={busy} onClick={onClose}>Keep appointment</Button>
          <Button variant="dangerSolid" disabled={!canSubmit} onClick={() => reason && onConfirm(reason)}>
            {busy ? "Cancelling…" : "Cancel appointment"}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
