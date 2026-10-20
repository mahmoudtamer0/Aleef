import { cx } from "@/lib/utils";
import styles from "./Skeleton.module.css";

type Props = { width?: number | string; height?: number | string; radius?: number; onDark?: boolean };

// Grey placeholder shown while data loads.
export function Skeleton({ width = "100%", height = 16, radius = 16, onDark = false }: Props) {
  return <div aria-hidden className={cx(styles.skeleton, onDark && styles.onDark)} style={{ width, height, borderRadius: radius }} />;
}
