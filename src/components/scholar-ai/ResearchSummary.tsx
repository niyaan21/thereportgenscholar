// src/components/scholar-ai/ResearchSummary.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck, FileText, Lightbulb, Quote, Brain } from 'lucide-react'; 
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
    <div>
      <Card className="w-full shadow-lg border border-primary/10 rounded-xl overflow-hidden bg-card">
        <CardHeader className="bg-primary/5 p-6">
          <div 
            className="flex items-center space-x-3"
          >
            <BookOpenCheck className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-semibold text-primary">Research Synthesis Complete</CardTitle>
          </div>
          <div>
            <CardDescription className="text-muted-foreground text-base">Below is a coherent overview synthesized from multiple research sources, based on your initial query.</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {originalQuestion && (
            <div
              className="p-4 bg-secondary/50 rounded-lg shadow-sm border border-primary/10"
            >
              <h3 className="text-base font-semibold mb-1.5 flex items-center text-primary">
                <Quote className="h-5 w-5 mr-2 text-accent transform -scale-x-100" />
                Original Research Question
              </h3>
              <p className="text-foreground/80 italic leading-normal text-sm">
                "{originalQuestion}"
              </p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
              <Brain className="h-6 w-6 mr-2 text-accent" />
              Synthesized Key Insights
            </h3>
            <div className="space-y-4 text-foreground/90 leading-normal prose prose-sm max-w-none">
              {summaryParagraphs.map((paragraph, index) => (
                <p 
                  key={index}
                  className="text-sm"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          <Separator className="my-6 bg-border/70"/>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
              <FileText className="h-5 w-5 mr-2 text-accent" />
              Synthesized From Query Areas <Badge variant="outline" className="ml-2 bg-accent/10 border-accent/20 text-accent-foreground text-xs">AI-Generated</Badge>
            </h3>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-1 text-sm">
              {summarizedPaperTitles.map((title, i) => (
                <li 
                  key={i}
                >
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-secondary/20 border-t border-border/50">
           <div 
            className="w-full p-4 bg-card/50 rounded-lg flex flex-col md:flex-row items-center text-center md:text-left gap-4 shadow-sm border border-secondary/40"
          >
              <div
                className="flex-shrink-0"
              >
                <Image 
                    src="https://picsum.photos/seed/research-synthesis/150/100" 
                    alt="Conceptual research synthesis graphic" 
                    width={150} 
                    height={100}
                    className="rounded-md shadow-md border border-secondary object-cover"
                    data-ai-hint="synthesis abstract"
                />
              </div>
              <div className="flex-grow">
                <h4 className="text-base font-semibold text-primary mb-1">Deep Dive Potential</h4>
                <p className="text-xs text-muted-foreground">
                  This AI-generated summary is based on the formulated query areas. Further investigation into each area can yield more detailed insights.
                </p>
              </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
