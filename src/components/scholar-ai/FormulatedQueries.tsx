// src/components/scholar-ai/FormulatedQueries.tsx
'use client';

import React from 'react';
import { useActionState } from 'react'; // Ensure useActionState is from 'react'
import { useFormStatus } from 'react-dom'; // Ensure useFormStatus is from 'react-dom'
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { handleSynthesizeResearchAction, type SynthesizeResearchActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Layers, ArrowRight, Telescope, Search, Filter, BarChartBig, Sparkles, CheckCircle, Brain } from 'lucide-react'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FormulatedQueriesProps {
  queries: string[];
  onResearchSynthesized: (summary: string) => void;
  isBusy: boolean; // Prop to indicate if parent is busy
}

const initialSynthesizeState: SynthesizeResearchActionState = {
  success: false,
  message: '',
  researchSummary: null,
  errors: null,
};

const cardVariants = {
  initial: { opacity: 0, y: 150, rotateX: -40, scale: 0.8, filter: "blur(10px)", originZ: -250 }, 
  animate: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1,
    filter: "blur(0px)",
    originZ: 0,
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 18, 
      duration: 1.2, 
      delay: 0.3 
    } 
  },
  hover: {
    scale: 1.04, 
    rotateX: -3,
    rotateY: 6,
    z: 50, 
    boxShadow: "0px 40px 70px -20px rgba(var(--primary-hsl), 0.25), 0px 0px 35px rgba(var(--accent-hsl),0.18)", 
    transition: { type: "spring", stiffness: 330, damping: 14 }
  }
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, 
      delayChildren: 0.6,  
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -90,  rotateY: -35, scale: 0.7, originX: 0, filter: "blur(6px)" }, 
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 16, duration: 0.8 } 
  }
};

const queryItemHover = {
  scale: 1.07, 
  rotateY: 10, 
  x: 12,       
  boxShadow: "0px 12px 30px rgba(var(--accent-hsl), 0.3), inset 0 0 15px rgba(var(--accent-hsl), 0.18)", 
  backgroundColor: "hsla(var(--accent-hsl) / 0.12)", 
  transition: { type: "spring", stiffness: 280, damping: 8} 
}

const headerElementVariants = { 
  initial: { opacity: 0, x: -50, filter: "blur(6px)", rotateX: -25, originX: 0 }, 
  animate: (i:number) => ({ 
    opacity: 1, x: 0, filter: "blur(0px)", rotateX:0,
    transition: { type: "spring", stiffness: 140, damping: 18, duration: 0.8, delay: i * 0.15 + 0.4 } 
  }),
};

function SynthesizeButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto shadow-2xl hover:shadow-accent/50 transition-all duration-400 group bg-gradient-to-br from-accent via-accent/80 to-yellow-400 hover:from-accent/85 hover:to-yellow-400/75 text-accent-foreground active:scale-90 text-xl py-4 px-8 rounded-xl" 
      aria-label="Synthesize Research"
      asChild
    >
      <motion.button
        whileHover={{
            scale: 1.12, 
            y:-7,
            rotateZ: -2, 
            boxShadow: "0px 16px 35px rgba(var(--accent-hsl), 0.5), 0 0 22px rgba(255,215,0,0.75)", 
            transition: {type: "spring", stiffness: 280, damping: 9} 
        }}
        whileTap={{ scale: 0.86, y:5, boxShadow: "0px 5px 15px rgba(var(--accent-hsl), 0.35)"}} 
        transition={{ type: "spring", stiffness: 400, damping: 10 }} 
      >
        {pending ? (
            <Loader2 className="mr-3.5 h-8 w-8 animate-spin text-primary-foreground" /> 
          ) : (
            <Layers className="mr-3.5 h-8 w-8 text-primary-foreground group-hover:scale-[1.4] group-hover:rotate-[-20deg] transition-all duration-700 ease-out transform-gpu" /> 
          )}
        Synthesize & Illuminate
        <ArrowRight className="ml-3.5 h-7 w-7 opacity-0 group-hover:opacity-100 group-hover:translate-x-2.5 transition-all duration-500" /> 
      </motion.button>
    </Button>
  );
}

export default function FormulatedQueries({ queries, onResearchSynthesized, isBusy: parentIsBusy }: FormulatedQueriesProps) {
  const [state, formAction, formIsPending] = useActionState(handleSynthesizeResearchAction, initialSynthesizeState);
  const { toast } = useToast();
  const icons = [Search, Filter, BarChartBig, Telescope, Brain, Sparkles]; 
  
  // Combine parentIsBusy with formIsPending for the disabled state
  const isEffectivelyBusy = parentIsBusy || formIsPending;


  React.useEffect(() => {
     if (state.message) {
      if (state.success && state.researchSummary) {
        toast({ title: "💡 Profound Insights Uncovered!", description: state.message, variant: 'default', duration: 7000 });
        onResearchSynthesized(state.researchSummary);
      } else if (!state.success) {
        toast({ title: "🛠️ Synthesis Stumbled!", description: state.message, variant: 'destructive', duration: 9000 });
      }
    }
  }, [state, toast, onResearchSynthesized]);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      style={{ transformStyle: "preserve-3d", perspective: '1600px' }} 
      className="will-change-transform"
    >
      <Card className="w-full shadow-2xl border-2 border-primary/15 hover:border-accent/70 transition-all duration-500 rounded-[30px] overflow-hidden bg-card/70 backdrop-blur-xl transform-gpu"> 
        <CardHeader className="bg-gradient-to-bl from-primary/80 via-primary/90 to-primary p-12"> 
          <motion.div variants={headerElementVariants} custom={0} className="flex items-center space-x-5 mb-2"> 
            <Telescope className="h-12 w-12 text-accent animate-bounce" style={{animationDuration: '2s', animationDelay: '0.3s'}} /> 
            <CardTitle className="text-5xl font-black text-primary-foreground tracking-tighter"> 
              AI-Forged Vectors
            </CardTitle>
          </motion.div>
           <motion.div variants={headerElementVariants} custom={1}>
            <CardDescription className="text-primary-foreground/80 text-xl leading-relaxed"> 
              ScholarAI has meticulously crafted these search vectors to navigate the vast expanse of knowledge. Click "Synthesize & Illuminate" to distill deep insights.
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="p-12"> 
          <motion.ul 
            className="space-y-7" 
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {queries.map((query, index) => {
               const IconComponent = icons[index % icons.length]; 
               return (
              <motion.li 
                key={index}
                className="flex items-start space-x-5 p-6 bg-secondary/60 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-350 cursor-default border border-transparent hover:border-accent/50 group" 
                variants={listItemVariants}
                whileHover={queryItemHover}
                style={{ transformStyle: "preserve-3d", originX: 0 }}
              >
                <IconComponent className="h-8 w-8 text-accent flex-shrink-0 mt-1 group-hover:animate-pulse" style={{ animationDuration: '0.8s' }} /> 
                <Badge
                  variant="outline"
                  className="text-lg py-3 px-6 whitespace-normal break-words border-primary/50 text-foreground bg-background/50 leading-relaxed rounded-xl shadow-lg group-hover:bg-accent/5 group-hover:border-accent/30" 
                >
                  {query}
                </Badge>
                <CheckCircle className="h-7 w-7 text-green-500/70 ml-auto flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:scale-120 transition-all duration-400" /> 
              </motion.li>
            );
            })}
          </motion.ul>
        </CardContent>
        <CardFooter className="flex justify-end p-12 pt-8"> 
          <motion.form
            action={formAction}
            initial={{opacity:0, y:60, scale: 0.7, filter: "blur(5px)"}} 
            animate={{opacity:1, y:0, scale:1, filter: "blur(0px)"}}
            transition={{delay: (queries.length * 0.2) + 0.7, duration:0.9, type:"spring", stiffness:90, damping: 12}} 
            className="w-full sm:w-auto"
          >
            <input type="hidden" name="queries" value={JSON.stringify(queries)} />
            {/* Pass isEffectivelyBusy to disable button if parent or form is busy */}
            <SynthesizeButton /> 
          </motion.form>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
