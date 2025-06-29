'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a skeleton on the server and during the initial client render to avoid hydration mismatch
    return (
        <footer className="py-8 sm:py-10 border-t-2 border-border/50 bg-background mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-muted-foreground">
                <div className="h-4 w-3/4 mx-auto bg-muted/40 rounded-sm animate-pulse mb-4"></div>
                <div className="h-3 w-1/2 mx-auto bg-muted/40 rounded-sm animate-pulse mb-4"></div>
                <div className="h-3 w-2/3 mx-auto bg-muted/40 rounded-sm animate-pulse"></div>
            </div>
        </footer>
    );
  }
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 sm:py-10 border-t-2 border-border/50 bg-background mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-muted-foreground">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-3">
          <NextLink href="/about" className="hover:text-accent hover:underline">{t('footer.about')}</NextLink>
          <NextLink href="/features" className="hover:text-accent hover:underline">{t('footer.features')}</NextLink>
          <NextLink href="/pricing" className="hover:text-accent hover:underline">{t('footer.pricing')}</NextLink>
          <NextLink href="/contact" className="hover:text-accent hover:underline">{t('footer.contact')}</NextLink>
          <NextLink href="/docs" className="hover:text-accent hover:underline">{t('footer.docs')}</NextLink>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-4">
          <NextLink href="/privacy-policy" className="text-xs hover:text-accent hover:underline">{t('footer.privacyPolicy')}</NextLink>
          <span className="text-muted-foreground/50">|</span>
          <NextLink href="/terms-conditions" className="text-xs hover:text-accent hover:underline">{t('footer.terms')}</NextLink>
        </div>
        <div>
          <p>
            &copy; {currentYear} {t('footer.copyright')}
            <Sparkles className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent mx-1 sm:mx-1.5"/>
            {t('footer.poweredBy')}
          </p>
          <p className="mt-2 text-xs">
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}
