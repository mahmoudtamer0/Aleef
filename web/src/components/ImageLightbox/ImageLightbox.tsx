"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import styles from "./ImageLightbox.module.css";

// A photo shown big over the page. Esc, the X or a click outside closes it (browser <dialog>).
export function ImageLightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (src && !dialog.open) dialog.showModal();
    if (!src && dialog.open) dialog.close();
  }, [src]);

  return (
    <dialog ref={ref} aria-label="Photo" className={styles.dialog} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      {src && (
        <div className={styles.frame}>
          <button type="button" aria-label="Close" onClick={onClose} className={styles.close}><X aria-hidden size={22} /></button>
          <Image src={src} alt="Chat photo" fill sizes="92vw" className={styles.image} />
        </div>
      )}
    </dialog>
  );
}
