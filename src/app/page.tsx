// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QueryForm from '@/components/scholar-ai/QueryForm';
import FormulatedQueries from '@/components/scholar-ai/FormulatedQueries';
import ResearchSummary from '@/components/scholar-ai/ResearchSummary';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, ArrowLeft, RotateCcw } from 'lucide-react';
import Image from 'next/image';

type AppState = 'initial' | 'queries_formulated' | 'summary_generated';

const pageVariants = {
  initial: { opacity: 0, x: "-100vw" },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "100vw" }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.8
};

const sectionVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -50, scale: 0.9, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

export default function ScholarAIPage() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [researchQuestion, setResearchQuestion] = useState<string>(''); 
  const [formulatedQueries, setFormulatedQueries] = useState<string[]>([]);
  const [researchSummary, setResearchSummary] = useState<string>('');
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
  
  const handleGoBack = () => {
    if (appState === 'summary_generated') {
      setAppState('queries_formulated');
      setResearchSummary(''); // Clear summary when going back
    } else if (appState === 'queries_formulated') {
      setAppState('initial');
      setResearchQuestion(''); // Clear original question
      setFormulatedQueries([]); // Clear queries when going back
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col overflow-x-hidden">
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 120, damping: 15 }}
        className="py-6 px-4 md:px-8 bg-primary text-primary-foreground shadow-xl sticky top-0 z-50"
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300}}
          >
            <BookOpen className="h-10 w-10 transform transition-transform duration-300 group-hover:rotate-6" />
            <h1 className="text-3xl font-bold tracking-tight">ScholarAI</h1>
          </motion.div>
           {appState !== 'initial' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{delay: 0.3}}>
                <Button onClick={handleGoBack} variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
             </motion.div>
           )}
        </div>
      </motion.header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-10">
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
                  className="text-center mb-10 p-8 bg-card rounded-xl shadow-2xl border border-border/50"
                  initial={{ opacity: 0, y:20,  scale: 0.98 }}
                  animate={{ opacity: 1, y:0, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.7, ease: "circOut" }}
                  whileHover={{ scale: 1.01, boxShadow: "0px 10px 30px rgba(0, 48, 73, 0.1)"}}
                >
                   <Image 
                      src="https://picsum.photos/seed/scholarai-main/700/350" 
                      alt="AI Research Concept - network of ideas" 
                      width={700} 
                      height={350}
                      className="rounded-lg shadow-xl mb-8 mx-auto border-4 border-secondary"
                      data-ai-hint="AI research"
                      priority
                   />
                  <h2 className="text-4xl font-semibold text-primary mb-4">Unlock Deeper Insights with AI</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
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
                 <motion.div 
                  initial={{ opacity: 0, y:15 }}
                  animate={{ opacity: 1, y:0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="p-4 bg-primary/5 text-primary rounded-md shadow"
                >
                  <p className="text-sm font-medium">Original Question:</p>
                  <p className="text-md">{researchQuestion}</p>
                </motion.div>
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
                <ResearchSummary summary={researchSummary} originalQuestion={researchQuestion}/>
                <motion.div 
                    initial={{ opacity:0, y: 20 }} 
                    animate={{ opacity: 1, y: 0}} 
                    transition={{delay: 0.4, duration:0.5}} 
                    className="flex justify-center"
                >
                  <Button onClick={handleStartNewResearch} variant="default" size="lg" className="shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                     <RotateCcw className="mr-2 h-5 w-5 group-hover:rotate-[-90deg] transition-transform duration-300" /> Start New Research
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <motion.footer
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100, damping: 15 }}
        className="py-8 px-4 md:px-8 border-t border-border/50 bg-secondary/30"
      >
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear ?? <span className="inline-block w-8 h-4 bg-muted-foreground/20 animate-pulse rounded-sm"></span>} ScholarAI. Powered by Advanced AI Models.</p>
          <p className="mt-1">Your Intelligent Research Companion for the Digital Age.</p>
        </div>
      </motion.footer>
    </div>
  );
}
