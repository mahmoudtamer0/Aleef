import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/lib/api/profile";
import type { ProfileInput } from "@/types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProfileInput) => updateProfile(input),
    // the name and photo in the navbar come from "me": ask for it again
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });
}
