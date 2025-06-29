
// src/components/scholar-ai/QueryForm.tsx
'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Lightbulb, Brain, Wand2, Lock } from 'lucide-react'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export interface QueryFormProps {
  formAction: (payload: FormData) => void; 
  isBusy: boolean; 
  isDisabled?: boolean; 
  value: string; 
  onChange: (value: string) => void; 
}

function SubmitButtonQueryForm({ isDisabled }: { isDisabled?: boolean }) {
  const { t } = useTranslation();
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || isDisabled}
      className="w-full sm:w-auto mt-2 sm:mt-4 text-sm sm:text-base py-2.5 sm:py-3.5 px-6 sm:px-8 shadow-xl hover:shadow-primary/50 bg-gradient-to-br from-primary via-primary/85 to-primary/70 text-primary-foreground rounded-lg sm:rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 ease-out group"
      aria-label="Formulate Queries and Begin Exploration"
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 sm:mr-2.5 sm:h-5 sm:w-5 animate-spin" />
      ) : isDisabled ? (
        <Lock className="mr-2 h-4 w-4 sm:mr-2.5 sm:h-5 sm:w-5" />
      ) : (
        <Send className="mr-2 h-4 w-4 sm:mr-2.5 sm:h-5 sm:w-5 group-hover:animate-pulse transition-transform duration-200" />
      )}
      {isDisabled ? t('queryForm.buttonLabelAuth') : t('queryForm.buttonLabel')}
    </Button>
  );
}

function QueryFormInner({ isBusy, isDisabled, value, onChange }: QueryFormProps) {
  const { t, i18n } = useTranslation();
  const { pending } = useFormStatus();
  const actualIsDisabled = isBusy || isDisabled;

  return (
    <>
      <input type="hidden" name="language" value={i18n.language} />
      <div className="relative">
        <Textarea
          id="researchQuestion"
          name="researchQuestion"
          rows={6}
          placeholder={actualIsDisabled && !isBusy ? t('queryForm.placeholderAuth') : t('queryForm.placeholder')}
          className={cn(
            "w-full border-input focus:border-accent focus:ring-2 focus:ring-accent/60 rounded-lg sm:rounded-xl shadow-inner text-sm sm:text-base bg-background/80 placeholder:text-muted-foreground/70 p-3 sm:p-4 transition-all duration-200 leading-relaxed",
            "hover:border-primary/60 focus:shadow-accent/25 focus:shadow-lg",
            actualIsDisabled && "opacity-60 cursor-not-allowed bg-muted/30 placeholder:text-destructive/70",
            pending && "opacity-50"
          )}
          required
          minLength={10}
          maxLength={1500}
          disabled={actualIsDisabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby="question-error-message"
        />
      </div>
      <CardFooter className={cn("flex flex-col sm:flex-row justify-end items-center p-0 pt-2 sm:pt-3 space-y-2 sm:space-y-0 sm:space-x-3", pending && "opacity-50")}>
        <SubmitButtonQueryForm isDisabled={actualIsDisabled && !isBusy} />
      </CardFooter>
    </>
  );
}


const QueryForm = React.memo(function QueryForm({ formAction, isBusy, isDisabled, value, onChange }: QueryFormProps) {
  const { t } = useTranslation();
  const actualIsDisabled = isBusy || isDisabled;

  return (
    <div
      className="w-full"
    >
      <Card className="w-full shadow-2xl border-primary/30 rounded-xl sm:rounded-2xl overflow-hidden bg-card">
        <CardHeader className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-primary/15 via-transparent to-primary/5 border-b border-primary/25">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div
              className="p-3 sm:p-4 bg-gradient-to-br from-accent to-accent/80 rounded-xl sm:rounded-2xl shadow-xl border-2 border-accent/50 text-accent-foreground ring-2 ring-accent/30 ring-offset-2 ring-offset-card"
            >
              <Brain className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                {t('queryForm.title')}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-1.5 max-w-lg">
                {actualIsDisabled && !isBusy ? t('queryForm.descriptionAuth') : t('queryForm.description')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-5 sm:pt-6 relative">
          <form
            action={actualIsDisabled ? undefined : formAction}
            onSubmit={(e) => { if (actualIsDisabled) e.preventDefault(); }}
            className="space-y-4 sm:space-y-6"
          >
            <QueryFormInner formAction={formAction} isBusy={isBusy} isDisabled={isDisabled} value={value} onChange={onChange} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
});
QueryForm.displayName = 'QueryForm';
export default QueryForm;
