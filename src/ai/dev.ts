
import { config } from 'dotenv';
config();

import '@/ai/flows/formulate-research-query.ts';
import '@/ai/flows/summarize-research-papers.ts';
import '@/ai/flows/generate-research-image.ts';
import '@/ai/flows/generate-research-report.ts';
import '@/ai/flows/generate-report-from-file.ts';
import '@/ai/flows/generate-daily-prompt-flow.ts';
import '@/ai/flows/extract-mindmap-concepts.ts';
import '@/ai/flows/transcribe-and-analyze-flow.ts'; // Added new flow

