
// src/app/about/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { Info, Zap, Users, Target, Compass, Heart, Eye, Package, ArrowRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="text-center p-8 sm:p-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-t-xl">
          <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-5 sm:mb-8 mx-auto ring-2 ring-accent/40 shadow-lg text-accent-foreground">
            <Info className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
          <CardTitle className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            {t('aboutPage.title')}
          </CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto">
            {t('aboutPage.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 md:p-10 space-y-10 sm:space-y-12 text-base sm:text-lg text-foreground/90 leading-relaxed prose prose-lg dark:prose-invert max-w-none marker:text-accent">
          
          <section className="bg-secondary/30 dark:bg-secondary/10 p-6 rounded-lg shadow-md border border-border/50">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mb-4">
              <Target className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
              {t('aboutPage.missionTitle')}
            </h2>
            <p>
              {t('aboutPage.missionText')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mb-4">
              <Zap className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
              {t('aboutPage.stackTitle')}
            </h2>
            <p>
              {t('aboutPage.stackText')}
            </p>
            <ul className="list-disc list-outside space-y-2 pl-5 mt-4">
              <li><strong>Next.js & React:</strong> {t('aboutPage.stackNext')}</li>
              <li><strong>Genkit & Google Gemini Models:</strong> {t('aboutPage.stackGenkit')}</li>
              <li><strong>Firebase:</strong> {t('aboutPage.stackFirebase')}</li>
              <li><strong>ShadCN UI & Tailwind CSS:</strong> {t('aboutPage.stackShadcn')}</li>
              <li><strong>TypeScript:</strong> {t('aboutPage.stackTypescript')}</li>
            </ul>
          </section>
          
          <section className="bg-secondary/30 dark:bg-secondary/10 p-6 rounded-lg shadow-md border border-border/50">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mb-4">
              <Heart className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
              {t('aboutPage.valuesTitle')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-medium text-primary/90 flex items-center mb-2"><Star className="h-5 w-5 mr-2 text-yellow-400"/>{t('aboutPage.valueInnovation')}</h3>
                <p className="text-foreground/80">{t('aboutPage.valueInnovationText')}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-primary/90 flex items-center mb-2"><Package className="h-5 w-5 mr-2 text-green-500"/>{t('aboutPage.valueAccessibility')}</h3>
                <p className="text-foreground/80">{t('aboutPage.valueAccessibilityText')}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-primary/90 flex items-center mb-2"><Info className="h-5 w-5 mr-2 text-blue-500"/>{t('aboutPage.valueIntegrity')}</h3>
                <p className="text-foreground/80">{t('aboutPage.valueIntegrityText')}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-primary/90 flex items-center mb-2"><Users className="h-5 w-5 mr-2 text-purple-500"/>{t('aboutPage.valueCollaboration')}</h3>
                <p className="text-foreground/80">{t('aboutPage.valueCollaborationText')}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mb-4">
              <Users className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
              {t('aboutPage.teamTitle')}
            </h2>
            <p>
             {t('aboutPage.teamText')}
            </p>
          </section>

          <section className="bg-primary/5 dark:bg-primary/10 p-6 rounded-lg shadow-md border border-primary/20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center mb-4">
              <Eye className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-accent" />
              {t('aboutPage.visionTitle')}
            </h2>
            <p>
             {t('aboutPage.visionText')}
            </p>
             <div className="mt-6 text-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:shadow-lg">
                  <NextLink href="/features">
                    {t('aboutPage.visionButton')} <ArrowRight className="ml-2 h-5 w-5" />
                  </NextLink>
                </Button>
              </div>
          </section>

          <p className="text-center pt-6 sm:pt-8 text-muted-foreground text-base">
            {t('aboutPage.thankYou')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
