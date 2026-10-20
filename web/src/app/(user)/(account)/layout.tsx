import { AccountShell } from "@/components/AccountShell/AccountShell";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
