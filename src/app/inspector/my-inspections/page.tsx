import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ListChecks, Eye, FileText, Filter } from "lucide-react";
import type { InspectionReport } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MOCK_MY_REPORTS: InspectionReport[] = [
  {
    id: "myreport1",
    inspectorId: "currentUser", // Assuming current user
    inspectorName: "Bob The Builder",
    departmentId: "dept1",
    checklistTemplateId: "tmpl1",
    checklistName: "Fire Extinguisher Checks - ER (Corridor B)",
    inspectionDate: "2024-07-20",
    items: [{ itemId: "item1", itemName: "Pressure Gauge", status: "Approved" }],
    isFinalized: true,
    overallStatus: "Completed",
  },
  {
    id: "myreport2",
    inspectorId: "currentUser",
    inspectorName: "Bob The Builder",
    departmentId: "dept3",
    checklistTemplateId: "tmpl-maint1",
    checklistName: "HVAC Unit Inspection - Roof Unit 3",
    inspectionDate: "2024-07-19",
    items: [
      { itemId: "hvac1", itemName: "Filter Check", status: "Not Approved", notes: "Filter clogged, needs replacement." },
      { itemId: "hvac2", itemName: "Fan Motor", status: "Approved" },
    ],
    isFinalized: true,
    overallStatus: "Overdue", // Indicates an issue or requires follow-up
  },
  {
    id: "myreport3",
    inspectorId: "currentUser",
    inspectorName: "Bob The Builder",
    departmentId: "dept1",
    checklistTemplateId: "tmpl2",
    checklistName: "Emergency Cart Restock - ER Bay 1",
    inspectionDate: "2024-07-15",
    items: [{ itemId: "cartItem1", itemName: "Defibrillator Pads", status: "Approved" }],
    isFinalized: true,
    overallStatus: "Completed",
  },
];

export default function MyInspectionsPage() {
  return (
    <>
      <PageTitle
        title="My Inspections"
        icon={ListChecks}
        description="A log of all inspections you have submitted."
        actions={
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter Reports
            </Button>
          }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Inspection History</CardTitle>
          <CardDescription>Review your past inspection reports and their statuses.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Checklist/Asset Name</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Overall Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_MY_REPORTS.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.checklistName}</TableCell>
                  <TableCell>{new Date(report.inspectionDate).toLocaleDateString()}</TableCell>
                  <TableCell>{report.departmentId === "dept1" ? "Emergency Room" : "Maintenance"}</TableCell> {/* Mock department */}
                  <TableCell>
                    <StatusBadge status={report.overallStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                     {/* In a real app, this link would go to a detailed view of THIS specific report. */}
                    <Link href={`/inspector/checklist/${report.id}`}> {/* Placeholder using report ID as item ID */}
                      <Button variant="ghost" size="icon" className="hover:text-primary" title="View Report">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="hover:text-primary" title="Download PDF" disabled>
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {MOCK_MY_REPORTS.length === 0 && (
             <div className="text-center py-8 text-muted-foreground">
               You haven't submitted any inspections yet.
             </div>
           )}
        </CardContent>
      </Card>
    </>
  );
}

