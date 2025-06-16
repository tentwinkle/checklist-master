import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BarChart3, LayoutDashboard } from "lucide-react"; // Removed Briefcase
import Link from "next/link";

export default function SuperAdminDashboardPage() {
  const stats = [
    // { title: "Total Organizations", value: "15", icon: Briefcase, color: "text-blue-500" }, // Removed
    { title: "Total Active Admins", value: "28", icon: Users, color: "text-green-500" }, // Assuming these are admins across all potential (now removed) orgs or system-wide admins
    { title: "Pending System Approvals", value: "3", icon: BarChart3, color: "text-orange-500" }, // Generalized
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">Updated just now</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>System Administration</CardTitle>
          <CardDescription>Perform high-level administrative tasks.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Links to User management might be relevant if SuperAdmins manage OrgAdmins directly */}
           <Link href="/admin/users" legacyBehavior> 
             <Button className="w-full justify-start text-left p-4 h-auto" variant="outline">
              <Users className="mr-3 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Manage All Users</p>
                <p className="text-xs text-muted-foreground">View and manage all user accounts in the system.</p>
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