
// src/lib/voiceNotesService.ts
'use client';

const STORAGE_KEY = 'fossAiVoiceNotes';
const MAX_NOTES = 50;

export interface VoiceNote {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string for the date
}

function generateTitle(content: string): string {
  if (!content) return "Untitled Note";
  const words = content.trim().split(/\s+/);
  const title = words.slice(0, 5).join(" ");
  return title.length > 30 ? title.substring(0, 27) + "..." : title || "Untitled Note";
}

export function getVoiceNotes(): VoiceNote[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedNotes = localStorage.getItem(STORAGE_KEY);
    if (storedNotes) {
      return JSON.parse(storedNotes) as VoiceNote[];
    }
  } catch (error) {
    console.error("Error reading voice notes from localStorage:", error);
  }
  return [];
}

export function addVoiceNote(content: string): VoiceNote {
  if (typeof window === 'undefined') {
    console.warn("Attempted to add voice note in non-browser environment.");
    return { id: Date.now().toString(), title: generateTitle(content), content, date: new Date().toISOString() };
  }

  const newNote: VoiceNote = {
    id: Date.now().toString(),
    title: generateTitle(content),
    content,
    date: new Date().toISOString(),
  };

  try {
    const currentNotes = getVoiceNotes();
    const updatedNotes = [newNote, ...currentNotes].slice(0, MAX_NOTES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (error) {
    console.error("Error saving voice note to localStorage:", error);
  }
  return newNote;
}

export function deleteVoiceNote(id: string): VoiceNote[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    let currentNotes = getVoiceNotes();
    currentNotes = currentNotes.filter(note => note.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentNotes));
    return currentNotes;
  } catch (error) {
    console.error("Error deleting voice note from localStorage:", error);
    return getVoiceNotes(); // Return original list on error
  }
}

export function updateVoiceNote(updatedNote: VoiceNote): VoiceNote[] {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        let currentNotes = getVoiceNotes();
        const noteIndex = currentNotes.findIndex(note => note.id === updatedNote.id);
        if (noteIndex > -1) {
            // Regenerate title if content changed significantly, or keep existing if minor edit
            const oldNote = currentNotes[noteIndex];
            const titleNeedsUpdate = oldNote.content.substring(0,30) !== updatedNote.content.substring(0,30);
            currentNotes[noteIndex] = {
                ...updatedNote,
                title: titleNeedsUpdate ? generateTitle(updatedNote.content) : oldNote.title,
                date: new Date().toISOString() // Update date on edit
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentNotes));
        }
        return currentNotes;
    } catch (error) {
        console.error("Error updating voice note in localStorage:", error);
        return getVoiceNotes();
    }
}
