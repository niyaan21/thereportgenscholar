
'use server';
/**
 * @fileOverview Generates an image representing a research topic.
 *
 * - generateResearchImage - A function that generates an image for a research topic.
 * - GenerateResearchImageInput - The input type for the generateResearchImage function.
 * - GenerateResearchImageOutput - The return type for the generateResearchImage function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
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


// Define two prompts: a detailed one and a simpler fallback.
const complexPromptTemplate = `Generate an exceptionally detailed and visually captivating conceptual artwork that serves as a powerful metaphor for the research topic: "{TOPIC}". The image must be abstract and symbolic, evoking a strong sense of intellectual depth, groundbreaking discovery, and the intricate interconnectedness of complex ideas. Emphasize dynamic visual elements, sophisticated and harmonious color palettes, and a modern, almost futuristic digital art style suitable for a keynote presentation or research publication. Strictly avoid any text, letters, numbers, or overly literal depictions of objects or people. The artwork should be thought-provoking, inspiring curiosity and contemplation. Aim for a highly polished, professional aesthetic with rich textures, intricate details, and a strong, balanced composition. The visual should be suitable for a discerning academic or professional audience. The artwork must be unique and specifically tailored to the nuances of the research topic, avoiding generic symbols or themes.`;
const simplePromptTemplate = `Generate a modern, abstract, symbolic digital artwork representing the research topic: "{TOPIC}". Avoid any text or letters.`;


const generateResearchImageFlow = ai.defineFlow(
  {
    name: 'generateResearchImageFlow',
    inputSchema: GenerateResearchImageInputSchema,
    outputSchema: GenerateResearchImageOutputSchema,
  },
  async (input) => {
    // Helper function to call the image generation API
    const generate = async (promptText: string) => {
        const { media } = await ai.generate({
          model: googleAI.model('gemini-2.0-flash-preview-image-generation'),
          prompt: promptText,
          // `responseModalities` is a top-level property, not inside a `config` object.
          responseModalities: ['TEXT', 'IMAGE'],
        });

        if (!media || !media.url) {
            throw new Error('Image generation call succeeded but returned no media URL.');
        }

        return { imageDataUri: media.url };
    }

    // First attempt: Use the detailed, complex prompt
    try {
        console.log("Attempting image generation with the detailed prompt...");
        const finalComplexPrompt = complexPromptTemplate.replace('{TOPIC}', input.topic);
        return await generate(finalComplexPrompt);
    } catch (error) {
        console.warn("Detailed image prompt failed. This can happen with experimental models. Trying a simpler prompt.", error);
        
        // Second attempt (fallback): Use the simpler prompt
        try {
            console.log("Attempting image generation with the simpler fallback prompt...");
            const finalSimplePrompt = simplePromptTemplate.replace('{TOPIC}', input.topic);
            return await generate(finalSimplePrompt);
        } catch (finalError) {
            console.error("The simpler fallback prompt also failed.", finalError);
            // If both attempts fail, throw a user-friendly error.
            throw new Error('Image generation failed on two attempts. The model may be unavailable or the topic might be too complex. Please try again later.');
        }
    }
  }
);
