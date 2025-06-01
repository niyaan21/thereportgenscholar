
// src/app/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info, Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About ScholarAI',
  description: 'Learn more about ScholarAI, its mission, and the technology behind it.',
  openGraph: {
    title: 'About ScholarAI',
    description: 'Discover the vision and technology driving the future of research with ScholarAI.',
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl border-primary/20">
        <CardHeader className="text-center p-6 sm:p-8 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-t-xl">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-4 sm:mb-6 mx-auto ring-2 ring-accent/40 shadow-lg text-accent-foreground">
            <Info className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">About ScholarAI</CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground mt-2 sm:mt-3">
            Discover the vision and technology driving the future of research.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6 text-base sm:text-lg text-foreground/90 leading-relaxed prose prose-base sm:prose-lg dark:prose-invert max-w-none marker:text-accent">
          <p>
            ScholarAI is a cutting-edge platform designed to empower researchers, students, and professionals
            by leveraging the power of generative artificial intelligence. Our mission is to streamline the
            research process, from initial query formulation to comprehensive report generation.
          </p>
          <p>
            We believe that AI can be a powerful collaborator, augmenting human intellect and creativity.
            ScholarAI aims to provide tools that help users uncover deeper insights, synthesize complex
            information more efficiently, and present their findings with clarity and impact.
          </p>
          <div className="py-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mb-3">
              <Zap className="h-6 w-6 sm:h-7 sm:w-7 mr-3 text-accent" />
              Our Technology
            </h2>
            <p>
              ScholarAI is built on a modern technology stack, including Next.js for the frontend,
              Genkit for AI flow orchestration, and Google's Gemini models for generative capabilities.
              We utilize Firebase for user authentication and rely on ShadCN UI components styled with Tailwind CSS for a
              sleek, accessible, and responsive user interface.
            </p>
          </div>
          <div className="pb-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mb-3">
              <Info className="h-6 w-6 sm:h-7 sm:w-7 mr-3 text-accent" />
              Our Commitment
            </h2>
            <p>
              We are committed to responsible AI development and ethical practices. ScholarAI is designed
              to be a tool that assists and enhances human research, not replace it. We continuously
              work on improving the accuracy, relevance, and user-friendliness of our platform,
              aiming to foster a new era of intelligent research.
            </p>
          </div>
          <p className="text-center pt-4 sm:pt-6 text-muted-foreground text-sm sm:text-base">
            Thank you for being part of the ScholarAI journey!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
