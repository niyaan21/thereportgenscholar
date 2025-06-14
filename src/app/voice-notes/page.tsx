
// src/app/voice-notes/page.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import NextLink from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Mic, MicOff, Loader2, AlertCircle, Info, Save, Trash2, Play, Square, Edit2, XCircle, Speaker } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getVoiceNotes, addVoiceNote, deleteVoiceNote, updateVoiceNote, type VoiceNote } from '@/lib/voiceNotesService';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// For SpeechRecognition type hinting
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function VoiceNotesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const { toast } = useToast();

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

    // Check for SpeechRecognition API support
    if (typeof window !== 'undefined' && !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setApiSupported(false);
    }
    return () => unsubscribe();
  }, []);

  const setupRecognition = useCallback(() => {
    if (!apiSupported || !currentUser) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setApiSupported(false);
      return;
    }
    
    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Make this configurable later

    recognition.onresult = (event) => {
      let localInterimTranscript = '';
      let localFinalTranscript = finalTranscript; // Preserve existing final transcript

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          localFinalTranscript += event.results[i][0].transcript + ' ';
        } else {
          localInterimTranscript += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(localInterimTranscript);
      setFinalTranscript(localFinalTranscript); // Update with new final parts
      setCurrentNoteContent(localFinalTranscript + localInterimTranscript); // Combine for textarea
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      let errorMsg = `Speech recognition error: ${event.error}.`;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMsg = "Microphone access denied. Please allow microphone access in your browser settings.";
        setPermissionError(errorMsg);
      } else if (event.error === 'no-speech') {
        errorMsg = "No speech detected. Please try speaking louder or closer to the microphone.";
      }
      toast({ title: 'Recording Error', description: errorMsg, variant: 'destructive' });
      setIsRecording(false);
    };

    recognition.onend = () => {
        // This might be called when stop() is called, or if continuous is false.
        // If continuous is true and we manually stop, this is fine.
        // If it ends unexpectedly, we might want to auto-restart or inform the user.
        if (isRecording) { // If it ended while we thought we were recording
            // console.log("Recognition ended unexpectedly, trying to restart if still in recording state.");
            // Potentially try to restart, or just set isRecording to false
            // For now, just ensure state is consistent.
            // setIsRecording(false); // This might conflict if stop button was just pressed.
        }
    };
  }, [apiSupported, finalTranscript, isRecording, toast, currentUser]);


  const toggleRecording = () => {
    if (!currentUser) {
      toast({ title: "Authentication Required", description: "Please log in to use voice notes.", variant: "destructive" });
      return;
    }
    if (!apiSupported) {
      toast({ title: "Browser Not Supported", description: "Speech recognition is not supported by your browser.", variant: "destructive" });
      return;
    }
     if (permissionError) {
      toast({ title: "Microphone Access Denied", description: permissionError, variant: "destructive" });
      return;
    }


    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      // The final transcript is already being accumulated.
      // setCurrentNoteContent can be set to finalTranscript after stopping if desired.
      setCurrentNoteContent(finalTranscript + interimTranscript); // Ensure textarea gets the latest
      setInterimTranscript(''); // Clear interim after stopping
    } else {
      if (!recognitionRef.current) {
        setupRecognition(); // Setup if not already done
      }
      if (recognitionRef.current) {
          setFinalTranscript(currentNoteContent); // Start with existing content if any
          setInterimTranscript('');
          recognitionRef.current.start();
          setIsRecording(true);
          setPermissionError(null);
          toast({ title: '🎙️ Recording Started', description: 'Speak into your microphone.', variant: 'default' });
      } else {
          toast({ title: 'Initialization Error', description: 'Could not initialize speech recognition.', variant: 'destructive' });
      }
    }
  };

  const handleSaveNote = () => {
    if (!currentUser) return;
    if (currentNoteContent.trim() === '') {
      toast({ title: 'Cannot Save Empty Note', description: 'Please record or type some content.', variant: 'destructive' });
      return;
    }
    if (editingNote) {
      const updated = updateVoiceNote({ ...editingNote, content: currentNoteContent });
      setSavedNotes(updated);
      toast({ title: 'Note Updated', description: 'Your voice note has been updated.', variant: 'default' });
      setEditingNote(null);
    } else {
      addVoiceNote(currentNoteContent);
      setSavedNotes(getVoiceNotes()); // Refresh list
      toast({ title: 'Note Saved', description: 'Your voice note has been saved locally.', variant: 'default' });
    }
    setCurrentNoteContent('');
    setFinalTranscript(''); // Clear transcript after saving
    setInterimTranscript('');
  };

  const handleDeleteNote = (id: string) => {
    if (!currentUser) return;
    const updatedNotes = deleteVoiceNote(id);
    setSavedNotes(updatedNotes);
    if (editingNote?.id === id) {
        setEditingNote(null);
        setCurrentNoteContent('');
        setFinalTranscript('');
    }
    toast({ title: 'Note Deleted', description: 'The voice note has been removed.', variant: 'default' });
  };
  
  const handleEditNote = (note: VoiceNote) => {
      if (isRecording) {
        toast({ title: 'Stop Recording First', description: 'Please stop the current recording before editing a note.', variant: 'default' });
        return;
    }
    setEditingNote(note);
    setCurrentNoteContent(note.content);
    setFinalTranscript(note.content); // So recording can append if started
    setInterimTranscript('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setCurrentNoteContent('');
    setFinalTranscript('');
    setInterimTranscript('');
  }

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
        <Alert variant="destructive" className="max-w-md mx-auto bg-destructive/10 border-destructive/30 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Authentication Required</AlertTitle>
          <AlertDescription>
            Please{' '}
            <NextLink href="/login" className="font-medium hover:underline">log in</NextLink> or {' '}
            <NextLink href="/signup" className="font-medium hover:underline">sign up</NextLink>{' '}
            to use Voice Notes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!apiSupported) {
     return (
      <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 px-4 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <XCircle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Browser Not Supported</AlertTitle>
          <AlertDescription>
            We're sorry, but the Speech Recognition API is not supported by your current browser.
            Please try using a modern browser like Chrome, Edge, or Safari (on macOS/iOS).
          </AlertDescription>
        </Alert>
      </div>
    );
  }


  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 sm:mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Voice-to-Text Research Notes
        </h1>
        <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Capture your thoughts and research ideas on the go. Edit, save, and manage your voice notes.
        </p>
      </header>

      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="p-6 bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
          <CardTitle className="text-2xl font-semibold text-primary flex items-center">
            {isRecording ? <MicOff className="mr-3 h-7 w-7 text-destructive" /> : <Mic className="mr-3 h-7 w-7 text-accent" />}
            {editingNote ? "Edit Note" : "Record New Note"}
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            {isRecording ? "Recording in progress... Click to stop." : (editingNote ? "Modify your transcribed note below." : "Click the button to start recording your voice.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          {permissionError && !isRecording && (
             <Alert variant="destructive" className="bg-destructive/10">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Microphone Access Denied</AlertTitle>
                <AlertDescription>
                  {permissionError} Please check your browser's site settings for microphone permissions.
                </AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button onClick={toggleRecording} size="lg" className={cn("w-full sm:w-auto text-base py-3", isRecording ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90")}>
              {isRecording ? <Square className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
             {isRecording && <span className="text-sm text-muted-foreground flex items-center"><Speaker className="h-4 w-4 mr-1.5 animate-pulse text-destructive"/>Listening...</span>}
          </div>
          
           {interimTranscript && isRecording && (
            <div className="p-3 bg-secondary/30 dark:bg-secondary/10 rounded-md border border-dashed border-border/50">
              <Label htmlFor="interimTranscript" className="text-xs font-medium text-muted-foreground">Live Transcript:</Label>
              <p id="interimTranscript" className="text-sm text-foreground/70 italic min-h-[20px]">{interimTranscript}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="noteContent" className="text-base">{editingNote ? "Edit Your Note Content:" : "Your Transcribed Note:"}</Label>
            <Textarea
              id="noteContent"
              placeholder={isRecording ? "Your live transcription will appear here as you speak..." : "Your finalized transcription will appear here. You can also type directly."}
              rows={8}
              value={currentNoteContent}
              onChange={(e) => setCurrentNoteContent(e.target.value)}
              className="text-base leading-relaxed"
              disabled={isRecording && interimTranscript.length > 0} // Disable if actively receiving interim results
            />
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-secondary/20 dark:bg-secondary/10 border-t flex flex-col sm:flex-row justify-end gap-3">
          {editingNote && (
            <Button variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto">
              Cancel Edit
            </Button>
          )}
          <Button onClick={handleSaveNote} className="w-full sm:w-auto" disabled={currentNoteContent.trim() === '' || isRecording}>
            <Save className="mr-2 h-5 w-5" /> {editingNote ? 'Update Note' : 'Save Note'}
          </Button>
        </CardFooter>
      </Card>

      {savedNotes.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Your Saved Voice Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedNotes.map(note => (
              <Card key={note.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-primary truncate" title={note.title}>{note.title}</CardTitle>
                  <CardDescription className="text-xs">
                    Saved on: {new Date(note.date).toLocaleDateString()} at {new Date(note.date).toLocaleTimeString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 line-clamp-3" title={note.content}>
                    {note.content}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                   <Button variant="outline" size="sm" onClick={() => handleEditNote(note)} disabled={isRecording}>
                    <Edit2 className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={isRecording}>
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the note titled "{note.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>Yes, Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
       {savedNotes.length === 0 && authChecked && currentUser && !apiSupported && (
          <Alert className="max-w-xl mx-auto mt-8">
            <Info className="h-5 w-5" />
            <AlertTitle>No Saved Notes</AlertTitle>
            <AlertDescription>
              Once you record and save notes, they will appear here. This data is stored locally in your browser.
            </AlertDescription>
          </Alert>
      )}
    </div>
  );
}
