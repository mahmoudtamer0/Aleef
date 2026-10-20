// Server Component (static): a banner with a looping fake chat, all CSS.
import { Button } from "@/components/Button/Button";
import { routes } from "@/config/routes";
import styles from "./AssistantBanner.module.css";

export function AssistantBanner() {
  return (
    <section className={`reveal ${styles.banner}`}>
      <div aria-hidden className={styles.orb} />
      <div className={styles.text}>
        <span className={styles.kicker}>ALEEF ASSISTANT</span>
        <h2 className={styles.title}>Not sure about something? Just ask.</h2>
        <p className={styles.sub}>Quick answers about your pet&apos;s care, any time of day. When it needs a vet, we&apos;ll point you to one.</p>
        <Button href={routes.chats} variant="white" className={styles.cta}>Start a chat →</Button>
      </div>
      <div aria-hidden className={styles.chat}>
        <div className={`${styles.bubble} ${styles.me} ${styles.b1}`}>My cat is sneezing. Should I worry?</div>
        <div className={`${styles.bubble} ${styles.bot} ${styles.b2}`}>Let&apos;s check together. How long has it been, and is he eating normally?</div>
        <div className={`${styles.bubble} ${styles.me} ${styles.b3}`}>Two days, and he eats fine.</div>
      </div>
    </section>
  );
}
