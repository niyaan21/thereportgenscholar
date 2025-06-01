// src/app/actions.ts
'use server';

import { formulateResearchQuery, type FormulateResearchQueryInput, type FormulateResearchQueryOutput } from '@/ai/flows/formulate-research-query';
import { summarizeResearchPapers, type SummarizeResearchPapersInput, type SummarizeResearchPapersOutput } from '@/ai/flows/summarize-research-papers';
import { generateResearchImage, type GenerateResearchImageInput, type GenerateResearchImageOutput } from '@/ai/flows/generate-research-image';
import { generateResearchReport, type GenerateResearchReportInput, type GenerateResearchReportOutput } from '@/ai/flows/generate-research-report';
import { z } from 'zod';
import { auth } from '@/lib/firebase'; // Firebase auth instance
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const formulateQuerySchema = z.object({
  researchQuestion: z.string().min(10, "Research question must be at least 10 characters long.").max(1500, "Research question must be at most 1500 characters long."),
});

export interface FormulateQueryActionState {
  success: boolean;
  message: string;
  formulatedQueries: string[] | null;
  originalQuestion?: string; 
  errors: { researchQuestion?: string[] } | null;
}

export async function handleFormulateQueryAction(
  prevState: FormulateQueryActionState,
  formData: FormData
): Promise<FormulateQueryActionState> {
  const researchQuestion = formData.get('researchQuestion') as string;

  const validation = formulateQuerySchema.safeParse({ researchQuestion });
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid input.",
      errors: validation.error.flatten().fieldErrors,
      formulatedQueries: null,
      originalQuestion: researchQuestion, 
    };
  }

  try {
    const input: FormulateResearchQueryInput = { researchQuestion: validation.data.researchQuestion };
    const result = await formulateResearchQuery(input);
    return {
      success: true,
      message: "Queries formulated successfully.",
      formulatedQueries: result.searchQueries,
      originalQuestion: validation.data.researchQuestion, 
      errors: null,
    };
  } catch (error) {
    console.error("Error formulating queries:", error);
    return {
      success: false,
      message: "Failed to formulate queries. An unexpected error occurred.",
      formulatedQueries: null,
      originalQuestion: researchQuestion, 
      errors: null,
    };
  }
}

const synthesizeResearchSchema = z.object({
  queries: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.every(q => typeof q === 'string');
    } catch {
      return false;
    }
  }, { message: "Invalid queries format."}),
});

export interface SynthesizeResearchActionState {
  success: boolean;
  message: string;
  researchSummary: string | null;
  summarizedPaperTitles: string[] | null;
  errors: { queries?: string[] } | null;
}

export async function handleSynthesizeResearchAction(
  prevState: SynthesizeResearchActionState,
  formData: FormData
): Promise<SynthesizeResearchActionState> {
  const queriesJson = formData.get('queries') as string;
  
  const validation = synthesizeResearchSchema.safeParse({ queries: queriesJson });
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid query data provided for synthesis.",
      researchSummary: null,
      summarizedPaperTitles: null,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  let formulatedQueries: string[] = [];
  try {
    formulatedQueries = JSON.parse(validation.data.queries);
  } catch (e) {
    return {
      success: false,
      message: "Failed to parse query data.",
      researchSummary: null,
      summarizedPaperTitles: null,
      errors: { queries: ["Malformed JSON for queries."] }
    };
  }

  if (formulatedQueries.length === 0) {
    return {
      success: false,
      message: "No queries provided for synthesis.",
      researchSummary: null,
      summarizedPaperTitles: null,
      errors: { queries: ["No queries found to synthesize."] }
    };
  }

  const papersForSummary = formulatedQueries.map((query, index) => ({
    title: `Insight Area ${index + 1}: ${query.substring(0, 100)}${query.length > 100 ? '...' : ''}`,
    abstract: `This section pertains to the query: "${query}". The AI will synthesize information based on its knowledge regarding this topic.`,
  }));

  try {
    const input: SummarizeResearchPapersInput = { papers: papersForSummary };
    const result: SummarizeResearchPapersOutput = await summarizeResearchPapers(input);
    return {
      success: true,
      message: "Research synthesized successfully using formulated queries.",
      researchSummary: result.summary,
      summarizedPaperTitles: papersForSummary.map(p => p.title),
      errors: null,
    };
  } catch (error) {
    console.error("Error synthesizing research:", error);
    return {
      success: false,
      message: "Failed to synthesize research. An unexpected error occurred.",
      researchSummary: null,
      summarizedPaperTitles: null,
      errors: null,
    };
  }
}


export interface GenerateImageActionState {
  success: boolean;
  message: string;
  imageDataUri: string | null;
  errors: { topic?: string[] } | null;
}

// This schema should match GenerateResearchImageInputSchema in generate-research-image.ts
const generateImageSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters long.").max(200, "Topic must be at most 200 characters long."),
});

export async function handleGenerateImageAction(
  prevState: GenerateImageActionState,
  formData: FormData
): Promise<GenerateImageActionState> {
  const topic = formData.get('topic') as string;

  const validation = generateImageSchema.safeParse({ topic });
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid topic for image generation.",
      imageDataUri: null,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const input: GenerateResearchImageInput = { topic: validation.data.topic };
    const result = await generateResearchImage(input);
    return {
      success: true,
      message: "Image generated successfully.",
      imageDataUri: result.imageDataUri,
      errors: null,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return {
      success: false,
      message: `Failed to generate image: ${errorMessage}`,
      imageDataUri: null,
      errors: null,
    };
  }
}

const generateReportSchema = z.object({
  researchQuestion: z.string().min(10, "Research question must be at least 10 characters long.").max(1500, "Research question must be at most 1500 characters long."),
  summary: z.string().optional(),
});

export interface GenerateReportActionState {
  success: boolean;
  message: string;
  researchReport: GenerateResearchReportOutput | null;
  errors: { researchQuestion?: string[], summary?: string[] } | null;
}

export async function handleGenerateReportAction(
  prevState: GenerateReportActionState,
  formData: FormData
): Promise<GenerateReportActionState> {
  const researchQuestion = formData.get('researchQuestion') as string;
  const summary = formData.get('summary') as string | undefined;

  const validation = generateReportSchema.safeParse({ researchQuestion, summary });
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid input for report generation.",
      researchReport: null,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const input: GenerateResearchReportInput = {
      researchQuestion: validation.data.researchQuestion,
      summary: validation.data.summary ? validation.data.summary.trim() : undefined
    };
    const result = await generateResearchReport(input);
    return {
      success: true,
      message: "Research report generated successfully.",
      researchReport: result,
      errors: null,
    };
  } catch (error) {
    console.error("Error generating research report:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return {
      success: false,
      message: `Failed to generate research report: ${errorMessage}`,
      researchReport: null,
      errors: null,
    };
  }
}

// Sign Up Action
const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export interface SignUpActionState {
  success: boolean;
  message: string;
  userId?: string | null;
  errors?: {
    email?: string[];
    password?: string[];
    firebase?: string[]; 
  } | null;
}

export async function handleSignUpAction(
  prevState: SignUpActionState,
  formData: FormData
): Promise<SignUpActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = signUpSchema.safeParse({ email, password });

  if (!validation.success) {
    return {
      success: false,
      message: "Invalid sign up information.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, validation.data.email, validation.data.password);
    return {
      success: true,
      message: "Account created successfully! Redirecting...",
      userId: userCredential.user.uid,
      errors: null,
    };
  } catch (error: any) {
    console.error("Firebase SignUp Error:", error);
    let firebaseErrorMessage = "Failed to create account. Please try again.";
    if (error.code === 'auth/email-already-in-use') {
      firebaseErrorMessage = 'This email address is already in use.';
    } else if (error.code === 'auth/weak-password') {
      firebaseErrorMessage = 'The password is too weak.';
    } else if (error.code === 'auth/invalid-email') {
        firebaseErrorMessage = 'The email address is not valid.';
    }
    
    return {
      success: false,
      message: firebaseErrorMessage,
      errors: { firebase: [firebaseErrorMessage] },
    };
  }
}

// Login Action
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }), // Basic check, actual password check is by Firebase
});

export interface LoginActionState {
  success: boolean;
  message: string;
  userId?: string | null;
  errors?: {
    email?: string[];
    password?: string[];
    firebase?: string[]; 
  } | null;
}

export async function handleLoginAction(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = loginSchema.safeParse({ email, password });

  if (!validation.success) {
    return {
      success: false,
      message: "Invalid login information.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, validation.data.email, validation.data.password);
    return {
      success: true,
      message: "Logged in successfully! Redirecting...",
      userId: userCredential.user.uid,
      errors: null,
    };
  } catch (error: any) {
    console.error("Firebase Login Error:", error);
    let firebaseErrorMessage = "Failed to log in. Please check your credentials and try again.";
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      firebaseErrorMessage = 'Invalid email or password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      firebaseErrorMessage = 'The email address is not valid.';
    } else if (error.code === 'auth/user-disabled') {
      firebaseErrorMessage = 'This account has been disabled.';
    }
    
    return {
      success: false,
      message: firebaseErrorMessage,
      errors: { firebase: [firebaseErrorMessage] },
    };
  }
}
