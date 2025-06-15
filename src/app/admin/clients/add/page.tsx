
"use client";

import React, { useState } from 'react';
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Briefcase, Mail, Phone, Building } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function AddClientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!clientName || !email || !companyName) {
      toast({
        title: "Missing Fields",
        description: "Client Name, Email, and Company Name are required.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const tempPassword = generateRandomPassword(16);
      const auth = getFirebaseAuth();
      const displayName = clientName;

      const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName });
      await sendPasswordResetEmail(auth, email);

      const clientProfileData = {
        clientName,
        email,
        companyName,
        phone: phone || null,
        firebaseUid: firebaseUser.uid,
      };

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientProfileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Attempt to delete Firebase user if DB insert fails to avoid orphaned auth account
        try {
            await firebaseUser.delete();
            console.warn(`Firebase user ${firebaseUser.uid} for ${email} deleted due to DB profile creation failure.`);
        } catch (deleteError) {
            console.error(`Failed to delete Firebase user ${firebaseUser.uid} after DB error:`, deleteError);
        }
        throw new Error(errorData.details || errorData.error || 'Failed to add client to database');
      }

      toast({
        title: "Client Added Successfully!",
        description: `Client "${clientName}" has been created. A password setup email has been sent to ${email}.`,
      });
      router.push("/admin/clients");

    } catch (error: any) {
      console.error("Failed to add client:", error);
      let errorMessage = "Failed to add client. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email address is already in use by Firebase Authentication for another user/client.";
      } else if (error.message.includes('Failed to add client to database')) {
        errorMessage = error.message;
      } else if (error.code) {
        errorMessage = `Auth Error: ${error.code} - ${error.message}`;
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast({
        title: "Error adding client",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Add New Client" icon={UserPlus} description="Create a new client record. They will receive a password setup email." />
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>
            Enter the details for the new client. Client Name, Email, and Company Name are required.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                Client Full Name*
              </Label>
              <Input 
                id="clientName" 
                placeholder="e.g., John Doe" 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                Client Email Address*
              </Label>
              <Input 
                id="email" 
                type="email"
                placeholder="e.g., client@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                Company Name*
              </Label>
              <Input 
                id="companyName" 
                placeholder="e.g., ACME Corp" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                Phone No. (Optional)
              </Label>
              <Input 
                id="phone" 
                placeholder="e.g., +123456789" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
             <p className="text-xs text-muted-foreground">The client will be created in Firebase Authentication and receive a password setup email. Their profile details will be saved to the application database.</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/admin/clients">
              <Button variant="outline" type="button" disabled={isLoading}>Cancel</Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              <UserPlus className="mr-2 h-4 w-4" />
              {isLoading ? "Adding Client..." : "Add Client & Send Invite"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
