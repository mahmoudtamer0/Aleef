import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelAppointment, createAppointment, getAppointmentDetails, getMyAppointments, getUpcomingAppointment } from "@/lib/api/appointments";

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export const useUpcomingAppointment = () => useQuery({ queryKey: ["appointments", "upcoming"], queryFn: getUpcomingAppointment });

// One appointment with its doctor, pet and (when accepted) the chat id.
// staleTime 0: the status can change any moment (the doctor accepts), so always check again when the page opens.
export const useAppointmentDetails = (appointmentId: string) =>
  useQuery({
    queryKey: ["appointments", "details", appointmentId],
    queryFn: () => getAppointmentDetails(appointmentId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, reason }: { appointmentId: string; reason: string }) => cancelAppointment(appointmentId, reason),
    // success or error, the appointment's status may have changed: look again
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
    // the doctor's time slot is free again
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor"] }),
  });
}

// "My appointments": the previous ones.
export const useMyAppointments = () => useQuery({ queryKey: ["appointments", "history"], queryFn: getMyAppointments });
