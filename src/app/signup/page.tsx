
// src/app/signup/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';

const signUpFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string[]; password?: string[]; firebase?: string[] } | null>(null);
  
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(null);

    const validation = signUpFormSchema.safeParse({ email, password });
    if (!validation.success) {
      const zodErrors = validation.error.flatten().fieldErrors;
      setErrors(zodErrors);
      toast({
        title: 'Sign Up Failed',
        description: "Please correct the errors in the form.",
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, validation.data.email, validation.data.password);
      toast({
        title: 'Account Created!',
        description: "Account created successfully! Redirecting...",
        variant: 'default',
      });
      router.push('/'); 
    } catch (error: any) {
      let firebaseErrorMessage = "Failed to create account. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        firebaseErrorMessage = 'This email address is already in use by another account.';
      } else if (error.code === 'auth/weak-password') {
        firebaseErrorMessage = 'The password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
          firebaseErrorMessage = 'The email address is not valid.';
      }
      setErrors({ firebase: [firebaseErrorMessage] });
      toast({
        title: 'Sign Up Failed',
        description: firebaseErrorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setErrors(null);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: 'Sign Up Successful!',
        description: "Signed up with Google successfully! Redirecting...",
        variant: 'default',
      });
      router.push('/');
    } catch (error: any) {
      let firebaseErrorMessage = "Failed to sign up with Google. Please try again.";
      if (error.code === 'auth/account-exists-with-different-credential') {
        firebaseErrorMessage = 'An account already exists with this email using a different sign-in method. Please log in with that method.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        firebaseErrorMessage = 'Sign-up popup closed by user. Please try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        firebaseErrorMessage = 'Multiple sign-up popups open. Please close other popups and try again.';
      }
      setErrors({ firebase: [firebaseErrorMessage] });
      toast({
        title: 'Google Sign-Up Failed',
        description: firebaseErrorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
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
              Foss AI
            </h1>
          </div>
      </NextLink>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Enter your email and password to join Foss AI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleSignUp}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 fill-current">
                <title>Google</title>
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.67-4.66 1.67-3.86 0-6.99-3.16-6.99-7.12s3.13-7.12 6.99-7.12c1.96 0 3.41.79 4.3 1.7l2.43-2.42C18.09.47 15.49 0 12.48 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.28 0 11.43-4.39 11.43-11.72 0-.81-.07-1.61-.21-2.36h-11.22z"/>
              </svg>
            )}
            Sign up with Google
          </Button>

          <div className="flex items-center space-x-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

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
                disabled={isLoading || isGoogleLoading}
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
                placeholder="•••••••• (min. 6 characters)" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
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
              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Create Account with Email
              </Button>
            </CardFooter>
          </form>
        </CardContent>
        <div className="p-6 pt-0 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <NextLink href="/login" className="font-medium text-primary hover:underline underline-offset-2">
            Log In
          </NextLink>
        </div>
      </Card>
       <p className="mt-8 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Foss AI. All rights reserved.
      </p>
    </div>
  );
}
