// src/components/scholar-ai/ResearchSummary.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookOpenCheck, FileText, Lightbulb, Quote, Brain, CheckCircle, BarChart3, SparklesIcon, Image as ImageIcon, Loader2, Maximize } from 'lucide-react';
import NextImage from 'next/image'; 
import { Separator } from '@/components/ui/separator';
import { Badge } from '../ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
    // Use originalQuestion if available and valid, otherwise use a snippet of the summary
    let topicForImage = originalQuestion;
    if (!topicForImage || topicForImage.length < 5) {
      topicForImage = summary.substring(0, 200);
    }
     if (topicForImage && topicForImage.length >= 5) { // Ensure topic is valid
      onGenerateImage(topicForImage);
    } else {
      // Optionally, show a toast message if no valid topic can be derived
      console.warn("Cannot generate image: No valid topic could be determined.");
    }
  };

  return (
      <Card className="w-full shadow-xl border-primary/20 rounded-xl overflow-hidden bg-card">
        <CardHeader className="p-6 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-b border-primary/10">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent/10 rounded-full shadow-md border border-accent/20">
                <BookOpenCheck className="h-8 w-8 text-accent" />
            </div>
            <div>
                <CardTitle className="text-2xl font-bold text-primary tracking-tight">Concise Research Overview</CardTitle>
                <CardDescription className="text-muted-foreground text-sm mt-1">
                    Key insights synthesized by ScholarAI based on your query.
                </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {originalQuestion && (
            <div className="p-4 bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border">
              <h3 className="text-base font-semibold mb-1.5 flex items-center text-primary/90">
                <Quote className="h-4 w-4 mr-2 text-accent transform -scale-x-100" />
                Original Research Question
              </h3>
              <p className="text-foreground/80 italic text-sm">
                "{originalQuestion}"
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center text-primary">
              <Brain className="h-5 w-5 mr-2 text-accent" />
              Synthesized Key Insights
            </h3>
            <ScrollArea className="h-40 p-3 border border-border rounded-md bg-background shadow-inner">
                <div className="space-y-3 text-foreground/90 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none marker:text-accent">
                {summaryParagraphs.map((paragraph, index) => (
                    <p key={index}>
                    {paragraph}
                    </p>
                ))}
                </div>
            </ScrollArea>
          </div>

          <Separator className="my-4 bg-border/40"/>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center text-primary">
              <BarChart3 className="h-5 w-5 mr-2 text-accent" />
              Derived Query Areas
              <Badge variant="outline" className="ml-2 bg-accent/10 border-accent/20 text-accent-foreground text-xs px-1.5 py-0.5">AI-Curated</Badge>
            </h3>
            <ScrollArea className="h-32 p-3 border border-border rounded-md bg-background shadow-inner">
                <ul className="space-y-1.5 text-foreground/80 text-sm">
                {summarizedPaperTitles.map((title, i) => (
                    <li key={i} className="flex items-start p-1.5 rounded-md hover:bg-secondary/40 dark:hover:bg-secondary/20">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>{title}</span>
                    </li>
                ))}
                </ul>
            </ScrollArea>
          </div>

          <Separator className="my-4 bg-border/40"/>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center text-primary">
              <ImageIcon className="h-5 w-5 mr-2 text-accent" />
              Conceptual Visualization
            </h3>
            {isGeneratingImage && (
              <div className="flex items-center justify-center p-4 text-muted-foreground h-48 border border-dashed border-border rounded-md bg-secondary/20">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Generating visual concept... Please wait.
              </div>
            )}
            {!isGeneratingImage && !generatedImageUrl && (
              <div className="flex flex-col items-center text-center p-4 border border-dashed border-border rounded-md bg-secondary/20 h-48 justify-center">
                 <p className="text-sm text-muted-foreground mb-3">
                  Need a visual? Generate an AI-powered image representing the core concepts.
                </p>
                <Button onClick={handleImageGeneration} variant="outline" size="sm" disabled={isGeneratingImage}>
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  Generate Visual Concept
                </Button>
              </div>
            )}
            {generatedImageUrl && !isGeneratingImage && (
              <div className="mt-2 border border-border rounded-lg p-3 bg-secondary/20 shadow-sm relative group">
                <NextImage 
                  src={generatedImageUrl} 
                  alt="AI-generated conceptual visualization" 
                  width={512} 
                  height={300} // Adjusted for better aspect ratio in preview
                  className="rounded-md object-contain mx-auto"
                  data-ai-hint="abstract concept"
                />
                 <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none">
                     <DialogHeader>
                        <DialogTitle className="sr-only">Conceptual Visualization - Full Screen</DialogTitle>
                        <DialogDescription className="sr-only">
                          A larger view of the AI-generated conceptual visualization.
                        </DialogDescription>
                      </DialogHeader>
                     <NextImage 
                        src={generatedImageUrl} 
                        alt="AI-generated conceptual visualization - fullscreen" 
                        width={1024} 
                        height={1024} 
                        className="rounded-md object-contain w-full h-auto"
                        data-ai-hint="abstract concept"
                      />
                  </DialogContent>
                </Dialog>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-muted-foreground text-center">
                    AI-generated image.
                    </p>
                    <Button onClick={handleImageGeneration} variant="link" size="sm" className="text-accent text-xs p-0 h-auto" disabled={isGeneratingImage}>
                        Regenerate
                    </Button>
                </div>
              </div>
            )}
             {generatedImageUrl && isGeneratingImage && ( 
              <div className="mt-2 border border-border rounded-lg p-3 bg-secondary/20 shadow-sm opacity-60 relative h-48 flex items-center justify-center">
                <NextImage 
                  src={generatedImageUrl} 
                  alt="AI-generated conceptual visualization - regenerating" 
                  width={512} 
                  height={300}
                  className="rounded-md object-contain mx-auto blur-sm"
                   data-ai-hint="abstract concept"
                />
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-md">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                    <p className="text-white text-sm mt-2">Regenerating...</p>
                 </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t border-border/20 bg-secondary/10 dark:bg-secondary/5">
            <p className="text-xs text-muted-foreground text-center w-full">
                This summary provides a high-level overview. For a deeper dive, generate the full research report.
            </p>
        </CardFooter>
      </Card>
  );
}
