// src/components/scholar-ai/ResearchSummary.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck, FileText, Lightbulb, Quote, Brain, CheckCircle, BarChart3, SparklesIcon } from 'lucide-react'; // Added CheckCircle, BarChart3
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';

interface ResearchSummaryProps {
  summary: string;
  originalQuestion: string;
  summarizedPaperTitles: string[];
}

export default function ResearchSummary({ summary, originalQuestion, summarizedPaperTitles }: ResearchSummaryProps) {
  const summaryParagraphs = summary.split(/\n\s*\n/).filter(p => p.trim() !== "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="w-full shadow-xl border-2 border-primary/10 rounded-xl overflow-hidden bg-card transform hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="p-6 sm:p-8 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-t-lg">
          <div
            className="flex items-start sm:items-center space-x-4"
          >
            <div className="p-3 bg-accent/10 rounded-full">
                <BookOpenCheck className="h-8 w-8 sm:h-10 sm:w-10 text-accent drop-shadow-sm" />
            </div>
            <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">Research Synthesis</CardTitle>
                <CardDescription className="text-muted-foreground text-sm sm:text-base mt-1 leading-relaxed">
                    An overview synthesized from multiple sources, based on your query.
                </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-8">
          {originalQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-5 bg-secondary/30 dark:bg-secondary/20 rounded-lg shadow-inner border border-border/50"
            >
              <h3 className="text-md font-semibold mb-2 flex items-center text-primary/90">
                <Quote className="h-5 w-5 mr-2.5 text-accent transform -scale-x-100" />
                Original Research Question
              </h3>
              <p className="text-foreground/80 italic leading-relaxed text-sm pl-8">
                "{originalQuestion}"
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center text-primary">
              <Brain className="h-6 w-6 mr-2.5 text-accent" />
              Synthesized Key Insights
            </h3>
            <div className="space-y-4 text-foreground/90 leading-relaxed prose prose-sm sm:prose-base max-w-none marker:text-accent">
              {summaryParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          <Separator className="my-6 bg-border/50"/>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center text-primary">
              <BarChart3 className="h-6 w-6 mr-2.5 text-accent" />
              Synthesized From Query Areas
              <Badge variant="outline" className="ml-3 bg-accent/10 border-accent/30 text-accent-foreground text-xs px-2 py-0.5">AI-Curated</Badge>
            </h3>
            <ul className="space-y-2.5 text-foreground/80 pl-1 text-sm sm:text-base">
              {summarizedPaperTitles.map((title, i) => (
                <li
                  key={i}
                  className="flex items-start"
                >
                  <CheckCircle className="h-5 w-5 mr-2.5 mt-1 text-green-500 flex-shrink-0" />
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </CardContent>
        <CardFooter className="p-6 sm:p-8 bg-secondary/10 dark:bg-secondary/5 border-t border-border/30 rounded-b-lg">
           <div
            className="w-full p-5 bg-card rounded-lg flex flex-col md:flex-row items-center text-center md:text-left gap-4 shadow-md border border-border/40"
          >
              <div
                className="flex-shrink-0 relative"
              >
                <Image
                    src="https://picsum.photos/seed/research-synthesis-v2/150/100" // Updated seed for new image
                    alt="Conceptual research synthesis graphic"
                    width={120} // Adjusted size
                    height={80}  // Adjusted size
                    className="rounded-md shadow-lg border-2 border-accent/20 object-cover"
                    data-ai-hint="synthesis abstract"
                />
                <SparklesIcon className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <div className="flex-grow">
                <h4 className="text-md font-semibold text-primary mb-1 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                    Unlock Deeper Understanding
                </h4>
                <p className="text-xs text-muted-foreground leading-normal">
                  This AI-generated summary is based on the formulated query areas. Further investigation into each area can yield more detailed insights.
                </p>
              </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
