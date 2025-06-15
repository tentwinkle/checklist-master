
import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function UserDashboardPage() {
  return (
    <>
      <PageTitle title="User Dashboard" icon={LayoutDashboard} description="Welcome to your dashboard." />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Your quick summary and actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is your personal dashboard. You can access available forms and see relevant information here.
          </p>
          {/* Placeholder for user-specific dashboard content */}
        </CardContent>
      </Card>
    </>
  );
}
