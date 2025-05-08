// src/components/scholar-ai/FormulatedQueriesDisplay.tsx
'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import type { SynthesizeResearchActionState } from '@/app/actions'; 
import { Loader2, Layers, ArrowRight, Telescope, FileSearch2, DatabaseZap, Brain, Sparkles, ChevronRightIcon, Activity, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface FormulatedQueriesDisplayProps {
  queries: string[];
  formAction: (payload: FormData) => void; 
  isBusy: boolean; 
}

function SubmitButtonFormulatedQueries() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto shadow-xl hover:shadow-accent/50 bg-gradient-to-br from-accent via-accent/85 to-accent/70 text-accent-foreground text-base py-3.5 px-8 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 ease-out group"
      aria-label="Synthesize Research and Illuminate Insights"
    >
      {pending ? (
          <Loader2 className="mr-2.5 h-5 w-5 animate-spin" />
        ) : (
          <Zap className="mr-2.5 h-5 w-5 group-hover:animate-pulse transition-transform duration-200" /> 
        )}
      Synthesize & Illuminate
      <ArrowRight className="ml-2.5 h-5 w-5 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-transform duration-200" />
    </Button>
  );
}

export default function FormulatedQueriesDisplay({ queries, formAction, isBusy }: FormulatedQueriesDisplayProps) {
  const icons = [FileSearch2, DatabaseZap, Telescope, Brain, Sparkles, Layers, Activity];

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Parent handles isBusy
  };

  return (
      <div 
        className="w-full"
      >
        <Card className="w-full shadow-2xl border-accent/30 rounded-2xl overflow-hidden bg-card">
          <CardHeader className="p-7 md:p-8 bg-gradient-to-br from-accent/15 via-transparent to-accent/5 border-b border-accent/25">
            <div className="flex items-center space-x-4 md:space-x-5">
              <div 
                className="p-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-xl border-2 border-primary/50 text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-card"
              >
                  <Telescope className="h-8 w-8 md:h-9 md:w-9" />
              </div>
              <div>
                  <CardTitle className="text-xl md:text-2xl font-extrabold text-primary tracking-tight">
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
                    <li
                      key={index}
                      className={cn(
                        "flex items-center space-x-3.5 p-4 bg-secondary/40 dark:bg-secondary/20 rounded-xl shadow-md border border-border/70 transition-all duration-250 group",
                        "hover:border-accent/50 hover:shadow-lg hover:bg-secondary/60 dark:hover:bg-secondary/30"
                        )}
                    >
                      <IconComponent className="h-5 w-5 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="flex-grow text-base text-foreground/90">
                          {query}
                      </span>
                      <ChevronRightIcon className="h-5 w-5 text-muted-foreground/60 ml-auto flex-shrink-0 opacity-70 group-hover:opacity-100 group-hover:text-accent transition-all" />
                    </li>
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
                action={formAction} 
                onSubmit={handleFormSubmit} 
                className="w-full sm:w-auto"
              >
                <input type="hidden" name="queries" value={JSON.stringify(queries)} />
                <SubmitButtonFormulatedQueries />
              </form>
            </CardFooter>
          )}
        </Card>
      </div>
  );
}
