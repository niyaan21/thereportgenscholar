// src/components/scholar-ai/QueryForm.tsx
'use client';

import React from 'react';
import { useActionState } from 'react'; 
import { useFormStatus } from 'react-dom'; 
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { handleFormulateQueryAction, type FormulateQueryActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Rocket, Lightbulb, SearchCheck, Brain } from 'lucide-react';
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto mt-4 text-lg py-3 px-8 shadow-md hover:shadow-lg transition-shadow duration-300 group bg-accent hover:bg-accent/90 text-accent-foreground active:scale-95 rounded-lg"
      aria-label="Formulate Queries"
    >
        {pending ? (
          <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary-foreground" /> 
        ) : (
          <Rocket className="mr-3 h-6 w-6 text-primary-foreground group-hover:scale-110 transition-transform duration-300" /> 
        )}
        Ignite Research Engine
    </Button>
  );
}

export default function QueryForm({ onQueriesFormulated, isBusy: parentIsBusy }: QueryFormProps) {
  const [state, formAction, formIsPending] = useActionState(handleFormulateQueryAction, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [currentQuestion, setCurrentQuestion] = React.useState('');

  const isEffectivelyBusy = parentIsBusy || formIsPending;


  React.useEffect(() => {
    if (state.message) {
      if (state.success && state.formulatedQueries) {
        toast({ title: "🚀 AI Engine Ignited!", description: state.message, variant: 'default', duration: 7000 }); 
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
        toast({ title: "🚦 Engine Stalled!", description, variant: 'destructive', duration: 9000 }); 
      }
    }
  }, [state, toast, onQueriesFormulated, currentQuestion]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const question = formData.get('researchQuestion') as string;
    setCurrentQuestion(question);
  };


  return (
    <div>
      <Card className="w-full shadow-lg border border-primary/10 rounded-xl overflow-hidden bg-card"> 
        <CardHeader className="bg-primary/5 p-6"> 
           <div className="flex items-center space-x-3 mb-2"> 
             <Brain className="h-10 w-10 text-accent"/> 
            <CardTitle className="text-3xl font-semibold text-primary tracking-tight">
              Initiate Inquiry
            </CardTitle>
          </div>
          <div>
            <CardDescription className="text-muted-foreground text-base leading-relaxed">
              Input your complex research question. ScholarAI will meticulously deconstruct it into precise, actionable search vectors, catalyzing your discovery process.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6"> 
          <form
            action={formAction}
            ref={formRef}
            className="space-y-8" 
            onSubmit={handleFormSubmit}
          >
            <div className="relative group/textarea">
              <Label htmlFor="researchQuestion" className="block text-lg font-semibold mb-3 text-foreground flex items-center"> 
                <Lightbulb className="h-6 w-6 mr-2 text-yellow-400"/>
                Your Core Research Postulate
              </Label>
              <Textarea
                id="researchQuestion"
                name="researchQuestion"
                rows={6} 
                placeholder="e.g., Evaluate the efficacy of novel CRISPR-Cas9 gene-editing techniques in mitigating neurodegenerative disorders, focusing on off-target effects and long-term therapeutic viability..."
                className="w-full border-input focus:border-accent focus:ring-2 focus:ring-accent/40 transition-all duration-300 rounded-lg shadow-sm text-base bg-background placeholder:text-muted-foreground/60 p-4" 
                required
                minLength={10}
                maxLength={1000} 
                disabled={isEffectivelyBusy}
                aria-describedby="question-error"
              />
              <div className="absolute -bottom-3 -right-3 opacity-0 group-hover/textarea:opacity-100 group-focus-within/textarea:opacity-100 transition-opacity duration-300">
                <SearchCheck className="h-12 w-12 text-accent/20 -rotate-12" /> 
              </div>
              {state.errors?.researchQuestion && (
                <p
                  id="question-error"
                  className="mt-3 text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md border border-destructive/20 shadow-sm" 
                >
                  {state.errors.researchQuestion.join(' ')}
                </p>
              )}
            </div>
            <CardFooter className="flex justify-end p-0 pt-4"> 
              <div className="w-full sm:w-auto">
                 <SubmitButton />
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
