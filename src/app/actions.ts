// src/app/actions.ts
'use server';

import { formulateResearchQuery, type FormulateResearchQueryInput } from '@/ai/flows/formulate-research-query';
import { summarizeResearchPapers, type SummarizeResearchPapersInput } from '@/ai/flows/summarize-research-papers';
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
  summarizedPaperTitles: string[] | null; // Added to pass titles to UI
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

  // Construct papers input from formulated queries
  // This makes the summarization based on the AI-generated query topics.
  const papersForSummary = formulatedQueries.map((query, index) => ({
    title: `Insight Area ${index + 1}: ${query.substring(0, 100)}${query.length > 100 ? '...' : ''}`, // Keep titles concise
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
