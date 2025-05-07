// src/components/scholar-ai/QueryForm.tsx
'use client';

import React, { useActionState as useReactActionState } from 'react'; // Updated import
import { useFormStatus } from 'react-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { handleFormulateQueryAction, type FormulateQueryActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Lightbulb, SearchCheck, Brain, Sparkle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
      className="w-full sm:w-auto mt-2 text-base py-2.5 px-6 shadow-md hover:shadow-lg bg-primary text-primary-foreground rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Formulate Queries"
    >
      {pending ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      Formulate Queries
    </Button>
  );
}

export default function QueryForm({ onQueriesFormulated, isBusy, setIsBusy }: QueryFormProps) {
  const [state, formAction] = useReactActionState(handleFormulateQueryAction, initialState); // Updated to useReactActionState
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
    setIsBusy(true); 
    // formAction is called by the form's action attribute
  };


  return (
      <Card className="w-full shadow-lg border-primary/10 rounded-lg overflow-hidden bg-card">
        <CardHeader className="p-6 bg-primary/5 border-b border-primary/10">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-accent/10 rounded-full shadow-sm border border-accent/20">
                <Brain className="h-6 w-6 text-accent"/>
             </div>
            <div>
              <CardTitle className="text-xl font-semibold text-primary tracking-tight">
                Initiate Your Inquiry
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm mt-0.5">
                Pose your complex research question. ScholarAI will deconstruct it.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form
            action={formAction}
            ref={formRef}
            className="space-y-4"
            onSubmit={handleFormSubmit}
          >
            <div>
              <Label htmlFor="researchQuestion" className="block text-sm font-medium mb-1.5 text-foreground flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-yellow-500"/>
                Your Core Research Postulate
              </Label>
              <Textarea
                id="researchQuestion"
                name="researchQuestion"
                rows={5}
                placeholder="e.g., Analyze the impact of renewable energy adoption on global carbon emissions and economic growth in developing nations over the past decade..."
                className="w-full border-input focus:border-accent focus:ring-1 focus:ring-accent/50 rounded-md shadow-sm text-sm bg-background/70 placeholder:text-muted-foreground/60 p-3"
                required
                minLength={10}
                maxLength={1000}
                disabled={isBusy}
                aria-describedby="question-error"
              />
              {state.errors?.researchQuestion && (
                <p
                  id="question-error"
                  className="mt-1.5 text-xs text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/20"
                  role="alert"
                >
                  {state.errors.researchQuestion.join(' ')}
                </p>
              )}
            </div>
            <CardFooter className="flex justify-end p-0 pt-1">
              <SubmitButton />
            </CardFooter>
          </form>
        </CardContent>
      </Card>
  );
}

