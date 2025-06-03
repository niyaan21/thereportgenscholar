
'use server';
/**
 * @fileOverview Formulates research queries, alternative phrasings, key concepts, and sub-topics from a complex question.
 *
 * - formulateResearchQuery - A function that handles the advanced query formulation.
 * - FormulateResearchQueryInput - The input type for the formulateResearchQuery function.
 * - FormulateResearchQueryOutput - The return type for the formulateResearchQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormulateResearchQueryInputSchema = z.object({
  researchQuestion: z
    .string()
    .describe('The complex research question to formulate search queries for.'),
});
export type FormulateResearchQueryInput = z.infer<
  typeof FormulateResearchQueryInputSchema
>;

const FormulateResearchQueryOutputSchema = z.object({
  searchQueries: z
    .array(z.string())
    .describe('An array of 3-5 well-formed search queries based on the research question.'),
  alternativePhrasings: z
    .array(z.string().max(250, "Alternative phrasing should be concise."))
    .optional()
    .describe('1-2 alternative ways to phrase the original research question that might yield different perspectives or search results.'),
  keyConcepts: z
    .array(z.string().max(60, "Key concept should be a short phrase or term."))
    .optional()
    .describe('A list of 3-5 core concepts or keywords that are central to the research question.'),
  potentialSubTopics: z
    .array(z.string().max(250, "Sub-topic should be a concise question or statement."))
    .optional()
    .describe('2-3 potential sub-topics or narrower questions that branch off the main research question and could be investigated further.'),
});
export type FormulateResearchQueryOutput = z.infer<
  typeof FormulateResearchQueryOutputSchema
>;

export async function formulateResearchQuery(
  input: FormulateResearchQueryInput
): Promise<FormulateResearchQueryOutput> {
  return formulateResearchQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formulateResearchQueryPrompt',
  input: {schema: FormulateResearchQueryInputSchema},
  output: {schema: FormulateResearchQueryOutputSchema},
  prompt: `You are an expert research query formulator and research assistant. Your job is to take a complex research question and provide several outputs to help the user begin their research:

Research Question: {{{researchQuestion}}}

1.  **Formulated Search Queries (3-5 queries):** Reformulate the research question into several distinct, well-formed search queries. These queries should be designed to maximize the relevance and coverage of search results from academic databases or general search engines.
2.  **Alternative Phrasings (1-2 options, max 250 chars each):** Provide one or two alternative ways to phrase the original research question. These alternatives should offer slightly different angles or perspectives on the same core topic.
3.  **Key Concepts (3-5 concepts, max 60 chars each):** Identify and list the 3 to 5 most important, central concepts or keywords embedded in or highly relevant to the research question.
4.  **Potential Sub-Topics (2-3 topics, max 250 chars each):** Suggest two or three narrower sub-topics or specific questions that branch off the main research question. These should be areas that could be investigated in more detail as part of the broader research.

Provide the output in the specified JSON schema. Ensure all fields are populated appropriately based on the research question.
`,
});

const formulateResearchQueryFlow = ai.defineFlow(
  {
    name: 'formulateResearchQueryFlow',
    inputSchema: FormulateResearchQueryInputSchema,
    outputSchema: FormulateResearchQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Advanced query formulation failed to produce output.');
    }
    // Ensure all arrays are initialized, even if empty, to match schema expectations if model omits optional empty arrays
    return {
        searchQueries: output.searchQueries || [],
        alternativePhrasings: output.alternativePhrasings || [],
        keyConcepts: output.keyConcepts || [],
        potentialSubTopics: output.potentialSubTopics || [],
    };
  }
);

