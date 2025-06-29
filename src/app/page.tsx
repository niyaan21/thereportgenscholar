
// src/app/page.tsx
'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { useActionState } from 'react';
import NextLink from 'next/link';
import dynamic from 'next/dynamic'; // Import next/dynamic

import HeroSection from '@/components/landing/HeroSection';
// Dynamically import landing sections as they are only for the initial view
const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection'));
const KeyFeaturesShowcase = dynamic(() => import('@/components/landing/KeyFeaturesShowcase'));
const FinalCTASection = dynamic(() => import('@/components/landing/FinalCTASection'));

import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueriesDisplay from '@/components/scholar-ai/FormulatedQueriesDisplay';
import ResearchSummaryDisplay from '@/components/scholar-ai/ResearchSummaryDisplay';
import ResearchReportDisplay from '@/components/scholar-ai/ResearchReportDisplay';
import GeneratingStateDisplay from '@/components/scholar-ai/GeneratingStateDisplay';


import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Import Badge
import { ToastAction } from "@/components/ui/toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft, RotateCcw, FileTextIcon, Settings, Moon, Sun, Palette, Image as ImageIconLucide, Loader2, BookOpen, Brain, Search, Filter, BarChartBig, Telescope, Layers, Sparkles, Bot, CornerDownLeft, Edit, CheckSquare, Zap, Eye, Lightbulb, FileArchive, Atom, ClipboardCopy, Share2, Download, Sigma, BarChartHorizontal, TrendingUpIcon, ScaleIcon, FlaskConical, LightbulbIcon as LightbulbLucideIcon, InfoIcon, AlertCircleIcon, CheckCircle2Icon, ExternalLink, MaximizeIcon, ChevronRight, Rocket, Check, Lock, FileText, Shield, MessageSquare, Tag, MessagesSquare, ListTree
} from 'lucide-react'; // Added Tag, MessagesSquare, ListTree
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Import Accordion

import {
  handleFormulateQueryAction,
  handleSynthesizeResearchAction,
  handleGenerateReportAction,
  type FormulateQueryActionState,
  type SynthesizeResearchActionState,
  type GenerateReportActionState,
} from '@/app/actions';
import type { GenerateResearchReportOutput } from '@/ai/flows/generate-research-report';
import { useToast } from '@/hooks/use-toast';
import { addResearchActivity } from '@/lib/historyService';
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
  originalQuestion: '',
  formulatedQueries: null,
  alternativePhrasings: null,
  keyConcepts: null,
  potentialSubTopics: null,
  errors: null,
};

const initialSynthesizeResearchActionState: SynthesizeResearchActionState = {
    success: false,
    message: '',
    researchSummary: null,
    summarizedPaperTitles: null,
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
  const [alternativePhrasings, setAlternativePhrasings] = useState<string[]>([]);
  const [keyConcepts, setKeyConcepts] = useState<string[]>([]);
  const [potentialSubTopics, setPotentialSubTopics] = useState<string[]>([]);
  
  const [researchSummary, setResearchSummary] = useState<string>(''); // This will now be editable
  const [summarizedPaperTitles, setSummarizedPaperTitles] = useState<string[]>([]);
  const [generateCharts, setGenerateCharts] = useState(true);

  const [_isTransitionPending, startTransition] = useTransition();

  const [formulateQueryState, formulateQueryFormAction, isFormulatingQueries] = useActionState(handleFormulateQueryAction, initialFormulateQueryActionState);
  const [synthesizeResearchState, synthesizeResearchFormAction, isSynthesizingResearch] = useActionState(handleSynthesizeResearchAction, initialSynthesizeResearchActionState);
  const [reportActionState, reportFormAction, isReportGenerating] = useActionState(handleGenerateReportAction, initialReportActionState);

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

  const handleQueriesFormulatedCallback = useCallback((
    question: string,
    queries?: string[] | null,
    altPhrasings?: string[] | null,
    kConcepts?: string[] | null,
    subTopics?: string[] | null
  ) => {
    startTransition(() => {
      setResearchQuestion(question);
      setQueryFormInputValue(question);
      setFormulatedQueries(queries || []);
      setAlternativePhrasings(altPhrasings || []);
      setKeyConcepts(kConcepts || []);
      setPotentialSubTopics(subTopics || []);
      setAppState('queries_formulated');
      if (currentUser) {
        addResearchActivity({ type: 'query-formulation', question });
      }
    });
  }, [currentUser]);

  const handleResearchSynthesizedCallback = useCallback((summary: string, titles: string[]) => {
    startTransition(() => {
      setResearchSummary(summary); // Set the initial AI-generated summary
      setSummarizedPaperTitles(titles);
      setAppState('summary_generated');
    });
  }, []);


  useEffect(() => {
    if (!isFormulatingQueries && formulateQueryState.message) {
      if (formulateQueryState.success && formulateQueryState.originalQuestion) {
        toast({ title: "🚀 AI Engine Ignited!", description: formulateQueryState.message, variant: 'default', duration: 5000 });
        handleQueriesFormulatedCallback(
          formulateQueryState.originalQuestion,
          formulateQueryState.formulatedQueries,
          formulateQueryState.alternativePhrasings,
          formulateQueryState.keyConcepts,
          formulateQueryState.potentialSubTopics
        );
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
        toast({ title: "🚫 Report Generation Failed", description: fullErrorMessage, variant: "destructive", duration: 9000 });
      }
    }
  }, [reportActionState, isReportGenerating, toast, researchQuestion, currentUser]);

  const handleStartNewResearch = useCallback(() => {
    startTransition(() => {
      setAppState('initial');
      setResearchQuestion('');
      setQueryFormInputValue('');
      setFormulatedQueries([]);
      setAlternativePhrasings([]);
      setKeyConcepts([]);
      setPotentialSubTopics([]);
      setResearchSummary('');
      setSummarizedPaperTitles([]);
      setGenerateCharts(true);
      // Reset action states if possible, or rely on new form submissions to overwrite
    });
  }, []);

  const handleGoBack = useCallback(() => {
    startTransition(() => {
      if (appState === 'report_generated') {
        setAppState('summary_generated');
      } else if (appState === 'summary_generated') {
        setAppState('queries_formulated');
        // Keep researchSummary as is, as it's now editable
        // setSummarizedPaperTitles([]); // Not strictly necessary to clear this
      } else if (appState === 'queries_formulated') {
        setAppState('initial');
        setQueryFormInputValue(researchQuestion);
        setAlternativePhrasings([]);
        setKeyConcepts([]);
        setPotentialSubTopics([]);
      }
    });
  }, [appState, researchQuestion]);

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
      // Ensure the current (potentially edited) researchSummary is used
      if (researchSummary && researchSummary.trim().length > 0) {
        formData.append('summary', researchSummary.trim());
      }
      if (generateCharts) {
        formData.append('generateCharts', 'on');
      }
      reportFormAction(formData);
    });
  }, [researchQuestion, researchSummary, generateCharts, reportFormAction, toast, currentUser]);

  const isLoading = isFormulatingQueries || isSynthesizingResearch || isReportGenerating;
  const isFormDisabled = (!currentUser && authChecked) || isLoading;

  const ActionButton: React.FC<React.ComponentProps<typeof Button> & { icon?: React.ElementType, isProcessing?: boolean, label: string, pending?: boolean }> = ({ icon: Icon, isProcessing, pending, label, children, ...props }) => (
    <Button {...props} disabled={isLoading || isProcessing || pending || props.disabled || (!currentUser && authChecked)} className={cn("shadow-lg hover:shadow-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center justify-center group w-full sm:w-auto text-base py-3", props.className)}>
      {(isProcessing || pending) ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (Icon && <Icon className="mr-2.5 h-5 w-5" />)}
      {label || children}
    </Button>
  );


  const renderCurrentStep = () => {
    const animationClasses = "animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out";

    if (isFormulatingQueries) {
      return (
        <GeneratingStateDisplay
          title="Forging Your Research Path..."
          description="Our AI is analyzing your question to create a tailored research strategy."
          steps={[
            { text: 'Analyzing core concepts...', duration: 2000 },
            { text: 'Identifying related topics...', duration: 2500 },
            { text: 'Formulating optimal search vectors...', duration: 3000 },
          ]}
        />
      );
    }
    
    if (isSynthesizingResearch) {
      return (
        <GeneratingStateDisplay
          title="Illuminating Key Insights..."
          description="The AI is synthesizing information from its knowledge base to build a concise overview."
          steps={[
            { text: 'Processing search vectors...', duration: 2000 },
            { text: 'Gathering conceptual information...', duration: 3000 },
            { text: 'Synthesizing key themes...', duration: 3500 },
            { text: 'Drafting initial summary...', duration: 2000 },
          ]}
        />
      );
    }
    
    if (isReportGenerating) {
        return (
          <GeneratingStateDisplay
            title="Crafting Your Comprehensive Report..."
            description="This is the most intensive step. The AI is now writing your multi-section report."
            steps={[
              { text: 'Structuring report outline...', duration: 3000 },
              { text: 'Writing introduction & literature review...', duration: 7000 },
              { text: 'Developing key themes & methodology...', duration: 7000 },
              { text: 'Analyzing results & suggesting charts...', duration: 6000 },
              { text: 'Drafting discussion & conclusion...', duration: 7000 },
              { text: 'Assembling final document...', duration: 3000 },
            ]}
          />
        );
    }

    switch (appState) {
      case 'initial':
        return (
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
          </div>
        );
      case 'queries_formulated':
        return (
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
              alternativePhrasings={alternativePhrasings}
              keyConcepts={keyConcepts}
              potentialSubTopics={potentialSubTopics}
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
      case 'summary_generated':
        return (
          <div key="summary" className={cn("w-full space-y-6 md:space-y-8", animationClasses)}>
            <ResearchSummaryDisplay
              summary={researchSummary}
              onSummaryChange={setResearchSummary} // Pass setter to allow editing
              originalQuestion={researchQuestion}
              summarizedPaperTitles={summarizedPaperTitles}
              generateCharts={generateCharts}
              onGenerateChartsChange={setGenerateCharts}
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
      case 'report_generated':
        return (
          <div key="report" className={cn("w-full space-y-6 md:space-y-8", animationClasses)} id="research-report-section">
            {reportActionState.researchReport && (
              <ResearchReportDisplay
                report={reportActionState.researchReport}
                originalQuestion={researchQuestion}
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
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background flex flex-col antialiased selection:bg-accent/20 selection:text-accent-foreground">

      <main className={cn(
        "flex-grow",
        appState === 'initial' || isLoading ?
          "w-full flex items-center justify-center" : 
          "container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12"
      )}>
        <div className={cn(
          appState === 'initial' && !isLoading ?
            "w-full" : 
            "max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full",
            isLoading && "px-4 sm:px-6 lg:px-8" 
        )}>
            {renderCurrentStep()}
        </div>
      </main>
    </div>
  );
}
