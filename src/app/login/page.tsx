// src/app/login/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { handleLoginAction, type LoginActionState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn, Mail, Lock, AlertCircle, UserPlus } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

const initialLoginState: LoginActionState = {
  success: false,
  message: '',
  errors: null,
};

export default function LoginPage() {
  const [loginState, loginFormAction, isLoggingIn] = useActionState(handleLoginAction, initialLoginState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggingIn && loginState.message) {
      if (loginState.success) {
        toast({
          title: 'Login Successful!',
          description: loginState.message,
          variant: 'default',
        });
        router.push('/'); // Redirect to home or dashboard after login
      } else {
        let description = loginState.message;
        // Prioritize firebase general error message if available
        if (loginState.errors?.firebase) {
            description = loginState.errors.firebase.join(' ');
        } else {
            if (loginState.errors?.email) description += ` Email: ${loginState.errors.email.join(' ')}`;
            if (loginState.errors?.password) description += ` Password: ${loginState.errors.password.join(' ')}`;
        }
        
        toast({
          title: 'Login Failed',
          description: description || "An unexpected error occurred.",
          variant: 'destructive',
        });
      }
    }
  }, [loginState, isLoggingIn, toast, router]);

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
          <form action={loginFormAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email
              </Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              {loginState.errors?.email && (
                <p className="text-xs text-destructive flex items-center mt-1">
                  <AlertCircle className="mr-1 h-3 w-3" /> {loginState.errors.email.join(', ')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                <Lock className="mr-2 h-4 w-4 text-muted-foreground" /> Password
              </Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
              {loginState.errors?.password && (
                <p className="text-xs text-destructive flex items-center mt-1">
                  <AlertCircle className="mr-1 h-3 w-3" /> {loginState.errors.password.join(', ')}
                </p>
              )}
            </div>
            {loginState.errors?.firebase && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-start">
                  <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" /> {loginState.errors.firebase.join('; ')}
                </p>
              )}
            <CardFooter className="p-0 pt-4">
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
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
