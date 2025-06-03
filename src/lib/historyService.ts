
// src/lib/historyService.ts
'use client';

const STORAGE_KEY = 'scholarAiResearchHistory';
const MAX_HISTORY_ITEMS = 50;

export interface ResearchActivityItem {
  id: string;
  type: 'query-formulation' | 'report-generation' | 'file-report-generation';
  question: string; // Original research question or guidance query
  date: string; // ISO string for the date
  reportTitle?: string;
  executiveSummarySnippet?: string;
}

export function getResearchHistory(): ResearchActivityItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    if (storedHistory) {
      return JSON.parse(storedHistory) as ResearchActivityItem[];
    }
  } catch (error) {
    console.error("Error reading research history from localStorage:", error);
  }
  return [];
}

export function addResearchActivity(activityInput: Omit<ResearchActivityItem, 'id' | 'date'>): ResearchActivityItem {
  if (typeof window === 'undefined') {
    // Should not happen if called from client components after mount, but good safeguard
    console.warn("Attempted to add research activity in non-browser environment.");
    // Return a dummy item or throw, depending on desired behavior. Here, just log and return input as is.
    return { ...activityInput, id: Date.now().toString(), date: new Date().toISOString() };
  }

  const newActivity: ResearchActivityItem = {
    ...activityInput,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };

  try {
    const currentHistory = getResearchHistory();
    const updatedHistory = [newActivity, ...currentHistory].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Error saving research activity to localStorage:", error);
  }
  return newActivity;
}

export function setResearchHistory(history: ResearchActivityItem[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const validatedHistory = history.slice(0, MAX_HISTORY_ITEMS); // Ensure we don't exceed max items on import
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedHistory));
  } catch (error) {
    console.error("Error setting research history in localStorage:", error);
  }
}

export function clearResearchHistory(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing research history from localStorage:", error);
  }
}

