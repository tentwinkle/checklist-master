import AppLayout from "@/app/(app)/layout";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout currentRole="SUPERADMIN">{children}</AppLayout>;
}
