
'use server';
/**
 * @fileOverview Extracts key concepts from text to form a basic structure for a mindmap.
 *
 * - extractMindmapConcepts - A function that processes text to find mindmap concepts.
 * - ExtractMindmapConceptsInput - The input type for the function.
 * - ExtractMindmapConceptsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractMindmapConceptsInputSchema = z.object({
  textToAnalyze: z
    .string()
    .min(50, "Text must be at least 50 characters long.")
    .max(10000, "Text must be at most 10,000 characters long.")
    .describe('The text content from which to extract mindmap concepts.'),
});
export type ExtractMindmapConceptsInput = z.infer<
  typeof ExtractMindmapConceptsInputSchema
>;

const ExtractedConceptSchema = z.object({
  concept: z.string().describe("A main concept, idea, or entity identified in the text."),
  relatedTerms: z.array(z.string()).max(7).describe("A list of 3-7 closely related terms, sub-ideas, properties, or examples connected to this main concept.")
});

const ExtractMindmapConceptsOutputSchema = z.object({
  mainIdea: z.string().describe("The central theme or overarching main idea derived from the provided text."),
  keyConcepts: z
    .array(ExtractedConceptSchema)
    .min(3).max(10)
    .describe('An array of 3-10 key concepts extracted from the text, each with a few related terms or sub-ideas.'),
});
export type ExtractMindmapConceptsOutput = z.infer<
  typeof ExtractMindmapConceptsOutputSchema
>;

export async function extractMindmapConcepts(
  input: ExtractMindmapConceptsInput
): Promise<ExtractMindmapConceptsOutput> {
  return extractMindmapConceptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractMindmapConceptsPrompt',
  input: {schema: ExtractMindmapConceptsInputSchema},
  output: {schema: ExtractMindmapConceptsOutputSchema},
  prompt: `You are an expert text analyst specializing in structuring information for mind maps.
Given the following text, your task is to:
1. Identify the single most central theme or main idea of the text.
2. Extract 3 to 10 key concepts, main ideas, or important entities from the text.
3. For each key concept, list 3 to 7 closely related terms, sub-ideas, properties, or illustrative examples found within or directly implied by the text.

Text to Analyze:
{{{textToAnalyze}}}

Present your output in the specified JSON format. Ensure the 'mainIdea' is a concise summary of the text's core message. Each 'concept' in 'keyConcepts' should be a distinct major theme or entity, and its 'relatedTerms' should be specific and directly relevant supporting details or sub-points.
`,
});

const extractMindmapConceptsFlow = ai.defineFlow(
  {
    name: 'extractMindmapConceptsFlow',
    inputSchema: ExtractMindmapConceptsInputSchema,
    outputSchema: ExtractMindmapConceptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Mindmap concept extraction failed to produce output.');
    }
    return output;
  }
);
