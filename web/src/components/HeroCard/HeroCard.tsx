import { Button } from "@/components/Button/Button";
import { cx } from "@/lib/utils";
import styles from "./HeroCard.module.css";

type Props = { eyebrow: string; title: string; cta: string; href: string; tone: "navy" | "wine" | "violet" };

// The colored card on the right side of the hero.
export function HeroCard({ eyebrow, title, cta, href, tone }: Props) {
  return (
    <div className={cx(styles.card, styles[tone])}>
      <span className={styles.eyebrow}>{eyebrow.toUpperCase()}</span>
      <b className={styles.title}>{title}</b>
      <Button href={href} variant="white" className={styles.button}>{cta} →</Button>
    </div>
  );
}
