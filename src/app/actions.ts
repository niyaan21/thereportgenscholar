// src/app/actions.ts
'use server';

import { formulateResearchQuery, type FormulateResearchQueryInput, type FormulateResearchQueryOutput } from '@/ai/flows/formulate-research-query';
import { summarizeResearchPapers, type SummarizeResearchPapersInput, type SummarizeResearchPapersOutput } from '@/ai/flows/summarize-research-papers';
import { generateResearchReport, type GenerateResearchReportInput, type GenerateResearchReportOutput } from '@/ai/flows/generate-research-report';
import { generateReportFromFile, type GenerateReportFromFileInput, type GenerateReportFromFileOutput } from '@/ai/flows/generate-report-from-file';
import { generateDailyPrompt, type GenerateDailyPromptInput, type GenerateDailyPromptOutput } from '@/ai/flows/generate-daily-prompt-flow';
import { extractMindmapConcepts, type ExtractMindmapConceptsInput, type ExtractMindmapConceptsOutput } from '@/ai/flows/extract-mindmap-concepts';
import { transcribeAndAnalyze, type TranscribeAndAnalyzeInput, type TranscribeAndAnalyzeOutput } from '@/ai/flows/transcribe-and-analyze-flow';
import { plagiarismCheck, type PlagiarismCheckInput, type PlagiarismCheckOutput } from '@/ai/flows/plagiarism-check-flow';
import { z } from 'zod';

/**
 * Reads all GEMINI_API_KEY_... variables from the environment into an array.
 * @returns An array of API keys.
 */
function getApiKeys(): string[] {
  const keys: string[] = [];
  let i = 1;
  while (process.env[`GEMINI_API_KEY_${i}`]) {
    keys.push(process.env[`GEMINI_API_KEY_${i}`]!);
    i++;
  }
  return keys;
}

const MAX_RETRIES = 2; // Max retries per key for overload errors
const RETRY_DELAY_MS = 1500;

/**
 * A robust wrapper for running Genkit flows that handles API key failover and retries.
 * @param flow The AI flow function to execute.
 * @param input The input data for the flow.
 * @returns The result of the flow.
 * @throws An error if all keys and retries fail.
 */
async function runWithFailover<Input, Output>(
  flow: (input: Input & { apiKey?: string }) => Promise<Output>,
  input: Input
): Promise<Output> {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error("API configuration issue: No API keys found in environment variables (GEMINI_API_KEY_...).");
  }

  let lastError: any = new Error("All API keys failed after multiple retries.");

  for (const key of keys) {
    try {
      let attempts = 0;
      while (attempts <= MAX_RETRIES) {
        try {
          // Pass the specific key to the flow
          return await flow({ ...input, apiKey: key });
        } catch (error: any) {
          const errorMessage = error.message?.toLowerCase() || '';
          
          // Check for temporary overload/503 errors to retry
          if (errorMessage.includes('503') || errorMessage.includes('overloaded') || errorMessage.includes('try again')) {
            attempts++;
            if (attempts > MAX_RETRIES) {
              // If we've exhausted retries for this key, throw to move to the next key
              lastError = error;
              break; 
            }
            // Wait with exponential backoff before retrying
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempts));
            continue; // Retry with the same key
          }
          
          // For other errors (like invalid key), immediately break the retry loop and try the next key
          throw error;
        }
      }
    } catch (error) {
      lastError = error;
      console.warn(`API Key ending in ...${key.slice(-4)} failed. Trying next key.`);
    }
  }
  
  // If all keys and retries fail, throw the last recorded error
  throw lastError;
}

// Helper to create a user-friendly error message from a caught error
function processErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
      return "The AI model is currently overloaded. Please try again in a few moments.";
    }
    if (
        errorMessage.includes('401') || 
        errorMessage.includes('403') || 
        errorMessage.includes('permission_denied') || 
        errorMessage.includes('api key not valid') ||
        errorMessage.includes('invalid api key') ||
        errorMessage.includes('api configuration issue')
    ) {
        return "There is an issue with the API configuration. Please contact support if this issue persists.";
    }
    return error.message;
  }
  return defaultMessage;
}


const formulateQuerySchema = z.object({
  researchQuestion: z.string().min(10, "Research question must be at least 10 characters long.").max(1500, "Research question must be at most 1500 characters long."),
  language: z.string().optional(),
});

export interface FormulateQueryActionState {
  success: boolean;
  message: string;
  originalQuestion?: string; 
  formulatedQueries?: string[] | null;
  alternativePhrasings?: string[] | null;
  keyConcepts?: string[] | null;
  potentialSubTopics?: string[] | null;
  errors: { researchQuestion?: string[] } | null;
}

export async function handleFormulateQueryAction(
  prevState: FormulateQueryActionState,
  formData: FormData
): Promise<FormulateQueryActionState> {
  const researchQuestion = formData.get('researchQuestion') as string;
  const language = formData.get('language') as string;

  const validation = formulateQuerySchema.safeParse({ researchQuestion, language });
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid input.",
      errors: validation.error.flatten().fieldErrors,
      originalQuestion: researchQuestion, 
    };
  }

  try {
    const result = await runWithFailover(formulateResearchQuery, { researchQuestion: validation.data.researchQuestion, language: validation.data.language });
    return {
      success: true,
      message: "Queries and research guidance formulated successfully.",
      originalQuestion: validation.data.researchQuestion, 
      formulatedQueries: result.searchQueries,
      alternativePhrasings: result.alternativePhrasings,
      keyConcepts: result.keyConcepts,
      potentialSubTopics: result.potentialSubTopics,
      errors: null,
    };
  } catch (error) {
    console.error("Error formulating queries:", error);
    const errorMessage = processErrorMessage(error, "An unexpected error occurred.");
    return {
      success: false,
      message: `Failed to formulate queries: ${errorMessage}`,
      originalQuestion: researchQuestion, 
      errors: null,
    };
  }
}

const synthesizeResearchSchema = z.object({
  queries: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.every(q => typeof q === 'string');
    } catch {
      return false;
    }
  }, { message: "Invalid queries format."}),
});

export interface SynthesizeResearchActionState {
  success: boolean;
  message: string;
  researchSummary: string | null;
  summarizedPaperTitles: string[] | null;
  errors: { queries?: string[] } | null;
}

export async function handleSynthesizeResearchAction(
  prevState: SynthesizeResearchActionState,
  formData: FormData
): Promise<SynthesizeResearchActionState> {
  const queriesJson = formData.get('queries') as string;
  
  const validation = synthesizeResearchSchema.safeParse({ queries: queriesJson });
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid query data provided for synthesis.",
      researchSummary: null,
      summarizedPaperTitles: null,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  let formulatedQueries: string[] = [];
  try {
    formulatedQueries = JSON.parse(validation.data.queries);
  } catch (e) {
    return {
      success: false,
      message: "Failed to parse query data.",
      researchSummary: null,
      summarizedPaperTitles: null,
      errors: { queries: ["Malformed JSON for queries."] }
    };
  }

  if (formulatedQueries.length === 0) {
    return {
      success: false,
      message: "No queries provided for synthesis.",
      researchSummary: null,
      summarizedPaperTitles: null,
      errors: { queries: ["No queries found to synthesize."] }
    };
  }

  const papersForSummary = formulatedQueries.map((query, index) => ({
    title: `Insight Area ${index + 1}: ${query.substring(0, 100)}${query.length > 100 ? '...' : ''}`,
    abstract: `This section pertains to the query: "${query}". The AI will synthesize information based on its knowledge regarding this topic.`,
  }));

  try {
    const result: SummarizeResearchPapersOutput = await runWithFailover(summarizeResearchPapers, { papers: papersForSummary });
    return {
      success: true,
      message: "Research synthesized successfully using formulated queries.",
      researchSummary: result.summary,
      summarizedPaperTitles: papersForSummary.map(p => p.title),
      errors: null,
    };
  } catch (error) {
    console.error("Error synthesizing research:", error);
    const errorMessage = processErrorMessage(error, "An unexpected error occurred.");
    return {
      success: false,
      message: `Failed to synthesize research: ${errorMessage}`,
      researchSummary: null,
      summarizedPaperTitles: null,
      errors: null,
    };
  }
}

const generateReportSchema = z.object({
  researchQuestion: z.string().min(10, "Research question must be at least 10 characters long.").max(1500, "Research question must be at most 1500 characters long."),
  summary: z.string().optional(),
  generateCharts: z.boolean(),
  language: z.string().optional(),
});

export interface GenerateReportActionState {
  success: boolean;
  message: string;
  researchReport: GenerateResearchReportOutput | null;
  errors: { researchQuestion?: string[], summary?: string[] } | null;
}

export async function handleGenerateReportAction(
  prevState: GenerateReportActionState,
  formData: FormData
): Promise<GenerateReportActionState> {
  const researchQuestion = formData.get('researchQuestion') as string;
  const summary = formData.get('summary') as string | undefined;
  const generateCharts = formData.get('generateCharts') === 'on';
  const language = formData.get('language') as string;

  const validation = generateReportSchema.safeParse({ researchQuestion, summary, generateCharts, language });
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid input for report generation.",
      researchReport: null,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await runWithFailover(generateResearchReport, {
      researchQuestion: validation.data.researchQuestion,
      summary: validation.data.summary ? validation.data.summary.trim() : undefined,
      generateCharts: validation.data.generateCharts,
      language: validation.data.language,
    });
    return {
      success: true,
      message: "Research report generated successfully.",
      researchReport: result,
      errors: null,
    };
  } catch (error) {
    console.error("Error generating research report:", error);
    const errorMessage = processErrorMessage(error, "An unexpected error occurred.");
    return {
      success: false,
      message: `Failed to generate research report: ${errorMessage}`,
      researchReport: null,
      errors: null,
    };
  }
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_DOC_TYPES = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/markdown'];

const generateReportFromFileSchema = z.object({
  guidanceQuery: z.string().min(10, "Guidance query must be at least 10 characters.").max(1000, "Guidance query must be at most 1000 characters."),
  file: z
    .instanceof(File, { message: "A file is required." })
    .refine((file) => file.size > 0, "File cannot be empty.")
    .refine((file) => file.size <= MAX_FILE_SIZE_BYTES, `File size must be less than ${MAX_FILE_SIZE_MB}MB.`)
    .refine((file) => ALLOWED_DOC_TYPES.includes(file.type), "Invalid file type. Allowed types: .txt, .md, .pdf, .doc, .docx"),
  generateMindmap: z.boolean(),
  generateCharts: z.boolean(),
  language: z.string().optional(),
});

export interface GenerateReportFromFileActionState {
  success: boolean;
  message: string;
  researchReport: GenerateReportFromFileOutput | null;
  originalGuidance?: string;
  errors: { guidanceQuery?: string[]; file?: string[]; generateMindmap?: string[]; generateCharts?: string[] } | null;
}

export async function handleGenerateReportFromFileAction(
  prevState: GenerateReportFromFileActionState,
  formData: FormData
): Promise<GenerateReportFromFileActionState> {
  const guidanceQuery = formData.get('guidanceQuery') as string;
  const file = formData.get('file') as File;
  const generateMindmap = formData.get('generateMindmap') === 'on';
  const generateCharts = formData.get('generateCharts') === 'on';
  const language = formData.get('language') as string;

  const validation = generateReportFromFileSchema.safeParse({ guidanceQuery, file, generateMindmap, generateCharts, language });

  if (!validation.success) {
    return {
      success: false,
      message: "Invalid input for file report generation.",
      researchReport: null,
      errors: validation.error.flatten().fieldErrors,
      originalGuidance: guidanceQuery,
    };
  }

  const { file: validatedFile, guidanceQuery: validatedQuery, generateMindmap: validatedMindmapFlag, generateCharts: validatedChartsFlag, language: validatedLanguage } = validation.data;

  try {
    const arrayBuffer = await validatedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileDataUri = `data:${validatedFile.type};base64,${buffer.toString('base64')}`;

    const result = await runWithFailover(generateReportFromFile, {
      fileDataUri,
      guidanceQuery: validatedQuery,
      fileName: validatedFile.name,
      generateMindmap: validatedMindmapFlag,
      generateCharts: validatedChartsFlag,
      language: validatedLanguage,
    });

    return {
      success: true,
      message: "Report from file generated successfully.",
      researchReport: result,
      originalGuidance: validatedQuery,
      errors: null,
    };
  } catch (error) {
    console.error("Error generating report from file:", error);
    const errorMessage = processErrorMessage(error, "An unexpected error occurred while processing the file.");
    return {
      success: false,
      message: `Failed to generate report: ${errorMessage}`,
      researchReport: null,
      originalGuidance: validatedQuery,
      errors: null,
    };
  }
}

export interface GenerateDailyPromptActionState {
  success: boolean;
  message: string;
  dailyPrompt: GenerateDailyPromptOutput | null;
  error?: string | null;
}

export async function handleGenerateDailyPromptAction(language?: string): Promise<GenerateDailyPromptActionState> {
  try {
    const result = await runWithFailover(generateDailyPrompt, { language });
    return {
      success: true,
      message: "Daily prompt generated successfully.",
      dailyPrompt: result,
    };
  } catch (error) {
    console.error("Error generating daily prompt:", error);
    const errorMessage = processErrorMessage(error, "An unexpected error occurred.");
    return {
      success: false,
      message: `Failed to generate daily prompt: ${errorMessage}`,
      dailyPrompt: null,
      error: errorMessage,
    };
  }
}

// Action for Mindmap Concept Extraction
const extractMindmapConceptsSchema = z.object({
  textToAnalyze: z.string().min(50, "Text must be at least 50 characters.").max(10000, "Text must be at most 10,000 characters."),
  language: z.string().optional(),
});

export interface ExtractMindmapConceptsActionState {
  success: boolean;
  message: string;
  extractedData: ExtractMindmapConceptsOutput | null;
  errors: { textToAnalyze?: string[] } | null;
}

export async function handleExtractMindmapConceptsAction(
  prevState: ExtractMindmapConceptsActionState,
  formData: FormData
): Promise<ExtractMindmapConceptsActionState> {
  const textToAnalyze = formData.get('textToAnalyze') as string;
  const language = formData.get('language') as string;

  const validation = extractMindmapConceptsSchema.safeParse({ textToAnalyze, language });
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid input for mindmap concept extraction.",
      extractedData: null,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await runWithFailover(extractMindmapConcepts, { textToAnalyze: validation.data.textToAnalyze, language: validation.data.language });
    return {
      success: true,
      message: "Mindmap concepts extracted successfully.",
      extractedData: result,
      errors: null,
    };
  } catch (error) {
    console.error("Error extracting mindmap concepts:", error);
    const errorMessage = processErrorMessage(error, "An unexpected error occurred.");
    return {
      success: false,
      message: `Failed to extract mindmap concepts: ${errorMessage}`,
      extractedData: null,
      errors: null,
    };
  }
}

// Action for Transcription and Analysis
const MAX_AUDIO_FILE_SIZE_MB = 50;
const MAX_AUDIO_FILE_SIZE_BYTES = MAX_AUDIO_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'video/mp4', 'video/quicktime'];

const transcribeAndAnalyzeSchema = z.object({
  analysisGuidance: z.string().max(1000, "Guidance must be at most 1000 characters.").optional(),
  file: z
    .instanceof(File, { message: "An audio or video file is required." })
    .refine((file) => file.size > 0, "File cannot be empty.")
    .refine((file) => file.size <= MAX_AUDIO_FILE_SIZE_BYTES, `File size must be less than ${MAX_AUDIO_FILE_SIZE_MB}MB.`)
    .refine((file) => ALLOWED_AUDIO_TYPES.includes(file.type), "Invalid file type. Allowed: .mp3, .wav, .mp4, .mov"),
  language: z.string().optional(),
});

export interface TranscribeAndAnalyzeActionState {
  success: boolean;
  message: string;
  analysisResult: TranscribeAndAnalyzeOutput | null;
  errors: { analysisGuidance?: string[]; file?: string[] } | null;
}

export async function handleTranscribeAndAnalyzeAction(
  prevState: TranscribeAndAnalyzeActionState,
  formData: FormData
): Promise<TranscribeAndAnalyzeActionState> {
  const guidance = formData.get('analysisGuidance') as string;
  const file = formData.get('file') as File;
  const language = formData.get('language') as string;

  const validation = transcribeAndAnalyzeSchema.safeParse({ analysisGuidance: guidance, file, language });

  if (!validation.success) {
    return {
      success: false,
      message: "Invalid input for transcription.",
      analysisResult: null,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { file: validatedFile, analysisGuidance: validatedGuidance, language: validatedLanguage } = validation.data;

  try {
    const arrayBuffer = await validatedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileDataUri = `data:${validatedFile.type};base64,${buffer.toString('base64')}`;

    const result = await runWithFailover(transcribeAndAnalyze, {
      fileDataUri,
      analysisGuidance: validatedGuidance,
      fileName: validatedFile.name,
      language: validatedLanguage,
    });

    return {
      success: true,
      message: "File transcribed and analyzed successfully.",
      analysisResult: result,
      errors: null,
    };
  } catch (error) {
    console.error("Error in transcription/analysis action:", error);
    const errorMessage = processErrorMessage(error, "An unexpected error occurred during processing.");
    return {
      success: false,
      message: `Processing failed: ${errorMessage}`,
      analysisResult: null,
      errors: null,
    };
  }
}


export interface PlagiarismCheckActionState {
  success: boolean;
  message: string;
  plagiarismReport: PlagiarismCheckOutput | null;
  error?: string | null;
}

export async function handlePlagiarismCheckAction(
  text: string,
  language?: string
): Promise<PlagiarismCheckActionState> {
  const validation = z.string().min(100).safeParse(text);
  if (!validation.success) {
    return {
      success: false,
      message: "Text is too short for a meaningful plagiarism check.",
      plagiarismReport: null,
    };
  }

  try {
    const result = await runWithFailover(plagiarismCheck, { text, language });
    return {
      success: true,
      message: "Plagiarism check simulation complete.",
      plagiarismReport: result,
    };
  } catch (error) {
    const errorMessage = processErrorMessage(error, "An unexpected error occurred.");
    return {
      success: false,
      message: `Failed to run plagiarism check: ${errorMessage}`,
      plagiarismReport: null,
      error: errorMessage,
    };
  }
}
