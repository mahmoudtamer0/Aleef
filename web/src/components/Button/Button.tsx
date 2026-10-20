import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/utils";
import styles from "./Button.module.css";

type Props = {
  variant?: "solid" | "white" | "outlineWhite" | "outlineGreen" | "cream" | "danger" | "dangerSolid";
  size?: "md" | "sm";
  /** With href it renders a link, without it a real <button>. */
  href?: string;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({ variant = "solid", size = "md", href, className, children, ...rest }: Props) {
  const classes = cx(styles.button, styles[variant], styles[size], className);
  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button type="button" className={classes} {...rest}>{children}</button>;
}
