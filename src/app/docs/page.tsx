
// src/app/docs/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { BookOpenText, ArrowRight, Lightbulb, Workflow, Download } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation - ScholarAI',
  description: 'Find detailed documentation on how to use ScholarAI features effectively.',
  openGraph: {
    title: 'Documentation - ScholarAI',
    description: 'Your comprehensive guide to mastering ScholarAI and its powerful research tools.',
  },
};

export default function DocsPage() {
  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl border-primary/20">
        <CardHeader className="text-center p-6 sm:p-8 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-t-xl">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-4 sm:mb-6 mx-auto ring-2 ring-accent/40 shadow-lg text-accent-foreground">
            <BookOpenText className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">ScholarAI Documentation</CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground mt-2 sm:mt-3">
            Your comprehensive guide to mastering ScholarAI.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-8 text-base sm:text-lg text-foreground/90 leading-relaxed prose prose-base sm:prose-lg dark:prose-invert max-w-none marker:text-accent">
          <p>
            Welcome to the ScholarAI documentation. Here you'll find everything you need to know
            to get the most out of our platform and accelerate your research endeavors.
          </p>
          
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mt-6 mb-4">
              <Lightbulb className="h-6 w-6 sm:h-7 sm:w-7 mr-3 text-accent" />
              Getting Started
            </h2>
            <p>To begin using ScholarAI, navigate to the <NextLink href="/" className="text-accent hover:underline font-medium">homepage</NextLink> and enter your core research question into the provided text area. Our AI will then guide you through the process of query formulation, synthesis, and report generation.</p>
            <p className="mt-3">
              Ensure you are <NextLink href="/login" className="text-accent hover:underline font-medium">logged in</NextLink> or <NextLink href="/signup" className="text-accent hover:underline font-medium">signed up</NextLink> to access all features and save your progress (feature coming soon).
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mt-6 mb-4">
              <Workflow className="h-6 w-6 sm:h-7 sm:w-7 mr-3 text-accent" />
              Key Features & Workflow
            </h2>
            <ol className="list-decimal list-outside space-y-3 pl-5 sm:pl-6">
              <li>
                <strong>Enter Research Question:</strong> Start on the homepage with your main topic or complex question. This is the seed for the entire AI-driven process.
              </li>
              <li>
                <strong>AI Query Formulation:</strong> ScholarAI transforms your broad question into several targeted, well-formed search vectors designed for optimal information retrieval.
              </li>
              <li>
                <strong>Knowledge Synthesis:</strong> Review the AI-crafted queries and initiate synthesis. The AI then distills key insights based on these queries, presenting you with a concise summary.
              </li>
              <li>
                <strong>Conceptual Visualization (Optional):</strong> Generate an abstract, AI-powered image to visually represent the core concepts of your research summary.
              </li>
              <li>
                <strong>Comprehensive Report Generation:</strong> With your synthesized summary (and original question) as context, generate a detailed, multi-section academic-style research report.
              </li>
              <li>
                <strong>Download Your Work:</strong> Reports can be downloaded in JSON format (for data and structure) and as a PDF document for sharing and presentation.
              </li>
            </ol>
          </section>
          
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-xl">
              <NextLink href="/">
                Start Your Research Now <ArrowRight className="ml-2 h-5 w-5" />
              </NextLink>
            </Button>
          </div>
          <p className="text-center pt-6 text-muted-foreground text-sm sm:text-base">
            This documentation is an evolving resource. Check back for more detailed guides and advanced tips!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
