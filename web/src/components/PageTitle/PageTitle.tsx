import styles from "./PageTitle.module.css";

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rise">
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
