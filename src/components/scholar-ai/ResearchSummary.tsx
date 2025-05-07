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
    rotateX: 0,
    rotateY: 0,
    boxShadow: "0px 8px 25px rgba(0, 48, 73, 0.08)",
    transition: { duration: 0.4, type: "tween", ease: "circOut" }
  },
  hover: {
    scale: 1.02,
    rotateX: 1,
    rotateY: -2,
    boxShadow: "0px 20px 40px rgba(0, 48, 73, 0.12)", 
    transition: { duration: 0.3, type: "spring", stiffness: 200, damping: 15 }
  }
};

const contentSectionVariants = {
  hidden: { opacity: 0, y: 25, skewY: 2, filter: "blur(3px)" },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    skewY: 0,
    filter: "blur(0px)",
    transition: { 
      delay: i * 0.2, 
      duration: 0.65, 
      ease: "easeOut" 
    } 
  })
};

const paragraphVariants = {
  hidden: { opacity: 0, x: -20, filter: "blur(2px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "circOut" } }
}

export default function ResearchSummary({ summary, originalQuestion }: ResearchSummaryProps) {
  const summaryParagraphs = summary.split(/\n\s*\n/).filter(p => p.trim() !== "");

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{ transformStyle: "preserve-3d" }}
    >
      <Card className="w-full shadow-xl border-2 border-transparent hover:border-accent/50 transition-all duration-300 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary to-primary/80 p-6">
          <motion.div 
            initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} transition={{delay:0.1, duration:0.4}}
            className="flex items-center space-x-3"
          >
            <BookOpenCheck className="h-8 w-8 text-primary-foreground" />
            <CardTitle className="text-2xl text-primary-foreground">Research Synthesis Complete</CardTitle>
          </motion.div>
          <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} transition={{delay:0.2, duration:0.4}}>
            <CardDescription className="text-primary-foreground/80">Below is a coherent overview synthesized from multiple research sources, based on your initial query.</CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent className="p-6 bg-card space-y-8">
          {originalQuestion && (
            <motion.div
              custom={0} 
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
            custom={1} 
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
                <motion.p 
                  key={index}
                  custom={index}
                  variants={paragraphVariants}
                  initial="hidden"
                  animate="visible" // Will be controlled by parent's stagger
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>
          
          <Separator className="my-6 bg-border/70"/>

          <motion.div 
            custom={2} 
            variants={contentSectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center text-primary">
              <FileText className="h-6 w-6 mr-2 text-accent" />
              Sources & Further Reading <Badge variant="outline" className="ml-2">Mocked Data</Badge>
            </h3>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-1">
              {["The Future of AI in Academic Research", "Advanced Language Models for Query Understanding", "Synthesizing Knowledge: A Survey of Text Summarization Techniques", "Ethical Considerations in AI-Driven Research"].map((src, i) => (
                <motion.li 
                  key={i}
                  custom={i}
                  variants={paragraphVariants} // Re-use for similar effect
                >
                  {src}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </CardContent>
        <CardFooter className="p-6 bg-secondary/20 border-t border-border/50">
           <motion.div 
            custom={3} 
            className="w-full p-4 bg-card/50 rounded-lg flex flex-col md:flex-row items-center text-center md:text-left gap-4 shadow"
            variants={contentSectionVariants}
            initial="hidden"
            animate="visible"
          >
              <motion.div
                initial={{ opacity:0, scale:0.8, rotate:-10 }}
                animate={{ opacity:1, scale:1, rotate:0 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness:150 }}
              >
                <Image 
                    src="https://picsum.photos/seed/research-connect/200/150" 
                    alt="Conceptual research graphic" 
                    width={200} 
                    height={150}
                    className="rounded-md shadow-lg border-2 border-secondary"
                    data-ai-hint="research graph"
                />
              </motion.div>
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
