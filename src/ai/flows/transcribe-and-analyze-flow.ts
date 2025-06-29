
'use server';
/**
 * @fileOverview Transcribes an audio/video file and analyzes the resulting text.
 *
 * - transcribeAndAnalyze - A function that handles the transcription and analysis.
 * - TranscribeAndAnalyzeInput - The input type for the function.
 * - TranscribeAndAnalyzeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeAndAnalyzeInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "The audio/video file as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  analysisGuidance: z
    .string()
    .optional()
    .describe(
      'Optional user guidance on what to focus on during analysis (e.g., "focus on action items for the marketing team").'
    ),
  fileName: z.string().optional().describe("The name of the uploaded file, for context."),
  language: z.string().optional().describe('The language for the response, e.g., "en" or "es".'),
});
export type TranscribeAndAnalyzeInput = z.infer<
  typeof TranscribeAndAnalyzeInputSchema
>;

const TranscribeAndAnalyzeOutputSchema = z.object({
  transcription: z.string().describe("The full, accurate transcription of the audio content."),
  summary: z.string().describe("A concise summary of the entire conversation."),
  keyThemes: z
    .array(z.string())
    .describe("A list of 3-5 key themes or topics that were discussed."),
  sentiment: z
    .enum(['Positive', 'Negative', 'Neutral', 'Mixed'])
    .describe("The overall sentiment of the conversation."),
  actionItems: z
    .array(z.string())
    .optional()
    .describe("A list of specific action items or follow-up tasks mentioned in the conversation."),
});
export type TranscribeAndAnalyzeOutput = z.infer<
  typeof TranscribeAndAnalyzeOutputSchema
>;

export async function transcribeAndAnalyze(
  input: TranscribeAndAnalyzeInput
): Promise<TranscribeAndAnalyzeOutput> {
  return transcribeAndAnalyzeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeAndAnalyzePrompt',
  input: {schema: TranscribeAndAnalyzeInputSchema},
  output: {schema: TranscribeAndAnalyzeOutputSchema},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
  prompt: `You are an expert meeting analyst and transcriptionist. Your task is to process an audio file with two main goals:

1.  **Transcribe:** Accurately transcribe the entire audio conversation. Pay attention to different speakers if possible, but a clean, readable transcript is the priority.
2.  **Analyze:** After transcribing, analyze the full text to extract key insights.

{{#if language}}
CRITICAL: Your analysis (summary, keyThemes, sentiment, actionItems) MUST be in the following language: {{{language}}}. The transcription itself should remain in the original language of the audio.
{{/if}}

Use the following user guidance to focus your analysis. If no guidance is provided, perform a general analysis.

{{#if fileName}}
File Name: {{{fileName}}}
{{/if}}

{{#if analysisGuidance}}
User Guidance: "{{{analysisGuidance}}}"
{{else}}
User Guidance: "Perform a general analysis."
{{/if}}

Audio for transcription and analysis: {{media url=fileDataUri}}

Based on your analysis, provide the following in the specified JSON format:
- **transcription**: The full, accurate text from the audio.
- **summary**: A concise summary of the conversation.
- **keyThemes**: A list of 3-5 major themes or topics discussed.
- **sentiment**: The overall sentiment (Positive, Negative, Neutral, or Mixed).
- **actionItems**: A list of specific action items or follow-ups mentioned. If none, provide an empty array.
`,
});

const transcribeAndAnalyzeFlow = ai.defineFlow(
  {
    name: 'transcribeAndAnalyzeFlow',
    inputSchema: TranscribeAndAnalyzeInputSchema,
    outputSchema: TranscribeAndAnalyzeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Transcription and analysis failed to produce output.');
    }
    return output;
  }
);
