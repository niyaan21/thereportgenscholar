// src/app/page.tsx
'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { useActionState } from 'react'; // Keep this for React 19+

import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueriesDisplay from '@/components/scholar-ai/FormulatedQueriesDisplay';
import ResearchSummaryDisplay from '@/components/scholar-ai/ResearchSummaryDisplay';
import ResearchReportDisplay from '@/components/scholar-ai/ResearchReportDisplay';

import { Button } from '@/components/ui/button';
import { ToastAction } from "@/components/ui/toast";
import {
  ArrowLeft, RotateCcw, FileTextIcon, Settings, Moon, Sun, Palette, Image as ImageIcon, Loader2, BookOpen, Brain, Search, Filter, BarChartBig, Telescope, Beaker, Sparkles, Bot, CornerDownLeft, Edit, CheckSquare, Zap, Eye, Lightbulb, FileArchive, Atom, ClipboardCopy, Share2, Download, Sigma, BarChartHorizontal, TrendingUpIcon, ScaleIcon, FlaskConical, LightbulbIcon as LightbulbLucideIcon, InfoIcon, AlertCircleIcon, CheckCircle2Icon, ExternalLink, MaximizeIcon
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
  const [researchQuestion, setResearchQuestion] = useState<string>(''); // This will hold the confirmed research question
  const [queryFormInputValue, setQueryFormInputValue] = useState<string>(''); // For controlled QueryForm textarea
  
  const [formulatedQueries, setFormulatedQueries] = useState<string[]>([]);
  const [researchSummary, setResearchSummary] = useState<string>('');
  const [summarizedPaperTitles, setSummarizedPaperTitles] = useState<string[]>([]);
  
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [_isTransitionPending, startTransition] = useTransition(); // General transition pending state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Action states
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
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
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
  
  // Effect for Query Formulation
  useEffect(() => {
    if (!isFormulatingQueries && formulateQueryState.message) { // Check if action is done and message exists
      if (formulateQueryState.success && formulateQueryState.formulatedQueries && formulateQueryState.originalQuestion) {
        toast({ title: "🚀 AI Engine Ignited!", description: formulateQueryState.message, variant: 'default', duration: 5000 });
        // Call the callback with the original question from the action state
        handleQueriesFormulatedCallback(formulateQueryState.formulatedQueries, formulateQueryState.originalQuestion);
      } else if (!formulateQueryState.success) {
        let description = formulateQueryState.message;
        if (formulateQueryState.errors?.researchQuestion) {
          description += ` ${formulateQueryState.errors.researchQuestion.join(' ')}`;
        }
        toast({ title: "🚦 Engine Stalled!", description, variant: 'destructive', duration: 7000 });
      }
    }
  }, [formulateQueryState, isFormulatingQueries]); // Removed handleQueriesFormulatedCallback from deps

  // Effect for Research Synthesis
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
  }, [synthesizeResearchState, isSynthesizingResearch]); // Removed handleResearchSynthesizedCallback from deps


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
                <ToastAction altText="View Image" onClick={(e) => {e.preventDefault(); /* Dialog should open */ }}>View</ToastAction>
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
        setResearchQuestion(reportActionState.researchReport.title); 
        setAppState('report_generated');
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
      setResearchQuestion(question); // Set the confirmed research question for the app
      setFormulatedQueries(queries);
      setAppState('queries_formulated');
      setGeneratedImageUrl(null); 
      setQueryFormInputValue(''); // Clear the input form value
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
      // Reset action states if needed, though useActionState usually handles this by keying or re-rendering
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
      }
    });
  };
  
  const handleGenerateImageForTopic = (topicForImage: string) => { 
    if (!topicForImage || topicForImage.trim().length < 5) {
      toast({
        title: "🚫 Cannot Generate Image",
        description: "The research topic provided is too short or empty. Please ensure a valid topic (min. 5 characters).",
        variant: "destructive",
      });
      return;
    }
    startTransition(() => {
      const formData = new FormData();
      formData.append('topic', topicForImage.trim()); 
      imageFormAction(formData);
    });
  };

  const handleGenerateFullReport = () => {
     if (!researchQuestion || researchQuestion.trim().length < 10) {
      toast({
        title: "🚫 Cannot Generate Report",
        description: "A valid research question (min. 10 characters) is required. Please formulate queries first.",
        variant: "destructive",
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
  };

  const isLoading = isFormulatingQueries || isSynthesizingResearch || isImageGenerating || isReportGenerating;
  
  const pageVariants = {
    initial: { opacity: 0, y: 0 }, // Keep y at 0 for smoother transitions
    enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, y: 0, transition: { duration: 0.2, ease: "easeInOut" } }
  };
  
  const ActionButton: React.FC<React.ComponentProps<typeof Button> & { icon?: React.ElementType, isProcessing?: boolean, label: string }> = ({ icon: Icon, isProcessing, label, children, ...props }) => (
    <Button {...props} disabled={isLoading || isProcessing || props.disabled} className={cn("shadow-lg hover:shadow-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center justify-center group", props.className)}>
      {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (Icon && <Icon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />)}
      {label || children}
    </Button>
  );

  const renderCurrentStep = () => {
    let content;
    switch (appState) {
      case 'initial':
        content = (
          <QueryForm 
            formAction={formulateQueryFormAction}
            isBusy={isFormulatingQueries}
            value={queryFormInputValue}
            onChange={setQueryFormInputValue}
            // errors={formulateQueryState.errors} // Pass errors for display if needed
          />
        );
        break;
      case 'queries_formulated':
        content = (
          <div className="space-y-8">
            <Card className="overflow-hidden shadow-xl card-glow-border border-accent/25 bg-card rounded-2xl">
              <CardHeader className="p-6 md:p-7 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 border-b border-accent/20">
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-gradient-to-br from-accent to-accent/70 rounded-full shadow-lg border-2 border-accent/50 text-accent-foreground">
                    <FileTextIcon className="h-7 w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-semibold text-accent-foreground tracking-tight">
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
          </div>
        );
        break;
      case 'summary_generated':
        content = (
          <div className="space-y-8">
            <ResearchSummaryDisplay
              summary={researchSummary}
              originalQuestion={researchQuestion} // Use the confirmed researchQuestion
              summarizedPaperTitles={summarizedPaperTitles}
              onGenerateImage={() => handleGenerateImageForTopic(researchQuestion)} // Pass confirmed researchQuestion
              generatedImageUrl={generatedImageUrl}
              isGeneratingImage={isImageGenerating}
            />
            <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 p-0 pt-8 border-t border-border/40 mt-8">
                <ActionButton
                  onClick={handleGenerateFullReport}
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/80 hover:to-primary text-base py-3 px-8 rounded-lg"
                  isProcessing={isReportGenerating}
                  icon={BookOpen}
                  label="Generate Full Report"
                  aria-label="Generate Full Research Report"
                />
                <ActionButton
                  onClick={handleStartNewResearch}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-input hover:bg-accent/10 hover:text-accent-foreground text-base py-3 px-8 rounded-lg"
                  icon={RotateCcw}
                  label="Start New Research"
                  aria-label="Start a new research session"
                />
            </CardFooter>
          </div>
        );
        break;
      case 'report_generated':
        content = (
          <div className="space-y-8" id="research-report-section">
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
                className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/80 hover:to-primary text-base py-3 px-8 rounded-lg"
                icon={RotateCcw}
                label="Start New Research Session"
                aria-label="Start a new research session"
              />
            </CardFooter>
          </div>
        );
        break;
      default:
        content = null;
    }
    return (
      <div key={appState} className="w-full"> {/* Simpler transition wrapper without AnimatePresence for now */}
        {content}
      </div>
    );
  };


  return (
    <Dialog>
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background flex flex-col overflow-x-hidden antialiased selection:bg-accent/20 selection:text-accent-foreground">
      <header
        className="py-4 px-4 md:px-8 bg-card/90 text-card-foreground shadow-lg sticky top-0 z-50 border-b border-border/60 backdrop-blur-lg"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div 
            className="flex items-center space-x-3.5 group cursor-pointer" 
            onClick={handleStartNewResearch}
          >
            <div 
              className="p-2.5 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-xl shadow-lg text-primary-foreground transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/40"
            >
              <Beaker className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-primary group-hover:text-accent transition-colors duration-200">
                ScholarAI
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Augmented Intelligence for Research</p>
            </div>
          </div>
           <div 
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
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                  <Moon className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                  <span>Dark Mode</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                  <Settings className="mr-2.5 h-4 w-4 text-muted-foreground transition-colors" />
                  <span>System Default</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            {renderCurrentStep()}
        </div>
      </main>

      <footer className="py-10 px-4 md:px-8 border-t border-border/40 bg-card/80 mt-20">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <div>
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
                className="mt-4 inline-flex items-center text-xs text-accent hover:text-accent-foreground hover:underline"
            >
                View Project on GitHub <ExternalLink className="ml-1.5 h-3.5 w-3.5"/>
            </a>
          </div>
        </div>
      </footer>
    </div>
     {/* Dialog for Image Preview - Ensure DialogTitle and DialogDescription are present */}
    <DialogContent className="max-w-3xl md:max-w-4xl lg:max-w-5xl p-2 sm:p-3 bg-transparent border-none shadow-none">
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
            className="rounded-xl object-contain w-full h-auto max-h-[85vh] shadow-2xl bg-black/30 backdrop-blur-md"
            data-ai-hint="research concept"
          />
        )}
    </DialogContent>
    </Dialog>
  );
}
