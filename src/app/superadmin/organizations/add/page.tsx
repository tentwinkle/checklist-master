"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, User, Mail, Save, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
  adminFirstName: z.string().min(1, "Admin first name is required"),
  adminLastName: z.string().min(1, "Admin last name is required"),
  adminEmail: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;

export default function AddOrganizationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errMsg = `Failed to create organization: ${response.statusText}`;
        try {
          const errData = await response.json();
          errMsg = errData.details || errData.error || errMsg;
        } catch {
          /* ignore */
        }
        throw new Error(errMsg);
      }

      toast({
        title: "Organization Created",
        description: `${data.name} created and admin invite sent to ${data.adminEmail}.`,
      });
      router.push("/superadmin/organizations");
    } catch (err: any) {
      console.error("Failed to create organization:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create organization.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PageTitle
        title="Add New Organization"
        icon={Building}
        description="Create a new organization and invite its first administrator."
      />
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Provide the organization name and administrator contact information.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                Organization Name*
              </Label>
              <Input id="name" placeholder="e.g., Region Holbæk" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adminFirstName" className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  Admin First Name*
                </Label>
                <Input id="adminFirstName" {...register("adminFirstName")} />
                {errors.adminFirstName && (
                  <p className="text-sm text-destructive">{errors.adminFirstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminLastName" className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  Admin Last Name*
                </Label>
                <Input id="adminLastName" {...register("adminLastName")} />
                {errors.adminLastName && (
                  <p className="text-sm text-destructive">{errors.adminLastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail" className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                Admin Email*
              </Label>
              <Input id="adminEmail" type="email" {...register("adminEmail")} />
              {errors.adminEmail && (
                <p className="text-sm text-destructive">{errors.adminEmail.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/superadmin/organizations">
              <Button variant="outline" type="button" disabled={isSubmitting}>
                <XCircle className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Organization"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
