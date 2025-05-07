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

const mockPapers = [
  { title: "The Future of AI in Academic Research", abstract: "This paper explores the growing role of artificial intelligence in shaping research methodologies and discovery processes across various academic disciplines. It highlights key advancements and potential challenges." },
  { title: "Advanced Language Models for Query Understanding", abstract: "We present a novel approach to query formulation using advanced large language models, demonstrating significant improvements in search result relevance. Our method focuses on semantic understanding and contextual awareness." },
  { title: "Synthesizing Knowledge: A Survey of Text Summarization Techniques", abstract: "A comprehensive survey of automated text summarization techniques, including extractive and abstractive methods, and their applications in research. We compare various models and their performance on benchmark datasets." },
  { title: "Ethical Considerations in AI-Driven Research", abstract: "This paper discusses the ethical implications of using AI in research, including issues of bias, transparency, and accountability. It proposes a framework for responsible AI development and deployment in academic settings." }
];

export interface SynthesizeResearchActionState {
  success: boolean;
  message: string;
  researchSummary: string | null;
  errors: any | null; // Keep generic for now
}

export async function handleSynthesizeResearchAction(
  prevState: SynthesizeResearchActionState,
  formData: FormData
): Promise<SynthesizeResearchActionState> {
  // In a real app, queries from formData might be used to fetch actual papers.
  // For now, we use mock data.
  // const queriesJson = formData.get('queries') as string;
  // let queries: string[] = [];
  // if (queriesJson) {
  //   try {
  //     queries = JSON.parse(queriesJson);
  //   } catch (e) {
  //     console.error("Failed to parse queries for synthesis:", e);
  //     return {
  //       success: false,
  //       message: "Invalid query data provided for synthesis.",
  //       researchSummary: null,
  //       errors: { queries: ["Failed to parse query data."] }
  //     };
  //   }
  // }
  
  try {
    const input: SummarizeResearchPapersInput = { papers: mockPapers };
    const result = await summarizeResearchPapers(input);
    return {
      success: true,
      message: "Research synthesized successfully.",
      researchSummary: result.summary,
      errors: null,
    };
  } catch (error) {
    console.error("Error synthesizing research:", error);
    return {
      success: false,
      message: "Failed to synthesize research. An unexpected error occurred.",
      researchSummary: null,
      errors: null,
    };
  }
}
