// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueries from '@/components/scholar-ai/FormulatedQueries';
import ResearchSummary from '@/components/scholar-ai/ResearchSummary';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';

type AppState = 'initial' | 'queries_formulated' | 'summary_generated';

const sectionVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] } },
};

const headerFooterVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};


export default function ScholarAIPage() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [researchQuestion, setResearchQuestion] = useState<string>(''); 
  const [formulatedQueries, setFormulatedQueries] = useState<string[]>([]);
  const [researchSummary, setResearchSummary] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);


  const handleQueriesFormulated = (queries: string[]) => {
    setFormulatedQueries(queries);
    setAppState('queries_formulated');
    setIsProcessing(false);
  };

  const handleResearchSynthesized = (summary: string) => {
    setResearchSummary(summary);
    setAppState('summary_generated');
    setIsProcessing(false);
  };

  const handleStartNewResearch = () => {
    setAppState('initial');
    setResearchQuestion('');
    setFormulatedQueries([]);
    setResearchSummary('');
    setIsProcessing(false);
  };
  
  const handleFormSubmit = () => {
    setIsProcessing(true);
  };


  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 100 }}
        className="py-6 px-4 md:px-8 bg-primary text-primary-foreground shadow-md sticky top-0 z-50"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-10 w-10" />
            <h1 className="text-3xl font-bold tracking-tight">ScholarAI</h1>
          </div>
        </div>
      </motion.header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <AnimatePresence mode="wait">
            {appState === 'initial' && (
              <motion.div
                key="initial"
                variants={sectionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <motion.div 
                  className="text-center mb-8 p-6 bg-card rounded-lg shadow-lg border"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                   <Image 
                      src="https://picsum.photos/seed/scholarai/600/300" 
                      alt="AI Research Concept" 
                      width={600} 
                      height={300}
                      className="rounded-md shadow-lg mb-6 mx-auto"
                      data-ai-hint="AI research"
                   />
                  <h2 className="text-3xl font-semibold text-primary mb-3">Unlock Deeper Insights with AI</h2>
                  <p className="text-lg text-muted-foreground">
                    ScholarAI helps you navigate complex research topics by formulating targeted search queries and synthesizing information into clear, actionable summaries.
                  </p>
                </motion.div>
                <QueryForm onQueriesFormulated={handleQueriesFormulated} isBusy={isProcessing} />
              </motion.div>
            )}

            {appState === 'queries_formulated' && formulatedQueries.length > 0 && (
              <motion.div
                key="queries_formulated"
                variants={sectionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <FormulatedQueries
                  queries={formulatedQueries}
                  onResearchSynthesized={handleResearchSynthesized}
                  isBusy={isProcessing}
                />
              </motion.div>
            )}

            {appState === 'summary_generated' && researchSummary && (
              <motion.div
                key="summary_generated"
                variants={sectionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <ResearchSummary summary={researchSummary} />
                <motion.div initial={{ opacity:0 }} animate={{ opacity: 1}} transition={{delay: 0.3}}>
                  <Button onClick={handleStartNewResearch} variant="outline" className="w-full sm:w-auto">
                    Start New Research
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {(appState === 'queries_formulated' || appState === 'summary_generated') && appState !== 'initial' && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity: 1}} transition={{delay: 0.5}}>
               <Button onClick={handleStartNewResearch} variant="ghost" className="w-full sm:w-auto text-primary hover:bg-primary/10 mt-4">
                  Reset and Start Over
               </Button>
             </motion.div>
          )}

        </div>
      </main>

      <motion.footer
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 100 }}
        className="py-6 px-4 md:px-8 border-t bg-secondary/50"
      >
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ScholarAI. Powered by Advanced AI.</p>
          <p>Your Intelligent Research Companion.</p>
        </div>
      </motion.footer>
    </div>
  );
}
