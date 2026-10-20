import type { ReactNode } from "react";
import styles from "./Rail.module.css";

// A row of cards: swipeable on phones, a grid on bigger screens.
export function Rail({ children }: { children: ReactNode }) {
  return <div className={styles.rail}>{children}</div>;
}
