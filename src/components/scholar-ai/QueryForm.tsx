// src/components/scholar-ai/QueryForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom'; // Changed import
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { handleFormulateQueryAction, type FormulateQueryActionState } from '@/app/actions';
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface QueryFormProps {
  onQueriesFormulated: (queries: string[], question: string) => void; // Added question to align with page.tsx
  isBusy: boolean; // To disable form if parent is busy with next step
}

const initialState: FormulateQueryActionState = {
  success: false,
  message: '',
  formulatedQueries: null,
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
    rotateY: 2, 
    boxShadow: "0px 15px 35px rgba(0, 48, 73, 0.15)", // #003049 with alpha
    transition: { duration: 0.3, type: "spring", stiffness: 250, damping: 20 }
  }
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto mt-1 shadow-md hover:shadow-lg transition-shadow duration-300 group">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4 text-accent group-hover:scale-110 transition-transform duration-300" />
      )}
      Formulate Queries
    </Button>
  );
}

export default function QueryForm({ onQueriesFormulated, isBusy }: QueryFormProps) {
  const [state, formAction, isPending] = useActionState(handleFormulateQueryAction, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [currentQuestion, setCurrentQuestion] = React.useState('');


  useEffect(() => {
    if (state.message) { 
      if (state.success && state.formulatedQueries) {
        toast({ title: "Success!", description: state.message, variant: 'default' });
        onQueriesFormulated(state.formulatedQueries, currentQuestion); // Pass currentQuestion
      } else if (!state.success) {
        let description = state.message;
        if (state.errors?.researchQuestion) {
          description += ` ${state.errors.researchQuestion.join(' ')}`;
        }
        toast({ title: "Oops!", description, variant: 'destructive' });
      }
    }
  }, [state, toast, onQueriesFormulated, currentQuestion]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const question = formData.get('researchQuestion') as string;
    setCurrentQuestion(question);
    // formAction will be called by the form's action attribute
  };


  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <Card className="w-full shadow-xl border-2 border-transparent hover:border-accent/50 transition-all duration-300 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary to-primary/90 p-6">
          <CardTitle className="text-2xl text-primary-foreground">Start Your Research Journey</CardTitle>
          <CardDescription className="text-primary-foreground/80">Enter your complex research question. ScholarAI will intelligently break it down into effective search queries.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-card">
          <form 
            action={formAction} 
            ref={formRef} 
            className="space-y-6"
            onSubmit={handleFormSubmit} // Added onSubmit
          >
            <div>
              <Label htmlFor="researchQuestion" className="block text-sm font-medium mb-2 text-foreground/90">
                Your Research Question
              </Label>
              <Textarea
                id="researchQuestion"
                name="researchQuestion"
                rows={5}
                placeholder="e.g., What are the long-term psychological effects of remote work on employee well-being and productivity, and what strategies can organizations implement to mitigate negative impacts?"
                className="w-full border-input focus:border-accent focus:ring-accent transition-colors duration-300 rounded-md shadow-sm"
                required
                minLength={10}
                maxLength={500}
                disabled={isBusy || isPending} 
              />
              {state.errors?.researchQuestion && (
                <motion.p 
                  initial={{opacity:0, y: -10}}
                  animate={{opacity:1, y:0}}
                  className="mt-2 text-sm text-destructive font-medium"
                >
                  {state.errors.researchQuestion.join(' ')}
                </motion.p>
              )}
            </div>
            <CardFooter className="flex justify-end p-0 pt-4">
              <SubmitButton />
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
