"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { AccountHeader } from "@/components/AccountHeader/AccountHeader";
import { Button } from "@/components/Button/Button";
import { ChatAvatar } from "@/components/ChatAvatar/ChatAvatar";
import { PhotoPicker } from "@/components/PhotoPicker/PhotoPicker";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfile } from "@/hooks/useProfile";
import { getErrorMessage } from "@/lib/api/client";
import { cx } from "@/lib/utils";
import styles from "./ProfileForm.module.css";

export function ProfileForm() {
  const { user } = useAuth();
  const update = useUpdateProfile();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);

  // fill the fields once the user is loaded
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? "");
    }
  }, [user]);

  // "Saved" goes away by itself
  useEffect(() => {
    if (!saved) return;
    const id = setTimeout(() => setSaved(false), 3500);
    return () => clearTimeout(id);
  }, [saved]);

  const errors = {
    name: name.trim().length < 2 ? "Enter your name." : "",
    phone: /^\+?[0-9\s-]{8,15}$/.test(phone.trim()) ? "" : "Enter a valid phone number.",
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (errors.name || errors.phone) return;
    setSaved(false);
    update.mutate({ name: name.trim(), phone: phone.trim(), photo }, { onSuccess: () => { setSaved(true); setPhoto(null); } });
  }

  return (
    <>
      <AccountHeader title="Edit profile" subtitle="Your name, phone number and photo." />

      {!user ? (
        <Skeleton height={380} radius={28} />
      ) : (
        <form onSubmit={submit} noValidate className={`rise ${styles.layout}`} style={{ animationDelay: "100ms" }}>
          <div className={styles.photoCard}>
            <PhotoPicker src={user.avatar} alt={user.name} size={150} onPick={setPhoto} fallback={<ChatAvatar name={user.name} size={150} />} />
            <h2 className={styles.photoName}>{user.name}</h2>
            <p className={styles.photoEmail}>{user.email}</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.title}>Personal details</h2>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="profile-name" className={styles.label}>Full name</label>
                <input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={cx(styles.input, touched && errors.name && styles.invalid)} />
                {touched && errors.name && <span role="alert" className={styles.error}>{errors.name}</span>}
              </div>
              <div className={styles.field}>
                <label htmlFor="profile-phone" className={styles.label}>Phone number</label>
                <input id="profile-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="01xxxxxxxxx" className={cx(styles.input, touched && errors.phone && styles.invalid)} />
                {touched && errors.phone && <span role="alert" className={styles.error}>{errors.phone}</span>}
              </div>
              <div className={styles.field}>
                <label htmlFor="profile-email" className={styles.label}>Email</label>
                <input id="profile-email" value={user.email ?? ""} disabled className={styles.input} />
                <span className={styles.hint}>Your email can&apos;t be changed.</span>
              </div>
            </div>

            <div className={styles.footer}>
              {saved && <span role="status" className={styles.saved}><Check aria-hidden size={18} /> Changes saved</span>}
              {update.isError && <span role="alert" className={styles.formError}>{getErrorMessage(update.error)}</span>}
              <Button type="submit" disabled={update.isPending}>{update.isPending ? "Saving…" : "Save changes"}</Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
