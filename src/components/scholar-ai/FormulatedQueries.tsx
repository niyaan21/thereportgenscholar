// src/components/scholar-ai/FormulatedQueries.tsx
'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { handleSynthesizeResearchAction, type SynthesizeResearchActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Layers, ArrowRight, Telescope, Search, Filter, BarChartBig, Sparkles, CheckCircle, Brain, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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
      className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-r from-accent to-accent/80 hover:from-accent/80 hover:to-accent text-accent-foreground active:scale-95 text-lg py-3 px-6 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Synthesize Research and Illuminate Insights"
    >
        {pending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Layers className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
          )}
        Synthesize & Illuminate
        <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
    </Button>
  );
}

export default function FormulatedQueries({ queries, onResearchSynthesized, isBusy, setIsBusy }: FormulatedQueriesProps) {
  const [state, formAction] = useFormState(handleSynthesizeResearchAction, initialSynthesizeState);
  const { toast } = useToast();
  const icons = [Search, Filter, BarChartBig, Telescope, Brain, Sparkles];

  React.useEffect(() => {
     if (state.message) {
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
  }, [state, toast, onResearchSynthesized, setIsBusy]);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsBusy(true);
    // formAction is handled by the form's action attribute
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="w-full shadow-xl border-2 border-primary/10 rounded-xl overflow-hidden bg-card transform hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="p-6 sm:p-8 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-t-lg">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="p-3 bg-accent/10 rounded-full">
                <Telescope className="h-8 w-8 sm:h-10 sm:w-10 text-accent drop-shadow-sm" />
            </div>
            <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                AI-Crafted Search Vectors
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm sm:text-base mt-1 leading-relaxed">
                ScholarAI has forged these vectors to navigate knowledge. Synthesize to distill insights.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <ul
            className="space-y-3"
          >
            {queries.map((query, index) => {
               const IconComponent = icons[index % icons.length];
               return (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center space-x-3 p-3.5 bg-secondary/40 dark:bg-secondary/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-border hover:border-accent/40 group cursor-default"
              >
                <IconComponent className="h-5 w-5 text-accent flex-shrink-0" />
                <span
                  className="flex-grow text-sm text-foreground/90 leading-snug"
                >
                  {query}
                </span>
                <ChevronRight className="h-5 w-5 text-muted-foreground/70 ml-auto flex-shrink-0 group-hover:text-accent transition-colors" />
              </motion.li>
            );
            })}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-end p-6 sm:p-8 pt-4 border-t border-border/20 bg-secondary/10 dark:bg-secondary/5 rounded-b-lg">
          <form
            action={formAction}
            className="w-full sm:w-auto"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="queries" value={JSON.stringify(queries)} />
            <SynthesizeButton />
          </form>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
