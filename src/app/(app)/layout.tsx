import { AppHeader } from "@/components/shared/AppHeader";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { navConfig } from "@/config/nav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import type { UserRole } from "@/types";

interface AppLayoutProps {
  children: React.ReactNode;
  currentRole: UserRole; // This will be passed by role-specific layouts
}

export default function AppLayout({ children, currentRole }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <AppSidebar navItems={navConfig} currentRole={currentRole} />
        <SidebarInset className="flex flex-col flex-1">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
