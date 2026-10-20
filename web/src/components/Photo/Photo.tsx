import Image from "next/image";
import { PawPrint } from "lucide-react";
import { cx } from "@/lib/utils";
import styles from "./Photo.module.css";

type Props = { src?: string | null; alt: string; className?: string; glass?: boolean };

// Remote photo with a paw placeholder when there is no image yet. Size/radius come from className.
export function Photo({ src, alt, className, glass = false }: Props) {
  return (
    <div className={cx(styles.photo, glass && styles.glass, className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes="(min-width: 992px) 25vw, 50vw" className={styles.image} />
      ) : (
        <PawPrint aria-hidden className={styles.paw} />
      )}
    </div>
  );
}
