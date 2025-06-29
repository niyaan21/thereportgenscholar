// src/components/landing/HowItWorksSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, Search, Brain, FileTextIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const HowItWorksSection = React.memo(function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Lightbulb,
      title: t('howItWorks.step1'),
      description: t('howItWorks.step1Desc'),
      color: "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    },
    {
      icon: Search,
      title: t('howItWorks.step2'),
      description: t('howItWorks.step2Desc'),
      color: "bg-green-500/15 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    },
    {
      icon: Brain,
      title: t('howItWorks.step3'),
      description: t('howItWorks.step3Desc'),
      color: "bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    },
    {
      icon: FileTextIcon,
      title: t('howItWorks.step4'),
      description: t('howItWorks.step4Desc'),
      color: "bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    },
  ];

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            {t('howItWorks.title')}
          </motion.h2>
          <motion.p
            variants={FADE_IN_ANIMATION_VARIANTS}
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl"
          >
            {t('howItWorks.description')}
          </motion.p>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 items-start">
          {steps.slice(0, -1).map((_, index) => (
            <motion.div
              key={`line-${index}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: (index * 0.15) + 0.5, duration: 0.6, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="hidden lg:block absolute top-1/2 -translate-y-1/2"
              style={{
                 left: `${(index * 25) + 12.5}%`,
                 width: '25%',
                 zIndex: 0,
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
              className="z-10"
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
});
HowItWorksSection.displayName = "HowItWorksSection";
export default HowItWorksSection;
