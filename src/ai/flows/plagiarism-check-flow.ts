
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
        source: z.string().describe("A plausible, invented academic source for the potential match (e.g., 'Johnson et al., 2021, Journal of Applied AI')."),
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
  prompt: `You are a simulated Plagiarism Detection System. Your task is to analyze the following text and generate a plausible-looking plagiarism report. Do not perform a real web search.

Follow these instructions precisely:
1.  **Calculate a Similarity Score**: Generate a plausible overall similarity score. This should be a percentage, typically low for AI-generated academic-style text, so pick a value between 5 and 25.
2.  **Identify Potential Matches**: Select 2 to 5 distinct, complete sentences from the input text that look like they could be citations or strong statements of fact.
3.  **Fabricate Sources**: For each selected sentence, invent a realistic, academic-sounding source. The source should look like a real citation (e.g., "Smith, J. (2022). The Future of AI in Research. Academic Press." or "Lee et al., Journal of Machine Learning, Vol. 15, 2023.").
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
      throw new Error('Plagiarism check simulation failed to produce output.');
    }
    return output;
  }
);
