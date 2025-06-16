"use client";

import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle2, Mail, KeyRound, ShieldAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast"; // Assuming useToast hook is available
import AppLayout from "@/app/(app)/layout"; // Import the AppLayout

// Mock current user data - in a real app, this would come from auth context
const MOCK_CURRENT_USER = {
  name: "Current User",
  email: "user@example.com",
  role: "orgAdmin" as "orgAdmin" | "superAdmin" | "inspector", // Example role
};

export default function ProfilePage() {
  const { toast } = useToast();

  const handleUpdateEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newEmail = formData.get("newEmail") as string;
    console.log("Updating email to:", newEmail);
    // Add Firebase logic here
    toast({
      title: "Email Update Requested",
      description: "Please check your current and new email inboxes to confirm the change.",
      variant: "default",
    });
  };

  const handleUpdatePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    console.log("Updating password...");
    // Add Firebase logic here
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
      variant: "default",
    });
    event.currentTarget.reset();
  };

  return (
    // Wrap content with AppLayout, providing a mock role or fetching dynamically
    <AppLayout currentRole={MOCK_CURRENT_USER.role}>
      <PageTitle title="My Profile" icon={UserCircle2} description="Manage your account settings and personal information." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Update Email Address</CardTitle>
            <CardDescription>Change the email address associated with your account. Verification will be required.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateEmail}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="currentEmail" className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  Current Email
                </Label>
                <Input id="currentEmail" type="email" value={MOCK_CURRENT_USER.email} readOnly disabled />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newEmail" className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  New Email Address
                </Label>
                <Input id="newEmail" name="newEmail" type="email" placeholder="new.email@example.com" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Update Email</Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password. Choose a strong, unique password.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdatePassword}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="currentPassword" className="flex items-center">
                  <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                  Current Password
                </Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newPassword" className="flex items-center">
                  <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                  New Password
                </Label>
                <Input id="newPassword" name="newPassword" type="password" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmNewPassword" className="flex items-center">
                  <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                 Confirm New Password
                </Label>
                <Input id="confirmNewPassword" name="confirmNewPassword" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Change Password</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
       <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <ShieldAlert className="mr-2 h-5 w-5" /> Account Security
            </CardTitle>
            <CardDescription>Additional security options for your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h4 className="font-medium">Two-Factor Authentication (2FA)</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
              </div>
              <Button variant="outline" disabled>Enable 2FA (Coming Soon)</Button>
            </div>
             <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h4 className="font-medium">Account Deletion</h4>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
              </div>
              <Button variant="destructive" disabled>Request Deletion (Coming Soon)</Button>
            </div>
          </CardContent>
        </Card>
    </AppLayout>
  );
}
