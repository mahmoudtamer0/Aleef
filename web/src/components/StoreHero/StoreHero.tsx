import { Bone, Cat, Dog, Fish, Search } from "lucide-react";
import styles from "./StoreHero.module.css";

type Props = { search: string; onSearch: (value: string) => void };

export function StoreHero({ search, onSearch }: Props) {
  return (
    <section className={`rise ${styles.hero}`} style={{ animationDelay: "100ms" }}>
      <div aria-hidden className={styles.orb} />

      <div className={styles.text}>
        <span className={styles.kicker}>ALEEF PET STORE</span>
        <h1 className={styles.title}>Everything your pet needs</h1>
        <p className={styles.subtitle}>Food, toys and care, picked for happy pets and delivered to your door.</p>
        <label className={styles.search}>
          <Search aria-hidden size={20} />
          <input type="search" value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search food, toys, litter…" aria-label="Search products" className={styles.input} />
        </label>
      </div>

      <div aria-hidden className={styles.bubbles}>
        <span className={`${styles.bubble} ${styles.b1}`}><Cat size={44} /></span>
        <span className={`${styles.bubble} ${styles.b2}`}><Bone size={30} /></span>
        <span className={`${styles.bubble} ${styles.b3}`}><Dog size={40} /></span>
        <span className={`${styles.bubble} ${styles.b4}`}><Fish size={28} /></span>
      </div>
    </section>
  );
}
