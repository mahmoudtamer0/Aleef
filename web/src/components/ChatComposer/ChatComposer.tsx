"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import { uploadChatImage } from "@/lib/api/chats";
import styles from "./ChatComposer.module.css";

const MAX_LENGTH = 2000; // the backend rejects longer messages
const MAX_PHOTO_MB = 5;

type Props = {
  disabled: boolean;
  disabledNote?: string;
  onSend: (payload: { text: string; image: string | null }) => void;
};

export function ChatComposer({ disabled, disabledNote, onSend }: Props) {
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<{ url: string; uploading: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // the box grows with the text (up to ~5 lines)
  useLayoutEffect(() => {
    const el = textarea.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [text]);

  // 1) pick a photo -> 2) upload it over REST right away -> 3) we get its url -> 4) the url is sent through the socket with the message
  async function pickPhoto(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) return setError("Please choose an image.");
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) return setError(`The photo must be smaller than ${MAX_PHOTO_MB} MB.`);

    setPhoto({ url: URL.createObjectURL(file), uploading: true }); // show it immediately
    try {
      const url = await uploadChatImage(file);
      setPhoto({ url, uploading: false });
    } catch {
      setPhoto(null);
      setError("We couldn't upload the photo. Try again.");
    }
  }

  const uploading = !!photo?.uploading;
  const canSend = !disabled && !uploading && (text.trim().length > 0 || !!photo);

  function submit() {
    if (!canSend) return;
    onSend({ text: text.trim(), image: photo?.url ?? null });
    setText("");
    setPhoto(null);
    setError(null);
  }

  if (disabled && disabledNote) return <div className={styles.closed}>{disabledNote}</div>;

  return (
    <div className={styles.composer}>
      {photo && (
        <div className={styles.preview}>
          <span className={styles.thumb}>
            <Image src={photo.url} alt="Photo to send" fill sizes="72px" unoptimized />
            {photo.uploading && <span className={styles.uploading}><Loader2 aria-label="Uploading" size={22} className={styles.spinner} /></span>}
          </span>
          <button type="button" aria-label="Remove photo" onClick={() => setPhoto(null)} className={styles.remove}><X aria-hidden size={14} /></button>
        </div>
      )}

      <div className={styles.row}>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void pickPhoto(file);
            e.target.value = ""; // so the same file can be picked again
          }}
        />
        <button type="button" aria-label="Attach a photo" disabled={disabled || uploading} onClick={() => fileInput.current?.click()} className={styles.iconButton}>
          <ImagePlus aria-hidden size={22} />
        </button>

        <textarea
          ref={textarea}
          value={text}
          rows={1}
          maxLength={MAX_LENGTH}
          disabled={disabled}
          placeholder="Write a message…"
          aria-label="Message"
          className={styles.input}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter adds a new line
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
        />

        <button type="button" aria-label="Send message" disabled={!canSend} onClick={submit} className={styles.send}>
          <Send aria-hidden size={20} />
        </button>
      </div>

      {text.length > MAX_LENGTH - 200 && <p className={styles.counter}>{text.length}/{MAX_LENGTH}</p>}
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {disabled && !disabledNote && <p className={styles.note}>Reconnecting…</p>}
    </div>
  );
}
