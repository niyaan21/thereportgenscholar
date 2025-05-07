// src/app/page.tsx
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useActionState as useReactActionState } from 'react';
import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueries from '@/components/scholar-ai/FormulatedQueries';
import ResearchSummary from '@/components/scholar-ai/ResearchSummary';
import ResearchReportDisplay from '@/components/scholar-ai/ResearchReportDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, FileText, Settings, Moon, Sun, Palette, Image as ImageIcon, Loader2, BookOpen, Brain, Maximize, Search, Filter, BarChartBig, Telescope, Beaker, Sparkles, Bot, CornerDownLeft, Edit, CheckSquare, Zap } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';


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
    formData.append('topic', researchQuestion || topic); 
    imageFormAction(formData);
  };

  const handleGenerateFullReport = () => {
    if (researchQuestion) {
      const formData = new FormData();
      formData.append('researchQuestion', researchQuestion);
      // The Genkit flow 'generateResearchReport' handles an optional summary.
      // By not appending 'summary' to formData, it will be undefined in the action,
      // and the flow will generate the report based solely on the researchQuestion.
      reportFormAction(formData);
    } else {
      toast({ title: "Missing Information", description: "Cannot generate a report without a research question.", variant: 'destructive'});
    }
  };

  const isLoading = isPending || isProcessingQuery || isProcessingSummary || isImageGenerating || isReportGenerating;
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const renderCurrentStep = () => {
    return (
      <AnimatePresence mode="wait">
        {appState === 'initial' && (
          <motion.div
            key="initial"
            initial="initial"
            animate="enter"
            exit="exit"
            variants={pageVariants}
            className="space-y-8"
          >
            <QueryForm 
              onQueriesFormulated={handleQueriesFormulated} 
              isBusy={isProcessingQuery} 
              setIsBusy={setIsProcessingQuery}
            />
          </motion.div>
        )}
        {appState === 'queries_formulated' && (
          <motion.div
            key="queries_formulated"
            initial="initial"
            animate="enter"
            exit="exit"
            variants={pageVariants}
            className="space-y-8"
          >
            <Card className="overflow-hidden shadow-xl border-accent/30 bg-card rounded-xl">
              <CardHeader className="bg-gradient-to-br from-accent/10 via-card to-accent/5 p-6 border-b border-accent/20">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="p-3 bg-accent/20 text-accent rounded-full shadow-lg border border-accent/40"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                  >
                    <FileText className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-accent-foreground">
                      Your Research Focus
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mt-0.5">The central question guiding this research endeavor.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-foreground/90 text-base leading-relaxed selection:bg-accent/20">{researchQuestion}</p>
              </CardContent>
            </Card>
            <FormulatedQueries
              queries={formulatedQueries}
              onResearchSynthesized={handleResearchSynthesized}
              isBusy={isProcessingSummary}
              setIsBusy={setIsProcessingSummary}
            />
          </motion.div>
        )}
        {appState === 'summary_generated' && (
          <motion.div
            key="summary_generated"
            initial="initial"
            animate="enter"
            exit="exit"
            variants={pageVariants}
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
            <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 p-0 pt-6">
                <Button
                  onClick={handleGenerateFullReport}
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto shadow-lg hover:shadow-primary/30 transform hover:scale-105 transition-all duration-200 bg-primary text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group"
                  disabled={isLoading || isReportGenerating}
                  aria-label="Generate Full Research Report"
                >
                  {isReportGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BookOpen className="mr-2 h-5 w-5 group-hover:animate-pulse" />}
                  Generate Full Report
                </Button>
                <Button
                  onClick={handleStartNewResearch}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto shadow-md hover:shadow-accent/20 transform hover:scale-105 transition-all duration-200 border-input hover:bg-accent/10 group"
                  disabled={isLoading}
                  aria-label="Start a new research session"
                >
                  <RotateCcw className="mr-2 h-5 w-5 group-hover:rotate-[30deg] transition-transform" /> Start New Research
                </Button>
            </CardFooter>
          </motion.div>
        )}
        {appState === 'report_generated' && (
          <motion.div
            key="report_generated"
            initial="initial"
            animate="enter"
            exit="exit"
            variants={pageVariants}
            className="space-y-8"
          >
            <ResearchReportDisplay 
              report={researchReport!} 
              originalQuestion={researchQuestion}
              generatedImageUrl={generatedImageUrl}
            />
            <CardFooter className="flex justify-center p-0 pt-6">
              <Button
                onClick={handleStartNewResearch}
                variant="default"
                size="lg"
                className="shadow-lg hover:shadow-primary/30 transform hover:scale-105 transition-all duration-200 bg-primary text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group"
                disabled={isLoading}
                aria-label="Start a new research session"
              >
                <RotateCcw className="mr-2 h-5 w-5 group-hover:rotate-[30deg] transition-transform" /> Start New Research
              </Button>
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background flex flex-col overflow-x-hidden antialiased selection:bg-accent/30 selection:text-accent-foreground">
      <header
        className="py-4 px-4 md:px-6 bg-card/90 text-card-foreground shadow-lg sticky top-0 z-50 border-b border-border/60 backdrop-blur-lg"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={appState !== 'initial' ? handleStartNewResearch : undefined}>
            <motion.div 
              className="p-2 bg-primary rounded-lg shadow-md transform group-hover:scale-110 group-hover:shadow-primary/40 transition-all duration-300 ease-out"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Beaker className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary group-hover:text-accent transition-colors">
                ScholarAI
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Intelligent Research Augmentation</p>
            </div>
          </div>
           <div className="flex items-center space-x-2">
            {appState !== 'initial' && (
                <Button 
                  onClick={handleGoBack} 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground disabled:opacity-50 group h-9 w-9 rounded-full"
                  disabled={isLoading}
                  aria-label="Go back to previous step"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground h-9 w-9 rounded-full group" aria-label="Theme settings">
                  <Palette className="h-4 w-4 group-hover:animate-pulse" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 border-border bg-popover shadow-xl rounded-lg">
                <DropdownMenuLabel className="font-semibold text-popover-foreground px-2 py-1.5">Theme</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20 text-sm px-2 py-1.5 group">
                  <Sun className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20 text-sm px-2 py-1.5 group">
                  <Moon className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20 text-sm px-2 py-1.5 group">
                  <Settings className="mr-2 h-4 w-4 text-muted-foreground group-hover:animate-spin" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-3 sm:px-4 py-8 md:py-12">
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            {renderCurrentStep()}
        </div>
      </main>

      <footer className="py-8 px-4 md:px-6 border-t border-border/40 bg-card/60 mt-16">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear ?? <span className="inline-block w-10 h-4 bg-muted/40 rounded-sm animate-pulse"></span>} ScholarAI. 
            <Sparkles className="inline h-4 w-4 text-accent mx-1"/>
            Powered by Generative AI.
          </p>
          <p className="mt-2 text-xs">
            Your intelligent partner in discovery. Elevating research with augmented intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
