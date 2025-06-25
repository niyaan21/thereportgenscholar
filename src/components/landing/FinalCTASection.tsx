
// src/components/landing/FinalCTASection.tsx
'use client';

import React from 'react';
import NextLink from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Rocket, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const FinalCTASection = React.memo(function FinalCTASection() {
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={FADE_IN_ANIMATION_VARIANTS}
        >
          <Card className="max-w-3xl mx-auto text-center shadow-2xl border-primary/20 rounded-xl overflow-hidden">
            <CardHeader className="p-8 sm:p-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-6 mx-auto ring-2 ring-accent/40 shadow-lg text-accent-foreground">
                <Rocket className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <CardTitle className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                Ready to Revolutionize Your Research?
              </CardTitle>
              <CardDescription className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
                Join Foss AI today and harness the power of AI to accelerate your discoveries, synthesize complex information, and generate insightful reports in minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 sm:p-10 pt-0">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-2xl px-8 py-3 text-lg shadow-xl">
                  <NextLink href="/signup">
                    Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </NextLink>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-primary/40 hover:border-primary/70 hover:bg-primary/5 hover:text-primary px-8 py-3 text-lg shadow-lg">
                  <NextLink href="/features">
                    <Sparkles className="mr-2 h-5 w-5" /> Explore Features
                  </NextLink>
                </Button>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                Unlock advanced capabilities with our flexible <NextLink href="/pricing" className="text-accent hover:underline">pricing plans</NextLink>.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
});
FinalCTASection.displayName = "FinalCTASection";
export default FinalCTASection;
