// src/components/scholar-ai/FormulatedQueries.tsx
'use client';

import React, { useActionState as useReactActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { handleSynthesizeResearchAction, type SynthesizeResearchActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Layers, ArrowRight, Telescope, Search, Filter, BarChartBig, Sparkles, CheckCircle, Brain, ChevronRight, Atom, DatabaseZap, FileSearch2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FormulatedQueriesProps {
  queries: string[];
  onResearchSynthesized: (summary: string, summarizedTitles: string[]) => void;
  isBusy: boolean;
  setIsBusy: (isBusy: boolean) => void;
}

const initialSynthesizeState: SynthesizeResearchActionState = {
  success: false,
  message: '',
  researchSummary: null,
  summarizedPaperTitles: null,
  errors: null,
};

function SynthesizeButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto shadow-lg hover:shadow-accent/30 bg-gradient-to-r from-accent to-accent/70 text-accent-foreground text-base py-3 px-6 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 ease-out group hover:scale-105 active:scale-95"
      aria-label="Synthesize Research and Illuminate Insights"
    >
      {pending ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Layers className="mr-2 h-5 w-5 group-hover:animate-pulse" />
        )}
      Synthesize & Illuminate
      <ArrowRight className="ml-2 h-4 w-4 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" />
    </Button>
  );
}

export default function FormulatedQueries({ queries, onResearchSynthesized, isBusy, setIsBusy }: FormulatedQueriesProps) {
  const [state, formAction] = useReactActionState(handleSynthesizeResearchAction, initialSynthesizeState);
  const { toast } = useToast();
  const icons = [FileSearch2, DatabaseZap, Telescope, Brain, Sparkles, Filter];

  React.useEffect(() => {
     if (state.message && !isBusy) { // Ensure isBusy from props is also checked
      setIsBusy(false);
      if (state.success && state.researchSummary && state.summarizedPaperTitles) {
        toast({ title: "💡 Profound Insights Uncovered!", description: state.message, variant: 'default', duration: 7000 });
        onResearchSynthesized(state.researchSummary, state.summarizedPaperTitles);
      } else if (!state.success) {
        let description = state.message;
        if (state.errors?.queries) {
            description += ` ${state.errors.queries.join(' ')}`;
        }
        toast({ title: "🛠️ Synthesis Stumbled!", description: description, variant: 'destructive', duration: 9000 });
      }
    }
  }, [state, toast, onResearchSynthesized, setIsBusy, isBusy]);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsBusy(true);
    // formAction is handled by the form's action attribute
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i:number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05, // Stagger animation
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "circOut" }}
      >
        <Card className="w-full shadow-xl card-glow-border border-primary/20 rounded-xl overflow-hidden bg-card">
          <CardHeader className="p-6 bg-gradient-to-br from-accent/10 via-background to-accent/5 border-b border-accent/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/15 rounded-full shadow-md border border-primary/30">
                  <Telescope className="h-7 w-7 text-primary" />
              </div>
              <div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-accent-foreground tracking-tight">
                  AI-Forged Search Vectors
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm mt-1">
                  ScholarAI has crafted these targeted queries. Synthesize to distill profound insights.
                  </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
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
                    "flex items-center space-x-3 p-3.5 bg-secondary/50 dark:bg-secondary/20 rounded-lg shadow-sm border border-border/70 transition-all duration-200",
                    "hover:border-accent/40 hover:shadow-md hover:bg-secondary/70 dark:hover:bg-secondary/30"
                    )}
                >
                  <IconComponent className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="flex-grow text-sm text-foreground/95">
                    {query}
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/70 ml-auto flex-shrink-0 opacity-70 group-hover:opacity-100" />
                </motion.li>
              );
              })}
            </ul>
            {queries.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No search vectors generated yet.</p>
            )}
          </CardContent>
          {queries.length > 0 && (
            <CardFooter className="flex justify-end p-6 pt-4 border-t border-border/30 bg-secondary/20 dark:bg-secondary/10">
              <form
                action={formAction}
                className="w-full sm:w-auto"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="queries" value={JSON.stringify(queries)} />
                <SynthesizeButton />
              </form>
            </CardFooter>
          )}
        </Card>
      </motion.div>
  );
}
