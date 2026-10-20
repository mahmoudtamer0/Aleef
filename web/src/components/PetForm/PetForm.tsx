"use client";

import { useState } from "react";
import { Bird, Cat, Dog, PawPrint } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { PhotoPicker } from "@/components/PhotoPicker/PhotoPicker";
import { routes } from "@/config/routes";
import { toIsoDate } from "@/lib/date";
import { petGenders, petTypes } from "@/lib/petOptions";
import { cx } from "@/lib/utils";
import type { Pet, PetInput } from "@/types";
import styles from "./PetForm.module.css";

const typeIcons: Record<string, typeof Cat> = { cat: Cat, dog: Dog, bird: Bird, other: PawPrint };

type Props = {
  /** when editing: the pet to start from */
  initial?: Pet;
  submitLabel: string;
  busy: boolean;
  error?: string;
  onSubmit: (input: PetInput) => void;
};

// The same form adds a new pet and edits an existing one.
export function PetForm({ initial, submitLabel, busy, error, onSubmit }: Props) {
  const [values, setValues] = useState({
    name: initial?.name ?? "",
    type: initial?.species ?? "",
    gender: initial?.gender ?? "",
    birthDate: initial?.birthDate ?? "",
    breed: initial?.breed ?? "",
    weight: initial?.weight != null ? String(initial.weight) : "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);
  const set = (key: keyof typeof values, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const errors = {
    name: values.name.trim().length < 2 ? "Enter your pet's name." : "",
    type: values.type ? "" : "Choose a type.",
    gender: values.gender ? "" : "Choose a gender.",
    birthDate: values.birthDate ? "" : "Pick the birth date (an estimate is fine).",
    weight: values.weight && !(Number(values.weight) > 0) ? "Enter a valid weight." : "",
  };
  const isValid = Object.values(errors).every((e) => !e);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onSubmit({ name: values.name.trim(), type: values.type, gender: values.gender, birthDate: values.birthDate, breed: values.breed.trim() || undefined, weight: values.weight || undefined, photo });
  }

  const show = (key: keyof typeof errors) => touched && errors[key];

  return (
    <form onSubmit={submit} noValidate className={`rise ${styles.form}`} style={{ animationDelay: "100ms" }}>
      <div className={styles.photoCard}>
        <PhotoPicker src={initial?.photo} alt={initial?.name ?? "Pet photo"} shape="rounded" size={160} onPick={setPhoto} fallback={<PawPrint aria-hidden size={64} />} />
        <h2 className={styles.photoTitle}>{values.name.trim() || "Your pet"}</h2>
        <p className={styles.photoText}>A clear photo helps the doctor recognise your pet.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label htmlFor="pet-name" className={styles.label}>Name</label>
            <input id="pet-name" value={values.name} onChange={(e) => set("name", e.target.value)} placeholder="Cheetos" autoComplete="off" className={cx(styles.input, show("name") && styles.invalid)} />
            {show("name") && <span role="alert" className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Type</span>
            <div role="radiogroup" aria-label="Type" className={styles.choices}>
              {petTypes.map(({ value, label }) => {
                const Icon = typeIcons[value] ?? PawPrint;
                return (
                  <button key={value} type="button" role="radio" aria-checked={values.type === value} onClick={() => set("type", value)} className={cx(styles.choice, values.type === value && styles.choiceOn)}>
                    <Icon aria-hidden size={18} /> {label}
                  </button>
                );
              })}
            </div>
            {show("type") && <span role="alert" className={styles.error}>{errors.type}</span>}
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Gender</span>
            <div role="radiogroup" aria-label="Gender" className={styles.choices}>
              {petGenders.map(({ value, label }) => (
                <button key={value} type="button" role="radio" aria-checked={values.gender === value} onClick={() => set("gender", value)} className={cx(styles.choice, values.gender === value && styles.choiceOn)}>
                  {label}
                </button>
              ))}
            </div>
            {show("gender") && <span role="alert" className={styles.error}>{errors.gender}</span>}
          </div>

          <div className={styles.two}>
            <div className={styles.field}>
              <label htmlFor="pet-birth" className={styles.label}>Birth date</label>
              <input id="pet-birth" type="date" max={toIsoDate(new Date())} value={values.birthDate} onChange={(e) => set("birthDate", e.target.value)} className={cx(styles.input, show("birthDate") && styles.invalid)} />
              {show("birthDate") && <span role="alert" className={styles.error}>{errors.birthDate}</span>}
            </div>
            <div className={styles.field}>
              <label htmlFor="pet-weight" className={styles.label}>Weight (kg) <span className={styles.optional}>optional</span></label>
              <input id="pet-weight" type="number" inputMode="decimal" min="0" step="0.1" value={values.weight} onChange={(e) => set("weight", e.target.value)} placeholder="4.2" className={cx(styles.input, show("weight") && styles.invalid)} />
              {show("weight") && <span role="alert" className={styles.error}>{errors.weight}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="pet-breed" className={styles.label}>Breed <span className={styles.optional}>optional</span></label>
            <input id="pet-breed" value={values.breed} onChange={(e) => set("breed", e.target.value)} placeholder="Persian, Golden Retriever…" className={styles.input} />
          </div>
        </div>

        <div className={styles.footer}>
          {error && <span role="alert" className={styles.formError}>{error}</span>}
          <Button href={initial ? routes.pet(initial.id) : routes.pets} variant="outlineGreen">Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? "Saving…" : submitLabel}</Button>
        </div>
      </div>
    </form>
  );
}
