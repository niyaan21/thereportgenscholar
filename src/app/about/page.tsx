
// src/app/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { Info, Zap, Users, Target, Compass, Heart, Eye, Package, ArrowRight, Star } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Foss AI - Pioneering Intelligent Research',
  description: 'Learn more about Foss AI, our mission to revolutionize research through AI, the innovative technology we use, our core values, and our vision for the future of academic and professional inquiry.',
  openGraph: {
    title: 'About Foss AI - Pioneering Intelligent Research',
    description: 'Discover the vision, technology, and values driving the future of research with Foss AI. Join us in augmenting human intellect.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=About+Foss+AI', 
        width: 1200,
        height: 630,
        alt: 'About Foss AI - Revolutionizing Research',
        'data-ai-hint': 'fossai about' as any,
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="text-center p-8 sm:p-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-t-xl">
          <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-5 sm:mb-8 mx-auto ring-2 ring-accent/40 shadow-lg text-accent-foreground">
            <Info className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
          <CardTitle className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            About Foss AI
          </CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto">
            Pioneering the future of intelligent research and discovery.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 md:p-10 space-y-10 sm:space-y-12 text-base sm:text-lg text-foreground/90 leading-relaxed prose prose-lg dark:prose-invert max-w-none marker:text-accent">
          
          <section className="bg-secondary/30 dark:bg-secondary/10 p-6 rounded-lg shadow-md border border-border/50">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mb-4">
              <Target className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
              Our Mission
            </h2>
            <p>
              At Foss AI, our mission is to empower researchers, students, and professionals worldwide by providing
              intuitive, powerful, and AI-driven tools that streamline the complexities of research. We aim to
              transform the way knowledge is discovered, synthesized, and shared, fostering a new era of
              accelerated innovation and deeper understanding. We believe in augmenting human intellect, not
              replacing it, making sophisticated research capabilities accessible to all.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mb-4">
              <Zap className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
              The Technology Stack
            </h2>
            <p>
              Foss AI is engineered with a state-of-the-art technology stack to ensure a robust, scalable,
              and responsive experience. Our platform leverages:
            </p>
            <ul className="list-disc list-outside space-y-2 pl-5 mt-4">
              <li><strong>Next.js & React:</strong> For a fast, modern, and interactive user interface with server-side rendering and static generation capabilities.</li>
              <li><strong>Genkit & Google Gemini Models:</strong> Powering our advanced AI features, including query formulation, knowledge synthesis, and report generation.</li>
              <li><strong>Firebase:</strong> For secure user authentication and potentially other backend services as we grow.</li>
              <li><strong>ShadCN UI & Tailwind CSS:</strong> Crafting a visually appealing, accessible, and consistent design system that is a joy to use.</li>
              <li><strong>TypeScript:</strong> Ensuring code quality, maintainability, and type safety throughout the application.</li>
            </ul>
          </section>
          
          <section className="bg-secondary/30 dark:bg-secondary/10 p-6 rounded-lg shadow-md border border-border/50">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mb-4">
              <Heart className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-medium text-primary/90 flex items-center mb-2"><Star className="h-5 w-5 mr-2 text-yellow-400"/>Innovation</h3>
                <p className="text-foreground/80">We are committed to pushing the boundaries of what's possible in research technology, constantly exploring new AI advancements.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-primary/90 flex items-center mb-2"><Package className="h-5 w-5 mr-2 text-green-500"/>Accessibility</h3>
                <p className="text-foreground/80">We strive to make powerful research tools available to a broad audience, regardless of technical expertise.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-primary/90 flex items-center mb-2"><Info className="h-5 w-5 mr-2 text-blue-500"/>Integrity</h3>
                <p className="text-foreground/80">We prioritize ethical AI practices, data privacy, and transparency in how our tools operate and assist users.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-primary/90 flex items-center mb-2"><Users className="h-5 w-5 mr-2 text-purple-500"/>Collaboration</h3>
                <p className="text-foreground/80">We believe AI should be a collaborative partner, enhancing human capabilities and fostering a synergistic approach to research.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mb-4">
              <Users className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
              Our Team (Placeholder)
            </h2>
            <p>
              Foss AI is brought to you by a passionate team of developers, AI researchers, and product visionaries
              dedicated to revolutionizing the research landscape. While we're currently a lean and focused group,
              our commitment to excellence and innovation drives us forward. (Further details about team members
              can be added here as the project evolves).
            </p>
          </section>

          <section className="bg-primary/5 dark:bg-primary/10 p-6 rounded-lg shadow-md border border-primary/20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mb-4">
              <Eye className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
              Future Vision
            </h2>
            <p>
              Our journey with Foss AI is just beginning. We envision a future where our platform integrates even more
              sophisticated AI capabilities, offers deeper customization, supports collaborative research projects,
              and provides seamless access to a vast array of knowledge sources. We are dedicated to continuously
              evolving Foss AI to meet the ever-changing needs of the global research community. Our goal is to
              be the indispensable AI co-pilot for every inquiring mind.
            </p>
             <div className="mt-6 text-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:shadow-lg">
                  <NextLink href="/features">
                    Explore Foss AI Features <ArrowRight className="ml-2 h-5 w-5" />
                  </NextLink>
                </Button>
              </div>
          </section>

          <p className="text-center pt-6 sm:pt-8 text-muted-foreground text-base">
            Thank you for your interest in Foss AI. We're excited to have you on this journey with us!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
