// src/app/signup/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { handleSignUpAction, type SignUpActionState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';
import NextLink from 'next/link'; // For linking to login or home
import { useRouter } from 'next/navigation';

const initialSignUpState: SignUpActionState = {
  success: false,
  message: '',
  errors: null,
};

function SubmitButton() {
  const [isPending, setIsPending] = React.useState(false);
  // This is a workaround since useFormStatus is not directly available here for this button type
  // In a real form, useFormStatus would be ideal.
  // For now, we'll manage pending state through the action state effect.

  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
      Create Account
    </Button>
  );
}

export default function SignUpPage() {
  const [signUpState, signUpFormAction, isSigningUp] = useActionState(handleSignUpAction, initialSignUpState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isSigningUp && signUpState.message) {
      if (signUpState.success) {
        toast({
          title: 'Account Created!',
          description: signUpState.message,
          variant: 'default',
        });
        // Redirect to a dashboard or home page after successful sign-up
        router.push('/'); // Or a protected route like '/dashboard'
      } else {
        let description = signUpState.message;
        if (signUpState.errors?.email) description += ` Email: ${signUpState.errors.email.join(' ')}`;
        if (signUpState.errors?.password) description += ` Password: ${signUpState.errors.password.join(' ')}`;
        if (signUpState.errors?.firebase) description = signUpState.errors.firebase.join(' ');
        
        toast({
          title: 'Sign Up Failed',
          description: description || "An unexpected error occurred.",
          variant: 'destructive',
        });
      }
    }
  }, [signUpState, isSigningUp, toast, router]);

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
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Enter your email and password to join ScholarAI.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signUpFormAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email
              </Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              {signUpState.errors?.email && (
                <p className="text-xs text-destructive flex items-center mt-1">
                  <AlertCircle className="mr-1 h-3 w-3" /> {signUpState.errors.email.join(', ')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                <Lock className="mr-2 h-4 w-4 text-muted-foreground" /> Password
              </Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
              {signUpState.errors?.password && (
                <p className="text-xs text-destructive flex items-center mt-1">
                  <AlertCircle className="mr-1 h-3 w-3" /> {signUpState.errors.password.join(', ')}
                </p>
              )}
            </div>
            {signUpState.errors?.firebase && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-start">
                  <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" /> {signUpState.errors.firebase.join('; ')}
                </p>
              )}
            <CardFooter className="p-0 pt-4">
              <Button type="submit" className="w-full" disabled={isSigningUp}>
                {isSigningUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Create Account
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
        &copy; {new Date().getFullYear()} ScholarAI. All rights reserved.
      </p>
    </div>
  );
}
