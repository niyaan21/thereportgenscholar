'use server';
/**
 * @fileOverview Generates an image representing a research topic.
 *
 * - generateResearchImage - A function that generates an image for a research topic.
 * - GenerateResearchImageInput - The input type for the generateResearchImage function.
 * - GenerateResearchImageOutput - The return type for the generateResearchImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResearchImageInputSchema = z.object({
  topic: z
    .string()
    .describe('The research topic or question to generate an image for.'),
});
export type GenerateResearchImageInput = z.infer<
  typeof GenerateResearchImageInputSchema
>;

const GenerateResearchImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateResearchImageOutput = z.infer<
  typeof GenerateResearchImageOutputSchema
>;

export async function generateResearchImage(
  input: GenerateResearchImageInput
): Promise<GenerateResearchImageOutput> {
  return generateResearchImageFlow(input);
}

// Note: This flow uses a specific model capable of image generation.
const generateResearchImageFlow = ai.defineFlow(
  {
    name: 'generateResearchImageFlow',
    inputSchema: GenerateResearchImageInputSchema,
    outputSchema: GenerateResearchImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // IMPORTANT: Specific model for image generation
      prompt: `Generate an artistic and abstract visual representation of the research topic: "${input.topic}". The image should be suitable for a scientific research context, conveying complexity and insight. Avoid text in the image.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed or returned no media URL.');
    }

    return {imageDataUri: media.url};
  }
);
