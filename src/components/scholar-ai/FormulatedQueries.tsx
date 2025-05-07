// src/components/scholar-ai/FormulatedQueries.tsx
'use client';

import React from 'react';
import { useActionState } from 'react'; 
import { useFormStatus } from 'react-dom'; 
import { Button } from '@/components/ui/button';
import { handleSynthesizeResearchAction, type SynthesizeResearchActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Layers, ArrowRight, Telescope, Search, Filter, BarChartBig, Sparkles, CheckCircle, Brain } from 'lucide-react'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FormulatedQueriesProps {
  queries: string[];
  onResearchSynthesized: (summary: string, summarizedTitles: string[]) => void;
  isBusy: boolean; 
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
      className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-300 group bg-accent hover:bg-accent/90 text-accent-foreground active:scale-95 text-lg py-3 px-6 rounded-lg" 
      aria-label="Synthesize Research"
    >
        {pending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary-foreground" /> 
          ) : (
            <Layers className="mr-2 h-5 w-5 text-primary-foreground group-hover:scale-110 transition-transform duration-300" /> 
          )}
        Synthesize & Illuminate
        <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" /> 
    </Button>
  );
}

export default function FormulatedQueries({ queries, onResearchSynthesized, isBusy: parentIsBusy }: FormulatedQueriesProps) {
  const [state, formAction, formIsPending] = useActionState(handleSynthesizeResearchAction, initialSynthesizeState);
  const { toast } = useToast();
  const icons = [Search, Filter, BarChartBig, Telescope, Brain, Sparkles]; 
  
  const isEffectivelyBusy = parentIsBusy || formIsPending;


  React.useEffect(() => {
     if (state.message) {
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
  }, [state, toast, onResearchSynthesized]);

  return (
    <div>
      <Card className="w-full shadow-lg border border-primary/10 rounded-xl overflow-hidden bg-card"> 
        <CardHeader className="bg-primary/5 p-6"> 
          <div className="flex items-center space-x-3 mb-2"> 
            <Telescope className="h-10 w-10 text-accent" /> 
            <CardTitle className="text-3xl font-semibold text-primary tracking-tight"> 
              AI-Forged Vectors
            </CardTitle>
          </div>
           <div>
            <CardDescription className="text-muted-foreground text-base leading-relaxed"> 
              ScholarAI has meticulously crafted these search vectors to navigate the vast expanse of knowledge. Click "Synthesize & Illuminate" to distill deep insights.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6"> 
          <ul 
            className="space-y-4" 
          >
            {queries.map((query, index) => {
               const IconComponent = icons[index % icons.length]; 
               return (
              <li 
                key={index}
                className="flex items-start space-x-3 p-4 bg-secondary/50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default border border-transparent hover:border-accent/30 group" 
              >
                <IconComponent className="h-6 w-6 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" /> 
                <Badge
                  variant="outline"
                  className="text-base py-2 px-4 whitespace-normal break-words border-primary/30 text-foreground bg-background/40 leading-relaxed rounded-lg shadow-sm group-hover:bg-accent/5 group-hover:border-accent/20" 
                >
                  {query}
                </Badge>
                <CheckCircle className="h-6 w-6 text-green-500/60 ml-auto flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" /> 
              </li>
            );
            })}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-end p-6 pt-4"> 
          <form
            action={formAction}
            className="w-full sm:w-auto"
          >
            <input type="hidden" name="queries" value={JSON.stringify(queries)} />
            <SynthesizeButton /> 
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
