import { api, toObject } from "./client";
import { endpoints } from "@/config/endpoints";
import { env } from "@/config/env";
import { mockDelay } from "@/lib/mock";
import { getMockProfile } from "@/lib/mockAccount";
import type { User } from "@/types";

// TODO: adjust field names to your user model.
export const toUser = (raw: any): User => ({
  id: String(raw?.id ?? raw?._id ?? ""),
  name: raw?.name ?? raw?.fullName ?? raw?.full_name ?? "",
  email: raw?.email,
  avatar: raw?.profilePic ?? raw?.avatar ?? raw?.image ?? raw?.photo ?? null,
  phone: raw?.phone ?? undefined,
});

export async function getMe(): Promise<User> {
  if (env.useMock) return mockDelay(getMockProfile(), 300);
  const res = await api.get(endpoints.me);
  return toUser(toObject(res.data.user, "user"));
}
