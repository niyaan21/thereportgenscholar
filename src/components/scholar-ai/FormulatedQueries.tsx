// src/components/scholar-ai/FormulatedQueries.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { handleSynthesizeResearchAction, type SynthesizeResearchActionState } from '@/app/actions';
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';
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
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.08)",
    transition: { duration: 0.3, type: "tween", ease: "easeOut" }
  },
  hover: {
    scale: 1.03,
    rotateY: 1.5, 
    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.12)",
    transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 15 }
  }
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 120 }
  }
};

function SynthesizeButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Synthesize Research
    </Button>
  );
}

export default function FormulatedQueries({ queries, onResearchSynthesized, isBusy }: FormulatedQueriesProps) {
  const [state, formAction] = useFormState(handleSynthesizeResearchAction, initialSynthesizeState);
  const { toast } = useToast();

  useEffect(() => {
     if (state.message) {
      if (state.success && state.researchSummary) {
        toast({ title: "Success", description: state.message, variant: 'default' });
        onResearchSynthesized(state.researchSummary);
      } else if (!state.success) {
        toast({ title: "Error", description: state.message, variant: 'destructive' });
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
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Formulated Search Queries</CardTitle>
          <CardDescription>ScholarAI has generated these queries to guide the research. Click "Synthesize Research" to proceed.</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-3"
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {queries.map((query, index) => (
              <motion.div 
                key={index} 
                className="flex items-center space-x-2"
                variants={listItemVariants}
              >
                <Search className="h-5 w-5 text-primary flex-shrink-0" />
                <Badge variant="secondary" className="text-sm py-1 px-3 whitespace-normal break-all">{query}</Badge>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4">
          <form action={formAction}>
            <input type="hidden" name="queries" value={JSON.stringify(queries)} />
            <SynthesizeButton />
          </form>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
