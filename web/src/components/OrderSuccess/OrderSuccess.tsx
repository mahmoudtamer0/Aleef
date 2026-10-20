import { Button } from "@/components/Button/Button";
import { routes } from "@/config/routes";
import styles from "./OrderSuccess.module.css";

// TODO: show the number the same way your dashboard does (it shows e.g. "#26B879").
const orderNumber = (id: string) => `#${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;

export function OrderSuccess({ orderId }: { orderId: string }) {
  return (
    <div role="status" className={styles.card}>
      <span className={styles.badge}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" className={styles.check} />
        </svg>
      </span>
      <h1 className={styles.title}>Order placed!</h1>
      {orderId && <span className={styles.number}>{orderNumber(orderId)}</span>}
      <p className={styles.text}>Thank you. We sent the details to your email and we&apos;ll let you know when your order ships.</p>
      <div className={styles.actions}>
        <Button href={routes.store}>Continue shopping</Button>
        <Button href={routes.home} variant="outlineGreen">Back to home</Button>
      </div>
    </div>
  );
}
