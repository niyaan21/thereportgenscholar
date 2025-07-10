
// src/app/api-docs/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code2, Construction, InfoIcon, ShieldCheck, Zap, Workflow, Image as ImageIcon, FileText, ListTree, KeyRound, Clock, GitMerge, Puzzle } from 'lucide-react';
import type { Metadata } from 'next';
import { useTranslation } from 'react-i18next';

export const metadata: Metadata = {
  title: 'Foss AI API Documentation (Developer Preview)',
  description: 'Explore the upcoming Foss AI API for programmatic access to powerful research tools and generative AI capabilities. Integrate AI-driven research into your applications.',
  openGraph: {
    title: 'Foss AI API Documentation (Developer Preview)',
    description: 'Unlock Foss AI\'s research functionalities programmatically. Details on planned endpoints, authentication, and integration for developers.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Foss AI API Documentation',
      },
    ],
  },
};

export default function ApiDocsPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="text-center p-8 sm:p-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-t-xl">
          <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-5 sm:mb-8 mx-auto ring-2 ring-accent/40 shadow-lg text-accent-foreground">
            <Code2 className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
          <CardTitle className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">{t('apiDocsPage.title')}</CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto">
            {t('apiDocsPage.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 md:p-10 space-y-10 text-base sm:text-lg text-foreground/90 leading-relaxed prose prose-lg dark:prose-invert max-w-none marker:text-accent">
          <p className="text-lg">
            {t('apiDocsPage.mainText')}
          </p>
          
          <Alert variant="default" className="bg-primary/5 border-primary/20 text-primary dark:bg-primary/10 dark:border-primary/30 dark:text-primary-foreground/90 shadow-md">
            <Construction className="h-7 w-7 text-primary" />
            <AlertTitle className="font-semibold text-xl text-primary">{t('apiDocsPage.alertTitle')}</AlertTitle>
            <AlertDescription className="text-primary/80 dark:text-primary-foreground/80 mt-2 text-base">
              {t('apiDocsPage.alertDescription')}
            </AlertDescription>
          </Alert>
              
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mt-10 mb-5">
               <Zap className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
               {t('apiDocsPage.introTitle')}
            </h2>
            <p>{t('apiDocsPage.introText1')}</p>
            <p className="mt-3">{t('apiDocsPage.introText2')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mt-10 mb-5">
               <ListTree className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
               {t('apiDocsPage.endpointsTitle')}
            </h2>
            <p>{t('apiDocsPage.endpointsText')}</p>
            <div className="space-y-6 mt-5">
              <Card className="bg-secondary/30 dark:bg-secondary/10 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-primary/90 flex items-center"><Workflow className="h-5 w-5 mr-2.5 text-accent/80"/>{t('apiDocsPage.endpointQuery')}</CardTitle>
                  <CardDescription className="text-sm">{t('apiDocsPage.endpointQueryDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Method:</strong> POST</p>
                  <p><strong>Request Body:</strong> `{'{ "researchQuestion": "Your complex question..." }'}`</p>
                  <p><strong>Response:</strong> `{'{ "searchQueries": ["query1", "query2", ...] }'}`</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary/30 dark:bg-secondary/10 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-primary/90 flex items-center"><Puzzle className="h-5 w-5 mr-2.5 text-accent/80"/>{t('apiDocsPage.endpointSynth')}</CardTitle>
                  <CardDescription className="text-sm">{t('apiDocsPage.endpointSynthDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Method:</strong> POST</p>
                  <p><strong>Request Body:</strong> `{'{ "queries": ["query1", ...], "papers": [{ "title": "...", "abstract": "..." }, ...] }'}` (either queries or papers)</p>
                  <p><strong>Response:</strong> `{'{ "summary": "Concise synthesized insights..." }'}`</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary/30 dark:bg-secondary/10 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-primary/90 flex items-center"><FileText className="h-5 w-5 mr-2.5 text-accent/80"/>{t('apiDocsPage.endpointReport')}</CardTitle>
                  <CardDescription className="text-sm">{t('apiDocsPage.endpointReportDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Method:</strong> POST</p>
                  <p><strong>Request Body:</strong> `{'{ "researchQuestion": "...", "summary": "Optional contextual summary..." }'}`</p>
                  <p><strong>Response:</strong> Detailed JSON structure of the generated report (similar to the web app's output).</p>
                </CardContent>
              </Card>
               <Card className="bg-secondary/30 dark:bg-secondary/10 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-primary/90 flex items-center"><ImageIcon className="h-5 w-5 mr-2.5 text-accent/80"/>{t('apiDocsPage.endpointImage')}</CardTitle>
                  <CardDescription className="text-sm">{t('apiDocsPage.endpointImageDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Method:</strong> POST</p>
                  <p><strong>Request Body:</strong> `{'{ "topic": "Your research topic/summary..." }'}`</p>
                  <p><strong>Response:</strong> `{'{ "imageDataUri": "data:image/png;base64,..." }'}`</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mt-10 mb-5">
               <KeyRound className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
               {t('apiDocsPage.authTitle')}
            </h2>
            <p>
              {t('apiDocsPage.authText1')}
            </p>
            <p className="mt-3">
              {t('apiDocsPage.authText2')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mt-10 mb-5">
               <Clock className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
               {t('apiDocsPage.rateLimitTitle')}
            </h2>
            <p>
              {t('apiDocsPage.rateLimitText1')}
            </p>
            <p className="mt-3">
              {t('apiDocsPage.rateLimitText2')}
            </p>
          </section>

           <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mt-10 mb-5">
               <GitMerge className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
               {t('apiDocsPage.versioningTitle')}
            </h2>
            <p>
              {t('apiDocsPage.versioningText')}
            </p>
          </section>
          
          <CardFooter className="text-center p-0 pt-10">
            <p className="mx-auto text-muted-foreground text-base">
              {t('apiDocsPage.footerText')}
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
