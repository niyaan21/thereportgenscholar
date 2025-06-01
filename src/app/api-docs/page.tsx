
// src/app/api-docs/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code2, Construction, InfoIcon, ShieldCheck, Zap, Workflow, Image as ImageIcon, FileText, ListTree, KeyRound, Clock, GitMerge, Puzzle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ScholarAI API Documentation (Developer Preview)',
  description: 'Explore the upcoming ScholarAI API for programmatic access to powerful research tools and generative AI capabilities. Integrate AI-driven research into your applications.',
  openGraph: {
    title: 'ScholarAI API Documentation (Developer Preview)',
    description: 'Unlock ScholarAI\'s research functionalities programmatically. Details on planned endpoints, authentication, and integration for developers.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=ScholarAI+API', 
        width: 1200,
        height: 630,
        alt: 'ScholarAI API Documentation',
        'data-ai-hint': 'api documentation code',
      },
    ],
  },
};

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="text-center p-8 sm:p-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-t-xl">
          <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-5 sm:mb-8 mx-auto ring-2 ring-accent/40 shadow-lg text-accent-foreground">
            <Code2 className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
          <CardTitle className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">ScholarAI API Documentation</CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto">
            Integrate ScholarAI's power into your applications and workflows. (Developer Preview)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 md:p-10 space-y-10 text-base sm:text-lg text-foreground/90 leading-relaxed prose prose-lg dark:prose-invert max-w-none marker:text-accent">
          <p className="text-lg">
            Welcome to the ScholarAI API documentation. Our API is designed to provide developers with programmatic
            access to the core functionalities of ScholarAI, including AI-driven query formulation, advanced
            research synthesis, and comprehensive report generation.
          </p>
          
          <Alert variant="default" className="bg-primary/5 border-primary/20 text-primary dark:bg-primary/10 dark:border-primary/30 dark:text-primary-foreground/90 shadow-md">
            <Construction className="h-7 w-7 text-primary" />
            <AlertTitle className="font-semibold text-xl text-primary">API Under Active Development</AlertTitle>
            <AlertDescription className="text-primary/80 dark:text-primary-foreground/80 mt-2 text-base">
              The ScholarAI API is currently under active development and is not yet publicly available.
              This page serves as a preview of our planned API capabilities and conventions.
              We are working diligently to bring these features to you. Stay tuned for official announcements and launch dates!
            </AlertDescription>
          </Alert>
              
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mt-10 mb-5">
               <Zap className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
               Introduction to the API
            </h2>
            <p>The ScholarAI API aims to provide a RESTful interface, enabling developers to harness our sophisticated AI research tools directly within their own software, platforms, or custom workflows. Whether you're building a specialized research tool, integrating AI insights into an existing application, or automating parts of your research process, our API will offer the building blocks you need.</p>
            <p className="mt-3">We plan to offer granular access to our core services, allowing for flexible integration strategies. The API will be designed with clarity, ease of use, and robustness in mind, following standard REST principles and utilizing JSON for data exchange.</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mt-10 mb-5">
               <ListTree className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
               Planned API Endpoints
            </h2>
            <p>Below is a conceptual overview of the primary API endpoints we are planning to offer. Specific request/response schemas and parameters will be detailed upon official release.</p>
            <div className="space-y-6 mt-5">
              <Card className="bg-secondary/30 dark:bg-secondary/10 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-primary/90 flex items-center"><Workflow className="h-5 w-5 mr-2.5 text-accent/80"/>/api/v1/formulate-query</CardTitle>
                  <CardDescription className="text-sm">Submit a research question to receive optimized search queries.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Method:</strong> POST</p>
                  <p><strong>Request Body:</strong> `{'{ "researchQuestion": "Your complex question..." }'}`</p>
                  <p><strong>Response:</strong> `{'{ "searchQueries": ["query1", "query2", ...] }'}`</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary/30 dark:bg-secondary/10 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-primary/90 flex items-center"><Puzzle className="h-5 w-5 mr-2.5 text-accent/80"/>/api/v1/synthesize-research</CardTitle>
                  <CardDescription className="text-sm">Provide queries or text data to get a synthesized summary.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Method:</strong> POST</p>
                  <p><strong>Request Body:</strong> `{'{ "queries": ["query1", ...], "papers": [{ "title": "...", "abstract": "..." }, ...] }'}` (either queries or papers)</p>
                  <p><strong>Response:</strong> `{'{ "summary": "Concise synthesized insights..." }'}`</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary/30 dark:bg-secondary/10 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-primary/90 flex items-center"><FileText className="h-5 w-5 mr-2.5 text-accent/80"/>/api/v1/generate-report</CardTitle>
                  <CardDescription className="text-sm">Generate a comprehensive research report.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Method:</strong> POST</p>
                  <p><strong>Request Body:</strong> `{'{ "researchQuestion": "...", "summary": "Optional contextual summary..." }'}`</p>
                  <p><strong>Response:</strong> Detailed JSON structure of the generated report (similar to the web app's output).</p>
                </CardContent>
              </Card>
               <Card className="bg-secondary/30 dark:bg-secondary/10 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-primary/90 flex items-center"><ImageIcon className="h-5 w-5 mr-2.5 text-accent/80"/>/api/v1/generate-image</CardTitle>
                  <CardDescription className="text-sm">Generate a conceptual image for a research topic.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Method:</strong> POST</p>
                  <p><strong>Request Body:</strong> `{'{ "topic": "Your research topic/summary..." }'}`</p>
                  <p><strong>Response:</strong> `{'{ "imageDataUri": "data:image/png;base64,..." }'}`</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mt-10 mb-5">
               <KeyRound className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
               Authentication & Authorization
            </h2>
            <p>
              Secure access to the ScholarAI API will be managed primarily through API keys. Developers will be able to generate and manage their API keys through their ScholarAI user dashboard (once available).
            </p>
            <p className="mt-3">
              Requests to the API will require an API key to be included in the HTTP headers, typically as a Bearer token or a custom header like `X-API-Key`. Detailed authentication schemes will be provided in the full API specification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mt-10 mb-5">
               <Clock className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
               Rate Limiting & Usage Policies
            </h2>
            <p>
              To ensure fair usage and stability of the platform, the API will be subject to rate limits. These limits will depend on the subscription tier and the specific endpoint being accessed. Information on default rate limits, how to monitor usage, and options for increased limits will be available in the developer portal.
            </p>
            <p className="mt-3">
              Usage of the API will be governed by our Terms of Service, including acceptable use policies for AI-generated content.
            </p>
          </section>

           <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mt-10 mb-5">
               <GitMerge className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
               Versioning
            </h2>
            <p>
              The API will be versioned (e.g., `/api/v1/`) to allow for future enhancements and changes without breaking existing integrations. We will strive to maintain backward compatibility where possible and provide clear migration paths for new API versions.
            </p>
          </section>
          
          <CardFooter className="text-center p-0 pt-10">
            <p className="mx-auto text-muted-foreground text-base">
              We are incredibly excited about the potential the ScholarAI API will unlock for developers and researchers alike!
              Your feedback during this preview phase will be invaluable. Thank you for your interest.
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
