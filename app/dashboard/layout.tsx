import { requireAuth } from "@/lib/auth-helpers";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  
  return <DashboardLayout>{children}</DashboardLayout>;
}
