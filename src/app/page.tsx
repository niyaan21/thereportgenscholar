// src/app/page.tsx
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useActionState } from 'react'; 
import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueries from '@/components/scholar-ai/FormulatedQueries';
import ResearchSummary from '@/components/scholar-ai/ResearchSummary';
import ResearchReportDisplay from '@/components/scholar-ai/ResearchReportDisplay';
import { Button } from '@/components/ui/button';
import { ToastAction } from "@/components/ui/toast";
import { ArrowLeft, RotateCcw, FileText, Settings, Moon, Sun, Palette, Image as ImageIcon, Loader2, BookOpen, Brain, Maximize, Search, Filter, BarChartBig, Telescope, Beaker, Sparkles, Bot, CornerDownLeft, Edit, CheckSquare, Zap, Eye, Lightbulb, FileArchive, Atom, ClipboardCopy, Share2, Download, Sigma, BarChartHorizontal, TrendingUpIcon, ScaleIcon, FlaskConical, LightbulbIcon as LightbulbLucideIcon, InfoIcon, AlertCircleIcon, CheckCircle2Icon } from 'lucide-react';
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

  const [imageActionState, imageFormAction, isImageGenerating] = useActionState(handleGenerateImageAction, initialImageActionState);
  const [reportActionState, reportFormAction, isReportGenerating] = useActionState(handleGenerateReportAction, initialReportActionState);
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
        toast({ title: "🖼️ Visual Concept Generated!", description: imageActionState.message, variant: 'default', 
          action: <ToastAction altText="View Image">View</ToastAction> 
        });
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
        toast({ title: "📜 Research Report Generated!", description: reportActionState.message, variant: 'default', duration: 7000,
          action: <ToastAction altText="View Report">Jump to Report</ToastAction>
        });
      } else if (!reportActionState.success) { 
        let fullErrorMessage = reportActionState.message;
        if (reportActionState.errors) {
          const errorDetails = Object.values(reportActionState.errors).flat().join(' ');
          if (errorDetails) {
            fullErrorMessage += ` Details: ${errorDetails}`;
          }
        }
        toast({ title: "🚫 Report Generation Failed", description: fullErrorMessage, variant: 'destructive', duration: 9000 });
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
  
  const handleGenerateImageForTopic = () => { 
    startTransition(() => {
      const formData = new FormData();
      formData.append('topic', researchQuestion); 
      imageFormAction(formData);
    });
  };

  const handleGenerateFullReport = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.append('researchQuestion', researchQuestion);
      if (researchSummary) {
        formData.append('summary', researchSummary);
      }
      reportFormAction(formData);
    });
  };


  const isLoading = isPending || isProcessingQuery || isProcessingSummary || isImageGenerating || isReportGenerating;
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "circOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "circIn" } }
  };

  const renderCurrentStep = () => {
    let content;
    switch (appState) {
      case 'initial':
        content = (
          <QueryForm 
            onQueriesFormulated={handleQueriesFormulated} 
            isBusy={isProcessingQuery} 
            setIsBusy={setIsProcessingQuery}
          />
        );
        break;
      case 'queries_formulated':
        content = (
          <div className="space-y-6">
            <Card className="overflow-hidden shadow-lg border-accent/20 bg-card rounded-xl">
              <CardHeader className="bg-accent/5 p-5 border-b border-accent/15">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-accent/15 text-accent rounded-full shadow-md border border-accent/30">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-accent-foreground">
                      Your Research Focus
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">The central question guiding this research.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-foreground/85 text-sm leading-normal">{researchQuestion}</p>
              </CardContent>
            </Card>
            <FormulatedQueries
              queries={formulatedQueries}
              onResearchSynthesized={handleResearchSynthesized}
              isBusy={isProcessingSummary}
              setIsBusy={setIsProcessingSummary}
            />
          </div>
        );
        break;
      case 'summary_generated':
        content = (
          <div className="space-y-6">
            <ResearchSummary
              summary={researchSummary}
              originalQuestion={researchQuestion}
              summarizedPaperTitles={summarizedPaperTitles}
              onGenerateImage={handleGenerateImageForTopic}
              generatedImageUrl={generatedImageUrl}
              isGeneratingImage={isImageGenerating}
            />
            <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-3 p-0 pt-5">
                <Button
                  onClick={handleGenerateFullReport}
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto shadow-lg hover:shadow-primary/25 bg-primary text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                  className="w-full sm:w-auto shadow-md hover:shadow-accent/15 border-input hover:bg-accent/10"
                  disabled={isLoading}
                  aria-label="Start a new research session"
                >
                  <RotateCcw className="mr-2 h-5 w-5" /> Start New Research
                </Button>
            </CardFooter>
          </div>
        );
        break;
      case 'report_generated':
        content = (
          <div className="space-y-6">
            <ResearchReportDisplay 
              report={researchReport!} 
              originalQuestion={researchQuestion}
              generatedImageUrl={generatedImageUrl}
            />
            <CardFooter className="flex justify-center p-0 pt-5">
              <Button
                onClick={handleStartNewResearch}
                variant="default"
                size="lg"
                className="shadow-lg hover:shadow-primary/25 bg-primary text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={isLoading}
                aria-label="Start a new research session"
              >
                <RotateCcw className="mr-2 h-5 w-5" /> Start New Research
              </Button>
            </CardFooter>
          </div>
        );
        break;
      default:
        content = null;
    }
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={appState}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={pageVariants}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background flex flex-col overflow-x-hidden antialiased selection:bg-accent/20 selection:text-accent-foreground">
      <header
        className="py-3.5 px-4 md:px-6 bg-card/85 text-card-foreground shadow-md sticky top-0 z-50 border-b border-border/50 backdrop-blur-md"
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2.5 group cursor-pointer" 
            onClick={appState !== 'initial' ? handleStartNewResearch : undefined}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div 
              className="p-1.5 bg-primary rounded-md shadow-sm transform group-hover:scale-110 transition-transform duration-200 ease-out"
            >
              <Beaker className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-semibold tracking-tight text-primary group-hover:text-accent transition-colors">
                ScholarAI
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Intelligent Research Augmentation</p>
            </div>
          </motion.div>
           <div className="flex items-center space-x-1.5">
            {appState !== 'initial' && (
                <Button 
                  onClick={handleGoBack} 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground disabled:opacity-50 h-8 w-8 rounded-full"
                  disabled={isLoading}
                  aria-label="Go back to previous step"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground h-8 w-8 rounded-full" aria-label="Theme settings">
                  <Palette className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 border-border bg-popover shadow-lg rounded-md">
                <DropdownMenuLabel className="font-medium text-popover-foreground px-2 py-1 text-xs">Theme</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/15 text-xs px-2 py-1.5 group">
                  <Sun className="mr-1.5 h-3.5 w-3.5 text-muted-foreground group-hover:text-yellow-500" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/15 text-xs px-2 py-1.5 group">
                  <Moon className="mr-1.5 h-3.5 w-3.5 text-muted-foreground group-hover:text-blue-400" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/15 text-xs px-2 py-1.5 group">
                  <Settings className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-3 sm:px-4 py-6 md:py-10">
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            {renderCurrentStep()}
        </div>
      </main>

      <footer className="py-6 px-4 md:px-6 border-t border-border/30 bg-card/50 mt-12">
        <div className="container mx-auto text-center text-xs text-muted-foreground">
          <p>
            &copy; {currentYear ?? <span className="inline-block w-8 h-3.5 bg-muted/30 rounded-sm"></span>} ScholarAI. 
            <Sparkles className="inline h-3.5 w-3.5 text-accent mx-0.5"/>
            Powered by Generative AI.
          </p>
          <p className="mt-1.5 text-xs">
            Your intelligent partner in discovery. Elevating research with augmented intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
