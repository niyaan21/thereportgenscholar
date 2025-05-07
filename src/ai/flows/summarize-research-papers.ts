// SummarizeResearchPapers Flow

'use server';

/**
 * @fileOverview A research paper summarization AI agent.
 *
 * - summarizeResearchPapers - A function that handles the summarization of research papers.
 * - SummarizeResearchPapersInput - The input type for the summarizeResearchPapers function.
 * - SummarizeResearchPapersOutput - The return type for the summarizeResearchPapers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeResearchPapersInputSchema = z.object({
  papers: z
    .array(
      z.object({
        title: z.string().describe('The title of the research paper.'),
        abstract: z.string().describe('The abstract of the research paper.'),
      })
    )
    .describe('A list of research papers to summarize.'),
});

export type SummarizeResearchPapersInput = z.infer<
  typeof SummarizeResearchPapersInputSchema
>;

const SummarizeResearchPapersOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise and coherent summary of the research papers.'),
});

export type SummarizeResearchPapersOutput = z.infer<
  typeof SummarizeResearchPapersOutputSchema
>;

export async function summarizeResearchPapers(
  input: SummarizeResearchPapersInput
): Promise<SummarizeResearchPapersOutput> {
  return summarizeResearchPapersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeResearchPapersPrompt',
  input: {schema: SummarizeResearchPapersInputSchema},
  output: {schema: SummarizeResearchPapersOutputSchema},
  prompt: `You are an expert researcher specializing in synthesizing information from multiple research papers.

You will be given a list of research papers with their titles and abstracts. Your task is to summarize the key findings and insights from these papers into a concise and coherent overview.

Here are the research papers:
{{#each papers}}
Title: {{{title}}}
Abstract: {{{abstract}}}
\n
{{/each}}

Summary:`, //The \n creates a new line
});

const summarizeResearchPapersFlow = ai.defineFlow(
  {
    name: 'summarizeResearchPapersFlow',
    inputSchema: SummarizeResearchPapersInputSchema,
    outputSchema: SummarizeResearchPapersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
