// src/components/scholar-ai/FormulatedQueries.tsx
'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { handleSynthesizeResearchAction, type SynthesizeResearchActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Brain } from 'lucide-react';
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

const cardHoverVariants = {
  rest: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    boxShadow: "0px 8px 25px rgba(0, 48, 73, 0.08)",
    transition: { duration: 0.4, type: "tween", ease: "circOut" }
  },
  hover: {
    scale: 1.03,
    rotateX: -2, 
    rotateY: -3,
    boxShadow: "0px 20px 40px rgba(0, 48, 73, 0.12)",
    transition: { duration: 0.3, type: "spring", stiffness: 200, damping: 15 }
  }
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.25,
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -30,  rotate: -5, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 15 }
  }
};

const queryItemHover = {
  scale: 1.05, 
  rotateY: 5,
  originX: 0,
  transition: { type: "spring", stiffness: 300, damping: 10}
}

function SynthesizeButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow duration-300 group"
      asChild
    >
      <motion.button
        whileHover={{ scale: 1.05, y:-2, boxShadow: "0px 5px 15px rgba(var(--accent-hsl), 0.3)"}}
        whileTap={{ scale: 0.95, y:1, boxShadow: "0px 2px 8px rgba(var(--accent-hsl), 0.2)" }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Brain className="mr-2 h-4 w-4 text-accent group-hover:scale-125 group-hover:text-primary-foreground transition-all duration-300" />
          )}
        Synthesize Research
      </motion.button>
    </Button>
  );
}

export default function FormulatedQueries({ queries, onResearchSynthesized, isBusy }: FormulatedQueriesProps) {
  const [state, formAction, isPending] = React.useActionState(handleSynthesizeResearchAction, initialSynthesizeState);
  const { toast } = useToast();

  React.useEffect(() => {
     if (state.message) {
      if (state.success && state.researchSummary) {
        toast({ title: "Synthesis Complete!", description: state.message, variant: 'default' });
        onResearchSynthesized(state.researchSummary);
      } else if (!state.success) {
        toast({ title: "Synthesis Error", description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast, onResearchSynthesized]);

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{ transformStyle: "preserve-3d" }}
    >
      <Card className="w-full shadow-xl border-2 border-transparent hover:border-accent/50 transition-all duration-300 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-bl from-primary to-primary/90 p-6">
          <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay:0.1, duration:0.4}}>
            <CardTitle className="text-xl text-primary-foreground">Targeted Search Queries</CardTitle>
          </motion.div>
           <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay:0.2, duration:0.4}}>
            <CardDescription className="text-primary-foreground/80">ScholarAI has generated these queries to guide the research. Click "Synthesize Research" to proceed.</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="p-6 bg-card">
          <motion.div 
            className="space-y-3"
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {queries.map((query, index) => (
              <motion.div 
                key={index} 
                className="flex items-start space-x-3 p-3 bg-secondary/50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-default"
                variants={listItemVariants}
                whileHover={queryItemHover}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Search className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <Badge 
                  variant="outline" 
                  className="text-sm py-1.5 px-3 whitespace-normal break-words border-primary/30 text-foreground/90 bg-transparent leading-relaxed"
                >
                  {query}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-end p-6 pt-4 bg-card">
          <motion.form 
            action={formAction}
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{delay: queries.length * 0.1 + 0.3, duration:0.5}} // Delay based on number of items
          >
            <input type="hidden" name="queries" value={JSON.stringify(queries)} />
            <SynthesizeButton />
          </motion.form>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
