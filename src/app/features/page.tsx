// src/app/features/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { Zap, Brain, FileTextIcon, Image as ImageIconLucide, ShieldCheck, LayoutDashboard, Download, Smartphone, ArrowRight, Sparkles, Search, Layers, Palette, Settings, Users, ThumbsUp, UploadCloud, MessageCircle, BarChart, BookOpen, Server, Share2, Mic, BrainCircuit, ScanText } from 'lucide-react';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import React from 'react'; 
import { useTranslation } from 'react-i18next';

// export const metadata: Metadata = {
//   title: 'Foss AI Features - Advanced AI Research Capabilities',
//   description: 'Discover the powerful features of Foss AI, including AI-driven query formulation, intelligent knowledge synthesis, file-powered reporting, conceptual visualization, voice notes, and more. Elevate your research workflow today.',
//   openGraph: {
//     title: 'Foss AI Features - Advanced AI Research Capabilities',
//     description: 'Explore how Foss AI\'s innovative features can streamline your research process and help you uncover deeper insights.',
//     images: [
//       {
//         url: 'https://placehold.co/1200x630.png?text=Foss+AI+Features', 
//         width: 1200,
//         height: 630,
//         alt: 'Features of Foss AI Platform',
//         'data-ai-hint': 'features list' as any,
//       },
//     ],
//   },
// };

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
  isPlanned?: boolean;
}

const FeatureCard = React.memo(function FeatureCard({ icon: Icon, title, description, className, isPlanned }: FeatureCardProps) {
  const { t } = useTranslation();
  return (
    <Card className={cn(
        "w-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out border-primary/15 hover:border-accent/70 bg-card flex flex-col", 
        isPlanned && "opacity-70 hover:opacity-90 border-dashed",
        className
      )}>
      <CardHeader className="items-center text-center p-5 sm:p-6">
        <div className={cn(
            "p-3.5 sm:p-4 rounded-full mb-4 ring-2 shadow-md text-accent-foreground",
            isPlanned ? "bg-muted ring-muted-foreground/30" : "bg-gradient-to-br from-accent to-accent/80 ring-accent/30"
        )}>
          <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-semibold text-primary">{title} {isPlanned && <span className="text-xs text-muted-foreground">{t('featuresPage.f_planned')}</span>}</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-sm sm:text-base text-muted-foreground leading-relaxed px-5 pb-6 sm:px-6 sm:pb-8 flex-grow">
        {description}
      </CardContent>
    </Card>
  );
});
FeatureCard.displayName = "FeatureCard";


export default function FeaturesPage() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Search,
      title: t('featuresPage.f_query'),
      description: t('featuresPage.f_query_desc'),
    },
    {
      icon: Layers,
      title: t('featuresPage.f_synthesis'),
      description: t('featuresPage.f_synthesis_desc'),
    },
    {
      icon: FileTextIcon,
      title: t('featuresPage.f_report'),
      description: t('featuresPage.f_report_desc'),
    },
    {
      icon: UploadCloud,
      title: t('featuresPage.f_file_report'),
      description: t('featuresPage.f_file_report_desc'),
    },
    {
      icon: Mic,
      title: t('featuresPage.f_voice'),
      description: t('featuresPage.f_voice_desc'),
    },
    {
      icon: BrainCircuit,
      title: t('featuresPage.f_mindmap'),
      description: t('featuresPage.f_mindmap_desc'),
    },
    {
      icon: ShieldCheck,
      title: t('featuresPage.f_auth'),
      description: t('featuresPage.f_auth_desc'),
    },
    {
      icon: LayoutDashboard,
      title: t('featuresPage.f_ui'),
      description: t('featuresPage.f_ui_desc'),
    },
    {
      icon: Download,
      title: t('featuresPage.f_download'),
      description: t('featuresPage.f_download_desc'),
    },
     {
      icon: Settings,
      title: t('featuresPage.f_workflow'),
      description: t('featuresPage.f_workflow_desc'),
    },
    {
      icon: ThumbsUp,
      title: t('featuresPage.f_ux'),
      description: t('featuresPage.f_ux_desc'),
    },
    {
      icon: MessageCircle,
      title: t('featuresPage.f_feedback'),
      description: t('featuresPage.f_feedback_desc'),
    },
    {
      icon: BarChart,
      title: t('featuresPage.f_viz'),
      description: t('featuresPage.f_viz_desc'),
    },
    {
      icon: BookOpen,
      title: t('featuresPage.f_docs'),
      description: t('featuresPage.f_docs_desc'),
    },
    {
      icon: Server,
      title: t('featuresPage.f_infra'),
      description: t('featuresPage.f_infra_desc'),
    },
     {
      icon: ScanText, // Using ShieldCheck for Plagiarism Detection
      title: t('featuresPage.f_plagiarism'),
      description: t('featuresPage.f_plagiarism_desc'),
      isPlanned: true,
    },
    {
      icon: Share2,
      title: t('featuresPage.f_sharing'),
      description: t('featuresPage.f_sharing_desc'),
      isPlanned: true,
    },
  ];

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-primary to-primary/80 rounded-full mb-6 ring-2 ring-primary/40 shadow-lg text-primary-foreground">
          <Sparkles className="h-12 w-12 sm:h-16 sm:w-16" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
          {t('featuresPage.title')}
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('featuresPage.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            isPlanned={feature.isPlanned}
          />
        ))}
      </div>

      <div className="mt-16 sm:mt-20 text-center">
        <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 shadow-xl border-accent/30 rounded-xl">
            <CardHeader className="p-0 mb-4">
                 <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-4 ring-2 ring-accent/30 shadow-md text-accent-foreground mx-auto">
                    <Zap className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">{t('featuresPage.ctaTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <p className="text-muted-foreground text-base sm:text-lg mb-6">
                    {t('featuresPage.ctaDescription')}
                </p>
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-2xl px-8 py-3 text-lg">
                    <NextLink href="/signup">
                        {t('featuresPage.ctaButton')} <ArrowRight className="ml-2.5 h-5 w-5" />
                    </NextLink>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
