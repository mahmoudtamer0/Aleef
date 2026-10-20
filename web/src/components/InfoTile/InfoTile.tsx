import type { ReactNode } from "react";
import styles from "./InfoTile.module.css";

type Props = { icon: ReactNode; label: string; value: string; href?: string };

// Icon + small label + value. With `href` the value becomes a link (phone, etc).
export function InfoTile({ icon, label, value, href }: Props) {
  return (
    <div className={styles.tile}>
      <span aria-hidden className={styles.icon}>{icon}</span>
      <div>
        <span className={styles.label}>{label}</span>
        {href ? <a href={href} className={styles.value}>{value}</a> : <b className={styles.value}>{value}</b>}
      </div>
    </div>
  );
}
