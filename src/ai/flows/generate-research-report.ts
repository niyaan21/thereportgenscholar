
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
  generateCharts: z.boolean().optional().describe('Flag to indicate if charts should be generated.'),
});
export type GenerateResearchReportInput = z.infer<
  typeof GenerateResearchReportInputSchema
>;

const ChartSuggestionSchema = z.object({
  type: z.enum(['bar', 'line', 'pie', 'scatter', 'none']).describe('Suggested chart type. If "none", other chart-related fields may be omitted.'),
  title: z.string().optional().describe('A concise title for the suggested chart.'),
  dataDescription: z.string().describe('Description of what data this chart should represent (e.g., "Comparison of Group A vs Group B on Metric Z over 5 years"). This field is crucial if chart type is not "none".'),
  xAxisLabel: z.string().optional().describe('Suggested X-axis label if applicable.'),
  yAxisLabel: z.string().optional().describe('Suggested Y-axis label if applicable.'),
  categoryDataKey: z.string().optional().describe('The key in the sample data objects that represents the category or X-axis values (e.g., "month", "productName"). Important if chart type is not "none".'),
  seriesDataKeys: z.string().optional().describe('A JSON string representing an array of objects, where each object has a "key" and a "label". Example: \'[{"key": "revenue", "label": "Total Revenue"}, {"key": "users", "label": "Active Users"}]\'. Important if chart type is not "none". For pie charts, use one series for values. For scatter, first key is Y, second (optional) is Z/size.'),
  data: z.string().optional().describe('A JSON string representing an array of 2-7 sample data objects. It is CRUCIAL that you generate plausible, contextually relevant sample data that logically fits the research question and this specific results section. Do not use generic placeholders like \'Value A\' or \'Category 1\'. Invent realistic numbers and labels. Keys in these data objects MUST exactly match the \'categoryDataKey\' and the \'key\'s defined in \'seriesDataKeys\'. All values within these data objects (e.g., for \'sales_total\') must be provided as STRINGS (e.g., "1200", "1500.75"). Important if chart type is not "none".')
});

const ResearchReportOutputSchema = z.object({
  title: z.string().describe('A concise and informative title for the research report (max 15 words).'),
  executiveSummary: z.string().describe('A brief, high-level summary of the entire report, covering the purpose, key findings, and main conclusions (approx. 300-400 words).'),
  introduction: z.string().describe('An expanded introduction providing detailed background, context, significance of the research problem, and clearly stating the purpose/objectives of the research (approx. 400-500 words).'),
  literatureReview: z.string().describe('A thorough review of existing literature and research relevant to the main research question. Identify key theories, prior findings, and gaps the current research aims to address (approx. 600-800 words).'),
  keyThemes: z.array(z.object({
    theme: z.string().describe('A major theme or area of investigation derived from the research question.'),
    discussion: z.string().describe('A detailed discussion of this theme, synthesizing information and relevant concepts (approx. 250-350 words per theme).')
  })).optional().describe('A section outlining and discussing 4-6 key themes or areas investigated.'),
  detailedMethodology: z.string().describe('A comprehensive explanation of the typical or proposed methodologies for investigating such a research question. Include research design, data collection approaches (even if hypothetical), and analytical techniques (approx. 500-700 words).'),
  resultsAndAnalysis: z.array(z.object({
    sectionTitle: z.string().describe('A descriptive title for this specific result/analysis section.'),
    content: z.string().describe('Detailed presentation and in-depth analysis of a specific segment of results or data. Discuss patterns, trends, and statistical significance if applicable (approx. 300-400 words per section).'),
    chartSuggestion: ChartSuggestionSchema.optional().describe('Suggestion for a chart to visualize this result. If a chart is relevant, provide details including plausible, context-relevant sample data.')
  })).optional().describe('Detailed breakdown of 3-5 key results sections, each with analysis and an optional chart suggestion with plausible sample data.'),
  discussion: z.string().describe('An expanded discussion interpreting the overall findings, their implications, how they relate back to the research question and literature review. Connect different results (approx. 600-800 words).'),
  conclusion: z.string().describe('A robust conclusion summarizing the main findings, their significance, and restating the overall contribution of the research (approx. 350-450 words).'),
  limitations: z.string().optional().describe('A detailed discussion of potential limitations of the research, analysis, or typical approaches to this topic (approx. 200-300 words).'),
  futureWork: z.string().optional().describe('Specific and actionable suggestions for future research directions stemming from the report (approx. 200-300 words).'),
  ethicalConsiderations: z.string().optional().describe('Discussion of any relevant ethical considerations related to the research topic, data handling, or methodology (approx. 150-250 words).'),
  references: z.array(z.string()).optional().describe('A list of 8-15 real, relevant academic references in a standard format (e.g., APA style). Use your knowledge base to find actual publications. Do not invent sources.'),
  appendices: z.array(z.object({
    title: z.string().describe('Title of the appendix section (e.g., "Appendix A: Survey Instrument Example").'),
    content: z.string().describe('Content of the appendix, e.g., placeholder for detailed data tables, survey instruments, or complex figures.')
  })).optional().describe('Optional appendices (1-3) for supplementary material.'),
  glossary: z.array(z.object({
    term: z.string().describe('A key technical term used in the report.'),
    definition: z.string().describe('A clear and concise definition of the term.')
  })).optional().describe('A glossary of 7-10 key terms used in the report for clarity.'),
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
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
  prompt: `You are an expert research assistant tasked with generating a comprehensive and significantly lengthy academic research report.
The central research question is: "{{researchQuestion}}"

{{#if summary}}
An initial summary has been provided for context and should be significantly expanded upon:
{{{summary}}}
{{/if}}

Please generate a very detailed and extensive research report based on this question. The report must be substantially longer and more in-depth than a typical summary or short article. Aim for considerable depth, breadth, and academic rigor in each section.

Key requirements for the report:
1.  **Title**: Create a concise and informative title (max 15 words).
2.  **Executive Summary**: (approx. 300-400 words) Provide a thorough high-level overview including purpose, key findings, and main conclusions.
3.  **Introduction**: (approx. 400-500 words) Provide extensive background, context, significance of the research problem, and clearly state the purpose, objectives, and scope of the research.
4.  **Literature Review**: (approx. 600-800 words) Conduct an in-depth and critical review of existing literature and research relevant to the main research question. Identify key theories, seminal works, prior findings, methodological approaches, and crucial gaps the current research aims to address. Synthesize the literature to build a strong theoretical foundation.
5.  **Key Themes**: Identify and extensively discuss 4-6 major themes or areas of investigation. Each theme's discussion should be approx. 250-350 words, providing substantial analysis and synthesis of information.
6.  **Detailed Methodology**: (approx. 500-700 words) Describe in great detail the typical or proposed methodologies for investigating such a research question. This should include research design choices (e.g., qualitative, quantitative, mixed-methods), specific data collection approaches (even if hypothetical, explain them thoroughly), sampling strategies, instrumentation, and advanced analytical techniques. Discuss the rationale for these choices and potential challenges.
7.  **Results and Analysis**: Provide 3-5 distinct sections. Each should have a 'sectionTitle', very detailed 'content' (approx. 300-400 words per section discussing patterns, trends, statistical significance if applicable, and nuanced interpretations).
    {{#if generateCharts}}
    CRITICAL: Each section should also have an optional 'chartSuggestion'.
    *   For 'chartSuggestion': If a chart (bar, line, pie, scatter) would be beneficial for illustrating complex data or findings:
        *   Specify its 'type' (bar, line, pie, scatter, or none).
        *   MANDATORY: If type is NOT 'none', you MUST provide 'dataDescription', 'categoryDataKey', 'seriesDataKeys', AND a non-empty 'data' field. If you determine a chart is appropriate, you MUST generate valid sample data for it; failure to do so will result in an error. If you cannot generate valid data, you MUST set 'type' to 'none'.
        *   'title' for the chart is optional.
        *   'xAxisLabel' and 'yAxisLabel' are optional.
        *   'dataDescription' (what it shows, e.g., "Trends of X over Y time, segmented by Group Z").
        *   'categoryDataKey' (the field name for categories/x-axis in your sample data, e.g., "year" or "product_category").
        *   'seriesDataKeys' must be a JSON STRING representing an array of objects, where each object has a "key" and a "label". Example: '[{"key": "revenue", "label": "Total Revenue"}]'.
        *   **CRITICAL**: 'data' must be a NON-EMPTY JSON STRING representing an array of 2-7 plausible data objects. It is CRUCIAL that you generate plausible, contextually relevant sample data that logically fits the research question and this specific results section. Do not use generic placeholders like 'Value A' or 'Category 1'. Invent realistic numbers and labels. Keys in these data objects MUST exactly match the 'categoryDataKey' and the 'key's defined in 'seriesDataKeys'. All values within these data objects (e.g., for 'sales_total') must be provided as STRINGS (e.g., "1200", "1500.75").
            Example (bar/line): If categoryDataKey is "month" and seriesDataKeys is '[{"key": "revenue", "label": "Revenue"}]', the JSON string for 'data' could be: '[{"month": "Jan", "revenue": "1200"}, {"month": "Feb", "revenue": "1500"}, {"month": "Mar", "revenue": "1300"}]'.
            Example (pie): If categoryDataKey is "segment" and seriesDataKeys is '[{"key": "percentage", "label": "Market Share"}]', the JSON string for 'data' could be: '[{"segment": "Alpha", "percentage": "40"}, {"segment": "Beta", "percentage": "30"}, {"segment": "Gamma", "percentage": "30"}]'.
        *   If no chart is suitable for a section, you MUST set chartSuggestion.type to 'none' and other chart-related fields can be omitted.
    {{else}}
    Do NOT generate any chart suggestions. For all 'chartSuggestion' fields, you MUST set the 'type' to 'none'.
    {{/if}}
8.  **Discussion**: (approx. 600-800 words) Interpret the overall (hypothetical or synthesized) findings in great depth. Discuss their implications, how they relate back to the research question and literature review, and how they contribute to the field. Connect different results, address inconsistencies, and explore alternative interpretations.
9.  **Conclusion**: (approx. 350-450 words) Provide a robust conclusion summarizing the main findings, their significance, and restating the overall contribution of the research. Reiterate the answers to the research objectives.
10. **Limitations**: (approx. 200-300 words) Detail potential limitations of the research, analysis, or typical approaches to this topic, including scope, methodology, and data.
11. **Future Work**: (approx. 200-300 words) Offer specific, insightful, and actionable suggestions for future research directions stemming from the report. These should be well-justified.
12. **Ethical Considerations**: (approx. 150-250 words) Discuss any relevant ethical considerations related to the research topic, data handling, methodology, or potential impact.
13. **References**: Provide 8-15 real, relevant academic references in a standard format (e.g., APA style). Use your knowledge base to find actual publications. Do not invent sources.
14. **Appendices (Optional)**: Suggest 1-3 appendices with a 'title' and placeholder 'content' for supplementary material like detailed data tables, survey instruments, complex figures, or extended theoretical discussions.
15. **Glossary (Optional)**: Define 7-10 key technical 'term's used in the report with their clear and concise 'definition'.

Ensure all sections are well-developed, substantially detailed, and contribute to a comprehensive, in-depth academic report. The language should be formal, precise, and scholarly. The overall length of the report should be significant.

Generate the full, extensive, and detailed research report now.
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
