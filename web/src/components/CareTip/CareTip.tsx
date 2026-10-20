"use client";

import { Lightbulb } from "lucide-react";
import { careTips } from "@/lib/careTips";
import { usePets } from "@/hooks/usePets";
import { useSelectedPet } from "@/hooks/usePets";
import styles from "./CareTip.module.css";

export function CareTip() {
  const { data: pets = [] } = usePets();
  const selectedId = useSelectedPet((s) => s.id);
  const pet = pets.find((p) => p.id === selectedId) ?? pets[0];
  const tip = careTips[new Date().getDate() % careTips.length];

  return (
    <div className={styles.card}>
      <span className={styles.icon}>
        <Lightbulb aria-hidden size={24} />
      </span>
      <div>
        <b className={styles.title}>{pet ? `Tip for ${pet.name}` : "Care tip"}</b>
        <p className={styles.text}>{tip}</p>
      </div>
    </div>
  );
}
