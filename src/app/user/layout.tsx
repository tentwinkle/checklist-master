
import AppLayout from "@/app/(app)/layout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout currentRole="USER">{children}</AppLayout>;
}

