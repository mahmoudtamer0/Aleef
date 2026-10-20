import type { Metadata } from "next";
import { AuthCard } from "@/components/AuthCard/AuthCard";
import { routes } from "@/config/routes";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return <AuthCard title="Log in" message="The form is coming in the next step." linkHref={routes.register} linkLabel="Create an account" />;
}
