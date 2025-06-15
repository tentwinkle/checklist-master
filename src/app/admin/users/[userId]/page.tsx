
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft, UserCircle2, Fingerprint, AtSign, Mail, Briefcase, Phone, CheckCircle, XCircle } from "lucide-react";
import type { User as AppUser } from "@/types";

const DetailItem = ({ icon: Icon, label, value, children }: { icon: React.ElementType, label: string, value?: string | number | null | undefined, children?: React.ReactNode }) => (
    <div className="flex items-start space-x-3 py-2">
        <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            {value !== undefined && <p className="text-md font-medium text-foreground">{value || 'N/A'}</p>}
            {children}
        </div>
    </div>
  );

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string; // This will be firebaseUid

  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/${userId}`); // Fetch by firebaseUid
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("User not found.");
          }
          const errorData = await response.json();
          throw new Error(errorData.details || `Failed to fetch user: ${response.statusText}`);
        }
        const data: AppUser = await response.json();
        setUser(data);
      } catch (err: any) {
        console.error("Error fetching user details:", err);
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (isLoading) {
    return (
      <>
        <PageTitle title="Loading User Details..." icon={UserCircle2} />
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(8)].map((_, i) => ( 
              <div key={i} className="space-y-1 py-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t pt-6">
             <Skeleton className="h-10 w-40" />
          </CardFooter>
        </Card>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageTitle title="Error" icon={AlertTriangle} description="Could not load user details." />
        <Card className="shadow-lg">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => router.push("/admin/users")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PageTitle title="User Not Found" icon={AlertTriangle} />
         <Card className="shadow-lg">
            <CardContent className="py-8 text-center">
                <p>The user could not be found.</p>
                 <Button onClick={() => router.push("/admin/users")} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
                </Button>
            </CardContent>
        </Card>
      </>
    );
  }
  
  return (
    <>
      <PageTitle title={`User: ${user.firstName} ${user.lastName}`} icon={UserCircle2} description={`Details for user (Firebase UID): ${user.firebaseUid}`} />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>All recorded details for this user.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <DetailItem icon={Fingerprint} label="Database ID" value={user.id} />
            <DetailItem icon={Fingerprint} label="Firebase UID" value={user.firebaseUid} />
            <DetailItem icon={UserCircle2} label="First Name" value={user.firstName} />
            <DetailItem icon={UserCircle2} label="Last Name" value={user.lastName} />
            <DetailItem icon={AtSign} label="Username" value={user.username} />
            <DetailItem icon={Mail} label="Email Address" value={user.email} />
            <DetailItem icon={Phone} label="Phone Number" value={user.phone} />
            <DetailItem icon={Briefcase} label="Role">
                <Badge variant={user.role === 'ADMIN' ? 'default' : user.role === 'SUPERADMIN' ? 'destructive' : 'secondary'}>
                    {user.role === 'ADMIN' ? 'Admin' : user.role === 'INSPECTOR' ? 'Inspector' : user.role === 'SUPERADMIN' ? 'Super Admin' : 'User'}
                </Badge>
            </DetailItem>
            <DetailItem icon={user.isActive ? CheckCircle : XCircle} label="Account Status">
                 <span className={`flex items-center ${user.isActive ? "text-green-600" : "text-red-600"}`}>
                    {user.isActive ? <CheckCircle className="mr-2 h-5 w-5" /> : <XCircle className="mr-2 h-5 w-5" />}
                    {user.isActive ? 'Active' : 'Inactive'}
                </span>
            </DetailItem>
        </CardContent>
        <CardFooter className="border-t pt-6 mt-4">
           <Button onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Users
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
