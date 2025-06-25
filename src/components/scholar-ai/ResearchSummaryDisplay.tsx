
// src/components/scholar-ai/ResearchSummaryDisplay.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookOpenCheck, FileText, Lightbulb, Quote, Brain, CheckCircle, BarChart3, Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea

export interface ResearchSummaryDisplayProps {
  summary: string;
  onSummaryChange: (newSummary: string) => void; // Callback to update summary in parent
  originalQuestion: string;
  summarizedPaperTitles: string[];
}

const ResearchSummaryDisplay = React.memo(function ResearchSummaryDisplay({ 
  summary, 
  onSummaryChange,
  originalQuestion, 
  summarizedPaperTitles,
}: ResearchSummaryDisplayProps) {

  return (
      <div>
        <Card className="w-full shadow-2xl border-primary/25 rounded-xl sm:rounded-2xl overflow-hidden bg-card">
          <CardHeader className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-primary/15 via-transparent to-primary/5 border-b border-primary/25">
            <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5">
              <div 
                className="p-3 sm:p-4 bg-gradient-to-br from-accent to-accent/70 rounded-xl sm:rounded-2xl shadow-xl border-2 border-accent/50 text-accent-foreground"
              >
                  <BookOpenCheck className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9" />
              </div>
              <div>
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Illuminated Research Overview</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-1.5 max-w-lg">
                      Key insights distilled and synthesized by ScholarAI. You can edit the summary below.
                  </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 md:p-6 space-y-6 md:space-y-8">
            {originalQuestion && (
              <div className="p-4 sm:p-5 md:p-6 bg-secondary/40 dark:bg-secondary/15 rounded-lg sm:rounded-xl shadow-inner border border-border/70">
                <h3 className="text-md sm:text-lg font-semibold mb-2 sm:mb-2.5 flex items-center text-primary/90">
                  <Quote className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-accent transform -scale-x-100" />
                  Your Guiding Question
                </h3>
                <p className="text-foreground/80 italic text-sm sm:text-base leading-relaxed">
                  "{originalQuestion}"
                </p>
              </div>
            )}
            
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold flex items-center text-primary">
                <Edit className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-accent" />
                Core Synthesized Insights (Editable)
              </h3>
              <ScrollArea className="h-60 sm:h-64 border border-border/70 rounded-lg sm:rounded-xl bg-background/70 shadow-inner">
                  <Textarea
                    value={summary}
                    onChange={(e) => onSummaryChange(e.target.value)}
                    placeholder="AI-generated summary will appear here. You can edit it before generating the full report."
                    className="w-full h-full min-h-[230px] sm:min-h-[240px] p-3 sm:p-4 text-foreground/85 text-sm sm:text-base leading-relaxed focus:border-accent focus:ring-accent border-none rounded-lg sm:rounded-xl resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-accent"
                    aria-label="Editable research summary"
                  />
              </ScrollArea>
               <p className="text-xs text-muted-foreground text-right pr-1">Your edits here will be used for the full report.</p>
            </div>

            <Separator className="my-6 sm:my-7 bg-border/60"/>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold flex items-center text-primary">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-accent" />
                Explored Query Dimensions
                <Badge variant="outline" className="ml-2 sm:ml-3 bg-accent/20 border-accent/40 text-accent-foreground text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 tracking-wide rounded-md">AI-Curated</Badge>
              </h3>
              <ScrollArea className="h-36 sm:h-40 p-3 sm:p-4 border border-border/70 rounded-lg sm:rounded-xl bg-background/70 shadow-inner">
                  <ul className="space-y-2 sm:space-y-2.5 text-foreground/80 text-sm sm:text-base">
                  {summarizedPaperTitles.map((title, i) => (
                      <li key={i} className="flex items-start p-2 sm:p-2.5 rounded-md hover:bg-secondary/50 dark:hover:bg-secondary/25 transition-colors duration-150">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>{title}</span>
                      </li>
                  ))}
                  {summarizedPaperTitles.length === 0 && <p className="italic text-muted-foreground">No specific query areas were identified.</p>}
                  </ul>
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter className="p-4 sm:p-5 md:p-6 border-t border-border/40 bg-secondary/25 dark:bg-secondary/10">
              <p className="text-sm sm:text-base text-muted-foreground text-center w-full">
                  This synthesized overview provides a high-level perspective. For an exhaustive exploration, proceed to generate the full research report.
              </p>
          </CardFooter>
        </Card>
      </div>
  );
});
ResearchSummaryDisplay.displayName = 'ResearchSummaryDisplay';
export default ResearchSummaryDisplay;
