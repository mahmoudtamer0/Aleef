"use client";

import { useState } from "react";
import { Photo } from "@/components/Photo/Photo";
import { cx } from "@/lib/utils";
import styles from "./ProductGallery.module.css";

// Big photo + clickable thumbnails. Hover zooms the big photo.
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0] ?? null;

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <Photo key={current ?? "empty"} src={current} alt={alt} className={styles.mainPhoto} />
      </div>
      {images.length > 1 && (
        <div className={styles.thumbs} role="group" aria-label="Product photos">
          {images.map((src, i) => (
            <button key={src + i} type="button" aria-label={`Photo ${i + 1}`} aria-pressed={i === active} onClick={() => setActive(i)} className={cx(styles.thumb, i === active && styles.thumbOn)}>
              <Photo src={src} alt="" className={styles.thumbPhoto} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
