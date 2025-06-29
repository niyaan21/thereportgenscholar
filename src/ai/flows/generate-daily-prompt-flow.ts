'use server';
/**
 * @fileOverview Generates a daily research prompt.
 *
 * - generateDailyPrompt - A function that generates a research prompt.
 * - GenerateDailyPromptOutput - The return type for the generateDailyPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyPromptInputSchema = z.object({
  language: z.string().optional().describe('The language for the response, e.g., "en" or "es".'),
});
export type GenerateDailyPromptInput = z.infer<typeof GenerateDailyPromptInputSchema>;


const GenerateDailyPromptOutputSchema = z.object({
  prompt: z.string().describe('A thought-provoking research question.'),
  category: z.string().describe('The category of the research question (e.g., Technology, Science, Humanities).'),
});
export type GenerateDailyPromptOutput = z.infer<typeof GenerateDailyPromptOutputSchema>;

export async function generateDailyPrompt(input: GenerateDailyPromptInput): Promise<GenerateDailyPromptOutput> {
  return generateDailyPromptFlow(input);
}

const promptTemplate = ai.definePrompt({
  name: 'generateDailyPromptSystemPrompt',
  input: {schema: GenerateDailyPromptInputSchema},
  output: {schema: GenerateDailyPromptOutputSchema},
  prompt: `You are an academic muse. Your task is to generate a single, novel, and thought-provoking research question suitable for a university-level student or an independent researcher. The question should encourage critical thinking, interdisciplinary exploration, or investigation into emerging trends.
{{#if language}}
Your entire response must be in the following language: {{{language}}}.
{{/if}}

Please also provide a broad category for this question. Examples of categories include: Technology, Science, Humanities, Social Sciences, Arts, Environment, Health, Economics.

Generate one such research question and its category.`,
});

const generateDailyPromptFlow = ai.defineFlow(
  {
    name: 'generateDailyPromptFlow',
    inputSchema: GenerateDailyPromptInputSchema,
    outputSchema: GenerateDailyPromptOutputSchema,
  },
  async (input) => {
    const {output} = await promptTemplate(input);
    if (!output) {
      throw new Error('Failed to generate a daily prompt.');
    }
    return output;
  }
);
