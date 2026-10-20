"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import styles from "./DemoBanner.module.css";

// Slides in from the side while the visitor is on the shared demo account.
export function DemoBanner() {
  const { isDemo, signOut } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  if (!isDemo || dismissed) return null;

  return (
    <aside role="status" className={styles.banner}>
      <button type="button" aria-label="Dismiss" onClick={() => setDismissed(true)} className={styles.close}>
        <X aria-hidden size={16} />
      </button>
      <b className={styles.title}>You&apos;re using a demo account</b>
      <p className={styles.text}>Look around freely. Create your own account to save your pets and bookings.</p>
      <Button size="sm" className={styles.cta} onClick={() => signOut(routes.register)}>Create your own account</Button>
    </aside>
  );
}
