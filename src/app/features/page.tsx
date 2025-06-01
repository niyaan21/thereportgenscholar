
// src/app/features/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { Zap, Brain, FileTextIcon, Image as ImageIcon, ShieldCheck, LayoutDashboard, Download, Smartphone, ArrowRight, Sparkles, Search, Layers, Palette, Settings, Users, ThumbsUp } from 'lucide-react';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils'; // Added import for cn

export const metadata: Metadata = {
  title: 'ScholarAI Features - Advanced AI Research Capabilities',
  description: 'Discover the powerful features of ScholarAI, including AI-driven query formulation, intelligent knowledge synthesis, comprehensive report generation, conceptual visualization, and more. Elevate your research workflow today.',
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

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, className }) => (
  <Card className={cn("w-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out border-primary/15 hover:border-accent/70 bg-card", className)}>
    <CardHeader className="items-center text-center p-5 sm:p-6">
      <div className="p-3.5 sm:p-4 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-4 ring-2 ring-accent/30 shadow-md text-accent-foreground">
        <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
      </div>
      <CardTitle className="text-xl sm:text-2xl font-semibold text-primary">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-center text-sm sm:text-base text-muted-foreground leading-relaxed px-5 pb-6 sm:px-6 sm:pb-8">
      {description}
    </CardContent>
  </Card>
);

export default function FeaturesPage() {
  const features = [
    {
      icon: Search,
      title: "AI-Powered Query Formulation",
      description: "Transform complex research questions into precise, effective search vectors. Our AI understands nuance and context to create queries that maximize information retrieval and relevance from its vast knowledge base.",
    },
    {
      icon: Layers,
      title: "Intelligent Knowledge Synthesis",
      description: "ScholarAI distills information from multiple conceptual sources based on the formulated queries, providing you with a concise, coherent summary of key insights, emerging themes, and critical findings.",
    },
    {
      icon: FileTextIcon,
      title: "Comprehensive Report Generation",
      description: "Automatically generate structured, multi-section academic-style research reports. Reports include executive summaries, introductions, literature reviews, methodology, results, discussions, conclusions, and placeholder references.",
    },
    {
      icon: Palette,
      title: "Conceptual Image Visualization",
      description: "Bring your research to life with AI-generated abstract and symbolic images. These visuals can represent core concepts from your topic or summary, perfect for presentations and sparking creative insights.",
    },
    {
      icon: ShieldCheck,
      title: "Secure User Authentication",
      description: "Your research work is protected with robust Firebase authentication. Sign up and log in securely to access ScholarAI's full suite of features and manage your research endeavors.",
    },
    {
      icon: LayoutDashboard,
      title: "Intuitive User Interface",
      description: "Experience a clean, modern, and user-friendly interface built with Next.js, ShadCN UI, and Tailwind CSS. Designed for ease of use, allowing you to focus on your research, not on learning complex software.",
    },
    {
      icon: Download,
      title: "Downloadable Outputs",
      description: "Easily export your work. Full research reports can be downloaded in structured JSON format for data portability and as professionally formatted PDF documents for sharing and offline access.",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "Access ScholarAI and conduct your research anytime, anywhere. Our platform is fully responsive, providing a seamless experience across desktops, tablets, and mobile devices.",
    },
     {
      icon: Settings,
      title: "Customizable Workflow",
      description: "ScholarAI guides you through a structured research process, but also offers flexibility. You can revisit and refine previous steps, such as editing your initial question or re-synthesizing information with adjusted queries.",
    },
    {
      icon: ThumbsUp,
      title: "User-Centric Enhancements",
      description: "Benefit from continuous improvements, including UI/UX refinements, dynamic animations, and clear feedback mechanisms like toasts, ensuring a polished and engaging user experience.",
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
