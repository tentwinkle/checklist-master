
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, PlusCircle, AlertTriangle, CheckCircle, XCircle, Eye, Layers } from "lucide-react";
import type { User as AppUser } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || `Failed to fetch users: ${response.statusText}`);
        }
        const data: AppUser[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || "An unknown error occurred while fetching users.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const UserRowSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton className="h-5 w-10" /></TableCell> {/* DB ID */}
      <TableCell><Skeleton className="h-5 w-32" /></TableCell> {/* Name */}
      <TableCell><Skeleton className="h-5 w-40" /></TableCell> {/* Email */}
      <TableCell><Skeleton className="h-5 w-28" /></TableCell> {/* Username */}
      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell> {/* Role */}
      <TableCell><Skeleton className="h-5 w-24" /></TableCell> {/* Phone */}
      <TableCell><Skeleton className="h-5 w-16" /></TableCell> {/* Active */}
      <TableCell className="text-right space-x-1">
        <Skeleton className="h-8 w-8 inline-block rounded-md" />
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <PageTitle
        title="Manage Users"
        icon={Users}
        description="Add, edit, and manage users and their roles."
        actions={
          <Link href="/admin/users/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add User
            </Button>
          </Link>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>All users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="my-4 p-4 bg-destructive/10 border border-destructive/50 text-destructive rounded-md flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DB ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => <UserRowSkeleton key={`skeleton-${index}`} />)
              ) : users.length === 0 && !error ? (
                 <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Layers className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No users found.</p>
                        <Link href="/admin/users/add" className="mt-2">
                            <Button variant="outline">Add First User</Button>
                        </Link>
                       </div>
                    </TableCell>
                  </TableRow>
              ) : (
                users.map((user) => {
                  const userName = ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || user.email || user.firebaseUid;
                  return (
                    <TableRow key={user.firebaseUid}> {/* Key by firebaseUid for consistency */}
                      <TableCell>{user.id}</TableCell>
                      <TableCell className="font-medium">{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.username || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'ADMIN' ? 'default' : user.role === 'SUPERADMIN' ? 'destructive' : 'secondary'}>
                          {user.role === 'ADMIN' ? 'Admin' : user.role === 'INSPECTOR' ? 'Inspector' : user.role === 'SUPERADMIN' ? 'Super Admin' : 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                      <TableCell>
                        {user.isActive ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/users/${user.firebaseUid}`}>
                          <Button variant="ghost" size="icon" className="hover:text-primary" title="View User Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
