
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users as UsersIcon, PlusCircle, AlertTriangle, Layers, Eye } from "lucide-react";
import type { Client } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

export default function ManageClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
          // Try to parse error message from API if response is not ok
          let errorDetails = `Failed to fetch clients: ${response.statusText} (Status: ${response.status})`;
          try {
            const errorData = await response.json();
            errorDetails = errorData.details || errorData.error || errorDetails;
          } catch (jsonError) {
            // If response body is not JSON or empty
            console.warn("Could not parse error response as JSON for non-OK response", jsonError);
          }
          throw new Error(errorDetails);
        }
        const data: Client[] = await response.json();
        setClients(data);
      } catch (err: any) {
        console.error("Error fetching clients:", err);
        setError(err.message || "An unknown error occurred while fetching clients.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const ClientRowSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton className="h-5 w-10" /></TableCell> {/* ID */}
      <TableCell><Skeleton className="h-5 w-32" /></TableCell> {/* Client Name */}
      <TableCell><Skeleton className="h-5 w-40" /></TableCell> {/* Email */}
      <TableCell><Skeleton className="h-5 w-32" /></TableCell> {/* Company Name */}
      <TableCell><Skeleton className="h-5 w-28" /></TableCell> {/* Phone */}
      <TableCell><Skeleton className="h-5 w-24" /></TableCell> {/* Created At */}
      <TableCell className="text-right space-x-1">
        <Skeleton className="h-8 w-8 inline-block rounded-md" />
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <PageTitle
        title="Manage Clients"
        icon={UsersIcon}
        description="Create, view, and manage clients."
        actions={
          <Link href="/admin/clients/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </Link>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>A list of all clients.</CardDescription>
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
                <TableHead>ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Email ID</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Phone No.</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => <ClientRowSkeleton key={`skeleton-${index}`} />)
              ) : clients.length === 0 && !error ? (
                 <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                       <div className="flex flex-col items-center justify-center">
                        <Layers className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No clients found.</p>
                        <Link href="/admin/clients/add" className="mt-2">
                            <Button variant="outline">Add First Client</Button>
                        </Link>
                       </div>
                    </TableCell>
                  </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.id}</TableCell>
                    <TableCell className="font-medium">{client.clientName}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.companyName}</TableCell>
                    <TableCell>{client.phone || 'N/A'}</TableCell>
                    <TableCell>{format(new Date(client.createdAt), "PP")}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/clients/${client.id}`}>
                        <Button variant="ghost" size="icon" className="hover:text-primary" title="View Client Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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
