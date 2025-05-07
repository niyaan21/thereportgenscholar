'use server';
/**
 * @fileOverview Generates a comprehensive research report from a research question.
 *
 * - generateResearchReport - A function that generates a research report.
 * - GenerateResearchReportInput - The input type for the generateResearchReport function.
 * - GenerateResearchReportOutput - The return type for the generateResearchReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResearchReportInputSchema = z.object({
  researchQuestion: z
    .string()
    .describe('The central research question for the report.'),
  summary: z.string().optional().describe('An existing summary of the research, if available, to provide context.'),
});
export type GenerateResearchReportInput = z.infer<
  typeof GenerateResearchReportInputSchema
>;

const ResearchReportOutputSchema = z.object({
  title: z.string().describe('A concise and informative title for the research report.'),
  introduction: z.string().describe('An introduction providing background, context, and the purpose of the research.'),
  keyThemes: z.array(z.object({
    theme: z.string().describe('A major theme or area of investigation.'),
    discussion: z.string().describe('A detailed discussion of this theme, synthesizing information.')
  })).describe('A section outlining and discussing the key themes or areas investigated, derived from the research question.'),
  methodology: z.string().describe('A brief overview of the typical methodologies that would be used to investigate such a research question. (AI-generated based on common research approaches for the topic).'),
  findings: z.array(z.object({
    statement: z.string().describe('A key finding or result.'),
    elaboration: z.string().optional().describe('Further details or context for the finding.')
  })).describe('A list of key findings or results based on the synthesized information.'),
  discussion: z.string().describe('A discussion interpreting the findings, their implications, and relating them back to the research question.'),
  conclusion: z.string().describe('A conclusion summarizing the main points of the report and their significance.'),
  limitations: z.string().optional().describe('Potential limitations of the research or analysis.'),
  futureWork: z.string().optional().describe('Suggestions for future research directions based on the report.'),
  references: z.array(z.string()).optional().describe('A list of placeholder references, e.g., "AI Synthesized Reference 1: [Topic]".'),
});
export type GenerateResearchReportOutput = z.infer<
  typeof ResearchReportOutputSchema
>;

export async function generateResearchReport(
  input: GenerateResearchReportInput
): Promise<GenerateResearchReportOutput> {
  return generateResearchReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResearchReportPrompt',
  input: {schema: GenerateResearchReportInputSchema},
  output: {schema: ResearchReportOutputSchema},
  prompt: `You are an expert research assistant tasked with generating a comprehensive research report.
The central research question is: "{{researchQuestion}}"

{{#if summary}}
An initial summary has been provided for context:
{{{summary}}}
{{/if}}

Please generate a detailed research report based on this question. The report should be structured, coherent, and written in an academic style.
Ensure all sections defined in the output schema are addressed. For key themes, identify 2-3 major areas derived from the research question and discuss them.
For methodology, briefly describe common approaches for this type of research.
For references, provide a list of 3-5 placeholder references in a generic academic format, like "AI Synthesized Reference X: [Relevant Topic/Concept from research question]".

Generate the full report now.
`,
});

const generateResearchReportFlow = ai.defineFlow(
  {
    name: 'generateResearchReportFlow',
    inputSchema: GenerateResearchReportInputSchema,
    outputSchema: ResearchReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Research report generation failed to produce output.');
    }
    return output;
  }
);
