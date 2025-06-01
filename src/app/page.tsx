
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
  ArrowLeft, RotateCcw, FileTextIcon, Settings, Moon, Sun, Palette, Image as ImageIconLucide, Loader2, BookOpen, Brain, Search, Filter, BarChartBig, Telescope, Beaker, Sparkles, Bot, CornerDownLeft, Edit, CheckSquare, Zap, Eye, Lightbulb, FileArchive, Atom, ClipboardCopy, Share2, Download, Sigma, BarChartHorizontal, TrendingUpIcon, ScaleIcon, FlaskConical, LightbulbIcon as LightbulbLucideIcon, InfoIcon, AlertCircleIcon, CheckCircle2Icon, ExternalLink, MaximizeIcon, ChevronRight, Rocket, Check
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
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
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
  const [isImagePreviewDialogOpen, setIsImagePreviewDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const handleQueriesFormulatedCallback = useCallback((queries: string[], question: string) => {
    startTransition(() => {
      setResearchQuestion(question); 
      setQueryFormInputValue(question);
      setFormulatedQueries(queries);
      setAppState('queries_formulated');
      setGeneratedImageUrl(null); 
    });
  }, []);

  const handleResearchSynthesizedCallback = useCallback((summary: string, titles: string[]) => {
    startTransition(() => {
      setResearchSummary(summary);
      setSummarizedPaperTitles(titles);
      setAppState('summary_generated');
    });
  }, []);


  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    const localTheme = localStorage.getItem('theme') as typeof theme | null;
    if (localTheme) {
      setTheme(localTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light'); 
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
  }, [formulateQueryState, isFormulatingQueries, toast, handleQueriesFormulatedCallback]);

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
  }, [synthesizeResearchState, isSynthesizingResearch, toast, handleResearchSynthesizedCallback]);


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
            <ToastAction altText="View Image" onClick={(e) => {
              e.preventDefault(); 
              setIsImagePreviewDialogOpen(true);
            }}>View</ToastAction>
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
  }, [imageActionState, isImageGenerating, toast, setIsImagePreviewDialogOpen]);

  useEffect(() => {
    if (reportActionState.message && !isReportGenerating) { 
      if (reportActionState.success && reportActionState.researchReport) {
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

  const handleStartNewResearch = () => {
    startTransition(() => {
      setAppState('initial');
      setResearchQuestion('');
      setQueryFormInputValue('');
      setFormulatedQueries([]);
      setResearchSummary('');
      setSummarizedPaperTitles([]);
      setGeneratedImageUrl(null);
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
        setQueryFormInputValue(researchQuestion); 
      }
    });
  };
  
  const handleGenerateImageForTopic = useCallback(() => {
    let topicForImage = researchQuestion.trim(); 
    
    if (!topicForImage || topicForImage.length < 5) {
      toast({
        title: "🚫 Cannot Generate Image",
        description: "A valid research question (min. 5 characters) is required to generate a visual concept.",
        variant: "destructive",
        duration: 6000,
      });
      return;
    }

    if (topicForImage.length > 200) {
      topicForImage = topicForImage.substring(0, 195) + "..."; 
    }

    startTransition(() => {
      const formData = new FormData();
      formData.append('topic', topicForImage); 
      imageFormAction(formData);
    });
  }, [researchQuestion, imageFormAction, toast]);


  const handleGenerateFullReport = useCallback(() => {
    const currentResearchQuestion = researchQuestion.trim();
     if (!currentResearchQuestion || currentResearchQuestion.length < 10) {
      toast({
        title: "🚫 Cannot Generate Report",
        description: "The research question is too short or missing. Please ensure a valid research question (min. 10 characters) was used to start this session.",
        variant: "destructive",
        duration: 6000,
      });
      return;
    }
    startTransition(() => {
      const formData = new FormData();
      formData.append('researchQuestion', currentResearchQuestion);
      if (researchSummary && researchSummary.trim().length > 0) {
        formData.append('summary', researchSummary.trim());
      }
      reportFormAction(formData);
    });
  }, [researchQuestion, researchSummary, reportFormAction, toast]);

  const openImagePreviewDialog = useCallback(() => {
    setIsImagePreviewDialogOpen(true);
  }, []);

  const isLoading = isFormulatingQueries || isSynthesizingResearch || isImageGenerating || isReportGenerating;
  
  const ActionButton: React.FC<React.ComponentProps<typeof Button> & { icon?: React.ElementType, isProcessing?: boolean, label: string, pending?: boolean }> = ({ icon: Icon, isProcessing, pending, label, children, ...props }) => (
    <Button {...props} disabled={isLoading || isProcessing || pending || props.disabled} className={cn("shadow-lg hover:shadow-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center justify-center group w-full sm:w-auto text-base py-3", props.className)}>
      {(isProcessing || pending) ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (Icon && <Icon className="mr-2.5 h-5 w-5" />)}
      {label || children}
    </Button>
  );

  const renderCurrentStep = () => {
    let content;
    switch (appState) {
      case 'initial':
        content = (
          <div key="initial" className="w-full">
            <QueryForm 
              formAction={formulateQueryFormAction}
              isBusy={isFormulatingQueries}
              value={queryFormInputValue}
              onChange={setQueryFormInputValue}
            />
          </div>
        );
        break;
      case 'queries_formulated':
        content = (
          <div key="queries" className="w-full space-y-6 md:space-y-8">
            <Card className="overflow-hidden shadow-xl border-accent/30 bg-card rounded-2xl">
              <CardHeader className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-accent/15 via-transparent to-accent/5 border-b border-accent/25">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-3 sm:p-3.5 bg-gradient-to-br from-accent to-accent/70 rounded-full shadow-lg border-2 border-accent/50 text-accent-foreground">
                    <FileTextIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-primary tracking-tight">
                      Your Research Focus
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">The central question guiding this research: <strong className="text-foreground/90">"{researchQuestion}"</strong></CardDescription>
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
          <div key="summary" className="w-full space-y-6 md:space-y-8">
            <ResearchSummaryDisplay
              summary={researchSummary}
              originalQuestion={researchQuestion} 
              summarizedPaperTitles={summarizedPaperTitles}
              onGenerateImage={handleGenerateImageForTopic} 
              generatedImageUrl={generatedImageUrl}
              isGeneratingImage={isImageGenerating}
              onOpenImagePreview={openImagePreviewDialog}
            />
            <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 p-0 pt-6 md:pt-8 border-t border-border/40 mt-6 md:mt-8">
                <ActionButton
                  onClick={handleGenerateFullReport}
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/80 hover:to-primary px-6 sm:px-8 rounded-xl"
                  pending={isReportGenerating}
                  icon={BookOpen}
                  label="Generate Full Report"
                  aria-label="Generate Full Research Report"
                />
                <ActionButton
                  onClick={handleStartNewResearch}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-input hover:bg-accent/10 hover:text-accent-foreground px-6 sm:px-8 rounded-xl"
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
          <div key="report" className="w-full space-y-6 md:space-y-8" id="research-report-section">
            {reportActionState.researchReport && (
              <ResearchReportDisplay 
                report={reportActionState.researchReport} 
                originalQuestion={researchQuestion} 
                generatedImageUrl={generatedImageUrl}
                onOpenImagePreview={openImagePreviewDialog}
              />
            )}
            <CardFooter className="flex justify-center p-0 pt-6 md:pt-8 border-t border-border/40 mt-6 md:mt-8">
              <ActionButton
                onClick={handleStartNewResearch}
                variant="default"
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/80 hover:to-primary px-6 sm:px-8 rounded-xl"
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
    return content;
  };


  return (
    <Dialog open={isImagePreviewDialogOpen} onOpenChange={setIsImagePreviewDialogOpen}>
      <DialogTrigger asChild>
        <button className="hidden">Hidden Dialog Trigger for Programmatic Control</button>
      </DialogTrigger>
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background flex flex-col overflow-x-hidden antialiased selection:bg-accent/20 selection:text-accent-foreground">
      <header
        className="py-3 sm:py-4 px-4 md:px-8 bg-card/95 text-card-foreground shadow-2xl sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div 
            className="flex items-center space-x-2.5 sm:space-x-4 group cursor-pointer flex-shrink min-w-0" 
            onClick={handleStartNewResearch}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleStartNewResearch()}
            aria-label="Start new research"
          >
            <div
              className="p-3.5 sm:p-4 bg-gradient-to-br from-primary via-primary/90 to-primary/75 rounded-xl sm:rounded-2xl shadow-lg text-primary-foreground ring-2 ring-primary/40 ring-offset-2 ring-offset-card"
            >
              <Beaker className="h-7 w-7 sm:h-9 sm:w-9" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent group-hover:from-accent group-hover:to-primary transition-all duration-300 truncate">
                ScholarAI
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5 tracking-wide truncate hidden sm:block">Augmented Intelligence for Research</p>
            </div>
          </div>
           <div 
             className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
            >
            {appState !== 'initial' && (
                <Button 
                  onClick={handleGoBack} 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:bg-accent/15 hover:text-accent-foreground disabled:opacity-50 h-9 w-9 sm:h-10 sm:w-10 rounded-full"
                  disabled={isLoading}
                  aria-label="Go back to previous step"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent/15 hover:text-accent-foreground h-9 w-9 sm:h-10 sm:w-10 rounded-full" aria-label="Theme settings">
                  <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-border/70 bg-popover shadow-xl rounded-lg p-1.5">
                <DropdownMenuLabel className="font-semibold text-popover-foreground px-2 py-1.5 text-sm">Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50 -mx-1 my-1" />
                <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                  <Sun className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                  <span>Light Mode</span>
                  {theme === 'light' && <Check className="ml-auto h-4 w-4 text-accent" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                  <Moon className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                  <span>Dark Mode</span>
                  {theme === 'dark' && <Check className="ml-auto h-4 w-4 text-accent" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                  <Settings className="mr-2.5 h-4 w-4 text-muted-foreground transition-colors" />
                  <span>System Default</span>
                  {theme === 'system' && <Check className="ml-auto h-4 w-4 text-accent" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-16">
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            {renderCurrentStep()}
        </div>
      </main>

      <footer className="py-8 sm:py-10 px-4 md:px-8 border-t-2 border-border/50 bg-background mt-16 sm:mt-20">
        <div className="container mx-auto text-center text-xs sm:text-sm text-muted-foreground">
          <div>
            <p>
              &copy; {currentYear ?? <span className="inline-block w-10 h-4 bg-muted/40 rounded-sm animate-pulse"></span>} ScholarAI. 
              <Sparkles className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent mx-1 sm:mx-1.5"/>
              Powered by Generative AI.
            </p>
            <p className="mt-2 text-xs">
              Pioneering the future of research with augmented intelligence.
            </p>
             <a 
                href="https://github.com/firebase/genkit/tree/main/examples/nextjs_template"
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-3 sm:mt-4 inline-flex items-center text-xs text-accent hover:text-accent-foreground hover:underline group"
            >
                View Project on GitHub <ExternalLink className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform"/>
            </a>
          </div>
        </div>
      </footer>
    </div>
    <DialogContent className="w-[95vw] max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl p-1 sm:p-2 bg-transparent border-none shadow-none !rounded-lg">
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
            className="rounded-lg sm:rounded-xl object-contain w-full h-auto max-h-[85svh] shadow-2xl bg-black/50 backdrop-blur-md"
            data-ai-hint="research concept"
          />
        )}
    </DialogContent>
    </Dialog>
  );
}
