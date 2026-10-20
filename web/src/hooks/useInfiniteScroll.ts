import { useEffect, useRef } from "react";

// Put the returned ref on an element at the bottom of the list.
// When it comes into view (a bit early, 300px), `onReach` runs: that's what loads the next page.
export function useInfiniteScroll(onReach: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && onReach(), { rootMargin: "300px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onReach, enabled]);

  return ref;
}
