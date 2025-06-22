
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GeneratingStateDisplayProps {
  title: string;
  description: string;
  steps: { text: string; duration: number }[];
}

const GeneratingStateDisplay: React.FC<GeneratingStateDisplayProps> = ({ title, description, steps }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    setCurrentStepIndex(0);
    const timers = steps.map((step, index) => {
      const delay = steps.slice(0, index).reduce((acc, s) => acc + s.duration, 0);
      return setTimeout(() => {
        setCurrentStepIndex(index + 1);
      }, delay);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [steps]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full"
    >
      <Card className="w-full shadow-2xl border-primary/30 rounded-xl sm:rounded-2xl overflow-hidden bg-card">
        <CardHeader className="p-4 sm:p-5 md:p-6 text-center bg-gradient-to-br from-primary/15 via-transparent to-primary/5">
           <div
            className="p-3 sm:p-4 bg-gradient-to-br from-primary to-primary/80 rounded-xl sm:rounded-2xl shadow-xl border-2 border-primary/50 text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-card mx-auto w-fit"
          >
            <Sparkles className="h-7 w-7 sm:h-8 sm:h-8 md:h-9 md:w-9 animate-pulse" />
          </div>
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary tracking-tight mt-4">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-1.5 max-w-lg mx-auto">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="space-y-3 sm:space-y-4 max-w-md mx-auto">
            <AnimatePresence>
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className={cn(
                    "flex items-center space-x-3 sm:space-x-4 p-3 sm:p-3.5 rounded-lg sm:rounded-xl transition-all duration-300",
                    index < currentStepIndex ? "bg-green-500/10 border border-green-500/20" : "bg-secondary/40 dark:bg-secondary/15 border border-border/60",
                    index === currentStepIndex && "bg-accent/10 border border-accent/30"
                  )}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
                  ) : index === currentStepIndex ? (
                    <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 text-accent animate-spin flex-shrink-0" />
                  ) : (
                    <div className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 border-2 border-muted-foreground/30 rounded-full" />
                  )}
                  <span
                    className={cn(
                      "text-sm sm:text-base font-medium",
                      index < currentStepIndex ? "text-green-700 dark:text-green-300" : "text-muted-foreground",
                      index === currentStepIndex && "text-accent-foreground"
                    )}
                  >
                    {step.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
        <CardFooter className="p-4 sm:p-5 md:p-6 bg-secondary/20 dark:bg-secondary/10 border-t">
            <p className="text-xs text-muted-foreground text-center w-full">Please wait, this process can take some time. Do not navigate away from the page.</p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default GeneratingStateDisplay;
