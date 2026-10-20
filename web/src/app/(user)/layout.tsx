import { AuthGuard } from "@/components/AuthGuard/AuthGuard";
import { Navbar } from "@/components/Navbar/Navbar";
import { DemoBanner } from "@/components/DemoBanner/DemoBanner";
import { PageContainer } from "@/components/PageContainer/PageContainer";
import { Toasts } from "@/components/Toasts/Toasts";
import { SocketProvider } from "@/context/SocketContext";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SocketProvider>
        <Navbar />
        <DemoBanner />
        <Toasts />
        <PageContainer>{children}</PageContainer>
      </SocketProvider>
    </AuthGuard>
  );
}
