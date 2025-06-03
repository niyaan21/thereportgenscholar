
import { config } from 'dotenv';
config();

import '@/ai/flows/formulate-research-query.ts';
import '@/ai/flows/summarize-research-papers.ts';
import '@/ai/flows/generate-research-image.ts';
import '@/ai/flows/generate-research-report.ts';
import '@/ai/flows/generate-report-from-file.ts'; // Added new flow
