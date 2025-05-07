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
  summary: z.string().optional().describe('An existing summary of the research, if available, to provide context and seed the report.'),
});
export type GenerateResearchReportInput = z.infer<
  typeof GenerateResearchReportInputSchema
>;

const ChartSuggestionSchema = z.object({
  type: z.enum(['bar', 'line', 'pie', 'scatter', 'none']).describe('Suggested chart type if applicable (bar, line, pie, scatter, or none).'),
  title: z.string().optional().describe('A concise title for the suggested chart.'),
  dataDescription: z.string().describe('Description of what data this chart should represent (e.g., "Comparison of Group A vs Group B on Metric Z over 5 years").'),
  xAxisLabel: z.string().optional().describe('Suggested X-axis label if applicable.'),
  yAxisLabel: z.string().optional().describe('Suggested Y-axis label if applicable.'),
});

const ResearchReportOutputSchema = z.object({
  title: z.string().describe('A concise and informative title for the research report (max 15 words).'),
  executiveSummary: z.string().describe('A brief, high-level summary of the entire report, covering the purpose, key findings, and main conclusions (approx. 200-300 words).'),
  introduction: z.string().describe('An expanded introduction providing detailed background, context, significance of the research problem, and clearly stating the purpose/objectives of the research (approx. 300-400 words).'),
  literatureReview: z.string().describe('A thorough review of existing literature and research relevant to the main research question. Identify key theories, prior findings, and gaps the current research aims to address (approx. 400-600 words).'),
  keyThemes: z.array(z.object({
    theme: z.string().describe('A major theme or area of investigation derived from the research question.'),
    discussion: z.string().describe('A detailed discussion of this theme, synthesizing information and relevant concepts (approx. 200-300 words per theme).')
  })).describe('A section outlining and discussing 3-5 key themes or areas investigated.'),
  detailedMethodology: z.string().describe('A comprehensive explanation of the typical or proposed methodologies for investigating such a research question. Include research design, data collection approaches (even if hypothetical), and analytical techniques (approx. 400-500 words).'),
  resultsAndAnalysis: z.array(z.object({
    sectionTitle: z.string().describe('A descriptive title for this specific result/analysis section.'),
    content: z.string().describe('Detailed presentation and in-depth analysis of a specific segment of results or data. Discuss patterns, trends, and statistical significance if applicable (approx. 250-350 words per section).'),
    chartSuggestion: ChartSuggestionSchema.optional().describe('Suggestion for a chart to visualize this result. If a chart is relevant, provide details.')
  })).min(2).max(4).describe('Detailed breakdown of 2-4 key results sections, each with analysis and an optional chart suggestion.'),
  discussion: z.string().describe('An expanded discussion interpreting the overall findings, their implications, how they relate back to the research question and literature review. Connect different results (approx. 400-600 words).'),
  conclusion: z.string().describe('A robust conclusion summarizing the main findings, their significance, and restating the overall contribution of the research (approx. 250-350 words).'),
  limitations: z.string().optional().describe('A detailed discussion of potential limitations of the research, analysis, or typical approaches to this topic (approx. 150-250 words).'),
  futureWork: z.string().optional().describe('Specific and actionable suggestions for future research directions stemming from the report (approx. 150-250 words).'),
  ethicalConsiderations: z.string().optional().describe('Discussion of any relevant ethical considerations related to the research topic, data handling, or methodology (approx. 100-200 words).'),
  references: z.array(z.string()).optional().describe('A list of 5-10 placeholder references in a generic academic format, like "AI Synthesized Reference X: [Relevant Topic/Concept from research question]".'),
  appendices: z.array(z.object({
    title: z.string().describe('Title of the appendix section (e.g., "Appendix A: Survey Instrument Example").'),
    content: z.string().describe('Content of the appendix, e.g., placeholder for detailed data tables, survey instruments, or complex figures.')
  })).optional().describe('Optional appendices (1-2) for supplementary material.'),
  glossary: z.array(z.object({
    term: z.string().describe('A key technical term used in the report.'),
    definition: z.string().describe('A clear and concise definition of the term.')
  })).optional().describe('A glossary of 5-7 key terms used in the report for clarity.'),
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
  prompt: `You are an expert research assistant tasked with generating a comprehensive and lengthy academic research report.
The central research question is: "{{researchQuestion}}"

{{#if summary}}
An initial summary has been provided for context and should be expanded upon:
{{{summary}}}
{{/if}}

Please generate a very detailed and extensive research report based on this question. The report should be well-structured, coherent, written in a formal academic style, and be substantially longer than a typical summary. Aim for depth in each section.

Key requirements for the report:
1.  **Title**: Create a concise and informative title (max 15 words).
2.  **Executive Summary**: (approx. 200-300 words) Provide a high-level overview including purpose, key findings, and conclusions.
3.  **Introduction**: (approx. 300-400 words) Detail background, context, problem significance, and research objectives.
4.  **Literature Review**: (approx. 400-600 words) Thoroughly review relevant literature, theories, prior findings, and identify research gaps.
5.  **Key Themes**: Identify and discuss 3-5 major themes. Each theme's discussion should be approx. 200-300 words.
6.  **Detailed Methodology**: (approx. 400-500 words) Describe typical/proposed research design, data collection (hypothetical is fine), and analytical techniques in detail.
7.  **Results and Analysis**: Provide 2-4 distinct sections. Each should have a 'sectionTitle', detailed 'content' (approx. 250-350 words discussing patterns, trends), and an optional 'chartSuggestion'.
    *   For 'chartSuggestion': If a chart (bar, line, pie, scatter) would be beneficial, specify its 'type', a 'title' for the chart, 'dataDescription' (what it shows, e.g., "Trends of X over Y time"), and optional 'xAxisLabel' and 'yAxisLabel'. If no chart is suitable for a section, set type to 'none'.
8.  **Discussion**: (approx. 400-600 words) Interpret overall findings, discuss implications, relate to literature, and connect different results.
9.  **Conclusion**: (approx. 250-350 words) Summarize main findings, their significance, and the research's contribution.
10. **Limitations**: (approx. 150-250 words) Detail potential limitations.
11. **Future Work**: (approx. 150-250 words) Offer specific suggestions for future research.
12. **Ethical Considerations**: (approx. 100-200 words) Discuss relevant ethical issues.
13. **References**: Provide 5-10 placeholder academic references, e.g., "Author, A. A. (Year). Title of work. Publisher." or "AI Synthesized Reference X: [Topic]".
14. **Appendices (Optional)**: Suggest 1-2 appendices with a 'title' and placeholder 'content' description.
15. **Glossary (Optional)**: Define 5-7 key 'term's used in the report with their 'definition'.

Ensure all sections are well-developed and contribute to a comprehensive, in-depth report. The language should be academic and precise.

Generate the full, extensive research report now.
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
