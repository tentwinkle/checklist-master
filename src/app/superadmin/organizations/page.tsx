"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building,
  PlusCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Layers,
} from "lucide-react";
import type { Organization } from "@/types";

export default function ManageOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/organizations");
        if (!response.ok) {
          let errMsg = `Failed to fetch organizations: ${response.statusText}`;
          try {
            const data = await response.json();
            errMsg = data.details || data.error || errMsg;
          } catch {
            /* ignore */
          }
          throw new Error(errMsg);
        }
        const data: Organization[] = await response.json();
        setOrganizations(data);
      } catch (err: any) {
        console.error("Error fetching organizations:", err);
        setError(
          err.message ||
            "An unknown error occurred while fetching organizations."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const OrganizationRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8 inline-block rounded-md" />
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <PageTitle
        title="Manage Organizations"
        icon={Building}
        description="Create and manage organizations within the system."
        actions={
          <Link href="/superadmin/organizations/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Organization
            </Button>
          </Link>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Organization List</CardTitle>
          <CardDescription>All organizations in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="my-4 p-4 bg-destructive/10 border border-destructive/50 text-destructive rounded-md flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <p>
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <OrganizationRowSkeleton key={`skeleton-${index}`} />
                ))
              ) : organizations.length === 0 && !error ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Layers className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No organizations found.</p>
                      <Link href="/superadmin/organizations/add" className="mt-2">
                        <Button variant="outline">Add First Organization</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>{org.id}</TableCell>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>
                      {new Date(org.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {org.isActive ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" /> Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-primary"
                        disabled
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
