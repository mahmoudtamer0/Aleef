import type { ReactNode } from "react";
import styles from "./Step.module.css";

// A numbered card of the booking form: "1 Choose your pet", "2 Pick a day and time"...
export function Step({ number, title, hint, children }: { number: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <section className={styles.step}>
      <header className={styles.header}>
        <span className={styles.badge}>{number}</span>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {hint && <p className={styles.hint}>{hint}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}
