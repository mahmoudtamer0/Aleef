import Link from "next/link";
import styles from "./AuthCard.module.css";

type Props = { title: string; message: string; linkHref: string; linkLabel: string };

export function AuthCard({ title, message, linkHref, linkLabel }: Props) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <span className={styles.logo}>ALEEF</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>
        <Link href={linkHref} className={styles.link}>{linkLabel}</Link>
      </div>
    </main>
  );
}
