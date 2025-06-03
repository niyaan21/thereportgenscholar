
// src/components/landing/HeroSection.tsx
'use client';

import React from 'react';
import NextLink from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, UploadCloud, Info, Sparkles, Brain, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  queryFormSlot: React.ReactNode;
  isAuthenticated: boolean;
  authLoading: boolean;
}

export default function HeroSection({ queryFormSlot, isAuthenticated, authLoading }: HeroSectionProps) {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 text-center relative overflow-hidden">
      <div 
        className="absolute inset-0 -z-10 opacity-15 dark:opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.5) 0%, hsl(var(--primary) / 0.3) 20%, transparent 50%), " +
            "radial-gradient(circle at 10% 20%, hsl(var(--accent) / 0.4) 0%, hsl(var(--accent) / 0.2) 25%, transparent 60%), " +
            "radial-gradient(circle at 90% 80%, hsl(var(--secondary) / 0.5) 0%, hsl(var(--secondary) / 0.3) 25%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_UP_ANIMATION_VARIANTS}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4 sm:mb-6 font-medium shadow-sm border border-primary/20">
            <Sparkles className="inline-block h-4 w-4 mr-1.5 -mt-0.5" /> Advanced AI Research Platform
          </div>
          <h1 className="hero-title text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary/80 to-accent">
            Uncover Deeper Insights with ScholarAI
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Leverage cutting-edge AI to formulate research queries, synthesize knowledge, visualize concepts, and generate comprehensive reports effortlessly.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_UP_ANIMATION_VARIANTS}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="mt-10 md:mt-12 w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto"
        >
          {queryFormSlot}
        </motion.div>
        
        <motion.div
            initial="hidden"
            animate="visible"
            variants={FADE_UP_ANIMATION_VARIANTS}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
            <Button 
                asChild 
                size="lg" 
                className={cn(
                    "w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-2xl px-8 py-3 text-base sm:text-lg shadow-xl",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
                onClick={() => {
                  // Scroll to query form or trigger focus, assuming queryFormSlot contains the form.
                  // This might need more specific targeting if the form is deeply nested.
                  const queryFormElement = document.getElementById('researchQuestion'); // Assuming your Textarea has this ID
                  if (queryFormElement) {
                    queryFormElement.focus({ preventScroll: true });
                    // Smooth scroll to the form area
                    const formCard = queryFormElement.closest('form')?.parentElement?.parentElement; // Adjust based on actual DOM structure
                    formCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                disabled={authLoading || (!isAuthenticated && !authLoading)}
            >
                <span>
                    {authLoading ? "Loading..." : (isAuthenticated ? "Start Research" : "Login to Start")}
                    {!authLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </span>
            </Button>
            <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className={cn(
                    "w-full sm:w-auto border-primary/40 hover:border-primary/70 hover:bg-primary/5 hover:text-primary px-8 py-3 text-base sm:text-lg shadow-lg",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
            >
                <NextLink href="/file-report">
                    <UploadCloud className="mr-2 h-5 w-5" /> Analyze Your File
                </NextLink>
            </Button>
        </motion.div>

        {!isAuthenticated && !authLoading && (
             <motion.p 
                initial="hidden"
                animate="visible"
                variants={FADE_UP_ANIMATION_VARIANTS}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                className="mt-6 text-xs text-muted-foreground"
            >
                <Info className="inline h-3 w-3 mr-1 -mt-0.5"/>
                Sign up or log in to access the full suite of ScholarAI research tools.
            </motion.p>
        )}
      </div>
    </section>
  );
}
