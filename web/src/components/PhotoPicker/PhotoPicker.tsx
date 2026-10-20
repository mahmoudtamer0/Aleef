"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { cx } from "@/lib/utils";
import styles from "./PhotoPicker.module.css";

const MAX_MB = 5;

type Props = {
  /** the photo the thing has now (from the backend) */
  src?: string | null;
  alt: string;
  /** shown when there is no photo at all (an icon or the first letter) */
  fallback: ReactNode;
  onPick: (file: File) => void;
  shape?: "circle" | "rounded";
  size?: number;
};

// A big photo with a camera button. Picking a file shows it right away; the parent keeps the file and sends it on save.
export function PhotoPicker({ src, alt, fallback, onPick, shape = "circle", size = 128 }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  // free the temporary preview url when it is replaced / the component goes away
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function pick(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) return setError("Please choose an image.");
    if (file.size > MAX_MB * 1024 * 1024) return setError(`The photo must be smaller than ${MAX_MB} MB.`);
    setPreview(URL.createObjectURL(file));
    onPick(file);
  }

  const shown = preview ?? src;

  return (
    <div className={styles.wrap}>
      <div className={styles.frame} style={{ width: size, height: size }}>
        <div className={cx(styles.image, shape === "circle" ? styles.circle : styles.rounded)} style={{ fontSize: size * 0.4, fontWeight: 800 }}>
          {shown ? <Image src={shown} alt={alt} fill sizes={`${size}px`} unoptimized={!!preview} /> : fallback}
        </div>
        <button type="button" aria-label="Change photo" className={styles.camera} onClick={() => input.current?.click()}>
          <Camera aria-hidden size={20} />
        </button>
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) pick(file);
            e.target.value = "";
          }}
        />
      </div>
      <span className={styles.hint}>JPG or PNG, up to {MAX_MB} MB</span>
      {error && <span role="alert" className={styles.error}>{error}</span>}
    </div>
  );
}
