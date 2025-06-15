
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/Logo";
import React, { useState } from 'react';
import { getFirebaseAuth } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import type { User as AppUser } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFirebaseLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const auth = getFirebaseAuth();

    if (!email || !password) {
      toast({
        title: "Login Error",
        description: "Email and password cannot be empty.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser || !firebaseUser.uid) {
        throw new Error("Firebase user not found after login.");
      }

      // Fetch user profile from your backend to get the role
      const profileResponse = await fetch(`/api/users/${firebaseUser.uid}`);
      
      if (!profileResponse.ok) {
        if (profileResponse.status === 404) {
             toast({
                title: "Login Error",
                description: "Authentication successful, but no user profile found in our system. Please check your database or contact support.",
                variant: "destructive",
                duration: 7000,
            });
        } else {
            let errorDetails = "Failed to fetch user profile.";
            try {
                const errorData = await profileResponse.json();
                errorDetails = errorData.details || errorData.error || errorDetails;
            } catch(e) { /* ignore if parsing error data fails */ }
            
            toast({
                title: "Login Error",
                description: `Could not retrieve your user details: ${errorDetails}`,
                variant: "destructive",
                duration: 7000,
            });
        }
        setIsLoading(false);
        return;
      }

      const userProfile: AppUser = await profileResponse.json();
      
      // Log the fetched user profile for debugging
      console.log("Fetched user profile from API:", JSON.stringify(userProfile, null, 2));

      if (!userProfile || !userProfile.role) {
         toast({
            title: "Login Error",
            description: "User profile retrieved, but critical information (like role) is missing. Please check the console for the fetched profile or contact support.",
            variant: "destructive",
            duration: 7000,
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userProfile.firstName || userProfile.username || 'User'}! Role: ${userProfile.role}`,
      });

      // Redirect based on role
      switch (userProfile.role) {
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'SUPERADMIN':
          router.push('/superadmin/dashboard');
          break;
        case 'INSPECTOR':
          router.push('/inspector/dashboard');
          break;
        case 'USER':
          router.push('/user/dashboard');
          break;
        default:
          toast({
            title: "Login Warning",
            description: `Logged in, but your role ('${userProfile.role}') is unrecognized. Defaulting to user dashboard.`,
            variant: "default", 
            duration: 7000,
          });
          router.push('/user/dashboard'); 
      }

    } catch (error: any) {
      console.error("Login process error:", error);
      let errorMessage = "Login failed. Please check your credentials.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "The email address is not valid.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This user account has been disabled.";
      } else if (error.message && error.message.includes("fetch user profile")) {
        errorMessage = `Login error: Could not retrieve your user profile. ${error.message}`;
      } else if (error.message && error.message.includes("Firebase user not found after login")) {
        errorMessage = "An unexpected issue occurred during login. Please try again.";
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isLoading) return; 

    if (!email) {
      toast({
        title: "Forgot Password",
        description: "Please enter your email address in the email field first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const auth = getFirebaseAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: `If an account exists for ${email}, a password reset link has been sent. Please check your inbox and spam/junk folder.`,
      });
    } catch (error: any) {
      console.error("Firebase password reset error:", error);
      let errorMessage = "Failed to send password reset email.";
      if (error.code === 'auth/invalid-email') {
        errorMessage = "The email address is not valid.";
      } else if (error.code === 'auth/user-not-found') {
        // Message handled by success toast
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many requests. Please try again later.";
      }
      
      if (error.code !== 'auth/user-not-found') { // Only show error if not "user not found" (already handled by success msg)
        toast({
            title: "Forgot Password Error",
            description: `${errorMessage} If the problem persists, please try again later.`,
            variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your inspection dashboard.</CardDescription>
        </CardHeader>
        <form onSubmit={handleFirebaseLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="#" 
                  onClick={handleForgotPassword}
                  className={`text-sm text-primary hover:underline ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                  aria-disabled={isLoading}
                  tabIndex={isLoading ? -1 : 0}
                >
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardContent>
        </form>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Region Holbæk Inspections</p>
      </footer>
    </div>
  );
}
