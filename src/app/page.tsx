// src/app/page.tsx
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueries from '@/components/scholar-ai/FormulatedQueries';
import ResearchSummary from '@/components/scholar-ai/ResearchSummary';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, RotateCcw, FileText, Zap } from 'lucide-react'; // Added FileText, Zap
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card components

type AppState = 'initial' | 'queries_formulated' | 'summary_generated';

export default function ScholarAIPage() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [researchQuestion, setResearchQuestion] = useState<string>('');
  const [formulatedQueries, setFormulatedQueries] = useState<string[]>([]);
  const [researchSummary, setResearchSummary] = useState<string>('');
  const [summarizedPaperTitles, setSummarizedPaperTitles] = useState<string[]>([]);
  const [isProcessingQuery, setIsProcessingQuery] = useState<boolean>(false);
  const [isProcessingSummary, setIsProcessingSummary] = useState<boolean>(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();


  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  const handleQueriesFormulated = (queries: string[], question: string) => {
    startTransition(() => {
      setResearchQuestion(question);
      setFormulatedQueries(queries);
      setAppState('queries_formulated');
    });
    setIsProcessingQuery(false);
  };

  const handleResearchSynthesized = (summary: string, titles: string[]) => {
    startTransition(() => {
      setResearchSummary(summary);
      setSummarizedPaperTitles(titles);
      setAppState('summary_generated');
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
    });
    setIsProcessingQuery(false);
    setIsProcessingSummary(false);
  };

  const handleGoBack = () => {
    startTransition(() => {
      if (appState === 'summary_generated') {
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

  const isLoading = isPending || isProcessingQuery || isProcessingSummary;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 flex flex-col overflow-x-hidden antialiased">
      <header
        className="py-5 px-4 md:px-8 bg-primary text-primary-foreground shadow-xl sticky top-0 z-50 border-b border-primary/30"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div
            className="flex items-center space-x-3"
          >
            <Zap className="h-10 w-10 text-accent animate-pulse" /> {/* Changed Icon, added subtle animation */}
            <div>
              <h1
                className="text-3xl font-extrabold tracking-tight"
              >
                ScholarAI
              </h1>
              <p className="text-xs text-primary-foreground/70 -mt-0.5">Intelligent Research Augmentation</p>
            </div>
          </div>
           {appState !== 'initial' && (
             <div>
                <Button 
                  onClick={handleGoBack} 
                  variant="ghost" 
                  className="text-primary-foreground hover:bg-primary-foreground/10 active:scale-95 transition-transform disabled:opacity-50"
                  disabled={isLoading}
                  aria-label="Go back to previous step"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
             </div>
           )}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-10">
            {appState === 'initial' && (
              <div
                key="initial"
                className="space-y-8"
              >
                <QueryForm 
                  onQueriesFormulated={handleQueriesFormulated} 
                  isBusy={isProcessingQuery} 
                  setIsBusy={setIsProcessingQuery}
                />
              </div>
            )}

            {appState === 'queries_formulated' && formulatedQueries.length > 0 && (
              <div
                key="queries_formulated"
                className="space-y-8"
              >
                 <Card className="overflow-hidden shadow-lg border-accent/20 bg-card">
                    <CardHeader className="bg-accent/5 p-5">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6 text-accent" />
                        <CardTitle className="text-xl font-semibold text-accent-foreground">
                          Your Research Focus
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-3">
                      <p className="text-foreground/90 leading-relaxed">{researchQuestion}</p>
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
              <div
                key="summary_generated"
                className="space-y-8"
              >
                <ResearchSummary
                    summary={researchSummary}
                    originalQuestion={researchQuestion}
                    summarizedPaperTitles={summarizedPaperTitles}
                />
                <div
                    className="flex justify-center pt-4"
                >
                  <Button
                    onClick={handleStartNewResearch}
                    variant="default"
                    size="lg"
                    className="shadow-md hover:shadow-lg transition-shadow duration-300 active:scale-95 disabled:opacity-50"
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

      <footer
        className="py-6 px-4 md:px-8 border-t border-border/30 bg-secondary/20 backdrop-blur-sm mt-12"
      >
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
