// src/components/scholar-ai/FormulatedQueries.tsx
'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { handleSynthesizeResearchAction, type SynthesizeResearchActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Layers, ArrowRight, Telescope, Search, Filter, BarChartBig, Sparkles, CheckCircle, Brain, ChevronRight, Atom } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-r from-accent to-accent/80 hover:from-accent/80 hover:to-accent text-accent-foreground active:scale-95 text-lg py-3 px-6 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative overflow-hidden"
      aria-label="Synthesize Research and Illuminate Insights"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-lg"></span>
      <span className="relative z-10 flex items-center justify-center">
        {pending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Layers className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[5deg]" />
          )}
        Synthesize & Illuminate
        <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
      </span>
       <Atom className="absolute top-1 left-1 h-4 w-4 text-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
    </Button>
  );
}

export default function FormulatedQueries({ queries, onResearchSynthesized, isBusy, setIsBusy }: FormulatedQueriesProps) {
  const [state, formAction] = useActionState(handleSynthesizeResearchAction, initialSynthesizeState);
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
      <Card className="w-full shadow-2xl border-2 border-primary/10 rounded-xl overflow-hidden bg-card transition-all duration-500 hover:scale-[1.01] hover:shadow-accent/20">
        <CardHeader className="p-6 sm:p-8 bg-gradient-to-br from-accent/5 via-transparent to-transparent rounded-t-lg relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/low-contrast-linen.png')] opacity-10 mix-blend-multiply"></div>
          <div className="flex items-start sm:items-center space-x-4 relative z-10">
            <div className="p-3 bg-primary/10 rounded-full shadow-inner border border-primary/20">
                <Telescope className="h-8 w-8 sm:h-10 sm:w-10 text-primary drop-shadow-lg" />
            </div>
            <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-accent-foreground tracking-tight drop-shadow-sm">
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
              <li
                key={index}
                className="flex items-center space-x-3 p-3.5 bg-secondary/40 dark:bg-secondary/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-border hover:border-accent/40 group cursor-default hover:bg-accent/5 dark:hover:bg-accent/10 transform hover:translate-x-1"
              >
                <IconComponent className="h-5 w-5 text-accent flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span
                  className="flex-grow text-sm text-foreground/90 leading-snug"
                >
                  {query}
                </span>
                <ChevronRight className="h-5 w-5 text-muted-foreground/70 ml-auto flex-shrink-0 group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5" />
              </li>
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
  );
}
