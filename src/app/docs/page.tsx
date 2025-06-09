
// src/app/docs/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpenText, ArrowRight, Lightbulb, Workflow, Download, Sparkles, Settings, AlertTriangle, Search, Layers, FileTextIcon, UserCircle, HelpCircle, MessageSquareQuestion } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ScholarAI Documentation - Mastering Your Research Assistant',
  description: 'Comprehensive documentation for ScholarAI. Learn how to use features like AI query formulation, knowledge synthesis, report generation, and more to supercharge your research workflow.',
  openGraph: {
    title: 'ScholarAI Documentation - Mastering Your Research Assistant',
    description: 'Your complete guide to understanding and utilizing all of ScholarAI\'s powerful AI-driven research tools effectively.',
     images: [
      {
        url: 'https://placehold.co/1200x630.png?text=ScholarAI+Docs', 
        width: 1200,
        height: 630,
        alt: 'ScholarAI Documentation',
        'data-ai-hint': 'documentation guide book' as any,
      },
    ],
  },
};

export default function DocsPage() {
  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="text-center p-8 sm:p-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-t-xl">
          <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-5 sm:mb-8 mx-auto ring-2 ring-accent/40 shadow-lg text-accent-foreground">
            <BookOpenText className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
          <CardTitle className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">ScholarAI Documentation</CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto">
            Your comprehensive guide to mastering ScholarAI and its powerful research tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 md:p-10 text-base sm:text-lg text-foreground/90 leading-relaxed prose prose-lg dark:prose-invert max-w-none marker:text-accent">
          <p className="mb-8">
            Welcome to the ScholarAI documentation! This guide is designed to help you understand and effectively utilize all the features our platform offers. Whether you're a new user or looking to explore advanced functionalities, you'll find valuable information here to enhance your research workflow.
          </p>
          
          <Accordion type="multiple" defaultValue={['getting-started', 'core-features']} className="w-full space-y-4">
            <AccordionItem value="getting-started" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                  <Lightbulb className="h-6 w-6 mr-3 text-accent" /> Getting Started
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p>Begin your journey with ScholarAI by understanding the basic setup and navigation:</p>
                <ol className="list-decimal list-outside space-y-2 pl-5 mt-3">
                  <li><strong>Account Creation & Login:</strong> Ensure you have an account. If not, <NextLink href="/signup" className="text-accent hover:underline font-medium">sign up</NextLink>. Existing users can <NextLink href="/login" className="text-accent hover:underline font-medium">log in</NextLink>. Authentication is required to use ScholarAI's core features.</li>
                  <li><strong>Dashboard Overview:</strong> Familiarize yourself with the main interface on the <NextLink href="/" className="text-accent hover:underline font-medium">homepage</NextLink>. This is where you'll initiate your research.</li>
                  <li><strong>Initial Research Question:</strong> The process begins by entering your primary research question or topic into the main text area. Be as specific or as broad as needed; our AI will help refine it.</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="core-features" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                 <Sparkles className="h-6 w-6 mr-3 text-accent" /> Core Features Deep Dive
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 space-y-5">
                <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><Search className="h-5 w-5 mr-2 text-accent/80"/>AI Query Formulation</h4>
                  <p>ScholarAI transforms your initial research question into a set of optimized, targeted search vectors. These vectors are designed to maximize the relevance and breadth of information retrieval from our AI's knowledge base. This step is crucial for focusing the subsequent synthesis and report generation phases.</p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><Layers className="h-5 w-5 mr-2 text-accent/80"/>Intelligent Knowledge Synthesis</h4>
                  <p>Based on the formulated queries, ScholarAI synthesizes information to provide a coherent summary of key insights, themes, and findings. This helps you quickly grasp the main points related to your research area before diving into a full report.</p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><FileTextIcon className="h-5 w-5 mr-2 text-accent/80"/>Comprehensive Report Generation</h4>
                  <p>Leveraging your original question and the synthesized summary, ScholarAI can generate a detailed, multi-section academic-style research report. This includes sections like an executive summary, introduction, literature review, methodology, results, discussion, conclusion, and references. The report structure is designed for clarity and depth.</p>
                </div>
                 <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><Workflow className="h-5 w-5 mr-2 text-accent/80"/>Conceptual Image Visualization</h4>
                  <p>To help illustrate your research concepts, ScholarAI can generate abstract, symbolic images based on your research topic or summary. These visuals can be useful for presentations or for stimulating further thought.</p>
                </div>
                 <div>
                  <h4 className="text-lg font-medium text-primary/90 flex items-center mb-2"><Download className="h-5 w-5 mr-2 text-accent/80"/>Downloadable Outputs</h4>
                  <p>Generated research reports can be downloaded in both JSON format (for data structure and programmatic use) and as a formatted PDF document, suitable for sharing and offline review.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="account-management" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                 <UserCircle className="h-6 w-6 mr-3 text-accent" /> Account Management
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p>Manage your ScholarAI account effectively:</p>
                <ul className="list-disc list-outside space-y-2 pl-5 mt-3">
                  <li><strong>Profile Information:</strong> (Placeholder for future profile settings) Currently, your email is used as your identifier.</li>
                  <li><strong>Logout:</strong> Securely log out of your account using the "Logout" option in the user menu within the Navbar.</li>
                  <li><strong>Password Management:</strong> (Placeholder for future password reset/change functionality) For password issues, standard Firebase mechanisms might apply if integrated.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="advanced-tips" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                 <Settings className="h-6 w-6 mr-3 text-accent" /> Advanced Tips & Best Practices
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p>Maximize your research efficiency with these tips:</p>
                <ul className="list-disc list-outside space-y-2 pl-5 mt-3">
                  <li><strong>Refine Initial Questions:</strong> While ScholarAI can handle broad queries, a more focused initial question can lead to more precise results. Consider including key terms or specific aspects you're interested in.</li>
                  <li><strong>Iterative Process:</strong> Research is often iterative. Use the "Go Back" functionality to refine queries or summaries if the initial results aren't perfectly aligned with your needs.</li>
                  <li><strong>Contextual Summary for Reports:</strong> Providing a rich, well-synthesized summary (or refining the AI-generated one) as input for the full report generation can significantly enhance the report's quality and relevance.</li>
                  <li><strong>Image Generation Specificity:</strong> When generating images, while the system uses your research question/summary, you can mentally frame specific visual metaphors to guide your interpretation of the results.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="troubleshooting" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                 <AlertTriangle className="h-6 w-6 mr-3 text-accent" /> Troubleshooting & FAQs
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                 <p className="mb-3">Encountering issues? Here are some common points:</p>
                <ul className="list-disc list-outside space-y-2 pl-5">
                    <li><strong>Login/Signup Issues:</strong> Ensure your email is correct and your password meets any specified criteria. Check for error messages displayed by the system.</li>
                    <li><strong>Slow Generation:</strong> AI generation, especially for reports and images, can take some time. Please be patient. If it seems stuck, a page refresh might be necessary (though this could lose current state).</li>
                    <li><strong>Unexpected AI Output:</strong> Generative AI can sometimes produce unexpected or less relevant content. Try rephrasing your initial question or refining the synthesis step.</li>
                    <li><strong>"Authentication Required" Message:</strong> This means you need to be logged in to use the feature. Please log in or sign up.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact-support" className="bg-secondary/30 dark:bg-secondary/10 rounded-lg shadow-sm border border-border/50">
              <AccordionTrigger className="px-5 py-4 text-xl font-semibold hover:no-underline text-primary">
                <div className="flex items-center">
                 <HelpCircle className="h-6 w-6 mr-3 text-accent" /> Contact & Support
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p>
                  If you have questions, feedback, or require assistance beyond what's covered in this documentation,
                  please reach out to our support team. (Placeholder: Further contact details or a link to a support
                  system/email address would be provided here in a production application).
                </p>
                <p className="mt-3">
                  We value your input and are always looking for ways to improve ScholarAI!
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <CardFooter className="mt-10 text-center p-0 pt-8">
            <Button asChild size="lg" className="mx-auto bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-xl">
              <NextLink href="/">
                Start Your Research Now <ArrowRight className="ml-2 h-5 w-5" />
              </NextLink>
            </Button>
          </CardFooter>
          <p className="text-center pt-8 text-muted-foreground text-base">
            This documentation is an evolving resource. Check back for more detailed guides and advanced tips!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
