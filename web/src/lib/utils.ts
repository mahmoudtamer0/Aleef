// Joins class names, skipping the empty ones: cx(styles.card, active && styles.active)
export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");
