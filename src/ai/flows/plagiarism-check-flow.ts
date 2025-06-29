
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
});
export type PlagiarismCheckInput = z.infer<typeof PlagiarismCheckInputSchema>;

const PlagiarismCheckOutputSchema = z.object({
  similarityScore: z.number().min(0).max(100).describe("A plausible overall similarity score percentage (e.g., between 5 and 25)."),
  matches: z
    .array(
      z.object({
        sentence: z.string().describe("The exact sentence from the input text that has a potential match."),
        source: z.string().describe("The most likely real source for the potential match (e.g., 'Johnson et al., 2021, Journal of Applied AI'). If a specific source cannot be found, state that it matches 'common academic phrasing' or a similar general attribution."),
        similarity: z.number().min(50).max(100).describe("A high similarity percentage for this specific match."),
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
  prompt: `You are an advanced Plagiarism Detection System. Your task is to analyze the following text and generate a plagiarism report. Use your extensive knowledge base to identify sentences or phrases that are highly similar to known publications, academic papers, or online sources.

Follow these instructions precisely:
1.  **Calculate a Similarity Score**: Based on your analysis, provide a realistic overall similarity score percentage, reflecting the proportion of text that has potential matches.
2.  **Identify Potential Matches**: Select 2 to 5 distinct, complete sentences from the input text that have a strong resemblance to existing sources.
3.  **Cite Real Sources**: For each selected sentence, identify the most likely real source. This could be a published paper, a book, or a reputable website. Provide the source in a standard citation format (e.g., "Smith, J. (2022). The Future of AI in Research. Academic Press." or "Lee et al., Journal of Machine Learning, Vol. 15, 2023."). If you cannot find a specific source, indicate that it matches 'common academic phrasing' or a similar general attribution.
4.  **Assign Match Similarity**: For each match, assign a high similarity percentage (between 70 and 95).
5.  **Format Output**: Return the result strictly in the provided JSON schema.

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
