
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Mail, Briefcase, Phone, AtSign } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { getFirebaseAuth } from "@/lib/firebase"; 
import { createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "firebase/auth";

const generateRandomPassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

const userFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "INSPECTOR", "USER"]), // Updated roles to uppercase
  isActive: z.boolean().default(true).optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function AddUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "INSPECTOR",
      isActive: true,
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const tempPassword = generateRandomPassword(16);
      const auth = getFirebaseAuth();
      const displayName = `${data.firstName} ${data.lastName}`;

      const userCredential = await createUserWithEmailAndPassword(auth, data.email, tempPassword);
      const user = userCredential.user;

      await updateProfile(user, { displayName });
      
      await sendPasswordResetEmail(auth, data.email);

      const userProfileData = {
        firebaseUid: user.uid,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        role: data.role as UserRole,
        isActive: data.isActive,
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to store user profile in database.');
      }

      toast({
        title: "User Created Successfully",
        description: `${displayName} has been added and their profile stored. A password setup email has been sent to ${data.email}.`,
      });
      
      router.push("/admin/users");

    } catch (error: any) {
      console.error("Failed to create user or store profile:", error);
      let errorMessage = "Failed to add user. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email address is already in use by Firebase Authentication.";
      } else if (error.message.includes('Failed to store user profile')) {
        errorMessage = error.message;
      } else if (error.code) {
        errorMessage = `Auth Error: ${error.code} - ${error.message}`;
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PageTitle title="Add New User" icon={UserPlus} description="Create a new user account. Their profile will be stored in the database." />
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>The user will be created in Firebase Authentication and receive a password setup email. Their profile details will be saved to the application database.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  First Name*
                </Label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => <Input id="firstName" placeholder="e.g., John" {...field} />}
                />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  Last Name*
                </Label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => <Input id="lastName" placeholder="e.g., Doe" {...field} />}
                />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center">
                <AtSign className="mr-2 h-4 w-4 text-muted-foreground" />
                Username*
              </Label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => <Input id="username" placeholder="e.g., johndoe" {...field} />}
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail" className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                Email Address*
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <Input id="userEmail" type="email" placeholder="user@example.com" {...field} />}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  Phone (Optional)
                </Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => <Input id="phone" placeholder="e.g., +1234567890" {...field} />}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="userRole" className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  Role*
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="userRole">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Organization Admin</SelectItem>
                        <SelectItem value="INSPECTOR">Inspector</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">The user will receive an email with a secure link to set their password. Their profile details will be saved.</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/admin/users">
              <Button variant="outline" type="button" disabled={isSubmitting}>Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding User..." : "Add User & Send Invite"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
