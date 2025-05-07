// src/components/scholar-ai/ResearchSummary.tsx
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck, FileText, Lightbulb, Quote } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '../ui/badge';

interface ResearchSummaryProps {
  summary: string;
  originalQuestion: string;
}

const cardHoverVariants = {
  rest: {
    scale: 1,
    boxShadow: "0px 8px 25px rgba(0, 48, 73, 0.1)", // #003049 with alpha
    transition: { duration: 0.4, type: "tween", ease: "circOut" }
  },
  hover: {
    scale: 1.02,
    boxShadow: "0px 15px 35px rgba(0, 48, 73, 0.15)", // #003049 with alpha
    transition: { duration: 0.3, type: "spring", stiffness: 250, damping: 20 }
  }
};

const contentSectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ // Add custom prop 'i' for staggered delay
    opacity: 1, 
    y: 0, 
    transition: { 
      delay: i * 0.15, // Stagger delay based on index
      duration: 0.6, 
      ease: "easeOut" 
    } 
  })
};

export default function ResearchSummary({ summary, originalQuestion }: ResearchSummaryProps) {
  // Split summary into paragraphs for better readability
  const summaryParagraphs = summary.split(/\n\s*\n/).filter(p => p.trim() !== "");

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <Card className="w-full shadow-xl border-2 border-transparent hover:border-accent/50 transition-all duration-300 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary to-primary/80 p-6">
          <div className="flex items-center space-x-3">
            <BookOpenCheck className="h-8 w-8 text-primary-foreground" />
            <CardTitle className="text-2xl text-primary-foreground">Research Synthesis Complete</CardTitle>
          </div>
          <CardDescription className="text-primary-foreground/80">Below is a coherent overview synthesized from multiple research sources, based on your initial query.</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 bg-card space-y-8">
          {originalQuestion && (
            <motion.div
              custom={0} // Stagger index
              variants={contentSectionVariants}
              initial="hidden"
              animate="visible"
              className="p-4 bg-secondary/50 rounded-lg shadow-sm"
            >
              <h3 className="text-md font-semibold mb-1 flex items-center text-primary">
                <Quote className="h-5 w-5 mr-2 text-accent transform -scale-x-100" />
                Original Research Question
              </h3>
              <p className="text-foreground/90 italic leading-relaxed">
                "{originalQuestion}"
              </p>
            </motion.div>
          )}

          <motion.div
            custom={1} // Stagger index
            variants={contentSectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center text-primary">
              <Lightbulb className="h-6 w-6 mr-2 text-accent animate-pulse" />
              Synthesized Key Insights
            </h3>
            <div className="space-y-4 text-foreground/90 leading-relaxed prose prose-sm max-w-none">
              {summaryParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
          
          <Separator className="my-6 bg-border/70"/>

          <motion.div 
            custom={2} // Stagger index
            variants={contentSectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center text-primary">
              <FileText className="h-6 w-6 mr-2 text-accent" />
              Sources & Further Reading <Badge variant="outline" className="ml-2">Mocked Data</Badge>
            </h3>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-1">
              <li>The Future of AI in Academic Research</li>
              <li>Advanced Language Models for Query Understanding</li>
              <li>Synthesizing Knowledge: A Survey of Text Summarization Techniques</li>
              <li>Ethical Considerations in AI-Driven Research</li>
            </ul>
          </motion.div>
        </CardContent>
        <CardFooter className="p-6 bg-secondary/20 border-t border-border/50">
           <motion.div 
            custom={3} // Stagger index
            className="w-full p-4 bg-card/50 rounded-lg flex flex-col md:flex-row items-center text-center md:text-left gap-4 shadow"
            variants={contentSectionVariants}
            initial="hidden"
            animate="visible"
          >
              <Image 
                  src="https://picsum.photos/seed/research-connect/200/150" 
                  alt="Conceptual research graphic" 
                  width={200} 
                  height={150}
                  className="rounded-md shadow-lg border-2 border-secondary"
                  data-ai-hint="research graph"
              />
              <div>
                <h4 className="text-md font-semibold text-primary mb-1">Expand Your Knowledge</h4>
                <p className="text-sm text-muted-foreground">
                  The synthesized summary provides a starting point. Consider exploring the (mocked) sources for deeper understanding and diverse perspectives.
                </p>
              </div>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
