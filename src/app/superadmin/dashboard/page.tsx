
import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BarChart3, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function SuperAdminDashboardPage() {
  // Mock stats removed
  const stats = [
    { title: "Total Active Admins", value: "0", icon: Users, color: "text-green-500" }, 
    { title: "Pending System Approvals", value: "0", icon: BarChart3, color: "text-orange-500" },
  ];

  return (
    <>
      <PageTitle title="Super Admin Dashboard" icon={LayoutDashboard} description="Overview of system activity and user management." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div> {/* Placeholder value */}
              <p className="text-xs text-muted-foreground">Data will update when available</p>
            </CardContent>
          </Card>
        ))}
        {/* Placeholder for a third card if needed, or adjust lg:grid-cols-3 */}
         <Card className="shadow-md hover:shadow-lg transition-shadow lg:col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <LayoutDashboard className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Nominal</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>System Administration</CardTitle>
          <CardDescription>Perform high-level administrative tasks.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
           <Link href="/admin/users" passHref> 
             <Button className="w-full justify-start text-left p-4 h-auto" variant="outline">
              <Users className="mr-3 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Manage All Users</p>
                <p className="text-xs text-muted-foreground">View and manage all user accounts.</p>
              </div>
            </Button>
          </Link>
           <Button className="w-full justify-start text-left p-4 h-auto" variant="outline" disabled>
              <BarChart3 className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">View System Logs (Soon)</p>
                <p className="text-xs text-muted-foreground">Monitor system activity and errors.</p>
              </div>
            </Button>
        </CardContent>
      </Card>
    </>
  );
}
