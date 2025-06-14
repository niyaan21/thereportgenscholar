
'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { useActionState } from 'react';
import NextLink from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ResearchReportDisplay from '@/components/scholar-ai/ResearchReportDisplay';
import { handleGenerateReportFromFileAction, type GenerateReportFromFileActionState } from '@/app/actions';
import type { GenerateReportFromFileOutput } from '@/ai/flows/generate-report-from-file';
import { UploadCloud, FileText, Wand2, Loader2, ArrowLeft, RotateCcw, AlertCircle, Lock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { addResearchActivity } from '@/lib/historyService'; // Import history service
import type { Metadata } from 'next';


// Client components cannot export metadata directly.
// This can be defined in a layout.tsx if SEO is critical for this page.
// export const metadata: Metadata = {
//   title: 'File-Powered Report Generation - Foss AI',
//   description: 'Upload your document and provide guidance to generate a custom research report with Foss AI.',
// };

const initialReportFromFileState: GenerateReportFromFileActionState = {
  success: false,
  message: '',
  researchReport: null,
  errors: null,
  originalGuidance: '',
};

export default function FileReportPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [reportState, formAction, isGenerating] = useActionState(handleGenerateReportFromFileAction, initialReportFromFileState);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [guidanceQuery, setGuidanceQuery] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isGenerating && reportState.message) {
      if (reportState.success && reportState.researchReport) {
        toast({
          title: '📜 Report Generated from File!',
          description: reportState.message,
          variant: 'default',
          duration: 7000,
        });
        setShowReport(true);
        if (currentUser && reportState.originalGuidance) {
           addResearchActivity({
            type: 'file-report-generation',
            question: reportState.originalGuidance,
            reportTitle: reportState.researchReport.title,
            executiveSummarySnippet: reportState.researchReport.executiveSummary?.substring(0, 150) + (reportState.researchReport.executiveSummary && reportState.researchReport.executiveSummary.length > 150 ? '...' : '')
          });
        }
        // Scroll to report section
        document.getElementById('file-report-display-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (!reportState.success) {
        let description = reportState.message;
        if (reportState.errors) {
          const errorDetails = Object.values(reportState.errors).flat().join(' ');
          if (errorDetails) {
            description += ` ${errorDetails}`;
          }
        }
        toast({
          title: '🚫 Report Generation Failed',
          description,
          variant: 'destructive',
          duration: 9000,
        });
        setShowReport(false);
      }
    }
  }, [reportState, isGenerating, toast, currentUser]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  const handleStartNew = () => {
    setShowReport(false);
    setFileName(null);
    setGuidanceQuery(''); 
    const form = document.getElementById('fileReportForm') as HTMLFormElement;
    form?.reset();
    // Visually clearing the form and allowing new submission.
    // To truly reset useActionState, you might need to remount the component or use a key.
    // For this prototype, visual reset is sufficient.
  };
  
  const isFormDisabled = (!currentUser && authChecked) || isGenerating;

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 sm:mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          File-Powered Report Generation
        </h1>
        <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your document, provide guidance, and let Foss AI craft a tailored report.
        </p>
      </header>

      {!authChecked && (
        <Card className="w-full max-w-xl mx-auto mb-8 shadow-lg animate-pulse">
            <CardHeader><div className="h-8 w-3/4 bg-muted/50 rounded"></div></CardHeader>
            <CardContent className="space-y-4">
                <div className="h-6 w-1/4 bg-muted/50 rounded"></div>
                <div className="h-10 w-full bg-muted/50 rounded-md"></div>
                <div className="h-6 w-1/4 bg-muted/50 rounded mt-2"></div>
                <div className="h-24 w-full bg-muted/50 rounded-md"></div>
            </CardContent>
            <CardFooter><div className="h-12 w-36 bg-muted/50 rounded-lg ml-auto"></div></CardFooter>
        </Card>
      )}

      {authChecked && !currentUser && (
        <Alert variant="destructive" className="max-w-xl mx-auto mb-8 bg-destructive/10 border-destructive/30 text-destructive">
          <Lock className="h-5 w-5" />
          <AlertTitle className="font-semibold">Authentication Required</AlertTitle>
          <AlertDescription>
            Please{' '}
            <NextLink href="/login" className="font-medium hover:underline underline-offset-2">
              log in
            </NextLink>{' '}
            or{' '}
            <NextLink href="/signup" className="font-medium hover:underline underline-offset-2">
              sign up
            </NextLink>{' '}
            to use this feature.
          </AlertDescription>
        </Alert>
      )}

      {authChecked && currentUser && !showReport && (
        <Card className="w-full max-w-xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
          <form id="fileReportForm" action={formAction}>
            <CardHeader className="p-6 bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
              <CardTitle className="text-2xl font-semibold text-primary flex items-center">
                <UploadCloud className="mr-3 h-7 w-7 text-accent" />
                Upload & Guide
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Select a document and tell us what to focus on. Supported: .txt, .md, .pdf, .doc, .docx (up to 5MB).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file" className="text-base">Document File</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  required
                  onChange={handleFileChange}
                  disabled={isGenerating}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-70"
                  accept=".txt,.md,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,application/pdf"
                />
                {fileName && <p className="text-sm text-muted-foreground mt-1">Selected: {fileName}</p>}
                {reportState.errors?.file && (
                  <p className="text-xs text-destructive flex items-center mt-1">
                    <AlertCircle className="mr-1 h-3 w-3" /> {reportState.errors.file.join(', ')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guidanceQuery" className="text-base">Guidance Query</Label>
                <Textarea
                  id="guidanceQuery"
                  name="guidanceQuery"
                  placeholder="e.g., Focus on the methodology section and summarize key findings related to Topic X. Extract all mentions of Company Y."
                  rows={5}
                  required
                  minLength={10}
                  maxLength={1000}
                  disabled={isGenerating}
                  value={guidanceQuery}
                  onChange={(e) => setGuidanceQuery(e.target.value)}
                  className="text-base"
                />
                {reportState.errors?.guidanceQuery && (
                  <p className="text-xs text-destructive flex items-center mt-1">
                    <AlertCircle className="mr-1 h-3 w-3" /> {reportState.errors.guidanceQuery.join(', ')}
                  </p>
                )}
              </div>
                 <Alert variant="default" className="bg-secondary/30 dark:bg-secondary/10 border-border/50 text-foreground/80">
                    <Info className="h-5 w-5 text-accent"/>
                    <AlertTitle className="font-medium text-primary/90">Note on File Processing</AlertTitle>
                    <AlertDescription className="text-xs">
                        The AI will attempt to extract text and analyze content from your uploaded file. Complex PDFs or DOCX files might have limitations in automated text extraction by the AI model. Plain text or Markdown files generally yield the best results.
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter className="p-6 bg-secondary/20 dark:bg-secondary/10 border-t">
              <Button type="submit" className="w-full sm:w-auto ml-auto text-base py-3" disabled={isGenerating || !currentUser}>
                {isGenerating ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-5 w-5" />
                )}
                {isGenerating ? 'Generating Report...' : 'Generate Report from File'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {showReport && reportState.researchReport && (
        <div id="file-report-display-section" className="mt-10">
          <ResearchReportDisplay
            report={reportState.researchReport}
            originalQuestion={reportState.originalGuidance || "Based on uploaded file"}
            // generatedImageUrl can be added if this flow also generates images
          />
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={handleStartNew} variant="outline" size="lg" className="w-full sm:w-auto">
              <RotateCcw className="mr-2 h-5 w-5" />
              Analyze Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
