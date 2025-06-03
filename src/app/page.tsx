
// src/app/page.tsx
'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { useActionState } from 'react'; 
import NextLink from 'next/link';

import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import KeyFeaturesShowcase from '@/components/landing/KeyFeaturesShowcase';
import FinalCTASection from '@/components/landing/FinalCTASection';

import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueriesDisplay from '@/components/scholar-ai/FormulatedQueriesDisplay';
import ResearchSummaryDisplay from '@/components/scholar-ai/ResearchSummaryDisplay';
import ResearchReportDisplay from '@/components/scholar-ai/ResearchReportDisplay';

import { Button } from '@/components/ui/button';
import { ToastAction } from "@/components/ui/toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft, RotateCcw, FileTextIcon, Settings, Moon, Sun, Palette, Image as ImageIconLucide, Loader2, BookOpen, Brain, Search, Filter, BarChartBig, Telescope, Layers, Sparkles, Bot, CornerDownLeft, Edit, CheckSquare, Zap, Eye, Lightbulb, FileArchive, Atom, ClipboardCopy, Share2, Download, Sigma, BarChartHorizontal, TrendingUpIcon, ScaleIcon, FlaskConical, LightbulbIcon as LightbulbLucideIcon, InfoIcon, AlertCircleIcon, CheckCircle2Icon, ExternalLink, MaximizeIcon, ChevronRight, Rocket, Check, Lock, FileText, Shield, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

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
import { addResearchActivity } from '@/lib/historyService'; // Import history service
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
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

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
  
  const [_isTransitionPending, startTransition] = useTransition();

  const [formulateQueryState, formulateQueryFormAction, isFormulatingQueries] = useActionState(handleFormulateQueryAction, initialFormulateQueryActionState);
  const [synthesizeResearchState, synthesizeResearchFormAction, isSynthesizingResearch] = useActionState(handleSynthesizeResearchAction, initialSynthesizeResearchActionState);
  const [imageActionState, imageFormAction, isImageGenerating] = useActionState(handleGenerateImageAction, initialImageActionState);
  const [reportActionState, reportFormAction, isReportGenerating] = useActionState(handleGenerateReportAction, initialReportActionState);
  
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isImagePreviewDialogOpen, setIsImagePreviewDialogOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false); 

  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const handleQueriesFormulatedCallback = useCallback((queries: string[], question: string) => {
    startTransition(() => {
      setResearchQuestion(question); 
      setQueryFormInputValue(question);
      setFormulatedQueries(queries);
      setAppState('queries_formulated');
      setGeneratedImageUrl(null);
      if (currentUser) {
        addResearchActivity({ type: 'query-formulation', question });
      }
    });
  }, [currentUser]);

  const handleResearchSynthesizedCallback = useCallback((summary: string, titles: string[]) => {
    startTransition(() => {
      setResearchSummary(summary);
      setSummarizedPaperTitles(titles);
      setAppState('summary_generated');
    });
  }, []);

  
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
        if (currentUser) {
          addResearchActivity({
            type: 'report-generation',
            question: researchQuestion,
            reportTitle: reportActionState.researchReport.title,
            executiveSummarySnippet: reportActionState.researchReport.executiveSummary?.substring(0, 150) + (reportActionState.researchReport.executiveSummary && reportActionState.researchReport.executiveSummary.length > 150 ? '...' : '')
          });
        }
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
  }, [reportActionState, isReportGenerating, toast, researchQuestion, currentUser]);

  const handleStartNewResearch = useCallback(() => {
    startTransition(() => {
      setAppState('initial');
      setResearchQuestion('');
      setQueryFormInputValue('');
      setFormulatedQueries([]);
      setResearchSummary('');
      setSummarizedPaperTitles([]);
      setGeneratedImageUrl(null);
      // Reset action states if needed
    });
  }, []);

  const handleGoBack = useCallback(() => {
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
  }, [appState, researchQuestion]);
  
  const handleGenerateImageForTopic = useCallback(() => {
     if (!currentUser) {
      toast({ title: "Authentication Required", description: "Please log in or sign up to generate images.", variant: "destructive", duration: 5000 });
      return;
    }
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

    if (topicForImage.length > 195) { 
      topicForImage = topicForImage.substring(0, 195) + "..."; 
    }

    startTransition(() => {
      const formData = new FormData();
      formData.append('topic', topicForImage); 
      imageFormAction(formData);
    });
  }, [researchQuestion, imageFormAction, toast, currentUser]);


  const handleGenerateFullReport = useCallback(() => {
     if (!currentUser) {
      toast({ title: "Authentication Required", description: "Please log in or sign up to generate reports.", variant: "destructive", duration: 5000 });
      return;
    }
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
  }, [researchQuestion, researchSummary, reportFormAction, toast, currentUser]);

  const openImagePreviewDialog = useCallback(() => {
    setIsImagePreviewDialogOpen(true);
  }, []);

  const isLoading = isFormulatingQueries || isSynthesizingResearch || isImageGenerating || isReportGenerating;
  const isFormDisabled = (!currentUser && authChecked) || isLoading;
  
  const ActionButton: React.FC<React.ComponentProps<typeof Button> & { icon?: React.ElementType, isProcessing?: boolean, label: string, pending?: boolean }> = ({ icon: Icon, isProcessing, pending, label, children, ...props }) => (
    <Button {...props} disabled={isLoading || isProcessing || pending || props.disabled || (!currentUser && authChecked)} className={cn("shadow-lg hover:shadow-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center justify-center group w-full sm:w-auto text-base py-3", props.className)}>
      {(isProcessing || pending) ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (Icon && <Icon className="mr-2.5 h-5 w-5" />)}
      {label || children}
    </Button>
  );


  const renderCurrentStep = () => {
    let content;
    let animationClasses = "animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out";
    switch (appState) {
      case 'initial':
        content = (
          <div key="initial" className={cn("w-full", animationClasses)}>
            <HeroSection 
              queryFormSlot={
                <QueryForm 
                  formAction={formulateQueryFormAction}
                  isBusy={isFormulatingQueries || (!currentUser && authChecked)}
                  isDisabled={!currentUser && authChecked}
                  value={queryFormInputValue}
                  onChange={setQueryFormInputValue}
                />
              }
              isAuthenticated={!!currentUser}
              authLoading={!authChecked}
            />
            <HowItWorksSection />
            <KeyFeaturesShowcase />
            <FinalCTASection />
          </div>
        );
        break;
      case 'queries_formulated':
        content = (
          <div key="queries" className={cn("w-full space-y-6 md:space-y-8", animationClasses)}>
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
              isBusy={isSynthesizingResearch || (!currentUser && authChecked)}
            />
             {appState === 'queries_formulated' && (
              <CardFooter className="flex flex-col sm:flex-row justify-start items-center gap-3 sm:gap-4 p-0 pt-6 md:pt-8 border-t border-border/40 mt-6 md:mt-8">
                <ActionButton
                    onClick={handleGoBack}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-input hover:bg-muted/20 hover:text-muted-foreground px-6 sm:px-8 rounded-xl"
                    icon={ArrowLeft}
                    label="Edit Question"
                    aria-label="Go back to edit research question"
                    disabled={isLoading}
                  />
              </CardFooter>
            )}
          </div>
        );
        break;
      case 'summary_generated':
        content = (
          <div key="summary" className={cn("w-full space-y-6 md:space-y-8", animationClasses)}>
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
                  onClick={handleGoBack}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-input hover:bg-muted/20 hover:text-muted-foreground px-6 sm:px-8 rounded-xl"
                  icon={ArrowLeft}
                  label="Refine Queries"
                  aria-label="Go back to formulated queries"
                  disabled={isLoading}
                />
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
            </CardFooter>
          </div>
        );
        break;
      case 'report_generated':
        content = (
          <div key="report" className={cn("w-full space-y-6 md:space-y-8", animationClasses)} id="research-report-section">
            {reportActionState.researchReport && (
              <ResearchReportDisplay 
                report={reportActionState.researchReport} 
                originalQuestion={researchQuestion} 
                generatedImageUrl={generatedImageUrl}
                onOpenImagePreview={openImagePreviewDialog}
              />
            )}
            <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 p-0 pt-6 md:pt-8 border-t border-border/40 mt-6 md:mt-8">
               <ActionButton
                  onClick={handleGoBack}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-input hover:bg-muted/20 hover:text-muted-foreground px-6 sm:px-8 rounded-xl"
                  icon={ArrowLeft}
                  label="View Summary"
                  aria-label="Go back to research summary"
                  disabled={isLoading}
                />
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
      
      <main className={cn(
        "flex-grow container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12",
        appState === 'initial' ? "max-w-none md:py-0" : "md:py-16" // Full width for landing, constrained for workflow
      )}>
        <div className={cn(appState !== 'initial' && "max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto")}>
            {renderCurrentStep()}
        </div>
      </main>
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
            data-ai-hint="research concept fullsize"
          />
        )}
    </DialogContent>
    </Dialog>
  );
}
