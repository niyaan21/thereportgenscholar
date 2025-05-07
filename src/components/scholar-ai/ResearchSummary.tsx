// src/components/scholar-ai/ResearchSummary.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookOpenCheck, FileText, Lightbulb, Quote, Brain, CheckCircle, BarChart3, SparklesIcon, Image as ImageIcon, Loader2, Maximize, Eye, ExternalLink } from 'lucide-react';
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
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  const summaryParagraphs = summary.split(/\n\s*\n|\n(?=\s*•|\n\s*\d+\.)/).filter(p => p.trim() !== "");

  const handleImageGeneration = () => {
    let topicForImage = originalQuestion;
    if (!topicForImage || topicForImage.length < 5) {
      topicForImage = summary.substring(0, 200).trim(); // Ensure it's trimmed
    }
     if (topicForImage && topicForImage.length >= 5) { 
      onGenerateImage(topicForImage);
    } else {
      console.warn("Cannot generate image: No valid topic could be determined.");
      // Consider adding a toast notification here for user feedback
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
      >
        <Card className="w-full shadow-xl card-glow-border border-primary/20 rounded-xl overflow-hidden bg-card">
          <CardHeader className="p-6 bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b border-primary/20">
            <div className="flex items-center space-x-4">
              <div className="p-3.5 bg-accent/20 rounded-full shadow-lg border border-accent/40">
                  <BookOpenCheck className="h-8 w-8 text-accent" />
              </div>
              <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Illuminated Research Overview</CardTitle>
                  <CardDescription className="text-muted-foreground text-base mt-1">
                      Key insights distilled and synthesized by ScholarAI.
                  </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {originalQuestion && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="p-5 bg-secondary/40 dark:bg-secondary/15 rounded-lg shadow-inner border border-border/80">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-primary/95">
                  <Quote className="h-5 w-5 mr-2.5 text-accent transform -scale-x-100" />
                  Your Guiding Question
                </h3>
                <p className="text-foreground/85 italic text-base leading-relaxed">
                  "{originalQuestion}"
                </p>
              </motion.div>
            )}
            
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-3">
              <h3 className="text-xl font-semibold flex items-center text-primary">
                <Brain className="h-6 w-6 mr-2.5 text-accent" />
                Core Synthesized Insights
              </h3>
              <ScrollArea className="h-48 p-4 border border-border/80 rounded-lg bg-background shadow-inner">
                  <div className="space-y-3.5 text-foreground/90 text-base leading-relaxed prose prose-base dark:prose-invert max-w-none marker:text-accent">
                  {summaryParagraphs.map((paragraph, index) => (
                      <p key={index}>
                      {paragraph}
                      </p>
                  ))}
                  {summaryParagraphs.length === 0 && <p className="italic text-muted-foreground">No summary content available.</p>}
                  </div>
              </ScrollArea>
            </motion.div>

            <Separator className="my-6 bg-border/50"/>

            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-3">
              <h3 className="text-xl font-semibold flex items-center text-primary">
                <BarChart3 className="h-6 w-6 mr-2.5 text-accent" />
                Explored Query Dimensions
                <Badge variant="outline" className="ml-2.5 bg-accent/15 border-accent/30 text-accent-foreground text-xs px-2 py-0.5 tracking-wide">AI-Curated</Badge>
              </h3>
              <ScrollArea className="h-36 p-4 border border-border/80 rounded-lg bg-background shadow-inner">
                  <ul className="space-y-2 text-foreground/85 text-base">
                  {summarizedPaperTitles.map((title, i) => (
                      <li key={i} className="flex items-start p-2 rounded-md hover:bg-secondary/50 dark:hover:bg-secondary/25 transition-colors duration-150">
                      <CheckCircle className="h-4.5 w-4.5 mr-2.5 mt-1 text-green-600 flex-shrink-0" />
                      <span>{title}</span>
                      </li>
                  ))}
                  {summarizedPaperTitles.length === 0 && <p className="italic text-muted-foreground">No specific query areas were identified.</p>}
                  </ul>
              </ScrollArea>
            </motion.div>

            <Separator className="my-6 bg-border/50"/>

            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center text-primary">
                <ImageIcon className="h-6 w-6 mr-2.5 text-accent" />
                Conceptual Visualization
              </h3>
              {isGeneratingImage && (
                <div className="flex flex-col items-center justify-center p-6 text-muted-foreground h-56 border-2 border-dashed border-border/70 rounded-lg bg-secondary/30 dark:bg-secondary/10 transition-all duration-300">
                  <Loader2 className="h-8 w-8 animate-spin mr-2.5 text-accent" />
                  <p className="mt-2 text-base">Crafting visual concept... This may take a moment.</p>
                </div>
              )}
              {!isGeneratingImage && !generatedImageUrl && (
                <div className="flex flex-col items-center text-center p-6 border-2 border-dashed border-border/70 rounded-lg bg-secondary/30 dark:bg-secondary/10 h-56 justify-center transition-all duration-300 hover:border-accent/50 hover:bg-secondary/40 dark:hover:bg-secondary/20">
                   <p className="text-base text-muted-foreground mb-4">
                    Need a visual spark? Generate an AI-powered image representing the core concepts.
                  </p>
                  <Button onClick={handleImageGeneration} variant="outline" size="lg" className="shadow-md hover:shadow-lg border-input hover:border-accent hover:text-accent-foreground" disabled={isGeneratingImage}>
                    <SparklesIcon className="mr-2 h-5 w-5" />
                    Generate Visual Concept
                  </Button>
                </div>
              )}
              {generatedImageUrl && !isGeneratingImage && (
                <div className="mt-3 border border-border/80 rounded-lg p-4 bg-secondary/30 dark:bg-secondary/10 shadow-md relative group card-glow-border">
                  <NextImage 
                    src={generatedImageUrl} 
                    alt="AI-generated conceptual visualization" 
                    width={600} 
                    height={350} 
                    className="rounded-md object-contain mx-auto shadow-lg"
                    data-ai-hint="abstract concept"
                  />
                   <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity bg-background/60 hover:bg-background/90 backdrop-blur-sm rounded-full h-9 w-9">
                        <Maximize className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-border/50">
                      <p className="text-sm text-muted-foreground">
                      AI-crafted visual. <DialogTrigger asChild><Button variant="link" className="p-0 h-auto text-xs text-accent hover:text-accent-foreground">View Fullscreen</Button></DialogTrigger>
                      </p>
                      <Button onClick={handleImageGeneration} variant="link" size="sm" className="text-accent text-sm p-0 h-auto hover:text-accent-foreground" disabled={isGeneratingImage}>
                          Regenerate
                      </Button>
                  </div>
                </div>
              )}
               {generatedImageUrl && isGeneratingImage && ( 
                <div className="mt-3 border border-border/80 rounded-lg p-4 bg-secondary/30 dark:bg-secondary/10 shadow-md opacity-70 relative h-56 flex items-center justify-center">
                  <NextImage 
                    src={generatedImageUrl} 
                    alt="AI-generated conceptual visualization - regenerating" 
                    width={600} 
                    height={350}
                    className="rounded-md object-contain mx-auto blur-sm"
                    data-ai-hint="abstract concept"
                  />
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-lg">
                      <Loader2 className="h-10 w-10 animate-spin text-white" />
                      <p className="text-white text-lg mt-3">Regenerating Visual...</p>
                   </div>
                </div>
              )}
            </motion.div>
          </CardContent>
          <CardFooter className="p-6 border-t border-border/30 bg-secondary/20 dark:bg-secondary/10">
              <p className="text-sm text-muted-foreground text-center w-full">
                  This synthesized overview provides a high-level perspective. For an exhaustive exploration, proceed to generate the full research report.
              </p>
          </CardFooter>
        </Card>
      </motion.div>
  );
}
