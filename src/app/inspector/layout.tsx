import AppLayout from "@/app/(app)/layout";

export default function InspectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout currentRole="INSPECTOR">{children}</AppLayout>;
}
