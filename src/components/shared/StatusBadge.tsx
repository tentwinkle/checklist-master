import { Badge } from "@/components/ui/badge";
import type { ReportItemStatus } from "@/types";

interface StatusBadgeProps {
  status: ReportItemStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<ReportItemStatus, string> = {
    Completed: "bg-green-100 text-green-700 border-green-300 dark:bg-green-700 dark:text-green-100 dark:border-green-500", // Custom green
    Upcoming: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-600 dark:text-orange-100 dark:border-orange-500", // Custom orange
    Overdue: "bg-red-100 text-red-700 border-red-300 dark:bg-red-700 dark:text-red-100 dark:border-red-500", // Custom red
  };

  return (
    <Badge variant="outline" className={`px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}
