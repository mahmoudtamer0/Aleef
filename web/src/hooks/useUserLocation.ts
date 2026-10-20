import { useCallback, useState } from "react";

export type Coords = { lat: number; lng: number };
export type LocationStatus = "idle" | "asking" | "granted" | "denied" | "unsupported" | "error";

// ~1 km precision: avoids new searches for tiny GPS changes.
const round = (n: number) => Math.round(n * 100) / 100;

// Asks the browser for the user's position (only when `request()` is called).
export function useUserLocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) return setStatus("unsupported");
    setStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: round(pos.coords.latitude), lng: round(pos.coords.longitude) });
        setStatus("granted");
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { timeout: 10_000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  const clear = useCallback(() => {
    setCoords(null);
    setStatus("idle");
  }, []);

  return { coords, status, request, clear };
}
