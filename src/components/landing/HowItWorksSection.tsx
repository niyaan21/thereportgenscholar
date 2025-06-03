
// src/components/landing/HowItWorksSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, Search, Brain, FileTextIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    icon: Lightbulb,
    title: "1. Ask Your Question",
    description: "Start by posing your complex research question or topic. Be as detailed or broad as you need.",
    color: "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  },
  {
    icon: Search,
    title: "2. AI Formulates Queries",
    description: "ScholarAI intelligently refines your input into optimized search vectors for its knowledge base.",
    color: "bg-green-500/15 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  },
  {
    icon: Brain,
    title: "3. Synthesize Insights",
    description: "The AI synthesizes information from diverse conceptual sources, providing a coherent summary of key findings.",
    color: "bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  },
  {
    icon: FileTextIcon,
    title: "4. Generate & Download",
    description: "Receive a comprehensive, structured report or a conceptual image, ready for download and use.",
    color: "bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  },
];

export default function HowItWorksSection() {
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.15, 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    }),
  };

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2 
            variants={FADE_IN_ANIMATION_VARIANTS} 
            className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl md:text-5xl"
          >
            How ScholarAI Works
          </motion.h2>
          <motion.p 
            variants={FADE_IN_ANIMATION_VARIANTS} 
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl"
          >
            Streamline your research process in four simple, AI-powered steps.
          </motion.p>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 items-start">
          {/* Dashed lines for larger screens */}
          {steps.slice(0, -1).map((_, index) => (
            <motion.div
              key={`line-${index}`}
              initial={{ opacity: 0, pathLength: 0 }}
              whileInView={{ opacity: 1, pathLength: 1 }}
              transition={{ delay: (index * 0.15) + 0.4, duration: 0.5, ease: "easeInOut" }}
              viewport={{ once: true }}
              className={cn(
                "hidden lg:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2",
                `lg:left-[${(index + 0.5) * 25}%] lg:w-[25%]`
              )}
              style={{
                 left: `${(index * 25) + 12.5}%`,
                 width: '25%',
                 transform: 'translateY(-50%) translateX(-12.5%)', 
                 zIndex:0
              }}
            >
               <svg width="100%" height="2" preserveAspectRatio="none">
                 <line x1="0" y1="1" x2="100%" y2="1" strokeDasharray="5,5" stroke="hsl(var(--border))" strokeWidth="2"/>
               </svg>
            </motion.div>
          ))}

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={FADE_IN_ANIMATION_VARIANTS}
              className="z-10" // Ensure cards are above the lines
            >
              <Card className="h-full text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-primary/15 hover:border-accent/60 bg-card flex flex-col">
                <CardHeader className="items-center">
                  <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-full p-2 ring-2 ring-offset-2 ring-offset-card", step.color, step.color.replace('text-', 'ring-').replace(/dark:ring-.*/, `dark:${step.color.split(' ')[1].replace('text-', 'ring-')}` ))}>
                    <step.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-primary">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
