'use server';
/**
 * @fileOverview Formulates research queries from a complex question.
 *
 * - formulateResearchQuery - A function that formulates research queries.
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
    .describe('An array of well-formed search queries.'),
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
  prompt: `You are an expert research query formulator. Your job is to take a complex research question and reformulate it into several well-formed search queries that will maximize the relevance and coverage of the search results.\n\nResearch Question: {{{researchQuestion}}}\n\nFormulated Search Queries:`,
});

const formulateResearchQueryFlow = ai.defineFlow(
  {
    name: 'formulateResearchQueryFlow',
    inputSchema: FormulateResearchQueryInputSchema,
    outputSchema: FormulateResearchQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
