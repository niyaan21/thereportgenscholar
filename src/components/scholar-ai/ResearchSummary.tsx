// src/components/scholar-ai/ResearchSummary.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck, FileText, Lightbulb, Quote, Brain, CheckCircle, BarChart3, SparklesIcon } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '../ui/badge';

interface ResearchSummaryProps {
  summary: string;
  originalQuestion: string;
  summarizedPaperTitles: string[];
}

export default function ResearchSummary({ summary, originalQuestion, summarizedPaperTitles }: ResearchSummaryProps) {
  const summaryParagraphs = summary.split(/\n\s*\n/).filter(p => p.trim() !== "");

  return (
      <Card className="w-full shadow-2xl border-2 border-primary/10 rounded-xl overflow-hidden bg-card transition-all duration-500 hover:scale-[1.01] hover:shadow-primary/20">
        <CardHeader className="p-6 sm:p-8 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-t-lg relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')] opacity-[0.03] mix-blend-overlay"></div>
          <div
            className="flex items-start sm:items-center space-x-4 relative z-10"
          >
            <div className="p-3 bg-accent/10 rounded-full shadow-inner border border-accent/20">
                <BookOpenCheck className="h-8 w-8 sm:h-10 sm:w-10 text-accent drop-shadow-lg" />
            </div>
            <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-primary tracking-tight drop-shadow-sm">Research Synthesis</CardTitle>
                <CardDescription className="text-muted-foreground text-sm sm:text-base mt-1 leading-relaxed">
                    An overview synthesized from multiple sources, based on your query.
                </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-8">
          {originalQuestion && (
            <div
              className="p-5 bg-secondary/30 dark:bg-secondary/20 rounded-lg shadow-inner border border-border/50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <h3 className="text-md font-semibold mb-2 flex items-center text-primary/90 relative z-10">
                <Quote className="h-5 w-5 mr-2.5 text-accent transform -scale-x-100 transition-transform duration-300 group-hover:scale-105" />
                Original Research Question
              </h3>
              <p className="text-foreground/80 italic leading-relaxed text-sm pl-8 relative z-10">
                "{originalQuestion}"
              </p>
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center text-primary">
              <Brain className="h-6 w-6 mr-2.5 text-accent" />
              Synthesized Key Insights
            </h3>
            <div className="space-y-4 text-foreground/90 leading-relaxed prose prose-sm sm:prose-base max-w-none marker:text-accent prose-p:transition-colors prose-p:duration-200 hover:prose-p:text-foreground">
              {summaryParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <Separator className="my-6 bg-border/50"/>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-primary">
              <BarChart3 className="h-6 w-6 mr-2.5 text-accent" />
              Synthesized From Query Areas
              <Badge variant="outline" className="ml-3 bg-accent/10 border-accent/30 text-accent-foreground text-xs px-2 py-0.5 shadow-sm">AI-Curated</Badge>
            </h3>
            <ul className="space-y-2.5 text-foreground/80 pl-1 text-sm sm:text-base">
              {summarizedPaperTitles.map((title, i) => (
                <li
                  key={i}
                  className="flex items-start p-2 rounded-md hover:bg-secondary/50 dark:hover:bg-secondary/30 transition-all duration-200 group"
                >
                  <CheckCircle className="h-5 w-5 mr-2.5 mt-0.5 text-green-500 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <span className="transition-colors duration-200 group-hover:text-foreground">{title}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        {/* Footer removed as per user request to remove "Unlock Deeper Understanding" section */}
      </Card>
  );
}
