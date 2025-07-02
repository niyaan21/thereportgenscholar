
'use server';
/**
 * @fileOverview A flow to simulate a plagiarism check on a given text.
 *
 * - plagiarismCheck - A function that analyzes text and returns a simulated plagiarism report.
 * - PlagiarismCheckInput - The input type for the function.
 * - PlagiarismCheckOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PlagiarismCheckInputSchema = z.object({
  text: z.string().min(100, "Text must be at least 100 characters long.").max(50000, "Text is too long for plagiarism check."),
  language: z.string().optional().describe('The language for the response, e.g., "en" or "es".'),
});
export type PlagiarismCheckInput = z.infer<typeof PlagiarismCheckInputSchema>;

const PlagiarismCheckOutputSchema = z.object({
  similarityScore: z.number().min(0).max(100).describe("An overall similarity score percentage calculated based on the number and severity of matches found. This should NOT be a random number."),
  matches: z
    .array(
      z.object({
        sentence: z.string().describe("The exact sentence from the input text that has a potential match."),
        source: z.string().describe("The most likely real source for the potential match (e.g., 'Johnson et al., 2021, Journal of Applied AI'). If a specific source cannot be found, state that it matches 'common academic phrasing' or a similar general attribution."),
        similarity: z.number().min(50).max(100).describe("A high similarity percentage for this specific match."),
        justification: z.string().optional().describe("A brief explanation of why this sentence is considered a match or what makes it similar to the source.")
      })
    )
    .max(5)
    .describe("An array of 2-5 potential matches found in the text."),
});
export type PlagiarismCheckOutput = z.infer<typeof PlagiarismCheckOutputSchema>;

export async function plagiarismCheck(input: PlagiarismCheckInput): Promise<PlagiarismCheckOutput> {
  return plagiarismCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'plagiarismCheckPrompt',
  input: { schema: PlagiarismCheckInputSchema },
  output: { schema: PlagiarismCheckOutputSchema },
  prompt: `You are an advanced AI Research Integrity Analyst. Your task is to analyze the following text and generate an originality report. Your goal is to use your extensive knowledge base, which includes vast amounts of academic papers, books, and web content, to identify sentences that are highly similar to known, real-world sources.
{{#if language}}
CRITICAL: Your analysis and justification in the output must be in the following language: {{{language}}}. Do not translate the source sentence or the citation itself.
{{/if}}

Follow these instructions precisely:
1.  **Calculate a Similarity Score**: Analyze the text for potential matches. Based on the quantity and severity of the matches you find, calculate a realistic overall similarity score percentage. This score must be a direct result of your analysis and not a random number. A document with no strong matches should have a low score (e.g., under 5%), while a document with several direct matches should have a higher score.
2.  **Identify Potential Matches**: Select 2 to 5 distinct, complete sentences from the input text that have a strong resemblance to existing sources.
3.  **Cite Real, Verifiable Sources**: For each selected sentence, you MUST identify the most likely **real source**. Provide the source in a standard citation format (e.g., "Smith, J. (2022). The Future of AI in Research. Academic Press." or "Lee et al., Journal of Machine Learning, Vol. 15, 2023."). **Do not invent sources.** If a specific source cannot be pinpointed but the phrasing is extremely common in academic writing, you may state 'Common academic phrasing'.
4.  **Provide Justification**: For each match, provide a brief (1-2 sentence) justification explaining why it is considered a match. For example, "This sentence uses identical terminology and structure to a key definition in the cited paper."
5.  **Assign Match Similarity**: For each match, assign a high similarity percentage (between 70% and 95%).
6.  **Format Output**: Return the result strictly in the provided JSON schema.

Input Text to Analyze:
{{{text}}}
`,
});

const plagiarismCheckFlow = ai.defineFlow(
  {
    name: 'plagiarismCheckFlow',
    inputSchema: PlagiarismCheckInputSchema,
    outputSchema: PlagiarismCheckOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Plagiarism check failed to produce output.');
    }
    return output;
  }
);
