// src/app/page.tsx
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueries from '@/components/scholar-ai/FormulatedQueries';
import ResearchSummary from '@/components/scholar-ai/ResearchSummary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, FileText, Zap, Settings, Moon, Sun, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');


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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col overflow-x-hidden antialiased transition-colors duration-300">
      <header
        className="py-4 px-4 md:px-8 bg-primary text-primary-foreground shadow-lg sticky top-0 z-50 border-b border-primary/30 backdrop-blur-sm bg-opacity-90"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div
            className="flex items-center space-x-3 group"
          >
            <Zap className="h-10 w-10 text-accent transition-all duration-300 group-hover:rotate-[15deg] group-hover:scale-110" />
            <div>
              <h1
                className="text-3xl font-extrabold tracking-tight transition-all duration-300 group-hover:text-accent/90"
              >
                ScholarAI
              </h1>
              <p className="text-xs text-primary-foreground/70 -mt-0.5">Intelligent Research Augmentation</p>
            </div>
          </div>
           <div className="flex items-center space-x-2">
            {appState !== 'initial' && (
                <Button 
                  onClick={handleGoBack} 
                  variant="ghost" 
                  className="text-primary-foreground hover:bg-primary-foreground/10 active:scale-95 transition-all duration-200 disabled:opacity-50"
                  disabled={isLoading}
                  aria-label="Go back to previous step"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 active:scale-95 transition-all duration-200" aria-label="Theme settings">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 border-border bg-background shadow-xl rounded-lg">
                <DropdownMenuLabel className="font-semibold text-foreground">Theme</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20">
                  <Sun className="mr-2 h-4 w-4 text-foreground/80" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20">
                  <Moon className="mr-2 h-4 w-4 text-foreground/80" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20">
                  <Settings className="mr-2 h-4 w-4 text-foreground/80" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           </div>
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
                 <Card className="overflow-hidden shadow-xl border-accent/20 bg-card transition-all duration-500 hover:scale-[1.01] hover:shadow-accent/30 rounded-xl">
                    <CardHeader className="bg-accent/10 p-5 border-b border-accent/20 relative">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-5 mix-blend-soft-light"></div>
                      <div className="flex items-center space-x-3 relative z-10">
                        <FileText className="h-6 w-6 text-accent" />
                        <CardTitle className="text-xl font-semibold text-accent-foreground">
                          Your Research Focus
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
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
                    className="shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-primary-foreground relative overflow-hidden group"
                    disabled={isLoading}
                    aria-label="Start a new research session"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-lg"></span>
                    <span className="relative z-10 flex items-center justify-center">
                        <RotateCcw className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-[-45deg]" /> Start New Research
                    </span>
                  </Button>
                </div>
              </div>
            )}
        </div>
      </main>

      <footer
        className="py-6 px-4 md:px-8 border-t border-border/30 bg-secondary/30 backdrop-blur-sm mt-12 transition-colors duration-300"
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
