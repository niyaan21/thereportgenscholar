
// src/app/docs/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpenText, ArrowRight, Lightbulb, Workflow, Download, Sparkles, Settings, AlertTriangle, Search, Layers, FileTextIcon, UserCircle, HelpCircle, MessageSquareQuestion, KeyboardIcon, Mic, BrainCircuit, UploadCloud, ShieldCheck, AudioLines } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DocsPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="text-center p-8 sm:p-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-t-xl">
          <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-5 sm:mb-8 mx-auto ring-2 ring-accent/40 shadow-lg text-accent-foreground">
            <BookOpenText className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
          <CardTitle className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">{t('docsPage.title')}</CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto">
            {t('docsPage.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 md:p-10 text-base sm:text-lg text-foreground/90 leading-relaxed prose prose-lg dark:prose-invert max-w-none marker:text-accent">
          <p className="mb-8">
            {t('docsPage.welcome')}
          </p>
          
          <Accordion type="multiple" defaultValue={['getting-started', 'core-features']} className="w-full space-y-4">
            <AccordionItem value="getting-started" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                  <Lightbulb className="h-6 w-6 mr-3 text-accent" /> {t('docsPage.gettingStartedTitle')}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p>{t('docsPage.gettingStartedText')}</p>
                <ol className="list-decimal list-outside space-y-2 pl-5 mt-3">
                  <li><strong>{t('docsPage.gettingStartedS1')}</strong> <NextLink href="/signup" className="text-accent hover:underline font-medium">{t('docsPage.gettingStartedS1Link1')}</NextLink>. {t('login.or')} <NextLink href="/login" className="text-accent hover:underline font-medium">{t('docsPage.gettingStartedS1Link2')}</NextLink>.</li>
                  <li><strong>{t('docsPage.gettingStartedS2')}</strong> <NextLink href="/" className="text-accent hover:underline font-medium">{t('docsPage.gettingStartedS2Link')}</NextLink>.</li>
                  <li><strong>{t('docsPage.gettingStartedS3')}</strong></li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="core-features" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                 <Sparkles className="h-6 w-6 mr-3 text-accent" /> {t('docsPage.coreFeaturesTitle')}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 space-y-5">
                <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><Search className="h-5 w-5 mr-2 text-accent/80"/>{t('docsPage.featureQueryTitle')}</h4>
                  <p>{t('docsPage.featureQueryText')}</p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><Layers className="h-5 w-5 mr-2 text-accent/80"/>{t('docsPage.featureSynthesisTitle')}</h4>
                  <p>{t('docsPage.featureSynthesisText')}</p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><FileTextIcon className="h-5 w-5 mr-2 text-accent/80"/>{t('docsPage.featureReportTitle')}</h4>
                  <p>{t('docsPage.featureReportText')}</p>
                </div>
                 <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><UploadCloud className="h-5 w-5 mr-2 text-accent/80"/>{t('docsPage.featureFileTitle')}</h4>
                  <p>{t('docsPage.featureFileText')}</p>
                </div>
                 <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><Mic className="h-5 w-5 mr-2 text-accent/80"/>{t('docsPage.featureVoiceTitle')}</h4>
                  <p>{t('docsPage.featureVoiceText')}</p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><AudioLines className="h-5 w-5 mr-2 text-accent/80"/>{t('docsPage.featureTranscriptionTitle')}</h4>
                  <p>{t('docsPage.featureTranscriptionText')}</p>
                </div>
                 <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><BrainCircuit className="h-5 w-5 mr-2 text-accent/80"/>{t('docsPage.featureMindmapTitle')}</h4>
                  <p>{t('docsPage.featureMindmapText')}</p>
                </div>
                 <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><Download className="h-5 w-5 mr-2 text-accent/80"/>{t('docsPage.featureDownloadTitle')}</h4>
                  <p>{t('docsPage.featureDownloadText')}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="keyboard-shortcuts" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                 <KeyboardIcon className="h-6 w-6 mr-3 text-accent" /> {t('docsPage.shortcutsTitle')}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p>{t('docsPage.shortcutsText')} <code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm text-sm">Cmd</code> {t('docsPage.shortcutsTextModifier')} <code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm text-sm">Ctrl</code> on Windows/Linux).</p>
                <ul className="list-disc list-outside space-y-2 pl-5 mt-3">
                  <li><strong><code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm text-sm">Modifier + K</code>:</strong> Focus on the main research question input (when on the homepage).</li>
                  <li><strong><code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm text-sm">Modifier + Shift + H</code>:</strong> Navigate to the Home page.</li>
                  <li><strong><code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm text-sm">Modifier + Shift + D</code>:</strong> Navigate to your Dashboard.</li>
                  <li><strong><code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm text-sm">Modifier + Shift + ,</code>:</strong> Navigate to Account Settings.</li>
                  <li><strong><code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm text-sm">Modifier + Shift + U</code>:</strong> Navigate to File Report / Analysis Tools.</li>
                  <li><strong><code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm text-sm">Modifier + Shift + N</code>:</strong> Navigate to Notes & Transcription.</li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">More shortcuts are planned for future updates!</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="account-management" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                 <UserCircle className="h-6 w-6 mr-3 text-accent" /> {t('docsPage.accountTitle')}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p>{t('docsPage.accountText')}</p>
                <ul className="list-disc list-outside space-y-2 pl-5 mt-3">
                  <li><strong>{t('docsPage.accountS1')}</strong> <NextLink href="/account-settings" className="text-accent hover:underline font-medium">{t('docsPage.accountS1Link')}</NextLink>.</li>
                  <li><strong>{t('docsPage.accountS2')}</strong></li>
                  <li><strong>{t('docsPage.accountS3')}</strong> <NextLink href="/account-settings" className="text-accent hover:underline font-medium">{t('docsPage.accountS3Link')}</NextLink> page.</li>
                  <li><strong>{t('docsPage.accountS4')}</strong> <NextLink href="/account-settings" className="text-accent hover:underline font-medium">{t('docsPage.accountS4Link')}</NextLink>.</li>
                   <li><strong>{t('docsPage.accountS5')}</strong> <NextLink href="/account-settings#history" className="text-accent hover:underline font-medium">{t('docsPage.accountS5Link')}</NextLink>. This data is stored locally.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="plagiarism-detection" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                 <ShieldCheck className="h-6 w-6 mr-3 text-accent" /> {t('docsPage.plagiarismTitle')}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p>{t('docsPage.plagiarismText')}</p>
                <ul className="list-disc list-outside space-y-2 pl-5 mt-3">
                    <li><strong>{t('docsPage.plagiarismS1')}</strong></li>
                    <li><strong>{t('docsPage.plagiarismS2')}</strong></li>
                    <li><strong>{t('docsPage.plagiarismS3')}</strong></li>
                    <li><strong>{t('docsPage.plagiarismS4')}</strong></li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">{t('docsPage.plagiarismNotice')}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="advanced-tips" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                 <Settings className="h-6 w-6 mr-3 text-accent" /> {t('docsPage.tipsTitle')}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p>{t('docsPage.tipsText')}</p>
                <ul className="list-disc list-outside space-y-2 pl-5 mt-3">
                  <li><strong>{t('docsPage.tipsS1')}</strong></li>
                  <li><strong>{t('docsPage.tipsS2')}</strong></li>
                  <li><strong>{t('docsPage.tipsS3')}</strong></li>
                  <li><strong>{t('docsPage.tipsS4')}</strong></li>
                  <li><strong>{t('docsPage.tipsS5')}</strong></li>
                  <li><strong>{t('docsPage.tipsS6')}</strong></li>
                  <li><strong>{t('docsPage.tipsS7')}</strong></li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="troubleshooting" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                 <AlertTriangle className="h-6 w-6 mr-3 text-accent" /> {t('docsPage.troubleshootingTitle')}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                 <p className="mb-3">{t('docsPage.troubleshootingText')}</p>
                <ul className="list-disc list-outside space-y-2 pl-5">
                    <li><strong>{t('docsPage.troubleshootingS1')}</strong></li>
                    <li><strong>{t('docsPage.troubleshootingS2')}</strong></li>
                    <li><strong>{t('docsPage.troubleshootingS3')}</strong></li>
                    <li><strong>{t('docsPage.troubleshootingS4')}</strong></li>
                    <li><strong>{t('docsPage.troubleshootingS5')}</strong></li>
                     <li><strong>{t('docsPage.troubleshootingS6')}</strong></li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact-support" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                 <HelpCircle className="h-6 w-6 mr-3 text-accent" /> {t('docsPage.supportTitle')}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p>
                  {t('docsPage.supportText')}
                  <NextLink href="/contact" className="text-accent hover:underline font-medium"> {t('docsPage.supportTextLink')}</NextLink>.
                </p>
                <p className="mt-3">
                  {t('docsPage.supportText2')}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <CardFooter className="mt-10 text-center p-0 pt-8">
            <Button asChild size="lg" className="mx-auto bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-xl">
              <NextLink href="/">
                {t('docsPage.ctaButton')} <ArrowRight className="ml-2 h-5 w-5" />
              </NextLink>
            </Button>
          </CardFooter>
          <p className="text-center pt-8 text-muted-foreground text-base">
            {t('docsPage.evolving')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
