import type { Metadata } from "next";
import { AuthCard } from "@/components/AuthCard/AuthCard";
import { routes } from "@/config/routes";

export const metadata: Metadata = { title: "Create your account" };

export default function RegisterPage() {
  return <AuthCard title="Create your account" message="The form is coming in the next step." linkHref={routes.login} linkLabel="I already have an account" />;
}
