'use client';

import type { GenerateResearchReportOutput } from '@/ai/flows/generate-research-report';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, BookOpen, ListChecks, MessageSquareQuote, SearchCode, Lightbulb, AlertTriangle, ThumbsUp, Telescope, Edit3, BarChartHorizontalBig } from 'lucide-react';
import NextImage from 'next/image';

interface ResearchReportDisplayProps {
  report: GenerateResearchReportOutput;
  originalQuestion: string;
  generatedImageUrl?: string | null;
}

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
  <div className={cn('space-y-2 py-3', className)}>
    <h3 className="text-lg font-semibold flex items-center text-primary mb-2">
      {icon && <span className="mr-2 text-accent">{icon}</span>}
      {title}
    </h3>
    <div className="text-foreground/90 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none marker:text-accent">
      {children}
    </div>
  </div>
);

export default function ResearchReportDisplay({ report, originalQuestion, generatedImageUrl }: ResearchReportDisplayProps) {
  const renderParagraphs = (text: string | undefined) => {
    if (!text) return <p className="italic text-muted-foreground">Not provided.</p>;
    return text.split(/\n\s*\n/).filter(p => p.trim() !== "").map((paragraph, index) => (
      <p key={index} className="mb-2 last:mb-0">{paragraph}</p>
    ));
  };

  return (
    <Card className="w-full shadow-xl border-primary/20 rounded-xl overflow-hidden bg-card">
      <CardHeader className="p-6 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-b border-primary/10">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-accent/10 rounded-full shadow-md border border-accent/20">
            <BookOpen className="h-8 w-8 text-accent" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-primary tracking-tight">
              {report.title || "Generated Research Report"}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-1">
              A comprehensive analysis based on your inquiry: "{originalQuestion}"
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="h-[calc(100vh-280px)]"> {/* Adjust height as needed */}
        <CardContent className="p-6 space-y-5">
          {generatedImageUrl && (
            <Section title="Conceptual Overview" icon={<Lightbulb size={20}/>}>
               <div className="my-4 p-3 border border-border rounded-lg bg-secondary/30 shadow-inner flex justify-center items-center">
                <NextImage
                  src={generatedImageUrl}
                  alt="Conceptual visualization for the research report"
                  width={300}
                  height={300}
                  className="rounded-md object-contain shadow-md"
                  data-ai-hint="research concept"
                />
              </div>
            </Section>
          )}
          
          <Section title="Introduction" icon={<Telescope size={20}/>}>
            {renderParagraphs(report.introduction)}
          </Section>

          <Separator className="my-3 bg-border/50" />

          <Section title="Key Themes & Discussion" icon={<BarChartHorizontalBig size={20}/>}>
            {report.keyThemes && report.keyThemes.length > 0 ? (
              report.keyThemes.map((themeObj, index) => (
                <div key={index} className="mb-3 p-3 bg-secondary/20 dark:bg-secondary/10 rounded-md border border-border/50 shadow-sm">
                  <h4 className="font-semibold text-base text-accent-foreground mb-1">{themeObj.theme}</h4>
                  {renderParagraphs(themeObj.discussion)}
                </div>
              ))
            ) : renderParagraphs(undefined)}
          </Section>

          <Separator className="my-3 bg-border/50" />

          <Section title="Methodology Outline" icon={<SearchCode size={20}/>}>
            {renderParagraphs(report.methodology)}
          </Section>
          
          <Separator className="my-3 bg-border/50" />

          <Section title="Key Findings" icon={<ListChecks size={20}/>}>
            {report.findings && report.findings.length > 0 ? (
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                {report.findings.map((finding, index) => (
                  <li key={index}>
                    <strong>{finding.statement}</strong>
                    {finding.elaboration && <p className="text-xs text-muted-foreground ml-4">{finding.elaboration}</p>}
                  </li>
                ))}
              </ul>
            ) : renderParagraphs(undefined)}
          </Section>

          <Separator className="my-3 bg-border/50" />
          
          <Section title="Discussion of Findings" icon={<MessageSquareQuote size={20}/>}>
            {renderParagraphs(report.discussion)}
          </Section>

          <Separator className="my-3 bg-border/50" />

          <Section title="Conclusion" icon={<ThumbsUp size={20}/>}>
            {renderParagraphs(report.conclusion)}
          </Section>

          {report.limitations && (
            <>
              <Separator className="my-3 bg-border/50" />
              <Section title="Limitations" icon={<AlertTriangle size={20}/>}>
                {renderParagraphs(report.limitations)}
              </Section>
            </>
          )}

          {report.futureWork && (
            <>
              <Separator className="my-3 bg-border/50" />
              <Section title="Future Work & Suggestions" icon={<Edit3 size={20}/>}>
                {renderParagraphs(report.futureWork)}
              </Section>
            </>
          )}
          
          {report.references && report.references.length > 0 && (
            <>
              <Separator className="my-3 bg-border/50" />
              <Section title="References (AI Synthesized)" icon={<FileText size={20}/>}>
                <ul className="list-decimal list-inside space-y-1 text-xs">
                  {report.references.map((ref, index) => (
                    <li key={index}>{ref}</li>
                  ))}
                </ul>
              </Section>
            </>
          )}
        </CardContent>
      </ScrollArea>
      <CardFooter className="p-4 border-t border-border/20 bg-secondary/10 dark:bg-secondary/5 text-center">
        <p className="text-xs text-muted-foreground w-full">This report was automatically generated by ScholarAI.</p>
      </CardFooter>
    </Card>
  );
}
