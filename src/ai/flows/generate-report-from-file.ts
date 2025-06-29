
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
  type: z.enum(['bar', 'line', 'pie', 'scatter', 'none']).describe('Suggested chart type. If "none", other chart-related fields may be omitted.'),
  title: z.string().optional().describe('A concise title for the suggested chart.'),
  dataDescription: z.string().describe('Description of what data this chart should represent (e.g., "Comparison of Group A vs Group B on Metric Z over 5 years"). This field is crucial if chart type is not "none".'),
  xAxisLabel: z.string().optional().describe('Suggested X-axis label if applicable.'),
  yAxisLabel: z.string().optional().describe('Suggested Y-axis label if applicable.'),
  categoryDataKey: z.string().optional().describe('The key in the sample data objects that represents the category or X-axis values (e.g., "month", "productName"). Important if chart type is not "none".'),
  seriesDataKeys: z.string().optional().describe('A JSON string representing an array of objects, where each object has a "key" and a "label". Example: \'[{"key": "revenue", "label": "Total Revenue"}, {"key": "users", "label": "Active Users"}]\'. Important if chart type is not "none". For pie charts, use one series for values. For scatter, first key is Y, second (optional) is Z/size.'),
   data: z.string().optional().describe('A JSON string representing an array of 2-7 sample data objects. It is CRUCIAL that you generate plausible, contextually relevant sample data that logically fits the research question and this specific results section. Do not use generic placeholders like \'Value A\' or \'Category 1\'. Invent realistic numbers and labels. Keys in these data objects MUST exactly match the \'categoryDataKey\' and the \'key\'s defined in \'seriesDataKeys\'. All values within these data objects (e.g., for \'sales_total\') must be provided as STRINGS (e.g., "1200", "1500.75"). Important if chart type is not "none".')
});

// Mindmap Schemas (copied from extract-mindmap-concepts.ts)
const ExtractedConceptSchema = z.object({
  concept: z.string().describe("A main concept, idea, or entity identified in the text."),
  relatedTerms: z.array(z.string()).describe("A list of 3-7 closely related terms, sub-ideas, properties, or examples connected to this main concept.")
});

const ExtractMindmapConceptsOutputSchema = z.object({
  mainIdea: z.string().describe("The central theme or overarching main idea derived from the provided text."),
  keyConcepts: z
    .array(ExtractedConceptSchema)
    .describe('An array of 3-10 key concepts extracted from the text, each with a few related terms or sub-ideas.'),
});


const ReportOutputSchema = z.object({
  title: z.string().describe('A concise and informative title for the research report (max 15 words).'),
  executiveSummary: z.string().describe('A brief, high-level summary of the entire report, covering the purpose, key findings, and main conclusions (approx. 300-400 words).'),
  introduction: z.string().describe('An expanded introduction providing detailed background, context, significance of the research problem, and clearly stating the purpose/objectives of the research (approx. 400-500 words).'),
  literatureReview: z.string().describe('A thorough review of existing literature and research relevant to the main research question. Identify key theories, prior findings, and gaps the current research aims to address (approx. 600-800 words).'),
  keyThemes: z.array(z.object({
    theme: z.string().describe('A major theme or area of investigation derived from the research question.'),
    discussion: z.string().describe('A detailed discussion of this theme, synthesizing information and relevant concepts (approx. 250-350 words per theme).')
  })).optional().describe('A section outlining and discussing 2-5 key themes or areas investigated based on the file and guidance.'),
  detailedMethodology: z.string().describe('A comprehensive explanation of the typical or proposed methodologies for investigating such a research question. Include research design, data collection approaches (even if hypothetical), and analytical techniques (approx. 500-700 words). This section might be more speculative if based solely on provided content. '),
  resultsAndAnalysis: z.array(z.object({
    sectionTitle: z.string().describe('A descriptive title for this specific result/analysis section.'),
    content: z.string().describe('Detailed presentation and in-depth analysis of a specific segment of results or data. Discuss patterns, trends, and statistical significance if applicable (approx. 300-400 words per section).'),
    chartSuggestion: ChartSuggestionSchema.optional().describe('Suggestion for a chart to visualize this result. If a chart is relevant, provide details including plausible, context-relevant sample data derived from or representative of the file content.')
  })).optional().describe('Detailed breakdown of 2-4 key results sections, each with analysis and an optional chart suggestion with plausible sample data, derived from the file content.'),
  discussion: z.string().describe('An expanded discussion interpreting the overall findings, their implications, how they relate back to the research question and literature review. Connect different results (approx. 600-800 words).'),
  conclusion: z.string().describe('A robust conclusion summarizing the main findings, their significance, and restating the overall contribution of the research (approx. 350-450 words).'),
  limitations: z.string().optional().describe('A detailed discussion of potential limitations of the research, analysis, or typical approaches to this topic (approx. 200-300 words).'),
  futureWork: z.string().optional().describe('Specific and actionable suggestions for future research directions stemming from the report (approx. 200-300 words).'),
  ethicalConsiderations: z.string().optional().describe('Discussion of any relevant ethical considerations related to the research topic, data handling, or methodology (approx. 150-250 words).'),
  references: z.array(z.string()).optional().describe('A list of 3-10 placeholder references in a generic academic format, relevant to the file content and guidance query.'),
  appendices: z.array(z.object({
    title: z.string().describe('Title of the appendix section (e.g., "Appendix A: Detailed Data from File").'),
    content: z.string().describe('Content of the appendix, e.g., placeholder for detailed data tables, or extracted text sections.')
  })).optional().describe('Optional appendices (1-2) for supplementary material derived from the file.'),
  glossary: z.array(z.object({
    term: z.string().describe('A key technical term used in the report related to the file.'),
    definition: z.string().describe('A clear and concise definition of the term.')
  })).optional().describe('A glossary of 3-7 key terms used in the report for clarity.'),
  mindmapData: ExtractMindmapConceptsOutputSchema.optional().describe('Optional mind map data extracted from the document.'),
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
  generateMindmap: z.boolean().optional().describe("Flag to indicate if mind map data should be generated."),
  generateCharts: z.boolean().optional().describe("Flag to indicate if charts should be generated."),
});
export type GenerateReportFromFileInput = z.infer<
  typeof GenerateReportFromFileInputSchema
>;

export type GenerateReportFromFileOutput = z.infer<typeof ReportOutputSchema>; // Updated output type

export async function generateReportFromFile(
  input: GenerateReportFromFileInput
): Promise<GenerateReportFromFileOutput> {
  return generateReportFromFileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportFromFilePrompt',
  input: {schema: GenerateReportFromFileInputSchema},
  output: {schema: ReportOutputSchema},
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
7.  **Results and Analysis from File**: Present 2-4 sections. Each 'sectionTitle' and 'content' (approx. 200-300 words per section) analyzing data/information from the file.
    {{#if generateCharts}}
    Include 'chartSuggestion' where appropriate.
    *   For 'chartSuggestion': If data in the file lends itself to visualization (or if hypothetical data related to the topic could be visualized):
        *   Specify its 'type' (bar, line, pie, scatter, or none).
        *   If type is NOT 'none', you MUST provide 'dataDescription', 'categoryDataKey', 'seriesDataKeys', and 'data'. If you determine a chart is appropriate, you MUST generate valid sample data for it; failure to do so will result in an error.
        *   'title' for the chart is optional.
        *   'xAxisLabel' and 'yAxisLabel' are optional.
        *   'dataDescription' (what it shows, e.g., "Trends of X over Y time, segmented by Group Z").
        *   'categoryDataKey' (the field name for categories/x-axis in your sample data, e.g., "item_name").
        *   'seriesDataKeys' must be a JSON STRING representing an array of objects, where each object has a "key" and a "label". Example: '[{"key": "revenue", "label": "Total Revenue"}]'.
        *   **MANDATORY FOR CHARTS**: 'data' must be a NON-EMPTY JSON STRING representing an array of 2-7 plausible data objects. It is CRUCIAL that this sample data is derived from patterns or information in the file content if available. If the file lacks specific numerical data, you MUST generate plausible, non-generic sample data that logically fits the file's topic and the user's guidance query. Invent realistic numbers and labels. Avoid placeholders. Keys in 'data' objects MUST match 'categoryDataKey' and the 'key' in the 'seriesDataKeys' objects. IMPORTANT FOR SCHEMA: All values within these data objects (e.g., for 'score') must be provided as STRINGS (e.g., "85", "92.5").
            Example: If categoryDataKey is "topic" and seriesDataKeys is '[{"key": "relevance", "label": "Relevance Score"}]', the JSON string for 'data' could be: '[{"topic": "AI Ethics", "relevance": "85"}, {"topic": "Data Privacy", "relevance": "92"}]'.
        *   If no chart is suitable, set chartSuggestion.type to 'none' and other chart-related fields can be omitted. Assume some data extraction or plausible sample data generation is possible if the file context suggests it.
    {{else}}
    Do NOT generate any chart suggestions. For all 'chartSuggestion' fields, set the 'type' to 'none'.
    {{/if}}
8.  **Discussion**: (approx. 400-600 words) Interpret findings from the file in light of the guidance query.
9.  **Conclusion**: (approx. 250-350 words) Summarize the main takeaways from the file as per the guidance.
10. **Limitations**: (approx. 150-250 words) Discuss limitations of the information in the file or the analysis.
11. **Future Work**: (approx. 150-250 words) Suggest future work based on the file's content.
12. **Ethical Considerations (if applicable)**: (approx. 100-200 words) Discuss ethics if relevant.
13. **References**: (3-10 placeholders) List references if mentioned in the file, or generic relevant ones.
14. **Appendices (Optional)**: (1-2) e.g., for extracted data snippets.
15. **Glossary (Optional)**: (3-7 terms) Define key terms from the file.

{{#if generateMindmap}}
In addition to the report, also analyze the file content to extract concepts for a mind map and populate the 'mindmapData' field.
1.  **Main Idea**: Identify the single, overarching central theme of the document.
2.  **Key Concepts**: Extract 3 to 10 key concepts, main ideas, or important entities from the text.
3.  **Related Terms**: For each key concept, list 3 to 7 closely related terms, sub-ideas, properties, or illustrative examples found within or directly implied by the text.
Ensure this mind map data is included in the final JSON output under the 'mindmapData' key.
{{/if}}

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
