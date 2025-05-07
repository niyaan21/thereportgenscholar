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

const sectionVariants = {
  initial: { opacity: 0, y: 100, scale: 0.85, rotateX: -45, originY: 0.5, originZ: -100 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    rotateX: 0,
    originZ: 0,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 20, 
      staggerChildren: 0.2, 
      when: "beforeChildren",
      duration: 0.8
    } 
  },
  exit: { 
    opacity: 0, 
    y: -100, 
    scale: 0.85, 
    rotateX: 30, 
    originY: 0.5,
    originZ: -100,
    transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.6 } 
  },
};


export default function ScholarAIPage() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [researchQuestion, setResearchQuestion] = useState<string>(''); 
  const [formulatedQueries, setFormulatedQueries] = useState<string[]>([]);
  const [researchSummary, setResearchSummary] = useState<string>('');
  const [summarizedPaperTitles, setSummarizedPaperTitles] = useState<string[]>([]); // New state
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // This could be managed by useFormStatus in child components if needed
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

  const handleResearchSynthesized = (summary: string, titles: string[]) => { // Updated signature
    setResearchSummary(summary);
    setSummarizedPaperTitles(titles); // Set titles
    setAppState('summary_generated');
    setIsProcessing(false);
  };

  const handleStartNewResearch = () => {
    setAppState('initial');
    setResearchQuestion('');
    setFormulatedQueries([]);
    setResearchSummary('');
    setSummarizedPaperTitles([]); // Reset titles
    setIsProcessing(false);
  };
  
  const handleGoBack = () => {
    if (appState === 'summary_generated') {
      setAppState('queries_formulated');
      setResearchSummary(''); 
      setSummarizedPaperTitles([]); // Reset titles
    } else if (appState === 'queries_formulated') {
      setAppState('initial');
      setResearchQuestion(''); 
      setFormulatedQueries([]); 
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col overflow-x-hidden">
      <motion.header
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 100, damping: 18 }}
        className="py-6 px-4 md:px-8 bg-primary text-primary-foreground shadow-xl sticky top-0 z-50"
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.08, rotate: -3 }}
            transition={{ type: "spring", stiffness: 350, damping: 10}}
          >
            <motion.div 
              initial={{scale:0, rotate: -270, opacity:0}} 
              animate={{scale:1, rotate: 0, opacity:1}}
              transition={{delay:0.4, type: "spring", stiffness: 200, damping: 15}}
              whileHover={{ rotate: [0, 15, -10, 15, 0], transition: { duration: 0.7, ease: "easeInOut" } }}
            >
              <BookOpen className="h-10 w-10" />
            </motion.div>
            <motion.h1 
              initial={{x: -70, opacity:0}}
              animate={{x:0, opacity:1}}
              transition={{delay:0.5, type: "spring", stiffness:120, damping: 15}}
              className="text-3xl font-bold tracking-tight"
            >
              ScholarAI
            </motion.h1>
          </motion.div>
           {appState !== 'initial' && (
             <motion.div 
              initial={{ opacity: 0, x: 60 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{delay: 0.6, type: "spring", stiffness: 120}}
             >
                <Button onClick={handleGoBack} variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 active:scale-95 transition-transform">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
             </motion.div>
           )}
        </div>
      </motion.header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-12" style={{ perspective: '1500px' }}>
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
                  initial={{ opacity: 0, y:20, rotateX: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y:0, rotateX: 0, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                  className="p-6 bg-primary/5 text-primary rounded-xl shadow-lg border border-primary/10"
                >
                  <p className="text-sm font-semibold text-primary/80">Original Research Question:</p>
                  <p className="text-md mt-1">{researchQuestion}</p>
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
                <ResearchSummary 
                    summary={researchSummary} 
                    originalQuestion={researchQuestion}
                    summarizedPaperTitles={summarizedPaperTitles} // Pass titles
                />
                <motion.div 
                    initial={{ opacity:0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1}} 
                    transition={{delay: 0.5, duration:0.7, type: "spring", stiffness:120, damping: 15}} 
                    className="flex justify-center"
                >
                  <Button 
                    onClick={handleStartNewResearch} 
                    variant="default" 
                    size="lg" 
                    className="shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                    asChild
                  >
                    <motion.button
                       whileHover={{ scale: 1.08, y: -3, boxShadow: "0px 8px 20px rgba(var(--primary-hsl), 0.3)" }}
                       whileTap={{ scale: 0.92, y: 2 }}
                       transition={{ type: "spring", stiffness: 350, damping: 15 }}
                    >
                       <RotateCcw className="mr-2 h-5 w-5 group-hover:rotate-[-180deg] transition-transform duration-500 ease-out" /> Start New Research
                    </motion.button>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <motion.footer
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.4, type: "spring", stiffness: 80, damping: 18 }}
        className="py-8 px-4 md:px-8 border-t border-border/50 bg-secondary/30 backdrop-blur-sm"
      >
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <motion.p initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} transition={{delay:0.6, duration:0.6, ease:"easeOut"}}>
            &copy; {currentYear ?? <span className="inline-block w-8 h-4 bg-muted-foreground/20 animate-pulse rounded-sm"></span>} ScholarAI. Powered by Advanced AI Models.
          </motion.p>
          <motion.p initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} transition={{delay:0.7, duration:0.6, ease:"easeOut"}} className="mt-1">
            Your Intelligent Research Companion for the Digital Age.
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
}
