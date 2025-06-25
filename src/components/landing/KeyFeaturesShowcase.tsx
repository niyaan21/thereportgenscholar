
// src/components/landing/KeyFeaturesShowcase.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Brain, FileTextIcon, Image as ImageIconLucide, UploadCloud, BarChart2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Zap,
    title: "AI Query Formulation",
    description: "Transforms complex research questions into precise search vectors, maximizing information retrieval.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Brain,
    title: "Intelligent Synthesis",
    description: "Distills information from multiple conceptual sources, providing concise summaries of key insights.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: FileTextIcon,
    title: "Comprehensive Reports",
    description: "Generates structured, multi-section academic-style reports including summaries, reviews, and references.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: UploadCloud,
    title: "File-Powered Reporting",
    description: "Upload documents and guide the AI to generate tailored reports based on your file's content.",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    icon: ImageIconLucide,
    title: "Conceptual Visualization",
    description: "Brings research to life with AI-generated abstract images representing core concepts.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: BarChart2,
    title: "Data Insights (Planned)",
    description: "Future capabilities to analyze and visualize data patterns within your research.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
];

const FeatureCard: React.FC<{ icon: React.ElementType; title: string; description: string; color: string; bgColor: string; index: number }> = ({ icon: Icon, title, description, color, bgColor, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    },
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-primary/15 hover:border-accent/60 bg-card flex flex-col overflow-hidden group">
        <CardHeader className="items-start p-5">
          <div className={cn("p-3 rounded-lg mb-3 shadow-md ring-2 ring-offset-1 ring-offset-card", bgColor, color, "group-hover:scale-105 transition-transform duration-300")}>
            <Icon className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors duration-300">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow px-5 pb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};


const KeyFeaturesShowcase = React.memo(function KeyFeaturesShowcase() {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.5
      }
    },
  };

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut"}}}}
            className="inline-block rounded-lg bg-accent/10 px-4 py-1.5 text-sm text-accent font-semibold mb-4 shadow-sm border border-accent/20"
          >
            <Sparkles className="inline-block h-4 w-4 mr-2 -mt-0.5" /> Core Capabilities
          </motion.div>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: -15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1, ease: "easeOut"}}}}
            className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl md:text-5xl"
          >
            Why Choose Foss AI?
          </motion.h2>
          <motion.p
            variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2, ease: "easeOut"}}}}
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl"
          >
            Foss AI empowers your research with a suite of intelligent tools designed to accelerate discovery and deepen understanding.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              bgColor={feature.bgColor}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
});
KeyFeaturesShowcase.displayName = "KeyFeaturesShowcase";
export default KeyFeaturesShowcase;
