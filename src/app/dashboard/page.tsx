
// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, LayoutDashboard, History, FileText, Settings, PlusCircle, BarChart2, ExternalLink, UserCircle, Info, BookOpen, Zap } from 'lucide-react';
import NextLink from 'next/link';
import type { Metadata } from 'next'; // For potential future server component parent

// Note: Metadata object cannot be used in client components for static export.
// If SEO for this page is critical, consider moving metadata to a server component parent or layout.
// export const metadata: Metadata = {
//   title: 'My Dashboard - ScholarAI',
//   description: 'Your personal ScholarAI dashboard. View recent activity, quick actions, and stats.',
// };

const DashboardStatCard: React.FC<{ title: string; value: string; icon: React.ElementType; description: string, className?: string }> = ({ title, value, icon: Icon, description, className }) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-primary">{value}</div>
      <p className="text-xs text-muted-foreground pt-1">{description}</p>
    </CardContent>
  </Card>
);

const QuickActionCard: React.FC<{ title: string; href: string; icon: React.ElementType; description: string }> = ({ title, href, icon: Icon, description }) => (
 <NextLink href={href} passHref>
    <Card className="hover:shadow-lg hover:border-accent transition-all duration-200 cursor-pointer h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent/20 rounded-md">
             <Icon className="h-6 w-6 text-accent" />
          </div>
          <CardTitle className="text-lg font-semibold text-primary">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
       <CardFooter className="pt-0">
         <Button variant="link" className="p-0 text-sm text-accent">
            Go to {title} <ExternalLink className="ml-1.5 h-3.5 w-3.5"/>
          </Button>
       </CardFooter>
    </Card>
  </NextLink>
);


export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push('/login'); // Redirect if not logged in
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Welcome back, <span className="text-accent">{currentUser.displayName || currentUser.email?.split('@')[0] || 'Researcher'}!</span>
        </h1>
        <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl">
          Here's your ScholarAI dashboard. Manage your research and access tools.
        </p>
      </header>

      {/* Placeholder for no actual data backend */}
       <Alert variant="default" className="mb-6 sm:mb-8 bg-primary/5 border-primary/20 text-primary dark:bg-primary/10 dark:border-primary/30 dark:text-primary-foreground/90 shadow-md">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary">Developer Note: Placeholder Content</AlertTitle>
        <AlertDescription className="text-primary/80 dark:text-primary-foreground/80 mt-1 text-sm">
          The dashboard and history features currently display placeholder data. Full functionality for recent activity, stats, and research history requires backend database integration to store and retrieve user-specific information.
        </AlertDescription>
      </Alert>

      {/* Stats Overview Section - Placeholder */}
      <section className="mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 sm:mb-6 flex items-center">
          <BarChart2 className="mr-3 h-7 w-7 text-accent" />
          Your Activity At a Glance
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardStatCard title="Research Started" value="0" icon={FileText} description="Total research sessions initiated." className="bg-card/80 backdrop-blur-sm"/>
          <DashboardStatCard title="Reports Generated" value="0" icon={BookOpen} description="Comprehensive reports created." className="bg-card/80 backdrop-blur-sm"/>
          <DashboardStatCard title="Queries Formulated" value="0" icon={Zap} description="AI-assisted query sets." className="bg-card/80 backdrop-blur-sm"/>
        </div>
         <p className="text-xs text-muted-foreground mt-3 text-center sm:text-left">Data is illustrative and not yet tracked.</p>
      </section>

      {/* Quick Actions Section */}
      <section className="mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 sm:mb-6 flex items-center">
            <PlusCircle className="mr-3 h-7 w-7 text-accent" />
            Quick Actions
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard 
                title="Start New Research" 
                href="/" 
                icon={FileText}
                description="Begin a new research exploration with your topic or question." 
            />
            <QuickActionCard 
                title="View Documentation" 
                href="/docs" 
                icon={BookOpen}
                description="Learn how to use ScholarAI features effectively." 
            />
            <QuickActionCard 
                title="Account Settings" 
                href="/account-settings" 
                icon={Settings}
                description="Manage your profile, preferences, and security." 
            />
        </div>
      </section>
      
      {/* Recent Activity Section - Placeholder */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 sm:mb-6 flex items-center">
            <History className="mr-3 h-7 w-7 text-accent" />
            Recent Activity
        </h2>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-primary/90">Last Research Query</CardTitle>
            <CardDescription className="text-sm">This is where your most recent research topic would appear.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">
              No research activity logged yet. Start a new research session to see it here.
            </p>
            {/* Example of how an item might look:
            <div className="p-3 bg-secondary/50 rounded-md mt-2">
                <p className="font-medium text-foreground/90">"The impact of AI on renewable energy sector."</p>
                <p className="text-xs text-muted-foreground mt-1">Accessed: 2 hours ago</p>
            </div>
            */}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <NextLink href="/account-settings#history">
                View Full History <ExternalLink className="ml-2 h-4 w-4"/>
              </NextLink>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <CardFooter className="mt-10 sm:mt-12 text-center border-t pt-6 text-xs text-muted-foreground">
        <p className="mx-auto">
          Need help? Visit our <NextLink href="/docs" className="text-accent hover:underline">Documentation</NextLink>.
        </p>
      </CardFooter>
    </div>
  );
}
