
// src/components/layout/Footer.tsx
'use client';

import React from 'react';
import NextLink from 'next/link';
import { Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  const [currentYear, setCurrentYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-8 sm:py-10 px-4 md:px-8 border-t-2 border-border/50 bg-background mt-auto">
      <div className="container mx-auto text-center text-xs sm:text-sm text-muted-foreground">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-3">
          <NextLink href="/about" className="hover:text-accent hover:underline">About</NextLink>
          <NextLink href="/features" className="hover:text-accent hover:underline">Features</NextLink>
          <NextLink href="/pricing" className="hover:text-accent hover:underline">Pricing</NextLink>
          <NextLink href="/testimonials" className="hover:text-accent hover:underline">Testimonials</NextLink>
          <NextLink href="/contact" className="hover:text-accent hover:underline">Contact</NextLink>
          <NextLink href="/docs" className="hover:text-accent hover:underline">Docs</NextLink>
          <NextLink href="/api-docs" className="hover:text-accent hover:underline">API</NextLink>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-4">
          <NextLink href="/privacy-policy" className="text-xs hover:text-accent hover:underline">Privacy Policy</NextLink>
          <span className="text-muted-foreground/50">|</span>
          <NextLink href="/terms-conditions" className="text-xs hover:text-accent hover:underline">Terms & Conditions</NextLink>
        </div>
        <div>
          <p>
            &copy; {currentYear ?? <span className="inline-block w-10 h-4 bg-muted/40 rounded-sm animate-pulse"></span>} ScholarAI.
            <Sparkles className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent mx-1 sm:mx-1.5"/>
            Powered by Generative AI.
          </p>
          <p className="mt-2 text-xs">
            Pioneering the future of research with augmented intelligence.
          </p>
          <a
            href="https://github.com/firebase/genkit/tree/main/examples/nextjs_template"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 sm:mt-4 inline-flex items-center text-xs text-accent hover:text-accent-foreground hover:underline group"
          >
            View Project on GitHub <ExternalLink className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform"/>
          </a>
        </div>
      </div>
    </footer>
  );
}
