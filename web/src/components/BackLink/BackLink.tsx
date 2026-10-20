import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./BackLink.module.css";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={styles.link}>
      <ArrowLeft aria-hidden size={18} /> {label}
    </Link>
  );
}
