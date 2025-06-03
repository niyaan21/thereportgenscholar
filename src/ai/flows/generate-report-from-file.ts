
'use server';
/**
 * @fileOverview Generates a comprehensive research report from an uploaded file and user guidance.
 *
 * - generateReportFromFile - A function that generates a research report from a file.
 * - GenerateReportFromFileInput - The input type for the generateReportFromFile function.
 * - GenerateReportFromFileOutput - The return type for the generateReportFromFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { GenerateResearchReportOutput } from './generate-research-report'; // Reusing the same output structure

const ChartSuggestionSchema = z.object({
  type: z.enum(['bar', 'line', 'pie', 'scatter', 'none']).describe('Suggested chart type if applicable (bar, line, pie, scatter, or none).'),
  title: z.string().optional().describe('A concise title for the suggested chart.'),
  dataDescription: z.string().describe('Description of what data this chart should represent (e.g., "Comparison of Group A vs Group B on Metric Z over 5 years").'),
  xAxisLabel: z.string().optional().describe('Suggested X-axis label if applicable.'),
  yAxisLabel: z.string().optional().describe('Suggested Y-axis label if applicable.'),
  categoryDataKey: z.string().optional().describe('The key in the sample data objects that represents the category or X-axis values (e.g., "month", "productName"). Required for bar, line, pie charts if data is provided.'),
  seriesDataKeys: z.array(z.object({
      key: z.string().describe('The key in the sample data objects for this series (e.g., "revenue", "users").'),
      label: z.string().describe('The display label for this series (e.g., "Total Revenue", "Active Users").')
  })).min(1).optional().describe('Defines the data series for the chart. For pie charts, use one series for values. For scatter, first key is Y, second (optional) is Z/size.'),
  data: z.array(z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])))
    .min(2)
    .max(7)
    .optional()
    .describe('An array of 2-7 sample data objects for the chart, e.g., [{category: "A", value1: 10, value2: 20}, ...]. Keys within these objects MUST match the categoryDataKey and the keys defined in seriesDataKeys. For pie charts, data should be like [{name: "Category A", value: 40}, {name: "Category B", value: 60}]. For scatter, like [{xVal: 10, yVal: 20, zVal: 5}, ...]')
});

// Using the same output schema as the other report generator for consistency
const ReportOutputSchema = z.object({
  title: z.string().describe('A concise and informative title for the research report (max 15 words).'),
  executiveSummary: z.string().describe('A brief, high-level summary of the entire report, covering the purpose, key findings, and main conclusions (approx. 300-400 words).'),
  introduction: z.string().describe('An expanded introduction providing detailed background, context, significance of the research problem, and clearly stating the purpose/objectives of the research (approx. 400-500 words).'),
  literatureReview: z.string().describe('A thorough review of existing literature and research relevant to the main research question. Identify key theories, prior findings, and gaps the current research aims to address (approx. 600-800 words).'),
  keyThemes: z.array(z.object({
    theme: z.string().describe('A major theme or area of investigation derived from the research question.'),
    discussion: z.string().describe('A detailed discussion of this theme, synthesizing information and relevant concepts (approx. 250-350 words per theme).')
  })).min(2).max(5).describe('A section outlining and discussing 2-5 key themes or areas investigated based on the file and guidance.'),
  detailedMethodology: z.string().describe('A comprehensive explanation of the typical or proposed methodologies for investigating such a research question. Include research design, data collection approaches (even if hypothetical), and analytical techniques (approx. 500-700 words). This section might be more speculative if based solely on provided content. '),
  resultsAndAnalysis: z.array(z.object({
    sectionTitle: z.string().describe('A descriptive title for this specific result/analysis section.'),
    content: z.string().describe('Detailed presentation and in-depth analysis of a specific segment of results or data. Discuss patterns, trends, and statistical significance if applicable (approx. 300-400 words per section).'),
    chartSuggestion: ChartSuggestionSchema.optional().describe('Suggestion for a chart to visualize this result. If a chart is relevant, provide details including sample data.')
  })).min(2).max(4).describe('Detailed breakdown of 2-4 key results sections, each with analysis and an optional chart suggestion with sample data, derived from the file content.'),
  discussion: z.string().describe('An expanded discussion interpreting the overall findings, their implications, how they relate back to the research question and literature review. Connect different results (approx. 600-800 words).'),
  conclusion: z.string().describe('A robust conclusion summarizing the main findings, their significance, and restating the overall contribution of the research (approx. 350-450 words).'),
  limitations: z.string().optional().describe('A detailed discussion of potential limitations of the research, analysis, or typical approaches to this topic (approx. 200-300 words).'),
  futureWork: z.string().optional().describe('Specific and actionable suggestions for future research directions stemming from the report (approx. 200-300 words).'),
  ethicalConsiderations: z.string().optional().describe('Discussion of any relevant ethical considerations related to the research topic, data handling, or methodology (approx. 150-250 words).'),
  references: z.array(z.string()).min(3).max(10).optional().describe('A list of 3-10 placeholder references in a generic academic format, relevant to the file content and guidance query.'),
  appendices: z.array(z.object({
    title: z.string().describe('Title of the appendix section (e.g., "Appendix A: Detailed Data from File").'),
    content: z.string().describe('Content of the appendix, e.g., placeholder for detailed data tables, or extracted text sections.')
  })).optional().describe('Optional appendices (1-2) for supplementary material derived from the file.'),
  glossary: z.array(z.object({
    term: z.string().describe('A key technical term used in the report related to the file.'),
    definition: z.string().describe('A clear and concise definition of the term.')
  })).min(3).max(7).optional().describe('A glossary of 3-7 key terms used in the report for clarity.'),
});


const GenerateReportFromFileInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "The uploaded file as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  guidanceQuery: z
    .string()
    .min(10, "Guidance query must be at least 10 characters.")
    .max(1000, "Guidance query must be at most 1000 characters.")
    .describe(
      'Specific instructions or areas of focus for the report based on the file content.'
    ),
  fileName: z.string().optional().describe("The name of the uploaded file, for context."),
});
export type GenerateReportFromFileInput = z.infer<
  typeof GenerateReportFromFileInputSchema
>;

export type GenerateReportFromFileOutput = GenerateResearchReportOutput; // Reusing the existing output type

export async function generateReportFromFile(
  input: GenerateReportFromFileInput
): Promise<GenerateReportFromFileOutput> {
  return generateReportFromFileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportFromFilePrompt',
  input: {schema: GenerateReportFromFileInputSchema},
  output: {schema: ReportOutputSchema},
  prompt: `You are an expert research assistant tasked with generating a comprehensive academic research report based on the content of an uploaded file and specific user guidance.

File Context:
{{#if fileName}}File Name: {{{fileName}}}{{/if}}
File Content: {{media url=fileDataUri}}

User Guidance Query:
"{{{guidanceQuery}}}"

Task:
Analyze the provided file content thoroughly. Generate a detailed research report that addresses the user's guidance query. The report should extract key information, themes, data, and insights from the file. Structure the report according to the output schema provided.

If the file content is not directly parseable as text (e.g., it's an image or a very complex/corrupt PDF that resists simple text extraction via OCR by the model), attempt to describe its visual content or any accessible metadata. Then, generate a report primarily focused on the user's guidance query, speculating on how such a file might relate to it, or what kind of information one might expect to find in such a document relevant to the query.

Key report requirements:
1.  **Title**: Create a concise and informative title (max 15 words) reflecting the file content and guidance.
2.  **Executive Summary**: (approx. 200-300 words) Summarize the file's key contributions relevant to the guidance.
3.  **Introduction**: (approx. 300-400 words) Introduce the topic based on the file, and how the guidance query shapes the report's focus.
4.  **Literature Review (Contextual Background)**: (approx. 400-600 words) If the file provides context or cites sources, synthesize this. If not, provide general background relevant to the file's topic and guidance.
5.  **Key Themes from File**: Identify and discuss 2-5 major themes extracted from the file relevant to the guidance. Each theme discussion (approx. 200-300 words).
6.  **Methodology (if applicable)**: (approx. 300-500 words) If the file describes a methodology, summarize it. Otherwise, discuss general methodologies relevant to analyzing such content or topic.
7.  **Results and Analysis from File**: Present 2-4 sections. Each 'sectionTitle' and 'content' (approx. 200-300 words per section) analyzing data/information from the file. Include 'chartSuggestion' where appropriate.
    *   For 'chartSuggestion': If data in the file lends itself to visualization (or if hypothetical data related to the topic could be visualized):
        *   Specify its 'type' (bar, line, pie, scatter), a 'title'.
        *   Provide a 'dataDescription' (what it shows).
        *   Suggest 'xAxisLabel' and 'yAxisLabel'.
        *   Define 'categoryDataKey' (field name for categories/x-axis, e.g., "item_name").
        *   Define 'seriesDataKeys' (array of objects with 'key' for data field and 'label' for display, e.g., [{key: "score", label: "Score"}]).
        *   Provide 2-7 plausible 'data' points (array of objects) that fit the description and keys. Keys in 'data' objects MUST match 'categoryDataKey' and 'seriesDataKeys'.
            Example: If categoryDataKey is "topic" and seriesDataKeys is [{key: "relevance", label: "Relevance Score"}], data could be: [{topic: "AI Ethics", relevance: 85}, {topic: "Data Privacy", relevance: 92}].
        *   If no chart is suitable, set chartSuggestion.type to 'none'. Assume some data extraction or plausible sample data generation is possible if the file context suggests it.
8.  **Discussion**: (approx. 400-600 words) Interpret findings from the file in light of the guidance query.
9.  **Conclusion**: (approx. 250-350 words) Summarize the main takeaways from the file as per the guidance.
10. **Limitations**: (approx. 150-250 words) Discuss limitations of the information in the file or the analysis.
11. **Future Work**: (approx. 150-250 words) Suggest future work based on the file's content.
12. **Ethical Considerations (if applicable)**: (approx. 100-200 words) Discuss ethics if relevant.
13. **References**: (3-10 placeholders) List references if mentioned in the file, or generic relevant ones.
14. **Appendices (Optional)**: (1-2) e.g., for extracted data snippets.
15. **Glossary (Optional)**: (3-7 terms) Define key terms from the file.

Ensure all sections are well-developed and directly utilize or refer to the provided file content as guided by the user's query. The language should be formal and academic.
Generate the full research report now.
`,
});

const generateReportFromFileFlow = ai.defineFlow(
  {
    name: 'generateReportFromFileFlow',
    inputSchema: GenerateReportFromFileInputSchema,
    outputSchema: ReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Report generation from file failed to produce output.');
    }
    return output;
  }
);

