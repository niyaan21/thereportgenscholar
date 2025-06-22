'use server';
/**
 * @fileOverview Generates a daily research prompt.
 *
 * - generateDailyPrompt - A function that generates a research prompt.
 * - GenerateDailyPromptOutput - The return type for the generateDailyPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyPromptOutputSchema = z.object({
  prompt: z.string().describe('A thought-provoking research question.'),
  category: z.string().describe('The category of the research question (e.g., Technology, Science, Humanities).'),
});
export type GenerateDailyPromptOutput = z.infer<typeof GenerateDailyPromptOutputSchema>;

export async function generateDailyPrompt(): Promise<GenerateDailyPromptOutput> {
  return generateDailyPromptFlow({});
}

const promptTemplate = ai.definePrompt({
  name: 'generateDailyPromptSystemPrompt',
  output: {schema: GenerateDailyPromptOutputSchema},
  model: 'gemini-2.5-flash',
  prompt: `You are an academic muse. Your task is to generate a single, novel, and thought-provoking research question suitable for a university-level student or an independent researcher. The question should encourage critical thinking, interdisciplinary exploration, or investigation into emerging trends.

Please also provide a broad category for this question. Examples of categories include: Technology, Science, Humanities, Social Sciences, Arts, Environment, Health, Economics.

Generate one such research question and its category.`,
});

const generateDailyPromptFlow = ai.defineFlow(
  {
    name: 'generateDailyPromptFlow',
    outputSchema: GenerateDailyPromptOutputSchema,
  },
  async () => {
    const {output} = await promptTemplate({});
    if (!output) {
      throw new Error('Failed to generate a daily prompt.');
    }
    return output;
  }
);
