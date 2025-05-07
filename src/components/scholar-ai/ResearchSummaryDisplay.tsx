// src/components/scholar-ai/ResearchSummaryDisplay.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookOpenCheck, FileText, Lightbulb, Quote, Brain, CheckCircle, BarChart3, SparklesIcon, Image as ImageIcon, Loader2, MaximizeIcon, Eye, ExternalLink } from 'lucide-react';
import NextImage from 'next/image'; 
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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

export interface ResearchSummaryDisplayProps {
  summary: string;
  originalQuestion: string;
  summarizedPaperTitles: string[];
  onGenerateImage: (topic: string) => void;
  generatedImageUrl: string | null;
  isGeneratingImage: boolean;
}

export default function ResearchSummaryDisplay({ 
  summary, 
  originalQuestion, 
  summarizedPaperTitles,
  onGenerateImage,
  generatedImageUrl,
  isGeneratingImage 
}: ResearchSummaryDisplayProps) {
  const summaryParagraphs = summary.split(/\n\s*\n|\n(?=\s*•|\n\s*\d+\.)/).filter(p => p.trim() !== "");

  const handleImageGeneration = () => {
    let topicForImage = originalQuestion;
    if (!topicForImage || topicForImage.trim().length < 5) { // Ensure topic is not just whitespace
      topicForImage = summary.substring(0, 200).trim(); 
    }
     if (topicForImage && topicForImage.trim().length >= 5) { 
      onGenerateImage(topicForImage);
    } else {
      console.warn("Cannot generate image: No valid topic could be determined.");
      // A toast notification for this case is handled in page.tsx or the action itself
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut", delay: 0.1 } }
  };

  return (
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "circOut", delay: 0.2 }}
      >
        <Card className="w-full shadow-2xl card-glow-border border-primary/25 rounded-2xl overflow-hidden bg-card transform hover:shadow-primary/20 transition-all duration-400">
          <CardHeader className="p-7 md:p-8 bg-gradient-to-br from-primary/15 via-transparent to-primary/5 border-b border-primary/25">
            <div className="flex items-center space-x-4 md:space-x-5">
              <div className="p-4 bg-gradient-to-br from-accent to-accent/70 rounded-2xl shadow-xl border-2 border-accent/50 text-accent-foreground">
                  <BookOpenCheck className="h-8 w-8 md:h-9 md:w-9" />
              </div>
              <div>
                  <CardTitle className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Illuminated Research Overview</CardTitle>
                  <CardDescription className="text-muted-foreground text-base mt-1.5 max-w-lg">
                      Key insights distilled and synthesized by ScholarAI.
                  </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-7 md:p-8 space-y-8">
            {originalQuestion && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="p-6 bg-secondary/40 dark:bg-secondary/15 rounded-xl shadow-inner border border-border/70">
                <h3 className="text-lg font-semibold mb-2.5 flex items-center text-primary/90">
                  <Quote className="h-5 w-5 mr-3 text-accent transform -scale-x-100" />
                  Your Guiding Question
                </h3>
                <p className="text-foreground/80 italic text-base leading-relaxed">
                  "{originalQuestion}"
                </p>
              </motion.div>
            )}
            
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center text-primary">
                <Brain className="h-6 w-6 mr-3 text-accent" />
                Core Synthesized Insights
              </h3>
              <ScrollArea className="h-52 p-4 border border-border/70 rounded-xl bg-background/70 shadow-inner">
                  <div className="space-y-4 text-foreground/85 text-base leading-relaxed prose prose-base dark:prose-invert max-w-none marker:text-accent">
                  {summaryParagraphs.map((paragraph, index) => (
                      <p key={index}>
                      {paragraph}
                      </p>
                  ))}
                  {summaryParagraphs.length === 0 && <p className="italic text-muted-foreground">No summary content available.</p>}
                  </div>
              </ScrollArea>
            </motion.div>

            <Separator className="my-7 bg-border/60"/>

            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center text-primary">
                <BarChart3 className="h-6 w-6 mr-3 text-accent" />
                Explored Query Dimensions
                <Badge variant="outline" className="ml-3 bg-accent/20 border-accent/40 text-accent-foreground text-xs px-2.5 py-1 tracking-wide rounded-md">AI-Curated</Badge>
              </h3>
              <ScrollArea className="h-40 p-4 border border-border/70 rounded-xl bg-background/70 shadow-inner">
                  <ul className="space-y-2.5 text-foreground/80 text-base">
                  {summarizedPaperTitles.map((title, i) => (
                      <li key={i} className="flex items-start p-2.5 rounded-lg hover:bg-secondary/50 dark:hover:bg-secondary/25 transition-colors duration-150">
                      <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>{title}</span>
                      </li>
                  ))}
                  {summarizedPaperTitles.length === 0 && <p className="italic text-muted-foreground">No specific query areas were identified.</p>}
                  </ul>
              </ScrollArea>
            </motion.div>

            <Separator className="my-7 bg-border/60"/>

            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-5">
              <h3 className="text-xl font-semibold flex items-center text-primary">
                <ImageIcon className="h-6 w-6 mr-3 text-accent" />
                Conceptual Visualization
              </h3>
              {isGeneratingImage && (
                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground h-60 border-2 border-dashed border-border/60 rounded-xl bg-secondary/30 dark:bg-secondary/10 transition-all duration-300">
                  <Loader2 className="h-9 w-9 animate-spin mr-3 text-accent" />
                  <p className="mt-3 text-base">Crafting visual concept... This may take a moment.</p>
                </div>
              )}
              {!isGeneratingImage && !generatedImageUrl && (
                <div className="flex flex-col items-center text-center p-8 border-2 border-dashed border-border/60 rounded-xl bg-secondary/30 dark:bg-secondary/10 h-60 justify-center transition-all duration-300 hover:border-accent/40 hover:bg-secondary/35 dark:hover:bg-secondary/15">
                   <p className="text-base text-muted-foreground mb-5 max-w-md">
                    Need a visual spark? Generate an AI-powered image representing the core concepts of your research.
                  </p>
                  <Button onClick={handleImageGeneration} variant="outline" size="lg" className="shadow-md hover:shadow-lg border-input hover:border-accent hover:text-accent-foreground text-base py-3 px-7 rounded-lg" disabled={isGeneratingImage}>
                    <SparklesIcon className="mr-2.5 h-5 w-5" />
                    Generate Visual Concept
                  </Button>
                </div>
              )}
              {generatedImageUrl && !isGeneratingImage && (
                <div className="mt-4 border border-border/70 rounded-xl p-4 bg-secondary/30 dark:bg-secondary/10 shadow-lg relative group card-glow-border">
                  <DialogTrigger asChild>
                    <div className="relative overflow-hidden rounded-lg cursor-pointer">
                        <NextImage 
                        src={generatedImageUrl} 
                        alt="AI-generated conceptual visualization" 
                        width={700} 
                        height={400} 
                        className="rounded-lg object-contain mx-auto shadow-xl transition-transform duration-300 ease-out group-hover:scale-105"
                        data-ai-hint="abstract concept"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <MaximizeIcon className="h-10 w-10 text-white/80" />
                        </div>
                    </div>
                  </DialogTrigger>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed border-border/50">
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
                <div className="mt-4 border border-border/70 rounded-xl p-4 bg-secondary/30 dark:bg-secondary/10 shadow-lg opacity-70 relative h-60 flex items-center justify-center">
                  <NextImage 
                    src={generatedImageUrl} 
                    alt="AI-generated conceptual visualization - regenerating" 
                    width={700} 
                    height={400}
                    className="rounded-lg object-contain mx-auto blur-sm max-h-[calc(100%-2rem)]" // Ensure image fits
                    data-ai-hint="abstract concept"
                  />
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg">
                      <Loader2 className="h-12 w-12 animate-spin text-white" />
                      <p className="text-white text-lg mt-4">Regenerating Visual...</p>
                   </div>
                </div>
              )}
            </motion.div>
          </CardContent>
          <CardFooter className="p-7 md:p-8 border-t border-border/40 bg-secondary/25 dark:bg-secondary/10">
              <p className="text-base text-muted-foreground text-center w-full">
                  This synthesized overview provides a high-level perspective. For an exhaustive exploration, proceed to generate the full research report.
              </p>
          </CardFooter>
        </Card>
      </motion.div>
  );
}
