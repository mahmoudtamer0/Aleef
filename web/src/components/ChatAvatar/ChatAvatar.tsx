import Image from "next/image";
import { cx } from "@/lib/utils";
import styles from "./ChatAvatar.module.css";

type Props = { name: string; src?: string | null; size?: number; onDark?: boolean };

// Round photo, or the first letter of the name when there is no photo.
export function ChatAvatar({ name, src, size = 48, onDark = false }: Props) {
  return (
    <span className={cx(styles.avatar, onDark && styles.light)} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {src ? <Image src={src} alt="" fill sizes={`${size}px`} className={styles.image} /> : name.replace(/^Dr\.?\s+/i, "").charAt(0).toUpperCase()}
    </span>
  );
}
