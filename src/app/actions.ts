// src/app/actions.ts
'use server';

import { formulateResearchQuery, type FormulateResearchQueryInput, type FormulateResearchQueryOutput } from '@/ai/flows/formulate-research-query';
import { summarizeResearchPapers, type SummarizeResearchPapersInput, type SummarizeResearchPapersOutput } from '@/ai/flows/summarize-research-papers';
import { generateResearchReport, type GenerateResearchReportInput, type GenerateResearchReportOutput } from '@/ai/flows/generate-research-report';
import { generateReportFromFile, type GenerateReportFromFileInput, type GenerateReportFromFileOutput } from '@/ai/flows/generate-report-from-file';
import { generateDailyPrompt, type GenerateDailyPromptInput, type GenerateDailyPromptOutput } from '@/ai/flows/generate-daily-prompt-flow';
import { extractMindmapConcepts, type ExtractMindmapConceptsInput, type ExtractMindmapConceptsOutput } from '@/ai/flows/extract-mindmap-concepts';
import { transcribeAndAnalyze, type TranscribeAndAnalyzeInput, type TranscribeAndAnalyzeOutput } from '@/ai/flows/transcribe-and-analyze-flow';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { plagiarismCheck, type PlagiarismCheckInput, type PlagiarismCheckOutput } from '@/ai/flows/plagiarism-check-flow';
import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Helper to create a user-friendly error message from a caught error
function processErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
      return "The AI model is currently overloaded. Please try again in a few moments.";
    }
    // Check for API key or permission errors
    if (
        errorMessage.includes('401') || 
        errorMessage.includes('403') || 
        errorMessage.includes('permission_denied') || 
        errorMessage.includes('api key not valid') ||
        errorMessage.includes('invalid api key')
    ) {
        return "There is an issue with the API configuration. Please contact support if this issue persists.";
    }
    return error.message;
  }
  return defaultMessage;
}

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1500;

// This new wrapper function handles API key failover and retries for temporary errors.
async function runWithFailover<T>(
  flowRunner: (ai: any) => Promise<T>
): Promise<T> {
  const apiKeysString = process.env.GOOGLE_API_KEYS || process.env.GOOGLE_API_KEY;
  const keys = apiKeysString ? apiKeysString.split(',').map(k => k.trim()).filter(Boolean) : [];
  
  if (keys.length === 0) {
    throw new Error("No Google API keys found. Please set GOOGLE_API_KEYS in your .env file.");
  }

  let lastError: unknown = new Error("AI operation failed for all API keys.");

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const ai = genkit({
      plugins: [googleAI({ apiKey: key })],
      model: 'googleai/gemini-2.0-flash',
    });

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        // Run the actual flow logic, passing the temporary `ai` instance
        return await flowRunner(ai);
      } catch (error) {
        lastError = error;
        const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';

        // If it's an auth/permission error, break the inner retry loop and try the next key.
        if (errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('permission_denied') || errorMessage.includes('api key not valid')) {
          console.warn(`API key at index ${i} failed with auth error. Rotating to next key.`);
          break; // Go to the next key in the outer loop
        }

        // If it's a temporary overload error, retry with backoff.
        if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
          if (attempt < MAX_RETRIES - 1) {
            const delay = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
            console.log(`AI service overloaded. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${MAX_RETRIES})`);
            await new Promise(res => setTimeout(res, delay));
            continue; // Continue to the next attempt in the inner loop
          }
        }
        
        // For any other error, re-throw immediately as it's not retriable.
        throw error;
      }
    }
  }

  // If all keys and retries fail, throw the last captured error.
  throw lastError;
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
    const result = await runWithFailover(async (ai) => {
        // Re-create the flow function on-the-fly with the provided ai instance
        const tempFormulateResearchQuery = (input: FormulateResearchQueryInput) => {
            const flow = ai.defineFlow({ name: 'tempFormulateFlow' }, () => formulateResearchQuery(input));
            return flow();
        };
        return tempFormulateResearchQuery({ researchQuestion: validation.data.researchQuestion, language: validation.data.language });
    });

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
    const result: SummarizeResearchPapersOutput = await runWithFailover(async (ai) => {
        const tempSummarizeResearchPapers = (input: SummarizeResearchPapersInput) => {
            const flow = ai.defineFlow({ name: 'tempSummarizeFlow' }, () => summarizeResearchPapers(input));
            return flow();
        };
        return tempSummarizeResearchPapers({ papers: papersForSummary });
    });

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
    const input: GenerateResearchReportInput = {
      researchQuestion: validation.data.researchQuestion,
      summary: validation.data.summary ? validation.data.summary.trim() : undefined,
      generateCharts: validation.data.generateCharts,
      language: validation.data.language,
    };

    const result = await runWithFailover(async (ai) => {
        const tempGenerateReport = (input: GenerateResearchReportInput) => {
            const flow = ai.defineFlow({ name: 'tempReportGenFlow' }, () => generateResearchReport(input));
            return flow();
        };
        return tempGenerateReport(input);
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

    const input: GenerateReportFromFileInput = {
      fileDataUri,
      guidanceQuery: validatedQuery,
      fileName: validatedFile.name,
      generateMindmap: validatedMindmapFlag,
      generateCharts: validatedChartsFlag,
      language: validatedLanguage,
    };

    const result = await runWithFailover(async (ai) => {
        const tempGenFromFile = (input: GenerateReportFromFileInput) => {
            const flow = ai.defineFlow({ name: 'tempFileReportFlow' }, () => generateReportFromFile(input));
            return flow();
        };
        return tempGenFromFile(input);
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
    const result = await runWithFailover(async (ai) => {
        const tempDailyPrompt = (input: GenerateDailyPromptInput) => {
            const flow = ai.defineFlow({ name: 'tempDailyPromptFlow' }, () => generateDailyPrompt(input));
            return flow();
        };
        return tempDailyPrompt({ language });
    });
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
    const input: ExtractMindmapConceptsInput = { textToAnalyze: validation.data.textToAnalyze, language: validation.data.language };
    const result = await runWithFailover(async (ai) => {
        const tempExtractConcepts = (input: ExtractMindmapConceptsInput) => {
            const flow = ai.defineFlow({ name: 'tempMindmapFlow' }, () => extractMindmapConcepts(input));
            return flow();
        };
        return tempExtractConcepts(input);
    });
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

    const input: TranscribeAndAnalyzeInput = {
      fileDataUri,
      analysisGuidance: validatedGuidance,
      fileName: validatedFile.name,
      language: validatedLanguage,
    };

    const result = await runWithFailover(async (ai) => {
        const tempTranscribe = (input: TranscribeAndAnalyzeInput) => {
            const flow = ai.defineFlow({ name: 'tempTranscribeFlow' }, () => transcribeAndAnalyze(input));
            return flow();
        };
        return tempTranscribe(input);
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

// Define the schema here to avoid exporting it from a 'use server' file
const TextToSpeechInputSchema = z.object({
  text: z.string().min(1, 'Text cannot be empty.').max(5000, 'Text cannot exceed 5000 characters.'),
});

// Action for Text-to-Speech
export interface TextToSpeechActionState {
    success: boolean;
    message: string;
    audioDataUri: string | null;
    error?: string | null;
}

export async function handleTextToSpeechAction(
    text: string
): Promise<TextToSpeechActionState> {
    const validation = TextToSpeechInputSchema.safeParse({ text });
    if (!validation.success) {
        return {
            success: false,
            message: "Invalid text for speech synthesis.",
            audioDataUri: null,
            error: validation.error.flatten().fieldErrors.text?.join(', ') || "Validation failed.",
        };
    }

    try {
        const result = await runWithFailover(async (ai) => {
            const tempTTS = (input: z.infer<typeof TextToSpeechInputSchema>) => {
                const flow = ai.defineFlow({ name: 'tempTTSFlow' }, () => textToSpeech(input));
                return flow();
            };
            return tempTTS({ text });
        });
        return {
            success: true,
            message: "Speech generated successfully.",
            audioDataUri: result.audioDataUri,
        };
    } catch (error) {
        console.error("Error in text-to-speech action:", error);
        const errorMessage = processErrorMessage(error, "An unexpected error occurred.");
        return {
            success: false,
            message: `Failed to generate speech: ${errorMessage}`,
            audioDataUri: null,
            error: errorMessage,
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
    const result = await runWithFailover(async (ai) => {
        const tempPlagiarismCheck = (input: PlagiarismCheckInput) => {
            const flow = ai.defineFlow({ name: 'tempPlagiarismFlow' }, () => plagiarismCheck(input));
            return flow();
        };
        return tempPlagiarismCheck({ text, language });
    });
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
