// src/components/scholar-ai/FormulatedQueries.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom'; // Changed import
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { handleSynthesizeResearchAction, type SynthesizeResearchActionState } from '@/app/actions';
import React, { useEffect } from 'react';
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
    boxShadow: "0px 8px 25px rgba(0, 48, 73, 0.1)", // #003049 with alpha
    transition: { duration: 0.4, type: "tween", ease: "circOut" }
  },
  hover: {
    scale: 1.03,
    rotateY: -2, // Rotate in opposite direction for variation
    boxShadow: "0px 15px 35px rgba(0, 48, 73, 0.15)", // #003049 with alpha
    transition: { duration: 0.3, type: "spring", stiffness: 250, damping: 20 }
  }
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -25,  rotate: -3 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

function SynthesizeButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow duration-300 group">
      {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Brain className="mr-2 h-4 w-4 text-accent group-hover:scale-110 transition-transform duration-300" />
        )}
      Synthesize Research
    </Button>
  );
}

export default function FormulatedQueries({ queries, onResearchSynthesized, isBusy }: FormulatedQueriesProps) {
  const [state, formAction, isPending] = useActionState(handleSynthesizeResearchAction, initialSynthesizeState);
  const { toast } = useToast();

  useEffect(() => {
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
    >
      <Card className="w-full shadow-xl border-2 border-transparent hover:border-accent/50 transition-all duration-300 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-bl from-primary to-primary/90 p-6">
          <CardTitle className="text-xl text-primary-foreground">Targeted Search Queries</CardTitle>
          <CardDescription className="text-primary-foreground/80">ScholarAI has generated these queries to guide the research. Click "Synthesize Research" to proceed.</CardDescription>
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
                className="flex items-start space-x-3 p-3 bg-secondary/50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                variants={listItemVariants}
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
          <form action={formAction}>
            <input type="hidden" name="queries" value={JSON.stringify(queries)} />
            <SynthesizeButton />
          </form>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
