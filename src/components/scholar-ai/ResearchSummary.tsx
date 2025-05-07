// src/components/scholar-ai/ResearchSummary.tsx
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck, FileText, Lightbulb, Quote, Brain } from 'lucide-react'; // Added Brain
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
    z: 0,
    boxShadow: "0px 10px 30px -5px rgba(0, 48, 73, 0.08)",
    transition: { duration: 0.5, type: "spring", stiffness: 100, damping: 15 }
  },
  hover: {
    scale: 1.03, // Slightly less aggressive scale for summary card
    rotateX: 1.5, // Subtle tilt
    rotateY: -2.5, // Subtle tilt
    z: 15,
    boxShadow: "0px 22px 45px -8px rgba(0, 48, 73, 0.14)", 
    transition: { type: "spring", stiffness: 220, damping: 18 }
  }
};

const contentSectionVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9, rotateX: -15, filter: "blur(4px)" }, // More dynamic entry
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { 
      delay: i * 0.25, // Adjusted delay
      type: "spring", 
      stiffness: 120, 
      damping: 18,
      duration: 0.75, 
    } 
  })
};

const paragraphVariants = {
  hidden: { opacity: 0, x: -30, filter: "blur(3px)", scale: 0.95 }, // Enhanced entry
  visible: { 
    opacity: 1, x: 0, filter: "blur(0px)", scale: 1,
    transition: { duration: 0.6, ease: "circOut", type: "spring", stiffness:100, damping:15 } 
  }
}

const headerElementVariants = {
  initial: { opacity: 0, y: -20, filter: "blur(2px)"},
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut", delay: 0.1 } }
};


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
      <Card className="w-full shadow-xl border-2 border-transparent hover:border-accent/60 transition-all duration-300 rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-br from-primary/90 to-primary/70 p-6">
          <motion.div 
            variants={headerElementVariants}
            initial="initial"
            animate="animate"
            className="flex items-center space-x-3"
          >
            <BookOpenCheck className="h-8 w-8 text-primary-foreground animate-pulse" />
            <CardTitle className="text-2xl text-primary-foreground">Research Synthesis Complete</CardTitle>
          </motion.div>
          <motion.div 
             variants={headerElementVariants}
             initial="initial"
             animate="animate"
             custom={1} // for stagger effect if container has staggerChildren
          >
            <CardDescription className="text-primary-foreground/80">Below is a coherent overview synthesized from multiple research sources, based on your initial query.</CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-10"> {/* Increased spacing */}
          {originalQuestion && (
            <motion.div
              custom={0} 
              variants={contentSectionVariants}
              initial="hidden"
              animate="visible"
              className="p-5 bg-secondary/60 rounded-lg shadow-md border border-primary/15" // Enhanced styling
            >
              <h3 className="text-md font-semibold mb-2 flex items-center text-primary">
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
            <h3 className="text-xl font-semibold mb-4 flex items-center text-primary">
              <Brain className="h-7 w-7 mr-2.5 text-accent" /> {/* Used Brain Icon */}
              Synthesized Key Insights
            </h3>
            <div className="space-y-5 text-foreground/90 leading-relaxed prose prose-sm max-w-none"> {/* Enhanced prose styling */}
              {summaryParagraphs.map((paragraph, index) => (
                <motion.p 
                  key={index}
                  custom={index} // Ensure custom prop is passed for stagger
                  variants={paragraphVariants}
                  // initial="hidden" // Already handled by parent's variants
                  // animate="visible"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>
          
          <Separator className="my-8 bg-border/80"/> {/* Increased margin */}

          <motion.div 
            custom={2} 
            variants={contentSectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center text-primary">
              <FileText className="h-6 w-6 mr-2.5 text-accent" />
              Sources & Further Reading <Badge variant="outline" className="ml-2 bg-accent/10 border-accent/30 text-accent-foreground">Mocked Data</Badge>
            </h3>
            <ul className="list-disc list-inside space-y-2.5 text-foreground/80 pl-1">
              {["The Future of AI in Academic Research", "Advanced Language Models for Query Understanding", "Synthesizing Knowledge: A Survey of Text Summarization Techniques", "Ethical Considerations in AI-Driven Research"].map((src, i) => (
                <motion.li 
                  key={i}
                  custom={i} // Ensure custom prop is passed for stagger
                  variants={paragraphVariants} // Re-use for similar effect
                  // initial="hidden"
                  // animate="visible"
                >
                  {src}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </CardContent>
        <CardFooter className="p-6 bg-secondary/30 border-t border-border/60">
           <motion.div 
            custom={3} 
            className="w-full p-5 bg-card/60 rounded-lg flex flex-col md:flex-row items-center text-center md:text-left gap-5 shadow-md border border-secondary/50" // Enhanced styling
            variants={contentSectionVariants}
            initial="hidden"
            animate="visible"
          >
              <motion.div
                initial={{ opacity:0, scale:0.75, rotate:-15, x:-20 }} // Enhanced entry
                animate={{ opacity:1, scale:1, rotate:0, x:0 }}
                transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness:130, damping: 12 }}
                whileHover={{ scale: 1.05, rotate: 3, z: 10, transition: {type:"spring", stiffness:250, damping:10} }} // Hover effect
                className="flex-shrink-0"
              >
                <Image 
                    src="https://picsum.photos/seed/research-connect/200/150" 
                    alt="Conceptual research graphic" 
                    width={180} // Slightly smaller for better fit
                    height={135}
                    className="rounded-md shadow-lg border-2 border-secondary object-cover"
                    data-ai-hint="research graph"
                />
              </motion.div>
              <div className="flex-grow">
                <h4 className="text-md font-semibold text-primary mb-1.5">Expand Your Knowledge</h4>
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