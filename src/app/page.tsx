// src/app/page.tsx
'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { useActionState } from 'react'; 

import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueriesDisplay from '@/components/scholar-ai/FormulatedQueriesDisplay';
import ResearchSummaryDisplay from '@/components/scholar-ai/ResearchSummaryDisplay';
import ResearchReportDisplay from '@/components/scholar-ai/ResearchReportDisplay';

import { Button } from '@/components/ui/button';
import { ToastAction } from "@/components/ui/toast";
import {
  ArrowLeft, RotateCcw, FileTextIcon, Settings, Moon, Sun, Palette, Image as ImageIcon, Loader2, BookOpen, Brain, Search, Filter, BarChartBig, Telescope, Beaker, Sparkles, Bot, CornerDownLeft, Edit, CheckSquare, Zap, Eye, Lightbulb, FileArchive, Atom, ClipboardCopy, Share2, Download, Sigma, BarChartHorizontal, TrendingUpIcon, ScaleIcon, FlaskConical, LightbulbIcon as LightbulbLucideIcon, InfoIcon, AlertCircleIcon, CheckCircle2Icon, ExternalLink, MaximizeIcon, ChevronRight, Rocket
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  handleFormulateQueryAction,
  handleSynthesizeResearchAction,
  handleGenerateImageAction,
  handleGenerateReportAction,
  type FormulateQueryActionState,
  type SynthesizeResearchActionState,
  type GenerateImageActionState,
  type GenerateReportActionState,
} from '@/app/actions';
import type { GenerateResearchReportOutput } from '@/ai/flows/generate-research-report';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NextImage from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type AppState = 'initial' | 'queries_formulated' | 'summary_generated' | 'report_generated';

const initialFormulateQueryActionState: FormulateQueryActionState = {
  success: false,
  message: '',
  formulatedQueries: null,
  originalQuestion: '',
  errors: null,
};

const initialSynthesizeResearchActionState: SynthesizeResearchActionState = {
    success: false,
    message: '',
    researchSummary: null,
    summarizedPaperTitles: null,
    errors: null,
};

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
  const [queryFormInputValue, setQueryFormInputValue] = useState<string>(''); 
  
  const [formulatedQueries, setFormulatedQueries] = useState<string[]>([]);
  const [researchSummary, setResearchSummary] = useState<string>('');
  const [summarizedPaperTitles, setSummarizedPaperTitles] = useState<string[]>([]);
  
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [_isTransitionPending, startTransition] = useTransition();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const [formulateQueryState, formulateQueryFormAction, isFormulatingQueries] = useActionState(handleFormulateQueryAction, initialFormulateQueryActionState);
  const [synthesizeResearchState, synthesizeResearchFormAction, isSynthesizingResearch] = useActionState(handleSynthesizeResearchAction, initialSynthesizeResearchActionState);
  const [imageActionState, imageFormAction, isImageGenerating] = useActionState(handleGenerateImageAction, initialImageActionState);
  const [reportActionState, reportFormAction, isReportGenerating] = useActionState(handleGenerateReportAction, initialReportActionState);
  
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    const localTheme = localStorage.getItem('theme') as typeof theme | null;
    if (localTheme) {
      setTheme(localTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light'); // Default to light if system not dark
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else { // system
      localStorage.removeItem('theme');
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);
  
  useEffect(() => {
    if (!isFormulatingQueries && formulateQueryState.message) {
      if (formulateQueryState.success && formulateQueryState.formulatedQueries && formulateQueryState.originalQuestion) {
        toast({ title: "🚀 AI Engine Ignited!", description: formulateQueryState.message, variant: 'default', duration: 5000 });
        handleQueriesFormulatedCallback(formulateQueryState.formulatedQueries, formulateQueryState.originalQuestion);
      } else if (!formulateQueryState.success) {
        let description = formulateQueryState.message;
        if (formulateQueryState.errors?.researchQuestion) {
          description += ` ${formulateQueryState.errors.researchQuestion.join(' ')}`;
        }
        toast({ title: "🚦 Engine Stalled!", description, variant: 'destructive', duration: 7000 });
      }
    }
  }, [formulateQueryState, isFormulatingQueries, toast]); // Removed handleQueriesFormulatedCallback from deps

  useEffect(() => {
    if (!isSynthesizingResearch && synthesizeResearchState.message) {
      if (synthesizeResearchState.success && synthesizeResearchState.researchSummary && synthesizeResearchState.summarizedPaperTitles) {
        toast({ title: "💡 Profound Insights Uncovered!", description: synthesizeResearchState.message, variant: 'default', duration: 7000 });
        handleResearchSynthesizedCallback(synthesizeResearchState.researchSummary, synthesizeResearchState.summarizedPaperTitles);
      } else if (!synthesizeResearchState.success) {
        let description = synthesizeResearchState.message;
        if (synthesizeResearchState.errors?.queries) {
            description += ` ${synthesizeResearchState.errors.queries.join(' ')}`;
        }
        toast({ title: "🛠️ Synthesis Stumbled!", description: description, variant: 'destructive', duration: 9000 });
      }
    }
  }, [synthesizeResearchState, isSynthesizingResearch, toast]); // Removed handleResearchSynthesizedCallback


  useEffect(() => {
    if (imageActionState.message && !isImageGenerating) { 
      if (imageActionState.success && imageActionState.imageDataUri) {
        setGeneratedImageUrl(imageActionState.imageDataUri);
        toast({ 
          title: "🖼️ Visual Concept Generated!", 
          description: imageActionState.message, 
          variant: 'default', 
          duration: 5000,
          action: (
            <DialogTrigger asChild>
                <ToastAction altText="View Image" onClick={(e) => {e.preventDefault(); }}>View</ToastAction>
            </DialogTrigger>
          )
        });
      } else if (!imageActionState.success) { 
        let fullErrorMessage = imageActionState.message;
        if (imageActionState.errors?.topic) {
            fullErrorMessage += ` Details: ${imageActionState.errors.topic.join(' ')}`;
        }
        toast({ title: "🚫 Image Generation Failed", description: fullErrorMessage, variant: 'destructive', duration: 7000 });
      }
    }
  }, [imageActionState, isImageGenerating, toast]);

  useEffect(() => {
    if (reportActionState.message && !isReportGenerating) { 
      if (reportActionState.success && reportActionState.researchReport) {
        setAppState('report_generated'); // researchQuestion is already set from query formulation
        toast({ title: "📜 Research Report Generated!", description: reportActionState.message, variant: 'default', duration: 7000,
          action: <ToastAction altText="View Report" onClick={() => document.getElementById('research-report-section')?.scrollIntoView({ behavior: 'smooth' })}>Jump to Report</ToastAction>
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
  }, [reportActionState, isReportGenerating, toast]);

  const handleQueriesFormulatedCallback = useCallback((queries: string[], question: string) => {
    startTransition(() => {
      setResearchQuestion(question); 
      setFormulatedQueries(queries);
      setAppState('queries_formulated');
      setGeneratedImageUrl(null); 
      setQueryFormInputValue(''); 
    });
  }, []);

  const handleResearchSynthesizedCallback = useCallback((summary: string, titles: string[]) => {
    startTransition(() => {
      setResearchSummary(summary);
      setSummarizedPaperTitles(titles);
      setAppState('summary_generated');
    });
  }, []);

  const handleStartNewResearch = () => {
    startTransition(() => {
      setAppState('initial');
      setResearchQuestion('');
      setQueryFormInputValue('');
      setFormulatedQueries([]);
      setResearchSummary('');
      setSummarizedPaperTitles([]);
      setGeneratedImageUrl(null);
      // Consider explicitly resetting action states if they retain error messages or old data
      // This might involve creating reset functions or passing null to their dispatchers if useActionState allows
    });
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
        setQueryFormInputValue(researchQuestion); // Repopulate form with the original question
      }
    });
  };
  
  const handleGenerateImageForTopic = useCallback(() => { 
    if (!researchQuestion || researchQuestion.trim().length < 5) {
      toast({
        title: "🚫 Cannot Generate Image",
        description: "A valid research question (min. 5 characters) is required. Please ensure your initial question is valid.",
        variant: "destructive",
        duration: 6000,
      });
      return;
    }
    startTransition(() => {
      const formData = new FormData();
      formData.append('topic', researchQuestion.trim()); 
      imageFormAction(formData);
    });
  }, [researchQuestion, imageFormAction, toast]);

  const handleGenerateFullReport = useCallback(() => {
     if (!researchQuestion || researchQuestion.trim().length < 10) {
      toast({
        title: "🚫 Cannot Generate Report",
        description: "A valid research question (min. 10 characters) is required. Please formulate queries first with a valid question.",
        variant: "destructive",
        duration: 6000,
      });
      return;
    }
    startTransition(() => {
      const formData = new FormData();
      formData.append('researchQuestion', researchQuestion.trim());
      if (researchSummary && researchSummary.trim().length > 0) {
        formData.append('summary', researchSummary.trim());
      }
      reportFormAction(formData);
    });
  }, [researchQuestion, researchSummary, reportFormAction, toast]);

  const isLoading = isFormulatingQueries || isSynthesizingResearch || isImageGenerating || isReportGenerating;
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "circOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "circIn" } }
  };
  
  const ActionButton: React.FC<React.ComponentProps<typeof Button> & { icon?: React.ElementType, isProcessing?: boolean, label: string, pending?: boolean }> = ({ icon: Icon, isProcessing, pending, label, children, ...props }) => (
    <Button {...props} disabled={isLoading || isProcessing || pending || props.disabled} className={cn("shadow-lg hover:shadow-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center justify-center group", props.className)}>
      {(isProcessing || pending) ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (Icon && <Icon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />)}
      {label || children}
    </Button>
  );

  const renderCurrentStep = () => {
    let content;
    switch (appState) {
      case 'initial':
        content = (
          <motion.div key="initial" initial="initial" animate="enter" exit="exit" variants={pageVariants} className="w-full">
            <QueryForm 
              formAction={formulateQueryFormAction}
              isBusy={isFormulatingQueries}
              value={queryFormInputValue}
              onChange={setQueryFormInputValue}
            />
          </motion.div>
        );
        break;
      case 'queries_formulated':
        content = (
          <motion.div key="queries" initial="initial" animate="enter" exit="exit" variants={pageVariants} className="w-full space-y-8">
            <Card className="overflow-hidden shadow-xl card-glow-border border-accent/30 bg-card rounded-2xl transform hover:shadow-accent/20 transition-all duration-300 ease-in-out">
              <CardHeader className="p-6 md:p-7 bg-gradient-to-br from-accent/15 via-transparent to-accent/5 border-b border-accent/25">
                <div className="flex items-center space-x-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.1, type: "spring", stiffness: 200, damping: 15} }} className="p-3.5 bg-gradient-to-br from-accent to-accent/70 rounded-full shadow-lg border-2 border-accent/50 text-accent-foreground">
                    <FileTextIcon className="h-7 w-7" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-semibold text-primary tracking-tight">
                      Your Research Focus
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mt-1 max-w-xl">The central question guiding this research endeavor: <strong className="text-foreground/90">"{researchQuestion}"</strong></CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <FormulatedQueriesDisplay
              queries={formulatedQueries}
              formAction={synthesizeResearchFormAction}
              isBusy={isSynthesizingResearch}
            />
          </motion.div>
        );
        break;
      case 'summary_generated':
        content = (
          <motion.div key="summary" initial="initial" animate="enter" exit="exit" variants={pageVariants} className="w-full space-y-8">
            <ResearchSummaryDisplay
              summary={researchSummary}
              originalQuestion={researchQuestion} 
              summarizedPaperTitles={summarizedPaperTitles}
              onGenerateImage={handleGenerateImageForTopic} 
              generatedImageUrl={generatedImageUrl}
              isGeneratingImage={isImageGenerating}
            />
            <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 p-0 pt-8 border-t border-border/40 mt-8">
                <ActionButton
                  onClick={handleGenerateFullReport}
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/80 hover:to-primary text-base py-3 px-8 rounded-lg shadow-lg hover:shadow-primary/40 transform hover:-translate-y-0.5 active:translate-y-0"
                  pending={isReportGenerating}
                  icon={BookOpen}
                  label="Generate Full Report"
                  aria-label="Generate Full Research Report"
                />
                <ActionButton
                  onClick={handleStartNewResearch}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-input hover:bg-accent/10 hover:text-accent-foreground text-base py-3 px-8 rounded-lg shadow-md hover:shadow-accent/20 transform hover:-translate-y-0.5 active:translate-y-0"
                  icon={RotateCcw}
                  label="Start New Research"
                  aria-label="Start a new research session"
                />
            </CardFooter>
          </motion.div>
        );
        break;
      case 'report_generated':
        content = (
          <motion.div key="report" initial="initial" animate="enter" exit="exit" variants={pageVariants} className="w-full space-y-8" id="research-report-section">
            {reportActionState.researchReport && (
              <ResearchReportDisplay 
                report={reportActionState.researchReport} 
                originalQuestion={researchQuestion} 
                generatedImageUrl={generatedImageUrl}
              />
            )}
            <CardFooter className="flex justify-center p-0 pt-8 border-t border-border/40 mt-8">
              <ActionButton
                onClick={handleStartNewResearch}
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/80 hover:to-primary text-base py-3 px-8 rounded-lg shadow-lg hover:shadow-primary/40 transform hover:-translate-y-0.5 active:translate-y-0"
                icon={RotateCcw}
                label="Start New Research Session"
                aria-label="Start a new research session"
              />
            </CardFooter>
          </motion.div>
        );
        break;
      default:
        content = null;
    }
    return (
        <AnimatePresence mode="wait">
            {content}
        </AnimatePresence>
    );
  };


  return (
    <Dialog>
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background flex flex-col overflow-x-hidden antialiased selection:bg-accent/20 selection:text-accent-foreground">
      <header
        className="py-4 px-4 md:px-8 bg-card/95 text-card-foreground shadow-2xl sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl"
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center space-x-3.5 group cursor-pointer" 
            onClick={handleStartNewResearch}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gradient-to-br from-primary via-primary/90 to-primary/75 rounded-xl shadow-lg text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-card"
            >
              <Beaker className="h-7 w-7" />
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent group-hover:from-accent group-hover:to-primary transition-all duration-300">
                ScholarAI
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5 tracking-wide">Augmented Intelligence for Research</p>
            </div>
          </motion.div>
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
             className="flex items-center space-x-2"
            >
            {appState !== 'initial' && (
                <Button 
                  onClick={handleGoBack} 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground disabled:opacity-50 h-10 w-10 rounded-full"
                  disabled={isLoading}
                  aria-label="Go back to previous step"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground h-10 w-10 rounded-full" aria-label="Theme settings">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-border/70 bg-popover shadow-xl rounded-lg p-1.5">
                <DropdownMenuLabel className="font-semibold text-popover-foreground px-2 py-1.5 text-sm">Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50 -mx-1 my-1" />
                <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                  <Sun className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                  <span>Light Mode</span>
                  {theme === 'light' && <CheckCircle2Icon className="ml-auto h-4 w-4 text-accent" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                  <Moon className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                  <span>Dark Mode</span>
                  {theme === 'dark' && <CheckCircle2Icon className="ml-auto h-4 w-4 text-accent" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                  <Settings className="mr-2.5 h-4 w-4 text-muted-foreground transition-colors" />
                  <span>System Default</span>
                  {theme === 'system' && <CheckCircle2Icon className="ml-auto h-4 w-4 text-accent" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           </motion.div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            {renderCurrentStep()}
        </div>
      </main>

      <footer className="py-10 px-4 md:px-8 border-t border-border/40 bg-card/80 mt-20 backdrop-blur-sm">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p>
              &copy; {currentYear ?? <span className="inline-block w-10 h-4 bg-muted/40 rounded-sm animate-pulse"></span>} ScholarAI. 
              <Sparkles className="inline h-4 w-4 text-accent mx-1.5"/>
              Powered by Generative AI.
            </p>
            <p className="mt-2.5 text-xs">
              Pioneering the future of research with augmented intelligence.
            </p>
             <a 
                href="https://github.com/firebase/genkit/tree/main/examples/nextjs_template"
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center text-xs text-accent hover:text-accent-foreground hover:underline group"
            >
                View Project on GitHub <ExternalLink className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform"/>
            </a>
          </motion.div>
        </div>
      </footer>
    </div>
    <DialogContent className="max-w-3xl md:max-w-4xl lg:max-w-5xl p-2 sm:p-3 bg-transparent border-none shadow-none !rounded-xl">
        <DialogHeader>
            <DialogTitle className="sr-only">Image Preview</DialogTitle>
            <DialogDescription className="sr-only">Full-size view of the generated image.</DialogDescription>
        </DialogHeader>
        {generatedImageUrl && (
          <NextImage 
            src={generatedImageUrl} 
            alt="Full-size conceptual visualization" 
            width={1200} 
            height={1200} 
            className="rounded-xl object-contain w-full h-auto max-h-[85vh] shadow-2xl bg-black/50 backdrop-blur-md"
            data-ai-hint="research concept"
          />
        )}
    </DialogContent>
    </Dialog>
  );
}
