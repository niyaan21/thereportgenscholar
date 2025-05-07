// src/components/scholar-ai/FormulatedQueriesDisplay.tsx
'use client';

import React from 'react'; // Removed useActionState, will be in page.tsx
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { handleSynthesizeResearchAction, type SynthesizeResearchActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Layers, ArrowRight, Telescope, FileSearch2, DatabaseZap, Brain, Sparkles, ChevronRightIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FormulatedQueriesDisplayProps {
  queries: string[];
  onResearchSynthesized: (summary: string, summarizedTitles: string[]) => void;
  isBusy: boolean;
  setIsBusy: (isBusy: boolean) => void;
  // Removed initialSynthesizeState, action, and pendingSynthesis as they are managed in page.tsx
}

export const initialSynthesizeResearchActionState: SynthesizeResearchActionState = {
    success: false,
    message: '',
    researchSummary: null,
    summarizedPaperTitles: null,
    errors: null,
};


function SubmitButtonFormulatedQueries() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto shadow-lg hover:shadow-accent/40 bg-gradient-to-r from-accent to-accent/70 text-accent-foreground text-base py-3.5 px-8 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 ease-out group hover:scale-105 active:scale-95 transform hover:-translate-y-0.5"
      aria-label="Synthesize Research and Illuminate Insights"
    >
      {pending ? (
          <Loader2 className="mr-2.5 h-5 w-5 animate-spin" />
        ) : (
          <Layers className="mr-2.5 h-5 w-5 group-hover:animate-pulse" />
        )}
      Synthesize & Illuminate
      <ArrowRight className="ml-2.5 h-5 w-5 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-transform duration-200" />
    </Button>
  );
}

export default function FormulatedQueriesDisplay({ queries, onResearchSynthesized, isBusy, setIsBusy }: FormulatedQueriesDisplayProps) {
  const { toast } = useToast();
  const icons = [FileSearch2, DatabaseZap, Telescope, Brain, Sparkles, Layers];

  // Local form action to manage busy state and call the server action (passed via form's action prop from page.tsx)
  const localFormAction = async (formData: FormData) => {
    setIsBusy(true);
    // The actual server action (handleSynthesizeResearchAction) call and state (state from useActionState)
    // are managed by the form's action prop in page.tsx.
    // page.tsx's useEffect will handle the response.

    // Simulating the call for now, this needs to align with how page.tsx wires it up
    const actionState = await handleSynthesizeResearchAction(initialSynthesizeResearchActionState, formData);
    
    setIsBusy(false); // Reset busy state after action completes
    if (actionState.success && actionState.researchSummary && actionState.summarizedPaperTitles) {
      toast({ title: "💡 Profound Insights Uncovered!", description: actionState.message, variant: 'default', duration: 7000 });
      onResearchSynthesized(actionState.researchSummary, actionState.summarizedPaperTitles);
    } else if (!actionState.success) {
      let description = actionState.message;
      if (actionState.errors?.queries) { // Assuming error structure
          description += ` ${actionState.errors.queries.join(' ')}`;
      }
      toast({ title: "🛠️ Synthesis Stumbled!", description: description, variant: 'destructive', duration: 9000 });
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -25, scale: 0.95 },
    visible: (i:number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.07, 
        duration: 0.35,
        ease: "easeOut"
      }
    })
  };

  return (
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "circOut", delay: 0.15 }}
      >
        <Card className="w-full shadow-2xl card-glow-border border-primary/25 rounded-2xl overflow-hidden bg-card transform hover:shadow-primary/20 transition-all duration-400">
          <CardHeader className="p-7 md:p-8 bg-gradient-to-br from-accent/15 via-transparent to-accent/5 border-b border-accent/25">
            <div className="flex items-center space-x-4 md:space-x-5">
              <div className="p-4 bg-gradient-to-br from-primary to-primary/70 rounded-2xl shadow-xl border-2 border-primary/50 text-primary-foreground">
                  <Telescope className="h-8 w-8 md:h-9 md:w-9" />
              </div>
              <div>
                  <CardTitle className="text-xl md:text-2xl font-extrabold text-accent-foreground tracking-tight">
                  AI-Forged Search Vectors
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base mt-1.5 max-w-lg">
                  ScholarAI has crafted these targeted queries. Synthesize to distill profound insights.
                  </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-7 md:p-8">
            {queries.length > 0 ? (
                <ul className="space-y-3.5">
                {queries.map((query, index) => {
                    const IconComponent = icons[index % icons.length];
                    return (
                    <motion.li
                    key={index}
                    custom={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                        "flex items-center space-x-3.5 p-4 bg-secondary/40 dark:bg-secondary/15 rounded-xl shadow-md border border-border/70 transition-all duration-250 group",
                        "hover:border-accent/50 hover:shadow-lg hover:bg-secondary/60 dark:hover:bg-secondary/25 transform hover:scale-[1.02] hover:z-10"
                        )}
                    >
                    <IconComponent className="h-5 w-5 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="flex-grow text-base text-foreground/90">
                        {query}
                    </span>
                    <ChevronRightIcon className="h-5 w-5 text-muted-foreground/60 ml-auto flex-shrink-0 opacity-70 group-hover:opacity-100 group-hover:text-accent transition-all" />
                    </motion.li>
                );
                })}
                </ul>
            ) : (
                 <p className="text-center text-muted-foreground py-6 text-base">No search vectors were generated for the provided question.</p>
            )}
          </CardContent>
          {queries.length > 0 && (
            <CardFooter className="flex justify-end p-7 md:p-8 pt-5 border-t border-border/40 bg-secondary/25 dark:bg-secondary/10">
              <form
                action={localFormAction} // Use localFormAction or pass formAction from page.tsx
                className="w-full sm:w-auto"
              >
                <input type="hidden" name="queries" value={JSON.stringify(queries)} />
                <SubmitButtonFormulatedQueries />
              </form>
            </CardFooter>
          )}
        </Card>
      </motion.div>
  );
}

