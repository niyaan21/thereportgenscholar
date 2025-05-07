// src/components/scholar-ai/ResearchSummary.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck, FileText, Lightbulb, Quote, Brain, CheckCircle, BarChart3, SparklesIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import NextImage from 'next/image'; // Renamed to avoid conflict with Lucide icon
import { Separator } from '@/components/ui/separator';
import { Badge } from '../ui/badge';
import { Button } from '@/components/ui/button';

interface ResearchSummaryProps {
  summary: string;
  originalQuestion: string;
  summarizedPaperTitles: string[];
  onGenerateImage: (topic: string) => void;
  generatedImageUrl: string | null;
  isGeneratingImage: boolean;
}

export default function ResearchSummary({ 
  summary, 
  originalQuestion, 
  summarizedPaperTitles,
  onGenerateImage,
  generatedImageUrl,
  isGeneratingImage 
}: ResearchSummaryProps) {
  const summaryParagraphs = summary.split(/\n\s*\n/).filter(p => p.trim() !== "");

  const handleImageGeneration = () => {
    // Use a concise part of the summary or the original question as the topic
    const topic = originalQuestion || summary.substring(0, 200);
    if (topic) {
      onGenerateImage(topic);
    }
  };

  return (
      <Card className="w-full shadow-lg border-primary/10 rounded-lg overflow-hidden bg-card">
        <CardHeader className="p-6 bg-primary/5 border-b border-primary/10">
          <div className="flex items-center space-x-3">
            <BookOpenCheck className="h-7 w-7 text-accent" />
            <div>
                <CardTitle className="text-xl font-semibold text-primary">Research Synthesis</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                    An overview synthesized from multiple sources, based on your query.
                </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {originalQuestion && (
            <div className="p-4 bg-secondary/50 rounded-md shadow-sm border border-border">
              <h3 className="text-base font-medium mb-1.5 flex items-center text-primary/90">
                <Quote className="h-4 w-4 mr-2 text-accent transform -scale-x-100" />
                Original Research Question
              </h3>
              <p className="text-foreground/80 italic text-sm">
                "{originalQuestion}"
              </p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center text-primary">
              <Brain className="h-5 w-5 mr-2 text-accent" />
              Synthesized Key Insights
            </h3>
            <div className="space-y-3 text-foreground/90 text-sm leading-relaxed prose prose-sm max-w-none marker:text-accent">
              {summaryParagraphs.map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <Separator className="bg-border/40"/>

          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center text-primary">
              <BarChart3 className="h-5 w-5 mr-2 text-accent" />
              Synthesized From Query Areas
              <Badge variant="outline" className="ml-2 bg-accent/10 border-accent/20 text-accent-foreground text-xs px-1.5 py-0.5">AI-Curated</Badge>
            </h3>
            <ul className="space-y-1.5 text-foreground/80 text-sm">
              {summarizedPaperTitles.map((title, i) => (
                <li key={i} className="flex items-start p-1.5 rounded-md hover:bg-secondary/40">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator className="bg-border/40"/>

          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center text-primary">
              <ImageIcon className="h-5 w-5 mr-2 text-accent" />
              Conceptual Visualization
            </h3>
            {isGeneratingImage && (
              <div className="flex items-center justify-center p-4 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Generating image... Please wait.
              </div>
            )}
            {!isGeneratingImage && !generatedImageUrl && (
              <div className="flex flex-col items-center text-center p-4 border border-dashed border-border rounded-md bg-secondary/20">
                 <p className="text-sm text-muted-foreground mb-3">
                  Generate an AI-powered visual representation of the core concepts from your research.
                </p>
                <Button onClick={handleImageGeneration} variant="outline" size="sm" disabled={isGeneratingImage}>
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  Generate Visual Concept
                </Button>
              </div>
            )}
            {generatedImageUrl && !isGeneratingImage && (
              <div className="mt-2 border border-border rounded-md p-2 bg-secondary/20 shadow-sm">
                <NextImage 
                  src={generatedImageUrl} 
                  alt="AI-generated conceptual visualization" 
                  width={512} 
                  height={512} 
                  className="rounded-md object-contain mx-auto"
                  data-ai-hint="abstract concept"
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  AI-generated image representing the research topic.
                  <Button onClick={handleImageGeneration} variant="link" size="sm" className="ml-2 text-accent" disabled={isGeneratingImage}>
                    Regenerate
                  </Button>
                </p>
              </div>
            )}
             {generatedImageUrl && isGeneratingImage && ( // Show current image dimmed while new one is generating
              <div className="mt-2 border border-border rounded-md p-2 bg-secondary/20 shadow-sm opacity-50 relative">
                <NextImage 
                  src={generatedImageUrl} 
                  alt="AI-generated conceptual visualization - regenerating" 
                  width={512} 
                  height={512} 
                  className="rounded-md object-contain mx-auto"
                  data-ai-hint="abstract concept"
                />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                 </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
  );
}
