// src/components/scholar-ai/FormulatedQueriesDisplay.tsx
'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2, Layers, ArrowRight, Telescope, FileSearch2, DatabaseZap, Brain, Sparkles, ChevronRightIcon, Activity, Zap, Lock, MessagesSquare, Tag, ListTree, Search } from 'lucide-react'; // Added Search icon
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface FormulatedQueriesDisplayProps {
  queries: string[];
  alternativePhrasings?: string[] | null;
  keyConcepts?: string[] | null;
  potentialSubTopics?: string[] | null;
  formAction: (payload: FormData) => void; 
  isBusy: boolean; 
}

function SubmitButtonFormulatedQueries({ isBusy }: { isBusy: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isBusy; 
  return (
    <Button
      type="submit"
      disabled={isDisabled}
      className="w-full sm:w-auto shadow-xl hover:shadow-accent/50 bg-gradient-to-br from-accent via-accent/85 to-accent/70 text-accent-foreground text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8 rounded-lg sm:rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 ease-out group"
      aria-label="Synthesize Research and Illuminate Insights"
    >
      {pending ? (
          <Loader2 className="mr-2 h-4 w-4 sm:mr-2.5 sm:h-5 sm:w-5 animate-spin" />
        ) : isBusy ? ( 
          <Lock className="mr-2 h-4 w-4 sm:mr-2.5 sm:h-5 sm:w-5" />
        ) : (
          <Zap className="mr-2 h-4 w-4 sm:mr-2.5 sm:h-5 sm:w-5 group-hover:animate-pulse transition-transform duration-200" /> 
        )}
      {isBusy && !pending ? "Login to Synthesize" : "Synthesize & Illuminate"}
      <ArrowRight className="ml-2 h-4 w-4 sm:ml-2.5 sm:h-5 sm:w-5 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-transform duration-200" />
    </Button>
  );
}

function FormulatedQueriesDisplayInner({ 
    queries, 
    alternativePhrasings,
    keyConcepts,
    potentialSubTopics,
}: { 
    queries: string[], 
    alternativePhrasings?: string[] | null,
    keyConcepts?: string[] | null,
    potentialSubTopics?: string[] | null,
}) {
  const queryIcons = [FileSearch2, DatabaseZap, Telescope, Brain, Sparkles, Layers, Activity];
  
  const renderListItems = (items: string[] | null | undefined, Icon: React.ElementType, itemClassName?: string) => {
    if (!items || items.length === 0) return <p className="text-sm text-muted-foreground italic px-1">None suggested for this query.</p>;
    return (
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={cn(
              "flex items-start space-x-2.5 p-2.5 bg-secondary/40 dark:bg-secondary/20 rounded-md shadow-sm border border-border/60",
              itemClassName
            )}
          >
            <Icon className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
            <span className="flex-grow text-xs text-foreground/85">{item}</span>
          </li>
        ))}
      </ul>
    );
  };
  
  const renderKeyConcepts = (concepts: string[] | null | undefined) => {
    if (!concepts || concepts.length === 0) return <p className="text-sm text-muted-foreground italic px-1">None identified for this query.</p>;
    return (
        <div className="flex flex-wrap gap-2 pt-1">
            {concepts.map((concept, index) => (
                 <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs font-medium bg-accent/15 border-accent/40 text-accent-foreground hover:bg-accent/25 transition-colors"
                >
                    <Tag className="h-3 w-3 mr-1.5"/>
                    {concept}
                </Badge>
            ))}
        </div>
    );
  };


  return (
    <>
      <Accordion type="multiple" defaultValue={["search-queries"]} className="w-full space-y-3">
        <AccordionItem value="search-queries" className="bg-card border-none rounded-lg shadow-md overflow-hidden">
          <AccordionTrigger className="px-4 py-3 text-md font-semibold hover:no-underline text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
            <div className="flex items-center">
              <Search className="h-5 w-5 mr-2.5 text-primary/80" /> AI-Forged Search Vectors
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            {queries.length > 0 ? (
              <ul className="space-y-3 sm:space-y-3">
                {queries.map((query, index) => {
                  const IconComponent = queryIcons[index % queryIcons.length];
                  return (
                    <li
                      key={index}
                      className="flex items-center space-x-3 sm:space-x-3 p-3 sm:p-3.5 bg-secondary/40 dark:bg-secondary/20 rounded-lg sm:rounded-xl shadow-md border border-border/70 transition-all duration-250 group hover:border-accent/50 hover:shadow-lg hover:bg-secondary/60 dark:hover:bg-secondary/30 hover:scale-[1.015] transform"
                    >
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="flex-grow text-sm sm:text-base text-foreground/90">
                        {query}
                      </span>
                      <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/60 ml-auto flex-shrink-0 opacity-70 group-hover:opacity-100 group-hover:text-accent transition-all" />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground py-4 sm:py-6 text-sm sm:text-base">No search vectors were generated for the provided question.</p>
            )}
          </AccordionContent>
        </AccordionItem>

        {(alternativePhrasings && alternativePhrasings.length > 0) && (
           <AccordionItem value="alternative-phrasings" className="bg-card border-none rounded-lg shadow-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 text-md font-semibold hover:no-underline text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="flex items-center">
                  <MessagesSquare className="h-5 w-5 mr-2.5 text-primary/80" /> Alternative Phrasings
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                {renderListItems(alternativePhrasings, ChevronRightIcon)}
              </AccordionContent>
            </AccordionItem>
        )}

        {(keyConcepts && keyConcepts.length > 0) && (
            <AccordionItem value="key-concepts" className="bg-card border-none rounded-lg shadow-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 text-md font-semibold hover:no-underline text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-2.5 text-primary/80" /> Key Concepts
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                {renderKeyConcepts(keyConcepts)}
              </AccordionContent>
            </AccordionItem>
        )}
        
        {(potentialSubTopics && potentialSubTopics.length > 0) && (
            <AccordionItem value="sub-topics" className="bg-card border-none rounded-lg shadow-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 text-md font-semibold hover:no-underline text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="flex items-center">
                  <ListTree className="h-5 w-5 mr-2.5 text-primary/80" /> Potential Sub-Topics
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                {renderListItems(potentialSubTopics, ChevronRightIcon)}
              </AccordionContent>
            </AccordionItem>
        )}
      </Accordion>
    </>
  );
}


const FormulatedQueriesDisplay = React.memo(function FormulatedQueriesDisplay({ 
    queries, 
    alternativePhrasings,
    keyConcepts,
    potentialSubTopics,
    formAction, 
    isBusy 
}: FormulatedQueriesDisplayProps) {
  const isAuthLocked = isBusy && queries.length > 0; // Determine if busy due to auth lock specifically

  return (
    <div
      className="w-full"
    >
      <Card className="w-full shadow-2xl border-accent/30 rounded-xl sm:rounded-2xl overflow-hidden bg-card">
        <CardHeader className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-accent/15 via-transparent to-accent/5 border-b border-accent/25">
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5">
            <div
              className="p-3 sm:p-4 bg-gradient-to-br from-primary to-primary/80 rounded-xl sm:rounded-2xl shadow-xl border-2 border-primary/50 text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-card"
            >
              <Telescope className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-extrabold text-primary tracking-tight">
                Expanded Research Guidance
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-1.5 max-w-lg">
                {isAuthLocked ? "Log in to synthesize insights." : "Review AI-crafted queries and suggestions. Synthesize to distill key insights."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form
          action={isAuthLocked ? undefined : formAction}
          onSubmit={(e) => { if (isAuthLocked) e.preventDefault(); }}
        >
          <CardContent className="p-4 sm:p-5 md:p-6 relative">
             <FormulatedQueriesDisplayInner 
                queries={queries} 
                alternativePhrasings={alternativePhrasings}
                keyConcepts={keyConcepts}
                potentialSubTopics={potentialSubTopics}
            />
          </CardContent>
          {queries.length > 0 && (
            <CardFooter className="flex justify-end p-4 sm:p-5 md:p-6 pt-4 sm:pt-5 border-t border-border/40 bg-secondary/25 dark:bg-secondary/10">
              <input type="hidden" name="queries" value={JSON.stringify(queries)} />
              <SubmitButtonFormulatedQueries isBusy={isAuthLocked} />
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
});
FormulatedQueriesDisplay.displayName = 'FormulatedQueriesDisplay';
export default FormulatedQueriesDisplay;
