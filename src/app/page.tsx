// src/app/page.tsx
'use client';

import React, { useState, useEffect, useTransition, useActionState as useReactActionState } from 'react';
import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueries from '@/components/scholar-ai/FormulatedQueries';
import ResearchSummary from '@/components/scholar-ai/ResearchSummary';
import ResearchReportDisplay from '@/components/scholar-ai/ResearchReportDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, FileText, Settings, Moon, Sun, Palette, Image as ImageIcon, Loader2, BookOpen, Brain, Maximize, Search, Filter, BarChartBig, Telescope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import NextImage from 'next/image';


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
    if (imageActionState.message && (imageActionState.success || imageActionState.errors)) { 
      if (imageActionState.success && imageActionState.imageDataUri) {
        setGeneratedImageUrl(imageActionState.imageDataUri);
        toast({ title: "🖼️ Visual Concept Generated!", description: imageActionState.message, variant: 'default' });
      } else if (!imageActionState.success) {
        toast({ title: "🚫 Image Generation Failed", description: imageActionState.message, variant: 'destructive' });
      }
    }
  }, [imageActionState, toast]);

  useEffect(() => {
    if (reportActionState.message && (reportActionState.success || reportActionState.errors)) { 
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
        setResearchReport(null);
      } else if (appState === 'summary_generated') {
        setAppState('queries_formulated');
        setResearchSummary('');
        setSummarizedPaperTitles([]);
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
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  const renderCurrentStep = () => {
    switch (appState) {
      case 'initial':
        return (
          <motion.div
            key="initial"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="space-y-8"
          >
            <QueryForm 
              onQueriesFormulated={handleQueriesFormulated} 
              isBusy={isProcessingQuery} 
              setIsBusy={setIsProcessingQuery}
            />
          </motion.div>
        );
      case 'queries_formulated':
        return (
          <motion.div
            key="queries_formulated"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="space-y-8"
          >
            <Card className="overflow-hidden shadow-lg border-accent/30 bg-card rounded-xl">
              <CardHeader className="bg-gradient-to-br from-accent/10 via-card to-accent/5 p-5 border-b border-accent/20">
                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 bg-accent/15 rounded-full shadow-sm border border-accent/30">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-accent-foreground">
                      Your Research Focus
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">The central question guiding this research.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-foreground/90 text-base leading-relaxed">{researchQuestion}</p>
              </CardContent>
            </Card>
            <FormulatedQueries
              queries={formulatedQueries}
              onResearchSynthesized={handleResearchSynthesized}
              isBusy={isProcessingSummary}
              setIsBusy={setIsProcessingSummary}
            />
          </motion.div>
        );
      case 'summary_generated':
        return (
          <motion.div
            key="summary_generated"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="space-y-8"
          >
            <ResearchSummary
              summary={researchSummary}
              originalQuestion={researchQuestion}
              summarizedPaperTitles={summarizedPaperTitles}
              onGenerateImage={handleGenerateImageForTopic}
              generatedImageUrl={generatedImageUrl}
              isGeneratingImage={isImageGenerating}
            />
            <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 p-0 pt-4">
                <Button
                  onClick={handleGenerateFullReport}
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto shadow-lg hover:shadow-xl bg-primary text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={isLoading || isReportGenerating}
                  aria-label="Generate Full Research Report"
                >
                  {isReportGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BookOpen className="mr-2 h-5 w-5" />}
                  Generate Full Report
                </Button>
                <Button
                  onClick={handleStartNewResearch}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto shadow-md hover:shadow-lg border-input hover:bg-accent/10"
                  disabled={isLoading}
                  aria-label="Start a new research session"
                >
                  <RotateCcw className="mr-2 h-5 w-5" /> Start New Research
                </Button>
            </CardFooter>
          </motion.div>
        );
      case 'report_generated':
        return (
          <motion.div
            key="report_generated"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="space-y-8"
          >
            <ResearchReportDisplay 
              report={researchReport!} 
              originalQuestion={researchQuestion}
              generatedImageUrl={generatedImageUrl}
            />
            <CardFooter className="flex justify-center p-0 pt-4">
              <Button
                onClick={handleStartNewResearch}
                variant="default"
                size="lg"
                className="shadow-lg hover:shadow-xl bg-primary text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={isLoading}
                aria-label="Start a new research session"
              >
                <RotateCcw className="mr-2 h-5 w-5" /> Start New Research
              </Button>
            </CardFooter>
          </motion.div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex flex-col overflow-x-hidden antialiased">
      <header
        className="py-3.5 px-4 md:px-6 bg-card text-card-foreground shadow-lg sticky top-0 z-50 border-b border-border/50 backdrop-blur-md bg-opacity-80"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-primary rounded-md shadow-inner">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary">
                ScholarAI
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Intelligent Research Augmentation</p>
            </div>
          </div>
           <div className="flex items-center space-x-2">
            {appState !== 'initial' && (
                <Button 
                  onClick={handleGoBack} 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground disabled:opacity-50"
                  disabled={isLoading}
                  aria-label="Go back to previous step"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground h-8 w-8" aria-label="Theme settings">
                  <Palette className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 border-border bg-popover shadow-xl rounded-lg">
                <DropdownMenuLabel className="font-semibold text-popover-foreground px-2 py-1.5">Theme</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20 text-sm px-2 py-1.5">
                  <Sun className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20 text-sm px-2 py-1.5">
                  <Moon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20 text-sm px-2 py-1.5">
                  <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-3 sm:px-4 py-8">
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {renderCurrentStep()}
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-6 px-4 md:px-6 border-t border-border/30 bg-card/50 mt-12">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear ?? <span className="inline-block w-10 h-4 bg-muted/30 rounded-sm animate-pulse"></span>} ScholarAI.
          </p>
          <p className="mt-1.5 text-xs">
            AI-Powered Insights for the Modern Researcher. Your intelligent partner in discovery.
          </p>
        </div>
      </footer>
    </div>
  );
}
