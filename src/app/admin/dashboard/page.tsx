
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Users2, FileText as FormsIcon, Activity, ListChecks } from "lucide-react"; 
import Link from "next/link";

const StatCard = ({ title, value, icon: Icon, iconBgColor, iconColor }: { title: string; value: string; icon: React.ElementType; iconBgColor: string; iconColor: string; }) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${iconBgColor}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
    </CardContent>
  </Card>
);


export default function AdminDashboardPage() {
  // Mock stats removed, will use placeholders or real data later
  const stats = [
    { title: "Total Active Clients", value: "0", icon: Users2, iconBgColor: "bg-blue-100 dark:bg-blue-900/50", iconColor: "text-blue-600 dark:text-blue-400" },
    { title: "Total Active Users", value: "0", icon: Users, iconBgColor: "bg-green-100 dark:bg-green-900/50", iconColor: "text-green-600 dark:text-green-400" },
    { title: "Total Forms Submitted", value: "0", icon: FormsIcon, iconBgColor: "bg-purple-100 dark:bg-purple-900/50", iconColor: "text-purple-600 dark:text-purple-400" },
  ];

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <StatCard 
            key={stat.title} 
            title={stat.title} 
            value={stat.value} // Using placeholder value
            icon={stat.icon} 
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Welcome to CheckFlow</CardTitle>
          <CardDescription>Your comprehensive checklist management system is ready to help you organize and track your operations efficiently.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-foreground">Getting Started:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Add clients to the system</li>
              <li>Create user accounts for your team</li>
              <li>Set up forms and workflows</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-foreground">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Real-time collaboration</li>
              <li>Mobile-friendly interface</li>
              <li>Secure data management</li>
              <li>Comprehensive reporting (via Forms)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Management Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/users" passHref><Button variant="outline" className="w-full justify-start gap-2"><Users className="h-4 w-4" /> Manage Users</Button></Link>
            <Link href="/admin/clients" passHref><Button variant="outline" className="w-full justify-start gap-2"><Users2 className="h-4 w-4" /> Manage Clients</Button></Link>
            <Link href="/admin/forms" passHref><Button variant="outline" className="w-full justify-start gap-2"><FormsIcon className="h-4 w-4" /> Manage Forms</Button></Link>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest forms submitted or activity.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mock recent activity removed */}
            <p className="text-sm text-muted-foreground">No recent activity to display.</p>
            {/* 
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm py-2 border-b border-border last:border-b-0">
                <div>
                  <p className="font-medium text-foreground">Equipment Check Form - John Doe</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </li>
              <li className="flex justify-between items-center text-sm py-2 border-b border-border last:border-b-0">
                 <div>
                  <p className="font-medium text-foreground">Safety Audit Form - Jane Smith</p>
                  <p className="text-xs text-orange-500">Upcoming review</p>
                </div>
                <span className="text-xs text-muted-foreground">Due in 3 days</span>
              </li>
            </ul>
            */}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
