
// src/app/mindmap/page.tsx
'use client';

import React, { useState, useEffect } from 'react'; 
import { useActionState } from 'react';
import NextLink from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { handleExtractMindmapConceptsAction, type ExtractMindmapConceptsActionState } from '@/app/actions';
import type { ExtractMindmapConceptsOutput } from '@/ai/flows/extract-mindmap-concepts';
import { BrainCircuit, Loader2, AlertCircle, Info, Sparkles, Lightbulb, Share2, CircleDot, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import type { Metadata } from 'next';

// export const metadata: Metadata = { // Cannot be used in client component
//   title: 'Mind Map Concept Extractor - Foss AI',
//   description: 'Input text to extract key concepts and structure ideas for mind mapping with Foss AI.',
// };

const initialMindmapState: ExtractMindmapConceptsActionState = {
  success: false,
  message: '',
  extractedData: null,
  errors: null,
};

export default function MindmapPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [mindmapState, formAction, isExtracting] = useActionState(handleExtractMindmapConceptsAction, initialMindmapState);
  const [textToAnalyze, setTextToAnalyze] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isExtracting && mindmapState.message) {
      if (mindmapState.success && mindmapState.extractedData) {
        toast({
          title: '🧠 Concepts Extracted!',
          description: mindmapState.message,
          variant: 'default',
          duration: 5000,
        });
        // Optionally scroll to results or clear textarea
        // setTextToAnalyze(''); 
      } else if (!mindmapState.success) {
        let description = mindmapState.message;
        if (mindmapState.errors?.textToAnalyze) {
          description += ` ${mindmapState.errors.textToAnalyze.join(' ')}`;
        }
        toast({
          title: '⚠️ Extraction Failed',
          description,
          variant: 'destructive',
          duration: 7000,
        });
      }
    }
  }, [mindmapState, isExtracting, toast]);

  const isFormDisabled = (!currentUser && authChecked) || isExtracting;

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 sm:mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Mind Map Concept Extractor
        </h1>
        <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Paste your text below, and Foss AI will identify the main idea and key concepts to kickstart your mind map.
        </p>
      </header>

      {!authChecked && (
         <Card className="w-full max-w-2xl mx-auto mb-8 shadow-lg animate-pulse">
            <CardHeader><div className="h-8 w-3/4 bg-muted/50 rounded"></div></CardHeader>
            <CardContent className="space-y-4">
                <div className="h-6 w-1/4 bg-muted/50 rounded"></div>
                <div className="h-40 w-full bg-muted/50 rounded-md"></div>
            </CardContent>
            <CardFooter><div className="h-12 w-48 bg-muted/50 rounded-lg ml-auto"></div></CardFooter>
        </Card>
      )}

      {authChecked && !currentUser && (
        <Alert variant="destructive" className="max-w-2xl mx-auto mb-8 bg-destructive/10 border-destructive/30 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Authentication Required</AlertTitle>
          <AlertDescription>
            Please{' '}
            <NextLink href="/login" className="font-medium hover:underline underline-offset-2">
              log in
            </NextLink>{' '}
            or{' '}
            <NextLink href="/signup" className="font-medium hover:underline underline-offset-2">
              sign up
            </NextLink>{' '}
            to use the Mind Map Concept Extractor.
          </AlertDescription>
        </Alert>
      )}

      {authChecked && currentUser && (
        <Card className="w-full max-w-2xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
          <form action={formAction}>
            <CardHeader className="p-6 bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
              <CardTitle className="text-2xl font-semibold text-primary flex items-center">
                <Lightbulb className="mr-3 h-7 w-7 text-accent" />
                Input Your Text
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Provide a body of text (50 - 10,000 characters) for analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="textToAnalyze" className="text-base">Text for Concept Extraction</Label>
                <Textarea
                  id="textToAnalyze"
                  name="textToAnalyze"
                  placeholder="Paste your article abstract, notes, or any block of text here..."
                  rows={10}
                  required
                  minLength={50}
                  maxLength={10000}
                  disabled={isFormDisabled}
                  value={textToAnalyze}
                  onChange={(e) => setTextToAnalyze(e.target.value)}
                  className="text-base leading-relaxed"
                />
                {mindmapState.errors?.textToAnalyze && (
                  <p className="text-xs text-destructive flex items-center mt-1">
                    <AlertCircle className="mr-1 h-3 w-3" /> {mindmapState.errors.textToAnalyze.join(', ')}
                  </p>
                )}
              </div>
               <Alert variant="default" className="bg-secondary/30 dark:bg-secondary/10 border-border/50 text-foreground/80">
                    <Info className="h-5 w-5 text-accent"/>
                    <AlertTitle className="font-medium text-primary/90">How it Works</AlertTitle>
                    <AlertDescription className="text-xs">
                        The AI will analyze your text to identify a central theme and break down key concepts with associated terms. This provides a structured starting point for building a detailed mind map.
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter className="p-6 bg-secondary/20 dark:bg-secondary/10 border-t">
              <Button type="submit" className="w-full sm:w-auto ml-auto text-base py-3" disabled={isFormDisabled}>
                {isExtracting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <BrainCircuit className="mr-2 h-5 w-5" />
                )}
                {isExtracting ? 'Extracting Concepts...' : 'Extract Concepts'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {mindmapState.success && mindmapState.extractedData && (
        <Card className="w-full max-w-2xl mx-auto mt-8 sm:mt-10 shadow-2xl border-accent/30 rounded-xl overflow-hidden">
          <CardHeader className="p-6 bg-gradient-to-br from-accent/15 via-transparent to-accent/5">
            <CardTitle className="text-2xl font-semibold text-primary flex items-center">
              <Sparkles className="mr-3 h-7 w-7 text-accent" />
              Extracted Mindmap Structure
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Here are the key ideas and concepts identified from your text.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                <CircleDot className="mr-2.5 h-5 w-5 text-accent/80"/> Main Idea / Central Theme
              </h3>
              <p className="text-base text-foreground/90 bg-secondary/40 dark:bg-secondary/20 p-3 rounded-md shadow-sm border border-border/60">
                {mindmapState.extractedData.mainIdea}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                <Share2 className="mr-2.5 h-5 w-5 text-accent/80"/> Key Concepts & Related Terms
              </h3>
              {mindmapState.extractedData.keyConcepts.length > 0 ? (
                <div className="space-y-4">
                  {mindmapState.extractedData.keyConcepts.map((conceptObj, index) => (
                    <div key={index} className="p-4 bg-card rounded-lg border border-border/70 shadow-md hover:shadow-lg transition-shadow">
                      <h4 className="text-md font-semibold text-accent-foreground mb-2.5 flex items-center">
                         <ChevronRight className="mr-1.5 h-5 w-5 text-accent/70"/> {conceptObj.concept}
                      </h4>
                      {conceptObj.relatedTerms.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {conceptObj.relatedTerms.map((term, termIndex) => (
                            <Badge key={termIndex} variant="outline" className="text-xs bg-secondary/50 border-secondary text-secondary-foreground hover:bg-secondary/70">
                              {term}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No specific related terms identified for this concept.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No specific key concepts were extracted.</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-6 bg-secondary/20 dark:bg-secondary/10 border-t">
             <p className="text-xs text-muted-foreground text-center w-full">
                Use these extracted concepts as a foundation to build out your visual mind map using your preferred tool.
              </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
