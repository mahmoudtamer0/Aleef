import { MessageCircle } from "lucide-react";
import styles from "./ChatEmpty.module.css";

// Shown in the middle when no chat is selected (desktop).
export function ChatEmpty() {
  return (
    <div className={styles.empty}>
      <div aria-hidden className={styles.orb} />
      <span className={styles.icon}><MessageCircle aria-hidden size={44} /></span>
      <h2 className={styles.title}>Your messages</h2>
      <p className={styles.text}>Pick a chat on the left to read it and reply to your doctor.</p>
    </div>
  );
}
