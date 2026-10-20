import { api, toObject } from "./client";
import { toUser } from "./auth";
import { endpoints } from "@/config/endpoints";
import { env } from "@/config/env";
import { mockDelay } from "@/lib/mock";
import { updateMockProfile } from "@/lib/mockAccount";
import type { ProfileInput, User } from "@/types";

// TODO: adjust the route and the field names to your real "update me" endpoint.
export async function updateProfile(input: ProfileInput): Promise<User> {
  if (env.useMock) return mockDelay(updateMockProfile(input), 900);
  const form = new FormData();
  form.append("name", input.name);
  form.append("phone", input.phone);
  if (input.photo) form.append("profilePic", input.photo);
  const res = await api.patch(endpoints.updateProfile, form);
  return toUser(toObject(res.data, "user"));
}
