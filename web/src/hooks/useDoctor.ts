import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { DoctorSort, getAvailableDoctors, getBestDoctors, getDoctorProfile, getDoctorSchedule, getDoctorSlots } from "@/lib/api/doctors";

export const useDoctorSchedule = (doctorId: string) =>
  useQuery({ queryKey: ["doctor", doctorId, "schedule"], queryFn: () => getDoctorSchedule(doctorId) });


export const useDoctorProfile = (doctorId: string) => useQuery({ queryKey: ["doctor", doctorId], queryFn: () => getDoctorProfile(doctorId) });

export function useDoctorSlots(doctorId: string, date: string | null, seed?: { date: string; slots: string[] }) {
  return useQuery({
    queryKey: ["doctor", doctorId, "slots", date],
    queryFn: () => getDoctorSlots(doctorId, date as string),
    enabled: !!date,
    initialData: seed && seed.date === date ? seed.slots : undefined,
  });
}

export const useBestDoctors = () => useQuery({ queryKey: ["doctors", "best"], queryFn: () => getBestDoctors(4) });

import type { Coords } from "./useUserLocation";

type Filters = { search: string; sort?: DoctorSort; coords: Coords | null };

export function useAvailableDoctors({ search, sort, coords }: Filters) {
  const lat = coords?.lat;
  const lng = coords?.lng;

  return useInfiniteQuery({
    queryKey: ["doctors", "available", { search, sort, lat, lng }], // new filters = new list from page 1
    queryFn: ({ pageParam }) => getAvailableDoctors({ page: pageParam, search, sort, lat, lng }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
  });
}