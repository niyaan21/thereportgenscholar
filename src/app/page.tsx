// src/app/page.tsx
'use client';

import React, { useState, useEffect, useTransition, useActionState as useReactActionState } from 'react';
import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueries from '@/components/scholar-ai/FormulatedQueries';
import ResearchSummary from '@/components/scholar-ai/ResearchSummary';
import ResearchReportDisplay from '@/components/scholar-ai/ResearchReportDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, FileText, Zap, Settings, Moon, Sun, Palette, Image as ImageIcon, Loader2, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { handleGenerateImageAction, type GenerateImageActionState, handleGenerateReportAction, type GenerateReportActionState } from '@/app/actions';
import type { GenerateResearchReportOutput } from '@/ai/flows/generate-research-report';
import { useToast } from '@/hooks/use-toast';


type AppState = 'initial' | 'queries_formulated' | 'summary_generated' | 'report_generated';

const initialImageActionState: GenerateImageActionState = {
  success: false,
  message: '',
  imageDataUri: null,
  errors: null,
};

const initialReportActionState: GenerateReportActionState = {
  success: false,
  message: '',
  researchReport: null,
  errors: null,
};


export default function ScholarAIPage() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [researchQuestion, setResearchQuestion] = useState<string>('');
  const [formulatedQueries, setFormulatedQueries] = useState<string[]>([]);
  const [researchSummary, setResearchSummary] = useState<string>('');
  const [summarizedPaperTitles, setSummarizedPaperTitles] = useState<string[]>([]);
  const [researchReport, setResearchReport] = useState<GenerateResearchReportOutput | null>(null);
  
  const [isProcessingQuery, setIsProcessingQuery] = useState<boolean>(false);
  const [isProcessingSummary, setIsProcessingSummary] = useState<boolean>(false);
  
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const [imageActionState, imageFormAction, isImageGenerating] = useReactActionState(handleGenerateImageAction, initialImageActionState);
  const [reportActionState, reportFormAction, isReportGenerating] = useReactActionState(handleGenerateReportAction, initialReportActionState);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    const localTheme = localStorage.getItem('theme') as typeof theme | null;
    if (localTheme) {
      setTheme(localTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.removeItem('theme');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  useEffect(() => {
    if (imageActionState.message) {
      if (imageActionState.success && imageActionState.imageDataUri) {
        setGeneratedImageUrl(imageActionState.imageDataUri);
        toast({ title: "🖼️ Visual Concept Generated!", description: imageActionState.message, variant: 'default' });
      } else if (!imageActionState.success) {
        toast({ title: "🚫 Image Generation Failed", description: imageActionState.message, variant: 'destructive' });
      }
    }
  }, [imageActionState, toast]);

  useEffect(() => {
    if (reportActionState.message) {
      if (reportActionState.success && reportActionState.researchReport) {
        setResearchReport(reportActionState.researchReport);
        setAppState('report_generated');
        toast({ title: "📜 Research Report Generated!", description: reportActionState.message, variant: 'default', duration: 7000 });
      } else if (!reportActionState.success) {
        toast({ title: "🚫 Report Generation Failed", description: reportActionState.message, variant: 'destructive', duration: 9000 });
      }
    }
  }, [reportActionState, toast]);


  const handleQueriesFormulated = (queries: string[], question: string) => {
    startTransition(() => {
      setResearchQuestion(question);
      setFormulatedQueries(queries);
      setAppState('queries_formulated');
      setGeneratedImageUrl(null); 
      setResearchReport(null);
    });
    setIsProcessingQuery(false);
  };

  const handleResearchSynthesized = (summary: string, titles: string[]) => {
    startTransition(() => {
      setResearchSummary(summary);
      setSummarizedPaperTitles(titles);
      setAppState('summary_generated');
      // Keep existing image if one was generated for the summary
      setResearchReport(null);
    });
    setIsProcessingSummary(false);
  };

  const handleStartNewResearch = () => {
    startTransition(() => {
      setAppState('initial');
      setResearchQuestion('');
      setFormulatedQueries([]);
      setResearchSummary('');
      setSummarizedPaperTitles([]);
      setGeneratedImageUrl(null);
      setResearchReport(null);
    });
    setIsProcessingQuery(false);
    setIsProcessingSummary(false);
  };

  const handleGoBack = () => {
    startTransition(() => {
      if (appState === 'report_generated') {
        setAppState('summary_generated');
        setResearchReport(null); // Clear report but keep summary and image
      } else if (appState === 'summary_generated') {
        setAppState('queries_formulated');
        setResearchSummary('');
        setSummarizedPaperTitles([]);
        // Potentially clear image if it's tied only to summary, or keep if generic enough
        // setGeneratedImageUrl(null); 
      } else if (appState === 'queries_formulated') {
        setAppState('initial');
        setResearchQuestion('');
        setFormulatedQueries([]);
      }
    });
  };
  
  const handleGenerateImageForTopic = (topic: string) => {
    const formData = new FormData();
    formData.append('topic', topic);
    imageFormAction(formData);
  };

  const handleGenerateFullReport = () => {
    if (researchQuestion) {
      const formData = new FormData();
      formData.append('researchQuestion', researchQuestion);
      if (researchSummary) {
        formData.append('summary', researchSummary);
      }
      reportFormAction(formData);
    } else {
      toast({ title: "Missing Information", description: "Cannot generate a report without a research question.", variant: 'destructive'});
    }
  };

  const isLoading = isPending || isProcessingQuery || isProcessingSummary || isImageGenerating || isReportGenerating;

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden antialiased">
      <header
        className="py-4 px-4 md:px-8 bg-primary text-primary-foreground shadow-md sticky top-0 z-50 border-b border-primary/30"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-accent" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                ScholarAI
              </h1>
              <p className="text-xs text-primary-foreground/70 -mt-0.5">Intelligent Research Augmentation</p>
            </div>
          </div>
           <div className="flex items-center space-x-2">
            {appState !== 'initial' && (
                <Button 
                  onClick={handleGoBack} 
                  variant="ghost" 
                  className="text-primary-foreground hover:bg-primary-foreground/10 disabled:opacity-50"
                  disabled={isLoading}
                  aria-label="Go back to previous step"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" aria-label="Theme settings">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 border-border bg-background shadow-lg rounded-md">
                <DropdownMenuLabel className="font-semibold text-foreground">Theme</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20">
                  <Sun className="mr-2 h-4 w-4 text-foreground/80" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20">
                  <Moon className="mr-2 h-4 w-4 text-foreground/80" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20">
                  <Settings className="mr-2 h-4 w-4 text-foreground/80" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
            {appState === 'initial' && (
              <div className="space-y-6">
                <QueryForm 
                  onQueriesFormulated={handleQueriesFormulated} 
                  isBusy={isProcessingQuery} 
                  setIsBusy={setIsProcessingQuery}
                />
              </div>
            )}

            {appState === 'queries_formulated' && formulatedQueries.length > 0 && (
              <div className="space-y-6">
                 <Card className="overflow-hidden shadow-lg border-accent/20 bg-card rounded-lg">
                    <CardHeader className="bg-accent/5 p-4 border-b border-accent/20">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-accent" />
                        <CardTitle className="text-lg font-semibold text-accent-foreground">
                          Your Research Focus
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-foreground/90">{researchQuestion}</p>
                    </CardContent>
                  </Card>
                <FormulatedQueries
                  queries={formulatedQueries}
                  onResearchSynthesized={handleResearchSynthesized}
                  isBusy={isProcessingSummary}
                  setIsBusy={setIsProcessingSummary}
                />
              </div>
            )}

            {appState === 'summary_generated' && researchSummary && (
              <div className="space-y-6">
                <ResearchSummary
                    summary={researchSummary}
                    originalQuestion={researchQuestion}
                    summarizedPaperTitles={summarizedPaperTitles}
                    onGenerateImage={handleGenerateImageForTopic}
                    generatedImageUrl={generatedImageUrl}
                    isGeneratingImage={isImageGenerating}
                />
                 <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
                  <Button
                    onClick={handleGenerateFullReport}
                    variant="outline"
                    size="lg"
                    className="shadow-md hover:shadow-lg disabled:opacity-50 border-accent text-accent hover:bg-accent/10 w-full sm:w-auto"
                    disabled={isLoading || isReportGenerating}
                    aria-label="Generate Full Research Report"
                  >
                    {isReportGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BookOpen className="mr-2 h-5 w-5" />}
                    Generate Full Report
                  </Button>
                  <Button
                    onClick={handleStartNewResearch}
                    variant="default"
                    size="lg"
                    className="shadow-md hover:shadow-lg disabled:opacity-50 bg-primary text-primary-foreground w-full sm:w-auto"
                    disabled={isLoading}
                    aria-label="Start a new research session"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" /> Start New Research
                  </Button>
                </div>
              </div>
            )}

            {appState === 'report_generated' && researchReport && (
               <div className="space-y-6">
                <ResearchReportDisplay 
                  report={researchReport} 
                  originalQuestion={researchQuestion}
                  generatedImageUrl={generatedImageUrl}
                />
                 <div className="flex justify-center pt-2">
                  <Button
                    onClick={handleStartNewResearch}
                    variant="default"
                    size="lg"
                    className="shadow-md hover:shadow-lg disabled:opacity-50 bg-primary text-primary-foreground"
                    disabled={isLoading}
                    aria-label="Start a new research session"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" /> Start New Research
                  </Button>
                </div>
              </div>
            )}
        </div>
      </main>

      <footer className="py-6 px-4 md:px-8 border-t border-border/30 bg-secondary/30 mt-10">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear ?? <span className="inline-block w-8 h-4 bg-muted-foreground/20 rounded-sm animate-pulse"></span>} ScholarAI.
          </p>
          <p className="mt-1 text-xs">
            AI-Powered Insights for the Modern Researcher.
          </p>
        </div>
      </footer>
    </div>
  );
}
