// src/components/scholar-ai/FormulatedQueries.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
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
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Formulated Search Queries</CardTitle>
        <CardDescription>ScholarAI has generated these queries to guide the research. Click "Synthesize Research" to proceed.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {queries.map((query, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="text-sm py-1 px-3">{query}</Badge>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <form action={formAction}>
          {/* Hidden input to pass queries if needed by backend, though current mock doesn't use it */}
          <input type="hidden" name="queries" value={JSON.stringify(queries)} />
          <SynthesizeButton />
        </form>
      </CardFooter>
    </Card>
  );
}
