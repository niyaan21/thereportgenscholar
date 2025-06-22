
// src/app/notes/page.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import NextLink from 'next/link';
import { useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { handleTranscribeAndAnalyzeAction, type TranscribeAndAnalyzeActionState } from '@/app/actions';
import { Mic, MicOff, Loader2, AlertCircle, Info, Save, Trash2, Play, Square, Edit2, XCircle, Speaker, UploadCloud, Wand2, AudioLines, FileText, Activity, Brain, MessageSquare, Check, Tag } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getVoiceNotes, addVoiceNote, deleteVoiceNote, updateVoiceNote, type VoiceNote } from '@/lib/voiceNotesService';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

// For SpeechRecognition type hinting
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const initialTranscriptionState: TranscribeAndAnalyzeActionState = {
  success: false,
  message: '',
  analysisResult: null,
  errors: null,
};

const TranscriptionResultDisplay = ({ result }: { result: NonNullable<TranscribeAndAnalyzeActionState['analysisResult']> }) => {
  const sentimentColor = {
    Positive: 'text-green-500 bg-green-500/10 border-green-500/20',
    Negative: 'text-red-500 bg-red-500/10 border-red-500/20',
    Neutral: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
    Mixed: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  };

  return (
    <Card className="mt-8 shadow-xl border-accent/20">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Transcription &amp; Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary & Sentiment */}
        <div className="p-4 bg-secondary/30 rounded-lg">
          <h3 className="font-semibold text-lg mb-2 flex items-center"><MessageSquare className="h-5 w-5 mr-2 text-accent" /> Summary</h3>
          <p className="text-foreground/80">{result.summary}</p>
          <Badge className={cn("mt-3", sentimentColor[result.sentiment])}>{result.sentiment} Sentiment</Badge>
        </div>

        {/* Key Themes */}
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center"><Brain className="h-5 w-5 mr-2 text-accent" /> Key Themes</h3>
          <div className="flex flex-wrap gap-2">
            {result.keyThemes.map((theme, i) => (
              <Badge key={i} variant="outline"><Tag className="h-3 w-3 mr-1"/>{theme}</Badge>
            ))}
          </div>
        </div>

        {/* Action Items */}
        {result.actionItems && result.actionItems.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center"><Activity className="h-5 w-5 mr-2 text-accent" /> Action Items</h3>
            <ul className="list-disc pl-5 space-y-1">
              {result.actionItems.map((item, i) => <li key={i} className="text-foreground/80">{item}</li>)}
            </ul>
          </div>
        )}

        {/* Full Transcription */}
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center"><FileText className="h-5 w-5 mr-2 text-accent" /> Full Transcription</h3>
          <ScrollArea className="h-64 bg-background/50 border rounded-md p-3">
            <p className="whitespace-pre-wrap text-sm text-foreground/90">{result.transcription}</p>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};


export default function NotesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const { toast } = useToast();

  // Transcription State
  const [transcriptionState, formAction, isProcessing] = useActionState(handleTranscribeAndAnalyzeAction, initialTranscriptionState);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Voice Notes State
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [currentNoteContent, setCurrentNoteContent] = useState('');
  const [savedNotes, setSavedNotes] = useState<VoiceNote[]>([]);
  const [editingNote, setEditingNote] = useState<VoiceNote | null>(null);
  const [apiSupported, setApiSupported] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Auth Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
      if (user) {
        setSavedNotes(getVoiceNotes());
      }
    });

    if (typeof window !== 'undefined' && !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setApiSupported(false);
    }
    return () => unsubscribe();
  }, []);

  // Transcription Effects
  useEffect(() => {
    if (!isProcessing && transcriptionState.message) {
      if (transcriptionState.success) {
        toast({
          title: 'Analysis Complete!',
          description: transcriptionState.message,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Analysis Failed',
          description: transcriptionState.message,
          variant: 'destructive',
        });
      }
    }
  }, [transcriptionState, isProcessing, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
  };


  // --- Voice Notes Logic ---
  const setupRecognition = useCallback(() => {
    if (!apiSupported || !currentUser) return;
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) { setApiSupported(false); return; }
    
    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let localInterim = '';
      let localFinal = finalTranscript;
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          localFinal += event.results[i][0].transcript + ' ';
        } else {
          localInterim += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(localInterim);
      setFinalTranscript(localFinal);
      setCurrentNoteContent(localFinal + localInterim);
    };

    recognition.onerror = (event) => {
      let errorMsg = `Speech recognition error: ${event.error}.`;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMsg = "Microphone access denied. Please allow microphone access in your browser settings.";
        setPermissionError(errorMsg);
      }
      toast({ title: 'Recording Error', description: errorMsg, variant: 'destructive' });
      setIsRecording(false);
    };
  }, [apiSupported, finalTranscript, currentUser, toast]);

  const toggleRecording = () => {
    if (!currentUser || !apiSupported) {
      toast({ title: "Cannot Record", description: !currentUser ? "Please log in first." : "Speech recognition not supported.", variant: "destructive" });
      return;
    }
    if (permissionError) {
       toast({ title: "Microphone Access Denied", description: permissionError, variant: "destructive" });
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (!recognitionRef.current) setupRecognition();
      if (recognitionRef.current) {
        setFinalTranscript(currentNoteContent);
        recognitionRef.current.start();
        setIsRecording(true);
        setPermissionError(null);
        toast({ title: '🎙️ Recording Started', variant: 'default' });
      }
    }
  };

  const handleSaveNote = () => {
    if (!currentUser) return;
    if (currentNoteContent.trim() === '') {
      toast({ title: 'Cannot Save Empty Note', variant: 'destructive' });
      return;
    }
    if (editingNote) {
      setSavedNotes(updateVoiceNote({ ...editingNote, content: currentNoteContent }));
      toast({ title: 'Note Updated', variant: 'default' });
      setEditingNote(null);
    } else {
      addVoiceNote(currentNoteContent);
      setSavedNotes(getVoiceNotes());
      toast({ title: 'Note Saved', variant: 'default' });
    }
    setCurrentNoteContent('');
    setFinalTranscript('');
    setInterimTranscript('');
  };

  const handleDeleteNote = (id: string) => {
    setSavedNotes(deleteVoiceNote(id));
    if (editingNote?.id === id) {
      setEditingNote(null);
      setCurrentNoteContent('');
      setFinalTranscript('');
    }
    toast({ title: 'Note Deleted', variant: 'default' });
  };
  
  const handleEditNote = (note: VoiceNote) => {
    if (isRecording) {
      toast({ title: 'Stop Recording First', variant: 'default' });
      return;
    }
    setEditingNote(note);
    setCurrentNoteContent(note.content);
    setFinalTranscript(note.content);
    setInterimTranscript('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingNote(null);
    setCurrentNoteContent('');
    setFinalTranscript('');
    setInterimTranscript('');
  };

  // --- Render Logic ---
  if (!authChecked) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 px-4 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Authentication Required</AlertTitle>
          <AlertDescription>
            Please{' '}
            <NextLink href="/login" className="font-medium hover:underline">log in</NextLink> or {' '}
            <NextLink href="/signup" className="font-medium hover:underline">sign up</NextLink>{' '}
            to use the Notes &amp; Transcription features.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Transcription Section */}
      <section>
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            Interview Transcription &amp; Analysis
          </h1>
          <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload audio/video to get a full transcription and AI-powered insights.
          </p>
        </header>

        <Card className="w-full max-w-2xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
          <form action={formAction}>
            <CardHeader className="p-6">
              <CardTitle className="text-2xl flex items-center"><UploadCloud className="mr-3 h-7 w-7 text-accent"/>Upload &amp; Guide</CardTitle>
              <CardDescription>Supported: .mp3, .wav, .mp4, .mov (Max 50MB).</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="file" className="text-base">Audio/Video File</Label>
                <Input id="file" name="file" type="file" ref={fileInputRef} required disabled={isProcessing} onChange={handleFileChange} accept="audio/*,video/*" />
                {transcriptionState.errors?.file && <p className="text-sm text-destructive mt-1">{transcriptionState.errors.file.join(', ')}</p>}
              </div>
              <div>
                <Label htmlFor="analysisGuidance" className="text-base">Analysis Guidance (Optional)</Label>
                <Textarea id="analysisGuidance" name="analysisGuidance" placeholder="e.g., Identify key themes, sentiment shifts..." rows={3} disabled={isProcessing} />
                {transcriptionState.errors?.analysisGuidance && <p className="text-sm text-destructive mt-1">{transcriptionState.errors.analysisGuidance.join(', ')}</p>}
              </div>
            </CardContent>
            <CardFooter className="p-6 bg-secondary/20 border-t">
              <Button type="submit" className="w-full sm:w-auto ml-auto" disabled={isProcessing}>
                {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                {isProcessing ? 'Processing...' : 'Transcribe &amp; Analyze'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        {transcriptionState.success && transcriptionState.analysisResult && <TranscriptionResultDisplay result={transcriptionState.analysisResult} />}
      </section>

      <Separator />

      {/* Voice Notes Section */}
      <section>
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            Voice-to-Text Research Notes
          </h1>
          <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Capture your thoughts on the go. Edit, save, and manage your voice notes.
          </p>
        </header>
        
        {!apiSupported ? (
            <Alert variant="destructive" className="max-w-md mx-auto">
                <XCircle className="h-5 w-5" />
                <AlertTitle className="font-semibold">Browser Not Supported</AlertTitle>
                <AlertDescription>The Speech Recognition API is not supported by your browser. Please try Chrome, Edge, or Safari.</AlertDescription>
            </Alert>
        ) : (
        <Card className="w-full max-w-2xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl flex items-center">
              {isRecording ? <MicOff className="mr-3 h-7 w-7 text-destructive"/> : <Mic className="mr-3 h-7 w-7 text-accent" />}
              {editingNote ? "Edit Note" : "Record New Note"}
            </CardTitle>
            <CardDescription>{isRecording ? "Recording in progress..." : "Click to start recording."}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {permissionError && !isRecording && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Microphone Access Denied</AlertTitle><AlertDescription>{permissionError}</AlertDescription></Alert>}
            <div className="flex items-center gap-4">
              <Button onClick={toggleRecording} size="lg" className={cn(isRecording && "bg-destructive")}>
                {isRecording ? <Square className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                {isRecording ? 'Stop' : 'Record'}
              </Button>
              {isRecording && <span className="text-sm text-muted-foreground flex items-center"><Speaker className="h-4 w-4 mr-1.5 animate-pulse text-destructive"/>Listening...</span>}
            </div>
            {interimTranscript && <p className="text-sm text-muted-foreground italic">Live: {interimTranscript}</p>}
            <div>
              <Label htmlFor="noteContent" className="text-base">Note Content</Label>
              <Textarea id="noteContent" placeholder="Your transcription will appear here..." rows={8} value={currentNoteContent} onChange={(e) => setCurrentNoteContent(e.target.value)} disabled={isRecording}/>
            </div>
          </CardContent>
          <CardFooter className="p-6 bg-secondary/20 border-t flex justify-end gap-3">
            {editingNote && <Button variant="outline" onClick={handleCancelEdit}>Cancel Edit</Button>}
            <Button onClick={handleSaveNote} disabled={!currentNoteContent.trim() || isRecording}>
              <Save className="mr-2 h-5 w-5" /> {editingNote ? 'Update Note' : 'Save Note'}
            </Button>
          </CardFooter>
        </Card>
        )}

        {savedNotes.length > 0 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Your Saved Voice Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedNotes.map(note => (
                <Card key={note.id} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg truncate">{note.title}</CardTitle>
                    <CardDescription>Saved: {new Date(note.date).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent><p className="line-clamp-3 text-sm">{note.content}</p></CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditNote(note)}><Edit2 className="mr-1 h-4 w-4"/>Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="mr-1 h-4 w-4"/>Delete</Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete "{note.title}".</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
