// src/components/scholar-ai/FormulatedQueries.tsx
'use client';

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { handleSynthesizeResearchAction, type SynthesizeResearchActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Brain, ArrowRight, Layers, CheckCircle, Telescope, Filter, BarChartBig, Sparkles } from 'lucide-react'; // Added more icons
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FormulatedQueriesProps {
  queries: string[];
  onResearchSynthesized: (summary: string) => void;
  isBusy: boolean;
}

const initialSynthesizeState: SynthesizeResearchActionState = {
  success: false,
  message: '',
  researchSummary: null,
  errors: null,
};

const cardVariants = {
  initial: { opacity: 0, y: 120, rotateX: -35, scale: 0.85, filter: "blur(8px)" }, // Start further down, more rotated
  animate: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 90, // Slightly softer spring
      damping: 18, // More damping
      duration: 1.0, // Longer duration
      delay: 0.2 // Slightly later delay than QueryForm
    } 
  },
  hover: {
    scale: 1.06, // Slightly less aggressive than QueryForm for balance
    rotateX: -5,
    rotateY: 7,
    z: 40, // Lift more
    boxShadow: "0px 35px 65px -15px rgba(var(--primary-hsl), 0.28), 0px 0px 30px rgba(var(--accent-hsl),0.22)", // More impactful shadow
    transition: { type: "spring", stiffness: 320, damping: 16 }
  }
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18, // Increased stagger
      delayChildren: 0.5,  // Increased delay for content
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -80,  rotateY: -30, scale: 0.75, originX: 0, filter: "blur(5px)" }, // More dynamic entry
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 130, damping: 18, duration: 0.7 } // Slightly adjusted spring
  }
};

const queryItemHover = {
  scale: 1.08, 
  rotateY: 12, // More rotation
  x: 10,       
  boxShadow: "0px 10px 25px rgba(var(--accent-hsl), 0.25), inset 0 0 12px rgba(var(--accent-hsl), 0.15)", // Enhanced shadow
  backgroundColor: "hsla(var(--accent-hsl) / 0.1)", // Slightly more prominent bg
  transition: { type: "spring", stiffness: 300, damping: 9} // Bouncier
}

const headerElementVariants = { 
  initial: { opacity: 0, x: -45, filter: "blur(5px)", rotateX: -20, originX: 0 }, // More dynamic entry
  animate: (i:number) => ({ 
    opacity: 1, x: 0, filter: "blur(0px)", rotateX:0,
    transition: { type: "spring", stiffness: 150, damping: 20, duration: 0.7, delay: i * 0.12 + 0.3 } // Adjusted stagger
  }),
};

function SynthesizeButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-350 group bg-gradient-to-br from-accent via-accent/85 to-yellow-400 hover:from-accent/90 hover:to-yellow-400/80 text-accent-foreground active:scale-92 text-lg py-3.5 px-7" // Larger, more vibrant button
      aria-label="Synthesize Research"
      asChild
    >
      <motion.button
        whileHover={{
            scale: 1.15, // Increased scale
            y:-6,
            rotateZ: -2.5, // More rotation
            boxShadow: "0px 14px 32px rgba(var(--accent-hsl), 0.45), 0 0 20px rgba(255,215,0,0.7)", // Stronger, gold shadow
            transition: {type: "spring", stiffness: 300, damping: 10} // Bouncier
        }}
        whileTap={{ scale: 0.85, y:4, boxShadow: "0px 4px 12px rgba(var(--accent-hsl), 0.3)"}} // More pronounced tap
        transition={{ type: "spring", stiffness: 420, damping: 12 }} // Snappier
      >
        {pending ? (
            <Loader2 className="mr-3 h-7 w-7 animate-spin text-primary-foreground" /> // Larger loader
          ) : (
            <Layers className="mr-3 h-7 w-7 text-primary-foreground group-hover:scale-130 group-hover:rotate-[-15deg] transition-all duration-600 ease-out transform-gpu" /> // Enhanced icon animation
          )}
        Synthesize & Illuminate
        <ArrowRight className="ml-3 h-6 w-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-450" /> {/* Enhanced arrow */}
      </motion.button>
    </Button>
  );
}

export default function FormulatedQueries({ queries, onResearchSynthesized, isBusy }: FormulatedQueriesProps) {
  const [state, formAction] = useActionState(handleSynthesizeResearchAction, initialSynthesizeState);
  const { toast } = useToast();
  const icons = [Search, Filter, BarChartBig, Telescope, Brain, Sparkles]; // Array of icons for variety

  React.useEffect(() => {
     if (state.message) {
      if (state.success && state.researchSummary) {
        toast({ title: "💡 Insights Unveiled!", description: state.message, variant: 'default', duration: 6000 });
        onResearchSynthesized(state.researchSummary);
      } else if (!state.success) {
        toast({ title: "🛠️ Synthesis Snag!", description: state.message, variant: 'destructive', duration: 8000 });
      }
    }
  }, [state, toast, onResearchSynthesized]);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      style={{ transformStyle: "preserve-3d", perspective: '1400px' }} // Slightly adjusted perspective
      className="will-change-transform"
    >
      <Card className="w-full shadow-2xl border-2 border-primary/15 hover:border-accent/75 transition-all duration-450 rounded-3xl overflow-hidden bg-card/80 backdrop-blur-xl transform-gpu"> {/* Consistent with QueryForm card */}
        <CardHeader className="bg-gradient-to-bl from-primary/85 via-primary/95 to-primary p-10"> {/* Consistent padding */}
          <motion.div variants={headerElementVariants} custom={0} className="flex items-center space-x-4 mb-1.5"> {/* Increased spacing */}
            <Telescope className="h-11 w-11 text-accent animate-bounce" style={{animationDuration: '1.8s', animationDelay: '0.2s'}} /> {/* Larger, slower bounce */}
            <CardTitle className="text-4xl font-black text-primary-foreground tracking-tighter"> {/* Consistent with QueryForm title */}
              AI-Generated Vectors
            </CardTitle>
          </motion.div>
           <motion.div variants={headerElementVariants} custom={1}>
            <CardDescription className="text-primary-foreground/85 text-lg leading-relaxed"> {/* Consistent with QueryForm desc */}
              ScholarAI has sculpted these queries to chart the knowledge frontier. Click "Synthesize & Illuminate" to distill profound insights.
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="p-10"> {/* Consistent padding */}
          <motion.ul 
            className="space-y-6" 
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {queries.map((query, index) => {
               const IconComponent = icons[index % icons.length]; // Cycle through icons
               return (
              <motion.li 
                key={index}
                className="flex items-start space-x-4 p-5 bg-secondary/75 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-default border border-transparent hover:border-accent/40" // Enhanced styling
                variants={listItemVariants}
                whileHover={queryItemHover}
                style={{ transformStyle: "preserve-3d", originX: 0 }}
              >
                <IconComponent className="h-7 w-7 text-accent flex-shrink-0 mt-0.5 group-hover:animate-pulse" style={{ animationDuration: '1s' }} /> {/* Icon with hover pulse */}
                <Badge
                  variant="outline"
                  className="text-lg py-2.5 px-5 whitespace-normal break-words border-primary/60 text-foreground/95 bg-background/60 leading-relaxed rounded-lg shadow-md group-hover:bg-accent/5" // Larger, more prominent badge
                >
                  {query}
                </Badge>
                <CheckCircle className="h-6 w-6 text-green-500/80 ml-auto flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-350" /> {/* Enhanced checkmark */}
              </motion.li>
            );
            })}
          </motion.ul>
        </CardContent>
        <CardFooter className="flex justify-end p-10 pt-6"> {/* Consistent padding */}
          <motion.form
            action={formAction}
            initial={{opacity:0, y:50, scale: 0.8, filter: "blur(4px)"}} // More dynamic entry
            animate={{opacity:1, y:0, scale:1, filter: "blur(0px)"}}
            transition={{delay: (queries.length * 0.18) + 0.6, duration:0.8, type:"spring", stiffness:100, damping: 14}} // Adjusted delay and spring
            className="w-full sm:w-auto"
          >
            <input type="hidden" name="queries" value={JSON.stringify(queries)} />
            <SynthesizeButton />
          </motion.form>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
