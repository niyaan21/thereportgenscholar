// src/components/scholar-ai/QueryForm.tsx
'use client';

import React, { useRef } from 'react'; // Removed useActionState here, will be used in page.tsx
import { useFormStatus } from 'react-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { handleFormulateQueryAction, type FormulateQueryActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Lightbulb, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface QueryFormProps {
  onQueriesFormulated: (queries: string[], question: string) => void;
  isBusy: boolean; 
  setIsBusy: (isBusy: boolean) => void;
  // Removed initialFormulateQueryActionState, action, and pendingFormulation as they are managed in page.tsx
}

export const initialFormulateQueryActionState: FormulateQueryActionState = {
  success: false,
  message: '',
  formulatedQueries: null,
  errors: null,
};

function SubmitButtonQueryForm() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto mt-4 text-base py-3.5 px-10 shadow-lg hover:shadow-primary/40 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 ease-out group hover:scale-105 active:scale-95 transform hover:-translate-y-0.5"
      aria-label="Formulate Queries and Begin Exploration"
    >
      {pending ? (
        <Loader2 className="mr-2.5 h-5 w-5 animate-spin" />
      ) : (
        <Send className="mr-2.5 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
      )}
      Explore Insights
    </Button>
  );
}

export default function QueryForm({ onQueriesFormulated, isBusy, setIsBusy }: QueryFormProps) {
  // The useActionState for handleFormulateQueryAction is now in page.tsx
  // We receive isBusy and setIsBusy as props.
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [currentQuestion, setCurrentQuestion] = React.useState('');

  // This local formAction is for the form submission itself.
  // The actual server action call and state management (state, formAction from useActionState) 
  // will be handled by the form's action prop, passed from page.tsx.
  const localFormAction = async (formData: FormData) => {
    setIsBusy(true);
    const question = formData.get('researchQuestion') as string;
    setCurrentQuestion(question); // Keep track of the current question for onQueriesFormulated

    // Call the server action via the form's native action.
    // The result (state) will be handled in page.tsx's useEffect.
    // We don't directly call `formAction(formData)` here if it's passed via props
    // and intended to be used in the form's `action` attribute.
    // If `handleFormulateQueryAction` is directly imported and called here, then
    // `setIsBusy(false)` and `onQueriesFormulated` would be called based on its result.
    // For now, assuming the `action` prop on the form handles the server call.
    // page.tsx will handle the response.

    // Simulating the call for now, this needs to align with how page.tsx wires it up
    const actionState = await handleFormulateQueryAction(initialFormulateQueryActionState, formData);
    
    setIsBusy(false);
    if (actionState.success && actionState.formulatedQueries) {
        toast({ title: "🚀 AI Engine Ignited!", description: actionState.message, variant: 'default', duration: 5000 });
        onQueriesFormulated(actionState.formulatedQueries, question); // Use 'question' from formData
        if (formRef.current) {
          formRef.current.reset();
          setCurrentQuestion('');
        }
      } else if (!actionState.success) {
        let description = actionState.message;
        if (actionState.errors?.researchQuestion) {
          description += ` ${actionState.errors.researchQuestion.join(' ')}`;
        }
        toast({ title: "🚦 Engine Stalled!", description, variant: 'destructive', duration: 7000 });
      }
  };

  return (
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "circOut", delay: 0.1 }}
      >
        <Card className="w-full shadow-2xl card-glow-border border-primary/25 rounded-2xl overflow-hidden bg-card transform hover:shadow-primary/20 transition-all duration-400">
          <CardHeader className="p-7 md:p-8 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 border-b border-primary/20">
             <div className="flex items-center space-x-4 md:space-x-5">
               <div className="p-4 bg-gradient-to-br from-accent to-accent/70 rounded-2xl shadow-xl border-2 border-accent/50 text-accent-foreground">
                  <Brain className="h-8 w-8 md:h-9 md:w-9"/>
               </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                  Launch Your Exploration
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base mt-1.5 max-w-lg">
                  Articulate your research challenge. ScholarAI will map the knowledge frontier for you.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-7 md:p-8 pt-6">
            <form
              action={localFormAction} // Use localFormAction or pass formAction from page.tsx
              ref={formRef}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="researchQuestion" className="block text-lg font-semibold mb-2.5 text-foreground flex items-center">
                  <Lightbulb className="h-5 w-5 mr-3 text-yellow-500 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"/>
                  Your Core Research Question
                </Label>
                <Textarea
                  id="researchQuestion"
                  name="researchQuestion"
                  rows={7}
                  placeholder="e.g., Explore the multifaceted impacts of generative AI on the future of creative professions, considering ethical dilemmas, economic shifts, and the evolution of human-AI collaboration..."
                  className={cn(
                    "w-full border-input focus:border-accent focus:ring-2 focus:ring-accent/50 rounded-xl shadow-inner text-base bg-background/70 placeholder:text-muted-foreground/60 p-4 transition-all duration-200 text-lg",
                    "hover:border-primary/50 focus:shadow-accent/20 focus:shadow-lg",
                    isBusy && "opacity-70 cursor-not-allowed"
                  )}
                  required
                  minLength={10}
                  maxLength={1500} 
                  disabled={isBusy}
                  aria-describedby="question-error"
                  onChange={(e) => setCurrentQuestion(e.target.value)} // Keep currentQuestion state updated
                  value={currentQuestion} // Controlled component
                />
                {/* Error display will be handled by page.tsx's state.errors, or locally if action is local */}
              </div>
              <CardFooter className="flex flex-col sm:flex-row justify-end items-center p-0 pt-3 space-y-3 sm:space-y-0 sm:space-x-3">
                <SubmitButtonQueryForm />
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </motion.div>
  );
}
