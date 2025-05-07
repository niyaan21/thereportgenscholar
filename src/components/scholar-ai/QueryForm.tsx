// src/components/scholar-ai/QueryForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { handleFormulateQueryAction, type FormulateQueryActionState } from '@/app/actions';
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QueryFormProps {
  onQueriesFormulated: (queries: string[]) => void;
  isBusy: boolean; // To disable form if parent is busy with next step
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
    <Button type="submit" disabled={pending} className="w-full sm:w-auto mt-1">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Formulate Queries
    </Button>
  );
}

export default function QueryForm({ onQueriesFormulated, isBusy }: QueryFormProps) {
  const [state, formAction] = useFormState(handleFormulateQueryAction, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) { // Only show toast if there's a message
      if (state.success && state.formulatedQueries) {
        toast({ title: "Success", description: state.message, variant: 'default' });
        onQueriesFormulated(state.formulatedQueries);
        // Optionally reset form, or let parent component hide it
        // formRef.current?.reset(); // Resetting form here
      } else if (!state.success) {
        // Combine field errors with general message if available
        let description = state.message;
        if (state.errors?.researchQuestion) {
          description += ` ${state.errors.researchQuestion.join(' ')}`;
        }
        toast({ title: "Error", description, variant: 'destructive' });
      }
    }
  }, [state, toast, onQueriesFormulated]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Start Your Research</CardTitle>
        <CardDescription>Enter your complex research question below. ScholarAI will break it down into effective search queries.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} ref={formRef} className="space-y-6">
          <div>
            <Label htmlFor="researchQuestion" className="block text-sm font-medium mb-1">
              Your Research Question
            </Label>
            <Textarea
              id="researchQuestion"
              name="researchQuestion"
              rows={4}
              placeholder="e.g., What are the long-term psychological effects of remote work on employee well-being and productivity, and what strategies can organizations implement to mitigate negative impacts?"
              className="w-full"
              required
              minLength={10}
              maxLength={500}
              disabled={isBusy}
            />
            {state.errors?.researchQuestion && (
              <p className="mt-2 text-sm text-destructive">
                {state.errors.researchQuestion.join(' ')}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
