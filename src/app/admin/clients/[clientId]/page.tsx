
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ArrowLeft, Briefcase, Building, CalendarDays, Info, Mail, Phone, UserSquare2, Fingerprint } from "lucide-react";
import type { Client } from "@/types";
import { format } from 'date-fns';

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | null | undefined }) => (
    <div className="flex items-start space-x-3 py-2">
        <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-md font-medium text-foreground">{value || 'N/A'}</p>
        </div>
    </div>
  );

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;

  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;

    const fetchClientDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/clients/${clientId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Client not found.");
          }
          const errorData = await response.json();
          throw new Error(errorData.details || `Failed to fetch client: ${response.statusText}`);
        }
        const data: Client = await response.json();
        setClient(data);
      } catch (err: any) {
        console.error("Error fetching client details:", err);
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientDetails();
  }, [clientId]);

  if (isLoading) {
    return (
      <>
        <PageTitle title="Loading Client Details..." icon={UserSquare2} />
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => ( // Increased skeleton count for firebaseUid
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
        <PageTitle title="Error" icon={AlertTriangle} description="Could not load client details." />
        <Card className="shadow-lg">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => router.push("/admin/clients")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  if (!client) {
    return (
      <>
        <PageTitle title="Client Not Found" icon={AlertTriangle} />
         <Card className="shadow-lg">
            <CardContent className="py-8 text-center">
                <p>The client could not be found.</p>
                 <Button onClick={() => router.push("/admin/clients")} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
                </Button>
            </CardContent>
        </Card>
      </>
    );
  }
  
  return (
    <>
      <PageTitle title={`Client: ${client.clientName}`} icon={UserSquare2} description={`Details for client ID: ${client.id}`} />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>All recorded details for this client.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <DetailItem icon={Info} label="Client Database ID" value={client.id} />
            <DetailItem icon={Briefcase} label="Client Full Name" value={client.clientName} />
            <DetailItem icon={Mail} label="Email Address" value={client.email} />
            <DetailItem icon={Building} label="Company Name" value={client.companyName} />
            <DetailItem icon={Phone} label="Phone Number" value={client.phone} />
            <DetailItem icon={Fingerprint} label="Firebase UID" value={client.firebaseUid} />
            <DetailItem icon={CalendarDays} label="Client Record Created At" value={format(new Date(client.createdAt), "PPP p")} />
        </CardContent>
        <CardFooter className="border-t pt-6 mt-4">
           <Button onClick={() => router.push("/admin/clients")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Clients
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
