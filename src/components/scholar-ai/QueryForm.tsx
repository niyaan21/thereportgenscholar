// src/components/scholar-ai/QueryForm.tsx
'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
// handleFormulateQueryAction and FormulateQueryActionState are managed by parent
import { Loader2, Send, Lightbulb, Brain, Wand2 } from 'lucide-react'; // Changed BrainWave to Brain
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface QueryFormProps {
  formAction: (payload: FormData) => void; // Passed from parent's useActionState
  isBusy: boolean; // Directly from parent's useActionState isPending
  value: string; // For controlled Textarea
  onChange: (value: string) => void; // For controlled Textarea
  // errors: { researchQuestion?: string[] } | null; // To display validation errors from parent state
}

// This initial state is now defined and managed in the parent (page.tsx)
// export const initialFormulateQueryActionState: FormulateQueryActionState = {
//   success: false,
//   message: '',
//   formulatedQueries: null,
//   originalQuestion: '',
//   errors: null,
// };

function SubmitButtonQueryForm() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto mt-4 text-base py-3.5 px-8 shadow-xl hover:shadow-primary/50 bg-gradient-to-br from-primary via-primary/85 to-primary/70 text-primary-foreground rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 ease-out group hover:scale-[1.03] active:scale-[0.97] transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-offset-background"
      aria-label="Formulate Queries and Begin Exploration"
    >
      {pending ? (
        <Loader2 className="mr-2.5 h-5 w-5 animate-spin" />
      ) : (
        <Wand2 className="mr-2.5 h-5 w-5 group-hover:animate-pulse transition-transform duration-200" />
      )}
      Explore Insights
    </Button>
  );
}

export default function QueryForm({ formAction, isBusy, value, onChange }: QueryFormProps) {
  // No internal useActionState or toast logic here. Parent (page.tsx) handles it.
  // const formRef = React.useRef<HTMLFormElement>(null); // Keep if direct form reset is ever needed, but controlled input is better.

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // setIsBusy(true) is implicitly handled by parent's isFormulatingQueries (passed as isBusy prop)
    // The form's `action` prop will call the `formAction` from the parent.
  };

  return (
    <div className="w-full">
      <Card className="w-full shadow-2xl card-glow-border border-primary/30 rounded-2xl overflow-hidden bg-card transform hover:shadow-primary/25 transition-all duration-400 ease-out">
        <CardHeader className="p-7 md:p-8 bg-gradient-to-br from-primary/15 via-transparent to-primary/5 border-b border-primary/25">
           <div className="flex items-center space-x-4 md:space-x-5">
             <div className="p-4 bg-gradient-to-br from-accent to-accent/80 rounded-2xl shadow-xl border-2 border-accent/50 text-accent-foreground ring-2 ring-accent/30 ring-offset-2 ring-offset-card">
                <Brain className="h-8 w-8 md:h-9 md:w-9"/> {/* Changed BrainWave to Brain */}
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
            action={formAction} // Use formAction from parent
            onSubmit={handleFormSubmit} // Optional: if any client-side logic needed before parent's action
            className="space-y-6"
          >
            <div>
              <Label htmlFor="researchQuestion" className="block text-lg font-semibold mb-3 text-foreground flex items-center">
                <Lightbulb className="h-5 w-5 mr-3 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]"/>
                Your Core Research Question
              </Label>
              <Textarea
                id="researchQuestion"
                name="researchQuestion" // Name attribute is crucial for FormData
                rows={7}
                placeholder="e.g., Explore the multifaceted impacts of generative AI on the future of creative professions, considering ethical dilemmas, economic shifts, and the evolution of human-AI collaboration..."
                className={cn(
                  "w-full border-input focus:border-accent focus:ring-2 focus:ring-accent/60 rounded-xl shadow-inner text-base bg-background/80 placeholder:text-muted-foreground/70 p-4 transition-all duration-200 text-lg leading-relaxed",
                  "hover:border-primary/60 focus:shadow-accent/25 focus:shadow-lg",
                  isBusy && "opacity-60 cursor-not-allowed bg-muted/30"
                )}
                required
                minLength={10}
                maxLength={1500}
                disabled={isBusy}
                value={value} // Controlled component
                onChange={(e) => onChange(e.target.value)} // Controlled component
                aria-describedby="question-error-message" // For potential error display linked by parent
              />
              {/* Error display can be passed as a prop if needed, e.g., props.errors?.researchQuestion */}
              {/* <p id="question-error-message" className="text-sm text-destructive mt-1">{props.errors?.researchQuestion?.join(', ')}</p> */}
            </div>
            <CardFooter className="flex flex-col sm:flex-row justify-end items-center p-0 pt-3 space-y-3 sm:space-y-0 sm:space-x-3">
              <SubmitButtonQueryForm />
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
