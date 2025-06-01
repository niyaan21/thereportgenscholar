
// src/app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }),
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string[]; password?: string[]; firebase?: string[] } | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(null);

    const validation = loginFormSchema.safeParse({ email, password });
    if (!validation.success) {
      const zodErrors = validation.error.flatten().fieldErrors;
      setErrors(zodErrors);
      toast({
        title: 'Login Failed',
        description: "Please correct the errors in the form.",
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, validation.data.email, validation.data.password);
      toast({
        title: 'Login Successful!',
        description: "Logged in successfully! Redirecting...",
        variant: 'default',
      });
      router.push('/'); // Redirect to home or dashboard after login
    } catch (error: any) {
      let firebaseErrorMessage = "Failed to log in. Please check your credentials and try again.";
       if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        firebaseErrorMessage = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        firebaseErrorMessage = 'The email address is not valid.';
      } else if (error.code === 'auth/user-disabled') {
        firebaseErrorMessage = 'This account has been disabled.';
      }
      setErrors({ firebase: [firebaseErrorMessage] });
      toast({
        title: 'Login Failed',
        description: firebaseErrorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-background p-4">
      <NextLink href="/" passHref className="mb-8">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg text-primary-foreground ring-2 ring-primary/40 ring-offset-2 ring-offset-card">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m10 14-2 2 2 2"></path><path d="m14 18 2-2-2-2"></path></svg>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent group-hover:from-accent group-hover:to-primary transition-all duration-300">
              ScholarAI
            </h1>
          </div>
      </NextLink>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Log in to continue your research with ScholarAI.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email
              </Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors?.email && (
                <p className="text-xs text-destructive flex items-center mt-1">
                  <AlertCircle className="mr-1 h-3 w-3" /> {errors.email.join(', ')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                <Lock className="mr-2 h-4 w-4 text-muted-foreground" /> Password
              </Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors?.password && (
                <p className="text-xs text-destructive flex items-center mt-1">
                  <AlertCircle className="mr-1 h-3 w-3" /> {errors.password.join(', ')}
                </p>
              )}
            </div>
            {errors?.firebase && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-start">
                  <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" /> {errors.firebase.join('; ')}
                </p>
              )}
            <CardFooter className="p-0 pt-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                Log In
              </Button>
            </CardFooter>
          </form>
        </CardContent>
        <div className="p-6 pt-0 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <NextLink href="/signup" className="font-medium text-primary hover:underline underline-offset-2">
            Sign Up
          </NextLink>
        </div>
      </Card>
       <p className="mt-8 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} ScholarAI. All rights reserved.
      </p>
    </div>
  );
}
