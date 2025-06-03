
// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, LayoutDashboard, History, FileText, Settings, PlusCircle, BarChart2, ExternalLink, UserCircle, Info, BookOpen, Zap, UploadCloud, ClockIcon, Search, FileSignature, Activity } from 'lucide-react';
import NextLink from 'next/link';
import type { Metadata } from 'next';
import { getResearchHistory, type ResearchActivityItem } from '@/lib/historyService';

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
  const [recentActivities, setRecentActivities] = useState<ResearchActivityItem[]>([]);
  const [stats, setStats] = useState({ sessions: 0, reports: 0, activities: 0 });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const history = getResearchHistory();
        setRecentActivities(history);
        
        // Calculate stats
        const uniqueSessions = new Set(history.filter(item => item.type === 'query-formulation').map(item => item.question)).size;
        const reportCount = history.filter(item => item.type === 'report-generation' || item.type === 'file-report-generation').length;
        setStats({ sessions: uniqueSessions, reports: reportCount, activities: history.length });

      } else {
        router.push('/login'); 
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
  
  const displayedActivities = recentActivities.slice(0, 3); // Show latest 3 activities

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

       <Alert variant="default" className="mb-6 sm:mb-8 bg-primary/5 border-primary/20 text-primary dark:bg-primary/10 dark:border-primary/30 dark:text-primary-foreground/90 shadow-md">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary">Local Activity Tracking</AlertTitle>
        <AlertDescription className="text-primary/80 dark:text-primary-foreground/80 mt-1 text-sm">
          Your dashboard stats and research history are based on activity stored locally in this browser.
        </AlertDescription>
      </Alert>

      <section className="mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 sm:mb-6 flex items-center">
          <BarChart2 className="mr-3 h-7 w-7 text-accent" />
          Your Activity At a Glance
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardStatCard title="Research Sessions Initiated" value={stats.sessions.toString()} icon={Search} description="Unique research questions explored." className="bg-card/80 backdrop-blur-sm"/>
          <DashboardStatCard title="Reports Generated" value={stats.reports.toString()} icon={BookOpen} description="Comprehensive reports created." className="bg-card/80 backdrop-blur-sm"/>
          <DashboardStatCard title="Total Activities Logged" value={stats.activities.toString()} icon={Activity} description="Total interactions recorded." className="bg-card/80 backdrop-blur-sm"/>
        </div>
         <p className="text-xs text-muted-foreground mt-3 text-center sm:text-left">Data reflects activity stored locally in this browser.</p>
      </section>

      <section className="mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 sm:mb-6 flex items-center">
            <PlusCircle className="mr-3 h-7 w-7 text-accent" />
            Quick Actions
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            <QuickActionCard 
                title="Start New Research" 
                href="/" 
                icon={FileText}
                description="Begin a new research exploration with your topic or question." 
            />
            <QuickActionCard 
                title="Generate Report from File" 
                href="/file-report" 
                icon={UploadCloud}
                description="Upload your document and provide guidance for a tailored report." 
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
      
      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 sm:mb-6 flex items-center">
            <History className="mr-3 h-7 w-7 text-accent" />
            Recent Activity
        </h2>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-primary/90">Latest Research Items</CardTitle>
            <CardDescription className="text-sm">A glimpse of your recent interactions with ScholarAI (locally stored).</CardDescription>
          </CardHeader>
          <CardContent>
            {displayedActivities.length > 0 ? (
              <ul className="space-y-3">
                {displayedActivities.map(item => {
                  let itemIcon = <Search className="inline h-4 w-4 mr-2 text-accent/80"/>;
                  let itemDescription = item.question;
                  if (item.type === 'report-generation') {
                    itemIcon = <BookOpen className="inline h-4 w-4 mr-2 text-accent/80"/>;
                    itemDescription = item.reportTitle || item.question;
                  }
                  if (item.type === 'file-report-generation') {
                     itemIcon = <FileSignature className="inline h-4 w-4 mr-2 text-accent/80"/>;
                     itemDescription = item.reportTitle || `Report from file: ${item.question}`;
                  }
                  return (
                    <li key={item.id} className="p-3 bg-secondary/50 dark:bg-secondary/20 rounded-md hover:bg-secondary/70 dark:hover:bg-secondary/30 transition-colors border border-border/60">
                      <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground/90 text-sm truncate" title={itemDescription}>
                              {itemIcon}
                              {itemDescription.length > 60 ? `${itemDescription.substring(0, 60)}...` : itemDescription}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2 flex items-center">
                              <ClockIcon className="h-3 w-3 mr-1"/> {new Date(item.date).toLocaleDateString()}
                          </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted-foreground italic text-sm">
                No recent activity logged yet in this browser. Start a new research session to see it here.
              </p>
            )}
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
