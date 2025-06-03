
// src/app/not-found.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import NextLink from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found (404) - ScholarAI',
  description: "Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
};

export default function NotFoundPage() {
  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg text-center shadow-2xl border-destructive/30 rounded-xl overflow-hidden">
        <CardHeader className="p-8 sm:p-10 bg-gradient-to-br from-destructive/15 via-transparent to-destructive/5 rounded-t-xl">
          <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-destructive to-destructive/80 rounded-full mb-5 sm:mb-6 mx-auto ring-2 ring-destructive/40 shadow-lg text-destructive-foreground">
            <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-extrabold text-destructive tracking-tight">
            404 - Page Not Found
          </CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground mt-3 sm:mt-4 max-w-md mx-auto">
            Oops! It seems the page you were looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <p className="text-base text-foreground/80 mb-6 sm:mb-8">
            Don't worry, it happens to the best of us. Let's get you back on track.
            You can return to our homepage or try searching again.
          </p>
           <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-input hover:border-primary/70 hover:bg-muted/50">
              <NextLink href="/">
                <Home className="mr-2 h-5 w-5" /> Go to Homepage
              </NextLink>
            </Button>
             <Button asChild size="lg" variant="default" className="w-full sm:w-auto">
              <NextLink href="/contact">
                <ArrowLeft className="mr-2 h-5 w-5" /> Contact Support
              </NextLink>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="p-6 sm:p-8 text-xs text-muted-foreground bg-secondary/30 dark:bg-secondary/10 border-t border-border/50">
          <p className="mx-auto">If you believe this is an error, please feel free to let us know.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
