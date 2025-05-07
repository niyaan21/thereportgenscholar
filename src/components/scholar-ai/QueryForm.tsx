// src/components/scholar-ai/QueryForm.tsx
'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { handleFormulateQueryAction, type FormulateQueryActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface QueryFormProps {
  onQueriesFormulated: (queries: string[], question: string) => void; 
  isBusy: boolean; 
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
    rotateX: 0,
    rotateY: 0,
    boxShadow: "0px 8px 25px rgba(0, 48, 73, 0.08)", 
    transition: { duration: 0.4, type: "tween", ease: "circOut" }
  },
  hover: {
    scale: 1.03,
    rotateX: 2,
    rotateY: 4,
    boxShadow: "0px 20px 40px rgba(0, 48, 73, 0.12)", 
    transition: { duration: 0.3, type: "spring", stiffness: 200, damping: 15 }
  }
};

const formElementVariants = {
  initial: { opacity: 0, y: 20, filter: "blur(5px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: "easeOut" } },
};

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } },
};


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full sm:w-auto mt-1 shadow-md hover:shadow-lg transition-shadow duration-300 group"
      asChild
    >
      <motion.button
        whileHover={{ scale: 1.05, y:-2, boxShadow: "0px 5px 15px rgba(var(--accent-hsl), 0.3)" }}
        whileTap={{ scale: 0.95, y:1, boxShadow: "0px 2px 8px rgba(var(--accent-hsl), 0.2)"}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4 text-accent group-hover:scale-125 group-hover:rotate-[360deg] transition-all duration-500" />
        )}
        Formulate Queries
      </motion.button>
    </Button>
  );
}

export default function QueryForm({ onQueriesFormulated, isBusy }: QueryFormProps) {
  const [state, formAction, isPending] = React.useActionState(handleFormulateQueryAction, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [currentQuestion, setCurrentQuestion] = React.useState('');


  React.useEffect(() => {
    if (state.message) { 
      if (state.success && state.formulatedQueries) {
        toast({ title: "Success!", description: state.message, variant: 'default' });
        onQueriesFormulated(state.formulatedQueries, currentQuestion); 
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
    // formAction can be called directly if not using it in form.action
    // However, for this pattern, it's usually passed to form.action
  };


  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{ transformStyle: "preserve-3d" }}
    >
      <Card className="w-full shadow-xl border-2 border-transparent hover:border-accent/50 transition-all duration-300 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary to-primary/90 p-6">
          <motion.div variants={formElementVariants}>
            <CardTitle className="text-2xl text-primary-foreground">Start Your Research Journey</CardTitle>
          </motion.div>
          <motion.div variants={formElementVariants}>
            <CardDescription className="text-primary-foreground/80">Enter your complex research question. ScholarAI will intelligently break it down into effective search queries.</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="p-6 bg-card">
          <motion.form 
            action={formAction} 
            ref={formRef} 
            className="space-y-6"
            onSubmit={(e) => {
              // Prevent default if submitting manually or add custom logic before action
              // e.preventDefault(); // Uncomment if you want to stop default form submission and call formAction manually
              const formData = new FormData(e.currentTarget);
              const question = formData.get('researchQuestion') as string;
              setCurrentQuestion(question);
              // formAction will be called by the form's native submission process
              // If you were to call it manually: formAction(formData);
            }}
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={formElementVariants}>
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
                  initial={{opacity:0, y: -10, height:0}}
                  animate={{opacity:1, y:0, height:'auto'}}
                  exit={{opacity:0, y:-10, height:0}}
                  className="mt-2 text-sm text-destructive font-medium"
                >
                  {state.errors.researchQuestion.join(' ')}
                </motion.p>
              )}
            </motion.div>
            <CardFooter className="flex justify-end p-0 pt-4">
              <motion.div variants={formElementVariants} className="w-full sm:w-auto">
                 <SubmitButton />
              </motion.div>
            </CardFooter>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

