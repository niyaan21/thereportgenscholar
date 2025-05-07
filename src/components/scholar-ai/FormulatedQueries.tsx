// src/components/scholar-ai/FormulatedQueries.tsx
'use client';

import React, { useActionState as useReactActionState } from 'react'; // Updated import
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
      className="w-full sm:w-auto shadow-md hover:shadow-lg bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-base py-2.5 px-5 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Synthesize Research and Illuminate Insights"
    >
      {pending ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Layers className="mr-2 h-4 w-4" />
        )}
      Synthesize & Illuminate
      <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5" />
    </Button>
  );
}

export default function FormulatedQueries({ queries, onResearchSynthesized, isBusy, setIsBusy }: FormulatedQueriesProps) {
  const [state, formAction] = useReactActionState(handleSynthesizeResearchAction, initialSynthesizeState); // Updated to useReactActionState
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
      <Card className="w-full shadow-lg border-primary/10 rounded-lg overflow-hidden bg-card">
        <CardHeader className="p-6 bg-accent/5 border-b border-accent/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full shadow-sm border border-primary/20">
                <Telescope className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle className="text-xl font-semibold text-accent-foreground tracking-tight">
                AI-Crafted Search Vectors
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm mt-0.5">
                ScholarAI forged these vectors. Synthesize to distill insights.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-2.5">
            {queries.map((query, index) => {
               const IconComponent = icons[index % icons.length];
               return (
              <li
                key={index}
                className="flex items-center space-x-2.5 p-3 bg-secondary/40 dark:bg-secondary/20 rounded-md shadow-sm border border-border hover:border-accent/30"
              >
                <IconComponent className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="flex-grow text-xs text-foreground/90">
                  {query}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground/60 ml-auto flex-shrink-0" />
              </li>
            );
            })}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-end p-6 pt-3 border-t border-border/20 bg-secondary/10 dark:bg-secondary/5">
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
