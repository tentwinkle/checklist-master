
import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanLine, CheckSquare, AlertTriangle, ListChecks, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function InspectorDashboardPage() {
  const inspectorName = "Inspector"; // Using a generic placeholder

  // Mock tasks removed
  const tasks: { title: string; dueDate: string; status: string; id: string }[] = [];

  return (
    <>
      <PageTitle title={`Welcome, ${inspectorName}!`} icon={LayoutDashboard} description="Your upcoming inspections and recent activity." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-xl">Start New Inspection</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <ScanLine className="h-16 w-16 mb-4" />
            <p className="mb-4">Scan a QR code to begin an inspection for an item or asset.</p>
            <Link href="/inspector/scan">
              <Button variant="secondary" size="lg" className="font-semibold">
                Scan QR Code
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
            <CheckSquare className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">Data will update once available</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending/Overdue</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">Data will update once available</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Upcoming Inspections</CardTitle>
          <CardDescription>Your scheduled tasks for the near future.</CardDescription>
        </CardHeader>
        <CardContent>
           {tasks.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">No upcoming inspections assigned.</p>
           ) : (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center gap-2">
                    <StatusBadge status={task.status as "Upcoming" | "Overdue"} />
                    <Link href={`/inspector/checklist/${task.id}`}>
                      <Button size="sm" variant="outline">Start</Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
           )}
          <div className="mt-6 text-center">
            <Link href="/inspector/my-inspections">
              <Button variant="link" className="text-primary">
                View All My Inspections <ListChecks className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
