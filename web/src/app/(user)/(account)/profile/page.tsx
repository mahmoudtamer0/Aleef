import type { Metadata } from "next";
import { ProfileForm } from "@/components/ProfileForm/ProfileForm";

export const metadata: Metadata = { title: "Edit profile" };

export default function ProfilePage() {
  return <ProfileForm />;
}
