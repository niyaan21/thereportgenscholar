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
import { useTranslation } from 'react-i18next';

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

const TranscriptionResultDisplay = ({ result, onReset }: { result: NonNullable<TranscribeAndAnalyzeActionState['analysisResult']>, onReset: () => void }) => {
  const { t } = useTranslation();
  const sentimentColor = {
    Positive: 'text-green-500 bg-green-500/10 border-green-500/20',
    Negative: 'text-red-500 bg-red-500/10 border-red-500/20',
    Neutral: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
    Mixed: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  };

  return (
    <Card className="mt-8 shadow-xl border-accent/20 animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center justify-between">
            <span>{t('notes.resultsTitle')}</span>
            <Button variant="ghost" size="icon" onClick={onReset} className="text-muted-foreground hover:text-destructive">
                <XCircle className="h-5 w-5"/>
                <span className="sr-only">{t('notes.closeResults')}</span>
            </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-secondary/30 rounded-lg">
          <h3 className="font-semibold text-lg mb-2 flex items-center"><MessageSquare className="h-5 w-5 mr-2 text-accent" />{t('notes.summary')}</h3>
          <p className="text-foreground/80">{result.summary}</p>
          <Badge className={cn("mt-3", sentimentColor[result.sentiment])}>{t('notes.sentiment', { sentiment: result.sentiment })}</Badge>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center"><Brain className="h-5 w-5 mr-2 text-accent" />{t('notes.keyThemes')}</h3>
          <div className="flex flex-wrap gap-2">
            {result.keyThemes.map((theme, i) => (
              <Badge key={i} variant="outline"><Tag className="h-3 w-3 mr-1"/>{theme}</Badge>
            ))}
          </div>
        </div>

        {result.actionItems && result.actionItems.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center"><Activity className="h-5 w-5 mr-2 text-accent" />{t('notes.actionItems')}</h3>
            <ul className="list-disc pl-5 space-y-1">
              {result.actionItems.map((item, i) => <li key={i} className="text-foreground/80">{item}</li>)}
            </ul>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center"><FileText className="h-5 w-5 mr-2 text-accent" />{t('notes.fullTranscription')}</h3>
          <ScrollArea className="h-64 bg-background/50 border rounded-md p-3">
            <p className="whitespace-pre-wrap text-sm text-foreground/90">{result.transcription}</p>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};


export default function NotesPage() {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const { toast } = useToast();

  const [transcriptionState, formAction, isProcessing] = useActionState(handleTranscribeAndAnalyzeAction, initialTranscriptionState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [currentNoteContent, setCurrentNoteContent] = useState('');
  const [savedNotes, setSavedNotes] = useState<VoiceNote[]>([]);
  const [editingNote, setEditingNote] = useState<VoiceNote | null>(null);
  const [apiSupported, setApiSupported] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
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

  const resetTranscriptionForm = () => {
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    // This is a way to reset the action state. It's a bit of a workaround.
    formAction(new FormData());
  };

  useEffect(() => {
    if (!isProcessing && transcriptionState.message) {
      if (transcriptionState.success) {
        toast({
          title: t('notes.toastAnalysisSuccess'),
          description: transcriptionState.message,
          variant: 'default',
        });
      } else {
        toast({
          title: t('notes.toastAnalysisFail'),
          description: transcriptionState.message,
          variant: 'destructive',
        });
      }
    }
  }, [transcriptionState, isProcessing, toast, t]);

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
        errorMsg = t('notes.micDeniedDescription');
        setPermissionError(errorMsg);
      }
      toast({ title: t('notes.toastRecordingError'), description: errorMsg, variant: 'destructive' });
      setIsRecording(false);
    };
  }, [apiSupported, finalTranscript, currentUser, toast, t]);

  const toggleRecording = () => {
    if (!currentUser || !apiSupported) {
      toast({ title: t('notes.toastCannotRecord'), description: !currentUser ? t('notes.toastLoginFirst') : t('notes.toastUnsupported'), variant: "destructive" });
      return;
    }
    if (permissionError) {
       toast({ title: t('notes.toastMicDenied'), description: permissionError, variant: "destructive" });
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
        toast({ title: t('notes.toastRecordingStarted'), variant: 'default' });
      }
    }
  };

  const handleSaveNote = () => {
    if (!currentUser) return;
    if (currentNoteContent.trim() === '') {
      toast({ title: t('notes.toastEmptyNote'), variant: 'destructive' });
      return;
    }
    if (editingNote) {
      setSavedNotes(updateVoiceNote({ ...editingNote, content: currentNoteContent }));
      toast({ title: t('notes.toastNoteUpdated'), variant: 'default' });
      setEditingNote(null);
    } else {
      addVoiceNote(currentNoteContent);
      setSavedNotes(getVoiceNotes());
      toast({ title: t('notes.toastNoteSaved'), variant: 'default' });
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
    toast({ title: t('notes.buttonDelete'), variant: 'default' });
  };
  
  const handleEditNote = (note: VoiceNote) => {
    if (isRecording) {
      toast({ title: t('notes.toastStopRecording'), variant: 'default' });
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
          <AlertTitle className="font-semibold">{t('notes.authRequiredTitle')}</AlertTitle>
          <AlertDescription>
            {t('notes.authRequiredDescription', {
                loginLink: '',
                signupLink: '',
                // @ts-ignore
                components: {
                    loginLink: <NextLink href="/login" className="font-medium hover:underline" />,
                    signupLink: <NextLink href="/signup" className="font-medium hover:underline" />
                }
            })}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <section>
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            {t('notes.transcriptionTitle')}
          </h1>
          <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('notes.transcriptionDescription')}
          </p>
        </header>

        {transcriptionState.success && transcriptionState.analysisResult ? (
            <TranscriptionResultDisplay result={transcriptionState.analysisResult} onReset={resetTranscriptionForm} />
        ) : (
            <Card className="w-full max-w-2xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
                <form action={formAction}>
                    <CardHeader className="p-6">
                    <CardTitle className="text-2xl flex items-center"><UploadCloud className="mr-3 h-7 w-7 text-accent"/>{t('notes.uploadTitle')}</CardTitle>
                    <CardDescription>{t('notes.uploadDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                    <div>
                        <Label htmlFor="file" className="text-base">{t('notes.fileLabel')}</Label>
                        <Input id="file" name="file" type="file" ref={fileInputRef} required disabled={isProcessing} accept="audio/*,video/*" />
                        {transcriptionState.errors?.file && <p className="text-sm text-destructive mt-1">{transcriptionState.errors.file.join(', ')}</p>}
                    </div>
                    <div>
                        <Label htmlFor="analysisGuidance" className="text-base">{t('notes.guidanceLabel')}</Label>
                        <Textarea id="analysisGuidance" name="analysisGuidance" placeholder={t('notes.guidancePlaceholder')} rows={3} disabled={isProcessing} />
                        {transcriptionState.errors?.analysisGuidance && <p className="text-sm text-destructive mt-1">{transcriptionState.errors.analysisGuidance.join(', ')}</p>}
                    </div>
                    </CardContent>
                    <CardFooter className="p-6 bg-secondary/20 border-t">
                    <Button type="submit" className="w-full sm:w-auto ml-auto" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                        {isProcessing ? t('notes.buttonProcessing') : t('notes.buttonTranscribe')}
                    </Button>
                    </CardFooter>
                </form>
            </Card>
        )}
      </section>

      <Separator />

      <section>
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            {t('notes.voiceNotesTitle')}
          </h1>
          <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('notes.voiceNotesDescription')}
          </p>
        </header>
        
        {!apiSupported ? (
            <Alert variant="destructive" className="max-w-md mx-auto">
                <XCircle className="h-5 w-5" />
                <AlertTitle className="font-semibold">{t('notes.unsupportedBrowserTitle')}</AlertTitle>
                <AlertDescription>{t('notes.unsupportedBrowserDescription')}</AlertDescription>
            </Alert>
        ) : (
        <Card className="w-full max-w-2xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl flex items-center">
              {isRecording ? <MicOff className="mr-3 h-7 w-7 text-destructive"/> : <Mic className="mr-3 h-7 w-7 text-accent" />}
              {editingNote ? t('notes.editNote') : t('notes.recordNewNote')}
            </CardTitle>
            <CardDescription>{isRecording ? t('notes.recordingInProgress') : t('notes.startRecording')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {permissionError && !isRecording && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>{t('notes.micDeniedTitle')}</AlertTitle><AlertDescription>{permissionError}</AlertDescription></Alert>}
            <div className="flex items-center gap-4">
              <Button onClick={toggleRecording} size="lg" className={cn(isRecording && "bg-destructive")}>
                {isRecording ? <Square className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                {isRecording ? t('notes.buttonStop') : t('notes.buttonRecord')}
              </Button>
              {isRecording && <span className="text-sm text-muted-foreground flex items-center"><Speaker className="h-4 w-4 mr-1.5 animate-pulse text-destructive"/>{t('notes.listening')}</span>}
            </div>
            {interimTranscript && <p className="text-sm text-muted-foreground italic">{t('notes.liveTranscript', { transcript: interimTranscript })}</p>}
            <div>
              <Label htmlFor="noteContent" className="text-base">{t('notes.noteContentLabel')}</Label>
              <Textarea id="noteContent" placeholder={t('notes.noteContentPlaceholder')} rows={8} value={currentNoteContent} onChange={(e) => setCurrentNoteContent(e.target.value)} disabled={isRecording}/>
            </div>
          </CardContent>
          <CardFooter className="p-6 bg-secondary/20 border-t flex justify-end gap-3">
            {editingNote && <Button variant="outline" onClick={handleCancelEdit}>{t('notes.buttonCancelEdit')}</Button>}
            <Button onClick={handleSaveNote} disabled={!currentNoteContent.trim() || isRecording}>
              <Save className="mr-2 h-5 w-5" /> {editingNote ? t('notes.buttonUpdateNote') : t('notes.buttonSaveNote')}
            </Button>
          </CardFooter>
        </Card>
        )}

        {savedNotes.length > 0 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-primary mb-6 text-center">{t('notes.savedNotesTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedNotes.map(note => (
                <Card key={note.id} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg truncate">{note.title}</CardTitle>
                    <CardDescription>{t('notes.savedOn', { date: new Date(note.date).toLocaleDateString() })}</CardDescription>
                  </CardHeader>
                  <CardContent><p className="line-clamp-3 text-sm">{note.content}</p></CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditNote(note)}><Edit2 className="mr-1 h-4 w-4"/>{t('notes.buttonEdit')}</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="mr-1 h-4 w-4"/>{t('notes.buttonDelete')}</Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('notes.deleteDialogTitle')}</AlertDialogTitle>
                          <AlertDialogDescription>{t('notes.deleteDialogDescription', { title: note.title })}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('notes.deleteDialogCancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>{t('notes.deleteDialogConfirm')}</AlertDialogAction>
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
