
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
    .min(5, "Topic must be at least 5 characters long.")
    .max(200, "Topic must be at most 200 characters long.")
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
      prompt: `Generate an exceptionally detailed and visually captivating conceptual artwork that serves as a powerful metaphor for the research topic: "${input.topic}". The image must be abstract and symbolic, evoking a strong sense of intellectual depth, groundbreaking discovery, and the intricate interconnectedness of complex ideas. Emphasize dynamic visual elements, sophisticated and harmonious color palettes, and a modern, almost futuristic digital art style suitable for a keynote presentation or research publication. Strictly avoid any text, letters, numbers, or overly literal depictions of objects or people. The artwork should be thought-provoking, inspiring curiosity and contemplation. Aim for a highly polished, professional aesthetic with rich textures, intricate details, and a strong, balanced composition. The visual should be suitable for a discerning academic or professional audience.`,
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

