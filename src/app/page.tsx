// src/app/page.tsx
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useActionState } from 'react';

import QueryForm, { initialFormulateQueryActionState, type QueryFormProps } from '@/components/scholar-ai/QueryForm';
import FormulatedQueriesDisplay, { initialSynthesizeResearchActionState, type FormulatedQueriesDisplayProps } from '@/components/scholar-ai/FormulatedQueriesDisplay';
import ResearchSummaryDisplay, { type ResearchSummaryDisplayProps } from '@/components/scholar-ai/ResearchSummaryDisplay';
import ResearchReportDisplay, { type ResearchReportDisplayProps } from '@/components/scholar-ai/ResearchReportDisplay';

import { Button } from '@/components/ui/button';
import { ToastAction } from "@/components/ui/toast";
import {
  ArrowLeft, RotateCcw, FileText, Settings, Moon, Sun, Palette, Image as ImageIcon, Loader2, BookOpen, Brain, Search, Filter, BarChartBig, Telescope, Beaker, Sparkles, Bot, CornerDownLeft, Edit, CheckSquare, Zap, Eye, Lightbulb, FileArchive, Atom, ClipboardCopy, Share2, Download, Sigma, BarChartHorizontal, TrendingUpIcon, ScaleIcon, FlaskConical, LightbulbIcon as LightbulbLucideIcon, InfoIcon, AlertCircleIcon, CheckCircle2Icon, ExternalLink, MaximizeIcon
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
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isTransitionPending, startTransition] = useTransition();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const [imageActionState, imageFormAction, isImageGenerating] = useActionState(handleGenerateImageAction, initialImageActionState);
  const [reportActionState, reportFormAction, isReportGenerating] = useActionState(handleGenerateReportAction, initialReportActionState);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  const { toast } = useToast();

  // States for child component busy status - managed by ScholarAIPage and passed down
  const [isProcessingQuery, setIsProcessingQuery] = useState<boolean>(false);
  const [isProcessingSummary, setIsProcessingSummary] = useState<boolean>(false);


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
                <ToastAction altText="View Image" onClick={(e) => e.preventDefault()}>View</ToastAction>
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
        setResearchQuestion(reportActionState.researchReport.title); // Update research question for consistency if report generates its own.
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

  const handleQueriesFormulatedCallback = (queries: string[], question: string) => {
    startTransition(() => {
      setResearchQuestion(question); // This is the original user question
      setFormulatedQueries(queries);
      setAppState('queries_formulated');
      setGeneratedImageUrl(null); 
      // setResearchReport(null); // Keep previous report if user goes back and forth? Or clear? Clearing for now.
    });
    setIsProcessingQuery(false); // Reset busy state for QueryForm
  };

  const handleResearchSynthesizedCallback = (summary: string, titles: string[]) => {
    startTransition(() => {
      setResearchSummary(summary);
      setSummarizedPaperTitles(titles);
      setAppState('summary_generated');
      // setResearchReport(null); // Clear report when new summary is generated
    });
    setIsProcessingSummary(false); // Reset busy state for FormulatedQueriesDisplay
  };

  const handleStartNewResearch = () => {
    startTransition(() => {
      setAppState('initial');
      setResearchQuestion('');
      setFormulatedQueries([]);
      setResearchSummary('');
      setSummarizedPaperTitles([]);
      setGeneratedImageUrl(null);
      // setResearchReport(null); // Cleared by other handlers or here
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
        setResearchSummary(''); // Clear summary when going back
        setSummarizedPaperTitles([]);
      } else if (appState === 'queries_formulated') {
        setAppState('initial');
        // researchQuestion and formulatedQueries are reset by QueryForm interaction or handleStartNewResearch
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
    startTransition(() => { // Ensure this is wrapped in startTransition if it involves state updates that affect pending status
      const formData = new FormData();
      formData.append('topic', topicForImage.trim()); 
      imageFormAction(formData);
    });
  };

  const handleGenerateFullReport = () => {
     if (!researchQuestion || researchQuestion.trim().length < 10) {
      toast({
        title: "🚫 Cannot Generate Report",
        description: "The research question is too short or missing. Please ensure the original research question is valid (min. 10 characters).",
        variant: "destructive",
      });
      return;
    }
    startTransition(() => { // Ensure this is wrapped in startTransition
      const formData = new FormData();
      formData.append('researchQuestion', researchQuestion.trim());
      if (researchSummary && researchSummary.trim().length > 0) { // Ensure summary is not just whitespace
        formData.append('summary', researchSummary.trim());
      }
      reportFormAction(formData);
    });
  };

  const isLoading = isTransitionPending || isProcessingQuery || isProcessingSummary || isImageGenerating || isReportGenerating;
  
  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
    exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.25, ease: [0.5, 0, 0.75, 0] } }
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
            onQueriesFormulated={handleQueriesFormulatedCallback} 
            isBusy={isProcessingQuery} 
            setIsBusy={setIsProcessingQuery}
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
                    <FileText className="h-7 w-7" />
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
              onResearchSynthesized={handleResearchSynthesizedCallback}
              isBusy={isProcessingSummary}
              setIsBusy={setIsProcessingSummary}
            />
          </div>
        );
        break;
      case 'summary_generated':
        content = (
          <div className="space-y-8">
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
                originalQuestion={researchQuestion} // Use current researchQuestion which might be report's title or original user input
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
      <AnimatePresence mode="wait">
        <motion.div
          key={appState}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={pageVariants}
          className="w-full"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };


  return (
    <Dialog>
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background flex flex-col overflow-x-hidden antialiased selection:bg-accent/20 selection:text-accent-foreground">
      <header
        className="py-4 px-4 md:px-8 bg-card/85 text-card-foreground shadow-lg sticky top-0 z-50 border-b border-border/50 backdrop-blur-lg"
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3.5 group cursor-pointer" 
            onClick={handleStartNewResearch} // Always allow reset
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "circOut" }}
          >
            <motion.div 
              className="p-2.5 bg-gradient-to-br from-primary to-primary/70 rounded-xl shadow-lg text-primary-foreground"
              whileHover={{ scale: 1.1, rotate: -3, boxShadow: "0px 5px 15px hsla(var(--primary) / 0.3)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
            >
              <Beaker className="h-7 w-7" />
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-primary group-hover:text-accent transition-colors duration-200">
                ScholarAI
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Augmented Intelligence for Research</p>
            </div>
          </motion.div>
           <motion.div 
             className="flex items-center space-x-2"
             initial={{ opacity: 0, x: 25 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.2, ease: "circOut" }}
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
              <DropdownMenuContent align="end" className="w-48 border-border/70 bg-popover shadow-xl rounded-lg">
                <DropdownMenuLabel className="font-semibold text-popover-foreground px-3 py-2 text-sm">Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/15 text-sm px-3 py-2.5 group flex items-center">
                  <Sun className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                  <span>Light Mode</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/15 text-sm px-3 py-2.5 group flex items-center">
                  <Moon className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                  <span>Dark Mode</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/15 text-sm px-3 py-2.5 group flex items-center">
                  <Settings className="mr-2.5 h-4 w-4 text-muted-foreground transition-colors" />
                  <span>System Default</span>
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

      <footer className="py-10 px-4 md:px-8 border-t border-border/40 bg-card/70 mt-20">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
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
                href="https://github.com/firebase/genkit/tree/main/examples/nextjs_template" // Example link
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center text-xs text-accent hover:text-accent-foreground hover:underline"
            >
                View Project on GitHub <ExternalLink className="ml-1.5 h-3.5 w-3.5"/>
            </a>
          </motion.div>
        </div>
      </footer>
    </div>
    <DialogContent className="max-w-3xl md:max-w-4xl lg:max-w-5xl p-2 sm:p-3 bg-transparent border-none shadow-none">
        <DialogHeader className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>Full-size view of the generated image.</DialogDescription>
        </DialogHeader>
        {generatedImageUrl && (
          <NextImage 
            src={generatedImageUrl} 
            alt="Full-size conceptual visualization" 
            width={1200} 
            height={1200} 
            className="rounded-xl object-contain w-full h-auto max-h-[85vh] shadow-2xl bg-black/20 backdrop-blur-sm"
            data-ai-hint="research concept"
          />
        )}
    </DialogContent>
    </Dialog>
  );
}

