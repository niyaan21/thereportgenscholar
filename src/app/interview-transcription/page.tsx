
// src/app/interview-transcription/page.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import NextLink from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AudioLines, Loader2, AlertCircle, Lock, Info, UploadCloud, Wand2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
// import type { Metadata } from 'next'; // For page metadata - uncomment if making server component

// export const metadata: Metadata = {
//   title: 'Interview Transcription - Foss AI',
//   description: 'Upload audio/video files for automated transcription and AI-powered analysis using Foss AI.',
// };

export default function InterviewTranscriptionPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analysisGuidance, setAnalysisGuidance] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to use this feature.',
        variant: 'destructive',
      });
      return;
    }
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    toast({
      title: 'Feature Coming Soon!',
      description: 'Interview transcription and analysis is under development. Thank you for your interest!',
      variant: 'default',
      duration: 5000,
    });
    // Reset form
    setFileName(null);
    setAnalysisGuidance('');
    const form = document.getElementById('transcriptionForm') as HTMLFormElement;
    form?.reset();
  };

  const isFormDisabled = (!currentUser && authChecked) || isProcessing;

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 sm:mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Interview Transcription & Analysis
        </h1>
        <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your audio/video interviews for automated transcription and AI-powered insights.
        </p>
      </header>

      {!authChecked && (
        <Card className="w-full max-w-xl mx-auto mb-8 shadow-lg animate-pulse">
          <CardHeader><div className="h-8 w-3/4 bg-muted/50 rounded"></div></CardHeader>
          <CardContent className="space-y-4">
            <div className="h-6 w-1/4 bg-muted/50 rounded"></div>
            <div className="h-10 w-full bg-muted/50 rounded-md"></div>
            <div className="h-6 w-1/4 bg-muted/50 rounded mt-2"></div>
            <div className="h-24 w-full bg-muted/50 rounded-md"></div>
          </CardContent>
          <CardFooter><div className="h-12 w-36 bg-muted/50 rounded-lg ml-auto"></div></CardFooter>
        </Card>
      )}

      {authChecked && !currentUser && (
        <Alert variant="destructive" className="max-w-xl mx-auto mb-8 bg-destructive/10 border-destructive/30 text-destructive">
          <Lock className="h-5 w-5" />
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
            to use this feature.
          </AlertDescription>
        </Alert>
      )}

      {authChecked && currentUser && (
        <Card className="w-full max-w-xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
          <form id="transcriptionForm" onSubmit={handleSubmit}>
            <CardHeader className="p-6 bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
              <CardTitle className="text-2xl font-semibold text-primary flex items-center">
                <AudioLines className="mr-3 h-7 w-7 text-accent" />
                Upload Your Interview File
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Supported formats: .mp3, .wav, .mp4, .mov (Max file size: 50MB - Placeholder limit).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="interviewFile" className="text-base">Audio/Video File</Label>
                <Input
                  id="interviewFile"
                  name="interviewFile"
                  type="file"
                  required
                  onChange={handleFileChange}
                  disabled={isFormDisabled}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-70"
                  accept=".mp3,.wav,.mp4,.mov" // Basic common audio/video types
                />
                {fileName && <p className="text-sm text-muted-foreground mt-1">Selected: {fileName}</p>}
                {/* Placeholder for file errors */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="analysisGuidance" className="text-base">Analysis Guidance (Optional)</Label>
                <Textarea
                  id="analysisGuidance"
                  name="analysisGuidance"
                  placeholder="e.g., Identify key themes, sentiment shifts, or specific topics mentioned..."
                  rows={4}
                  disabled={isFormDisabled}
                  value={analysisGuidance}
                  onChange={(e) => setAnalysisGuidance(e.target.value)}
                  className="text-base"
                />
              </div>
              <Alert variant="default" className="bg-secondary/30 dark:bg-secondary/10 border-border/50 text-foreground/80">
                <Info className="h-5 w-5 text-accent"/>
                <AlertTitle className="font-medium text-primary/90">Feature Under Development</AlertTitle>
                <AlertDescription className="text-xs">
                  The interview transcription and analysis feature is currently being built. Actual file processing and AI analysis are not yet implemented. This UI is for demonstration purposes.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="p-6 bg-secondary/20 dark:bg-secondary/10 border-t">
              <Button type="submit" className="w-full sm:w-auto ml-auto text-base py-3" disabled={isFormDisabled}>
                {isProcessing ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-5 w-5" />
                )}
                {isProcessing ? 'Processing...' : 'Transcribe & Analyze (Coming Soon)'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
