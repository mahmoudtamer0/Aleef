import Link from "next/link";
import styles from "./SectionHeader.module.css";

type Props = { title: string; href?: string; linkLabel?: string };

export function SectionHeader({ title, href, linkLabel = "View all" }: Props) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {href && <Link href={href} className={styles.link}>{linkLabel}</Link>}
    </div>
  );
}
