
// src/app/features/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { Zap, Brain, FileTextIcon, Image as ImageIconLucide, ShieldCheck, LayoutDashboard, Download, Smartphone, ArrowRight, Sparkles, Search, Layers, Palette, Settings, Users, ThumbsUp, UploadCloud, MessageCircle, BarChart, BookOpen, Server, Share2 } from 'lucide-react';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import React from 'react'; // Import React

export const metadata: Metadata = {
  title: 'ScholarAI Features - Advanced AI Research Capabilities',
  description: 'Discover the powerful features of ScholarAI, including AI-driven query formulation, intelligent knowledge synthesis, file-powered reporting, conceptual visualization, and more. Elevate your research workflow today.',
  openGraph: {
    title: 'ScholarAI Features - Advanced AI Research Capabilities',
    description: 'Explore how ScholarAI\'s innovative features can streamline your research process and help you uncover deeper insights.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=ScholarAI+Features', 
        width: 1200,
        height: 630,
        alt: 'Features of ScholarAI Platform',
        'data-ai-hint': 'features list infographic',
      },
    ],
  },
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = React.memo(function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <Card className={cn("w-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out border-primary/15 hover:border-accent/70 bg-card flex flex-col", className)}>
      <CardHeader className="items-center text-center p-5 sm:p-6">
        <div className="p-3.5 sm:p-4 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-4 ring-2 ring-accent/30 shadow-md text-accent-foreground">
          <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-semibold text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-sm sm:text-base text-muted-foreground leading-relaxed px-5 pb-6 sm:px-6 sm:pb-8 flex-grow">
        {description}
      </CardContent>
    </Card>
  );
});

export default function FeaturesPage() {
  const features = [
    {
      icon: Search,
      title: "AI Query Formulation",
      description: "Transforms complex research questions into precise search vectors, maximizing information retrieval relevance from its knowledge base.",
    },
    {
      icon: Layers,
      title: "Intelligent Knowledge Synthesis",
      description: "Distills information from multiple conceptual sources, providing concise summaries of key insights, themes, and findings.",
    },
    {
      icon: FileTextIcon,
      title: "Comprehensive Report Generation",
      description: "Automatically generates structured, multi-section academic-style reports including summaries, reviews, methodology, and references.",
    },
    {
      icon: UploadCloud,
      title: "File-Powered Guided Reporting",
      description: "Upload your documents (TXT, MD, PDF, DOCX) and provide specific guidance to generate tailored reports based on your file's content.",
    },
    {
      icon: Palette,
      title: "Conceptual Image Visualization",
      description: "Brings research to life with AI-generated abstract images representing core concepts, perfect for presentations and creative insights.",
    },
    {
      icon: ShieldCheck,
      title: "Secure User Authentication",
      description: "Protects your work with robust Firebase authentication, ensuring secure access to ScholarAI's full suite of features.",
    },
    {
      icon: LayoutDashboard,
      title: "Intuitive User Interface",
      description: "A clean, modern interface built with Next.js & ShadCN UI, designed for ease of use, letting you focus on research.",
    },
    {
      icon: Download,
      title: "Downloadable Outputs",
      description: "Export reports in structured JSON for data portability and as professionally formatted PDFs for sharing and offline access.",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "Access ScholarAI and conduct research anytime, anywhere. Fully responsive across desktops, tablets, and mobile devices.",
    },
     {
      icon: Settings,
      title: "Customizable Workflow",
      description: "Offers a guided research process with flexibility to revisit and refine steps like editing questions or re-synthesizing information.",
    },
    {
      icon: ThumbsUp,
      title: "User-Centric Enhancements",
      description: "Benefits from continuous UI/UX refinements, dynamic animations, and clear feedback for a polished, engaging experience.",
    },
    {
      icon: MessageCircle,
      title: "Interactive Feedback Loop",
      description: "Provides clear progress indicators and toast notifications, keeping you informed throughout the AI generation process.",
    },
    {
      icon: BarChart,
      title: "Data Visualization Suggestions",
      description: "AI suggests relevant chart types (bar, line, pie, scatter) within reports to help visualize key data points and trends.",
    },
    {
      icon: BookOpen,
      title: "In-App Documentation",
      description: "Access comprehensive guides and FAQs directly within the platform to master all features and troubleshoot effectively.",
    },
    {
      icon: Server,
      title: "Scalable Cloud Infrastructure",
      description: "Built on robust cloud technologies ensuring reliable performance and scalability as your research demands grow.",
    },
     {
      icon: Share2,
      title: "Content Sharing (Coming Soon)",
      description: "Future capabilities to easily share your generated reports or specific insights with collaborators or peers securely.",
    },
  ];

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-primary to-primary/80 rounded-full mb-6 ring-2 ring-primary/40 shadow-lg text-primary-foreground">
          <Sparkles className="h-12 w-12 sm:h-16 sm:w-16" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
          ScholarAI Features
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the suite of powerful AI-driven tools designed to revolutionize your research process, from initial ideation to final report.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

      <div className="mt-16 sm:mt-20 text-center">
        <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 shadow-xl border-accent/30 rounded-xl">
            <CardHeader className="p-0 mb-4">
                 <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-4 ring-2 ring-accent/30 shadow-md text-accent-foreground mx-auto">
                    <Zap className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Ready to Elevate Your Research?</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <p className="text-muted-foreground text-base sm:text-lg mb-6">
                    Sign up for ScholarAI today and experience the future of intelligent research.
                    Transform your workflow, uncover deeper insights, and generate impactful reports with ease.
                </p>
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-2xl px-8 py-3 text-lg">
                    <NextLink href="/signup">
                        Get Started Now <ArrowRight className="ml-2.5 h-5 w-5" />
                    </NextLink>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

