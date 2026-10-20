"use client";

import { LocateFixed, Search } from "lucide-react";
import type { DoctorSort } from "@/lib/api/doctors";
import type { LocationStatus } from "@/hooks/useUserLocation";
import { cx } from "@/lib/utils";
import styles from "./DoctorToolbar.module.css";

type Props = {
  search: string;
  onSearch: (value: string) => void;
  sort?: DoctorSort;
  onSort: (value?: DoctorSort) => void;
  nearActive: boolean;
  locationStatus: LocationStatus;
  onToggleNear: () => void;
};

const warnings: Partial<Record<LocationStatus, string>> = {
  denied: "Location is blocked. Allow it in your browser settings to find nearby doctors.",
  unsupported: "Your browser doesn't support location.",
  error: "We couldn't get your location. Try again.",
};

// Search box + "Near me" + sort chips. It only shows controls; the parent owns the state.
export function DoctorToolbar({ search, onSearch, sort, onSort, nearActive, locationStatus, onToggleNear }: Props) {
  const sorts: { value?: DoctorSort; label: string }[] = [
    { value: undefined, label: nearActive ? "Nearest" : "Most booked" },
    { value: "top_rated", label: "Top rated" },
    { value: "lowest_price", label: "Lowest price" },
  ];
  const asking = locationStatus === "asking";

  return (
    <div>
      <div className={styles.bar}>
        <label className={styles.search}>
          <Search aria-hidden size={18} />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by name, city or specialty…"
            aria-label="Search doctors"
            className={styles.input}
          />
        </label>

        <button type="button" aria-pressed={nearActive} disabled={asking} onClick={onToggleNear} className={cx(styles.near, nearActive && styles.nearOn)}>
          <LocateFixed aria-hidden size={18} />
          {asking ? "Locating…" : "Near me"}
        </button>

        <div role="group" aria-label="Sort doctors" className={styles.chips}>
          {sorts.map(({ value, label }) => (
            <button key={label} type="button" aria-pressed={sort === value} onClick={() => onSort(value)} className={cx(styles.chip, sort === value && styles.chipOn)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {warnings[locationStatus] && <p role="alert" className={styles.warning}>{warnings[locationStatus]}</p>}
    </div>
  );
}
