import AppLayout from "@/app/(app)/layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout currentRole="ADMIN">{children}</AppLayout>;
}
