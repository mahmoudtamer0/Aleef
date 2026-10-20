import type { ReactNode } from "react";
import styles from "./AccountHeader.module.css";

// Page title + a short line, and (optionally) a button on the right.
export function AccountHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className={`rise ${styles.header}`}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
