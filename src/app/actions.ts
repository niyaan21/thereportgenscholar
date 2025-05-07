// src/app/actions.ts
'use server';

import { formulateResearchQuery, type FormulateResearchQueryInput } from '@/ai/flows/formulate-research-query';
import { summarizeResearchPapers, type SummarizeResearchPapersInput } from '@/ai/flows/summarize-research-papers';
import { generateResearchImage, type GenerateResearchImageInput } from '@/ai/flows/generate-research-image';
import { z } from 'zod';

const formulateQuerySchema = z.object({
  researchQuestion: z.string().min(10, "Research question must be at least 10 characters long.").max(500, "Research question must be at most 500 characters long."),
});

export interface FormulateQueryActionState {
  success: boolean;
  message: string;
  formulatedQueries: string[] | null;
  errors: { researchQuestion?: string[] } | null;
}

export async function handleFormulateQueryAction(
  prevState: FormulateQueryActionState, 
  formData: FormData
): Promise<FormulateQueryActionState> {
  const researchQuestion = formData.get('researchQuestion') as string;

  const validation = formulateQuerySchema.safeParse({ researchQuestion });
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid input.",
      errors: validation.error.flatten().fieldErrors,
      formulatedQueries: null,
    };
  }

  try {
    const input: FormulateResearchQueryInput = { researchQuestion: validation.data.researchQuestion };
    const result = await formulateResearchQuery(input);
    return {
      success: true,
      message: "Queries formulated successfully.",
      formulatedQueries: result.searchQueries,
      errors: null,
    };
  } catch (error) {
    console.error("Error formulating queries:", error);
    return {
      success: false,
      message: "Failed to formulate queries. An unexpected error occurred.",
      formulatedQueries: null,
      errors: null,
    };
  }
}

export interface SynthesizeResearchActionState {
  success: boolean;
  message: string;
  researchSummary: string | null;
  summarizedPaperTitles: string[] | null; 
  errors: any | null; 
}

export async function handleSynthesizeResearchAction(
  prevState: SynthesizeResearchActionState,
  formData: FormData
): Promise<SynthesizeResearchActionState> {
  const queriesJson = formData.get('queries') as string;
  let formulatedQueries: string[] = [];

  if (queriesJson) {
    try {
      formulatedQueries = JSON.parse(queriesJson);
      if (!Array.isArray(formulatedQueries) || !formulatedQueries.every(q => typeof q === 'string')) {
        throw new Error("Invalid queries format.");
      }
    } catch (e) {
      console.error("Failed to parse queries for synthesis:", e);
      return {
        success: false,
        message: "Invalid query data provided for synthesis. Please ensure queries are correctly formatted.",
        researchSummary: null,
        summarizedPaperTitles: null,
        errors: { queries: ["Failed to parse query data."] }
      };
    }
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
    const input: SummarizeResearchPapersInput = { papers: papersForSummary };
    const result = await summarizeResearchPapers(input);
    return {
      success: true,
      message: "Research synthesized successfully using formulated queries.",
      researchSummary: result.summary,
      summarizedPaperTitles: papersForSummary.map(p => p.title),
      errors: null,
    };
  } catch (error) {
    console.error("Error synthesizing research:", error);
    return {
      success: false,
      message: "Failed to synthesize research. An unexpected error occurred.",
      researchSummary: null,
      summarizedPaperTitles: null,
      errors: null,
    };
  }
}


export interface GenerateImageActionState {
  success: boolean;
  message: string;
  imageDataUri: string | null;
  errors: { topic?: string[] } | null;
}

const generateImageSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters long.").max(200, "Topic must be at most 200 characters long."),
});

export async function handleGenerateImageAction(
  prevState: GenerateImageActionState,
  formData: FormData
): Promise<GenerateImageActionState> {
  const topic = formData.get('topic') as string;

  const validation = generateImageSchema.safeParse({ topic });
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid topic for image generation.",
      imageDataUri: null,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const input: GenerateResearchImageInput = { topic: validation.data.topic };
    const result = await generateResearchImage(input);
    return {
      success: true,
      message: "Image generated successfully.",
      imageDataUri: result.imageDataUri,
      errors: null,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return {
      success: false,
      message: `Failed to generate image: ${errorMessage}`,
      imageDataUri: null,
      errors: null,
    };
  }
}
