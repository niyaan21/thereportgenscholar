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
  initial: { opacity: 0, x: "-100vw", rotateY: -30 },
  in: { opacity: 1, x: 0, rotateY: 0 },
  out: { opacity: 0, x: "100vw", rotateY: 30 }
};

const pageTransition = {
  type: "spring",
  stiffness: 50,
  damping: 15,
  duration: 0.8
};

const sectionVariants = {
  initial: { opacity: 0, y: 70, scale: 0.9, rotateX: -20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    rotateX: 0,
    transition: { 
      duration: 0.7, 
      ease: [0.4, 0, 0.2, 1], 
      staggerChildren: 0.15,
      when: "beforeChildren" 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -70, 
    scale: 0.9, 
    rotateX: 20,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } 
  },
};

const heroCardContentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
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
      setResearchSummary(''); 
    } else if (appState === 'queries_formulated') {
      setAppState('initial');
      setResearchQuestion(''); 
      setFormulatedQueries([]); 
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col overflow-x-hidden">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
        className="py-6 px-4 md:px-8 bg-primary text-primary-foreground shadow-xl sticky top-0 z-50"
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300}}
          >
            <motion.div 
              initial={{scale:0, rotate: -180}} 
              animate={{scale:1, rotate: 0}}
              transition={{delay:0.3, type: "spring", stiffness: 260, damping: 20}}
            >
              <BookOpen className="h-10 w-10 transform transition-transform duration-300" />
            </motion.div>
            <motion.h1 
              initial={{x: -50, opacity:0}}
              animate={{x:0, opacity:1}}
              transition={{delay:0.4, type: "spring", stiffness:100}}
              className="text-3xl font-bold tracking-tight"
            >
              ScholarAI
            </motion.h1>
          </motion.div>
           {appState !== 'initial' && (
             <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{delay: 0.5, type: "spring", stiffness: 100}}
             >
                <Button onClick={handleGoBack} variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
             </motion.div>
           )}
        </div>
      </motion.header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-10" style={{ perspective: '1200px' }}>
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
                {/* Removed the "Unlock Deeper Insights" hero card */}
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
                  initial={{ opacity: 0, y:15, rotateX: -10 }}
                  animate={{ opacity: 1, y:0, rotateX: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
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
                    initial={{ opacity:0, y: 30, scale: 0.9 }} 
                    animate={{ opacity: 1, y: 0, scale: 1}} 
                    transition={{delay: 0.4, duration:0.6, type: "spring", stiffness:100}} 
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
                       whileHover={{ scale: 1.05, y: -2 }}
                       whileTap={{ scale: 0.95, y: 1 }}
                       transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                       <RotateCcw className="mr-2 h-5 w-5 group-hover:rotate-[-90deg] transition-transform duration-300" /> Start New Research
                    </motion.button>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <motion.footer
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 80, damping: 15 }}
        className="py-8 px-4 md:px-8 border-t border-border/50 bg-secondary/30"
      >
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.5, duration:0.5}}>
            &copy; {currentYear ?? <span className="inline-block w-8 h-4 bg-muted-foreground/20 animate-pulse rounded-sm"></span>} ScholarAI. Powered by Advanced AI Models.
          </motion.p>
          <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.6, duration:0.5}} className="mt-1">
            Your Intelligent Research Companion for the Digital Age.
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
}

