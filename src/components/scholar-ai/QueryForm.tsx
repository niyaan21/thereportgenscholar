// src/components/scholar-ai/QueryForm.tsx
'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { handleFormulateQueryAction, type FormulateQueryActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Lightbulb, SearchCheck, Brain } from 'lucide-react'; // Changed Rocket to Send
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface QueryFormProps {
  onQueriesFormulated: (queries: string[], question: string) => void;
  isBusy: boolean;
  setIsBusy: (isBusy: boolean) => void;
}

const initialState: FormulateQueryActionState = {
  success: false,
  message: '',
  formulatedQueries: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto mt-2 text-lg py-3 px-8 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-primary-foreground active:scale-95 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Formulate Queries"
    >
        {pending ? (
          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
        ) : (
          <Send className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        )}
        Formulate Queries
    </Button>
  );
}

export default function QueryForm({ onQueriesFormulated, isBusy, setIsBusy }: QueryFormProps) {
  const [state, formAction] = useFormState(handleFormulateQueryAction, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [currentQuestion, setCurrentQuestion] = React.useState('');

  React.useEffect(() => {
    if (state.message) {
      setIsBusy(false);
      if (state.success && state.formulatedQueries) {
        toast({ title: "🚀 AI Engine Ignited!", description: state.message, variant: 'default', duration: 5000 });
        onQueriesFormulated(state.formulatedQueries, currentQuestion);
        if (formRef.current) {
          formRef.current.reset();
          setCurrentQuestion('');
        }
      } else if (!state.success) {
        let description = state.message;
        if (state.errors?.researchQuestion) {
          description += ` ${state.errors.researchQuestion.join(' ')}`;
        }
        toast({ title: "🚦 Engine Stalled!", description, variant: 'destructive', duration: 7000 });
      }
    }
  }, [state, toast, onQueriesFormulated, currentQuestion, setIsBusy]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const question = formData.get('researchQuestion') as string;
    setCurrentQuestion(question);
    setIsBusy(true); // Set busy state on submit
    // formAction will be called by the form's action attribute
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full shadow-xl border-2 border-primary/10 rounded-xl overflow-hidden bg-card transform hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="p-6 sm:p-8 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-t-lg">
           <div className="flex items-start sm:items-center space-x-4">
             <div className="p-3 bg-accent/10 rounded-full">
                <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-accent drop-shadow-sm"/>
             </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                Initiate Your Inquiry
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base mt-1 leading-relaxed">
                Pose your complex research question. ScholarAI will deconstruct it into actionable search vectors.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form
            action={formAction}
            ref={formRef}
            className="space-y-6"
            onSubmit={handleFormSubmit}
          >
            <div className="relative group/textarea">
              <Label htmlFor="researchQuestion" className="block text-md sm:text-lg font-semibold mb-2.5 text-foreground flex items-center">
                <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 mr-2.5 text-yellow-400"/>
                Your Core Research Postulate
              </Label>
              <Textarea
                id="researchQuestion"
                name="researchQuestion"
                rows={7}
                placeholder="e.g., Analyze the impact of renewable energy adoption on global carbon emissions and economic growth in developing nations over the past decade..."
                className="w-full border-input focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all duration-200 rounded-lg shadow-sm text-base bg-background/80 placeholder:text-muted-foreground/70 p-4 focus:shadow-inner"
                required
                minLength={10}
                maxLength={1000}
                disabled={isBusy}
                aria-describedby="question-error"
                aria-live="polite"
              />
              <div className="absolute -bottom-2 -right-2 opacity-0 group-hover/textarea:opacity-100 group-focus-within/textarea:opacity-100 transition-opacity duration-300">
                <SearchCheck className="h-10 w-10 text-accent/20 -rotate-12" />
              </div>
              {state.errors?.researchQuestion && (
                <p
                  id="question-error"
                  className="mt-2.5 text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md border border-destructive/30 shadow-sm"
                  role="alert"
                >
                  {state.errors.researchQuestion.join(' ')}
                </p>
              )}
            </div>
            <CardFooter className="flex justify-end p-0 pt-2">
              <div className="w-full sm:w-auto">
                 <SubmitButton />
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
