// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueries from '@/components/scholar-ai/FormulatedQueries';
import ResearchSummary from '@/components/scholar-ai/ResearchSummary';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, RotateCcw } from 'lucide-react';

type AppState = 'initial' | 'queries_formulated' | 'summary_generated';

export default function ScholarAIPage() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [researchQuestion, setResearchQuestion] = useState<string>(''); 
  const [formulatedQueries, setFormulatedQueries] = useState<string[]>([]);
  const [researchSummary, setResearchSummary] = useState<string>('');
  const [summarizedPaperTitles, setSummarizedPaperTitles] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  const handleQueriesFormulated = (queries: string[], question: string) => {
    setResearchQuestion(question); 
    setFormulatedQueries(queries);
    setAppState('queries_formulated');
    setIsProcessing(false);
  };

  const handleResearchSynthesized = (summary: string, titles: string[]) => {
    setResearchSummary(summary);
    setSummarizedPaperTitles(titles);
    setAppState('summary_generated');
    setIsProcessing(false);
  };

  const handleStartNewResearch = () => {
    setAppState('initial');
    setResearchQuestion('');
    setFormulatedQueries([]);
    setResearchSummary('');
    setSummarizedPaperTitles([]);
    setIsProcessing(false);
  };
  
  const handleGoBack = () => {
    if (appState === 'summary_generated') {
      setAppState('queries_formulated');
      setResearchSummary(''); 
      setSummarizedPaperTitles([]);
    } else if (appState === 'queries_formulated') {
      setAppState('initial');
      setResearchQuestion(''); 
      setFormulatedQueries([]); 
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col overflow-x-hidden">
      <header
        className="py-6 px-4 md:px-8 bg-primary text-primary-foreground shadow-lg sticky top-0 z-50"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div 
            className="flex items-center space-x-3"
          >
            <div 
            >
              <BookOpen className="h-10 w-10" />
            </div>
            <h1 
              className="text-3xl font-bold tracking-tight"
            >
              ScholarAI
            </h1>
          </div>
           {appState !== 'initial' && (
             <div>
                <Button onClick={handleGoBack} variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 active:scale-95 transition-transform">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
             </div>
           )}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-12">
            {appState === 'initial' && (
              <div
                key="initial"
                className="space-y-8"
              >
                <QueryForm onQueriesFormulated={handleQueriesFormulated} isBusy={isProcessing} />
              </div>
            )}

            {appState === 'queries_formulated' && formulatedQueries.length > 0 && (
              <div
                key="queries_formulated"
                className="space-y-8"
              >
                 <div 
                  className="p-6 bg-primary/5 text-primary rounded-xl shadow-md border border-primary/10"
                >
                  <p className="text-sm font-semibold text-primary/80">Original Research Question:</p>
                  <p className="text-md mt-1">{researchQuestion}</p>
                </div>
                <FormulatedQueries
                  queries={formulatedQueries}
                  onResearchSynthesized={handleResearchSynthesized}
                  isBusy={isProcessing}
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
                    className="flex justify-center"
                >
                  <Button 
                    onClick={handleStartNewResearch} 
                    variant="default" 
                    size="lg" 
                    className="shadow-md hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <RotateCcw className="mr-2 h-5 w-5 group-hover:rotate-[-180deg] transition-transform duration-500 ease-out" /> Start New Research
                  </Button>
                </div>
              </div>
            )}
        </div>
      </main>

      <footer
        className="py-8 px-4 md:px-8 border-t border-border/50 bg-secondary/30 backdrop-blur-sm"
      >
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear ?? <span className="inline-block w-8 h-4 bg-muted-foreground/20 rounded-sm"></span>} ScholarAI. Powered by Advanced AI Models.
          </p>
          <p className="mt-1">
            Your Intelligent Research Companion for the Digital Age.
          </p>
        </div>
      </footer>
    </div>
  );
}
