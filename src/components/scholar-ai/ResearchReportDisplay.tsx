'use client';

import type { GenerateResearchReportOutput } from '@/ai/flows/generate-research-report';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, BookOpen, ListChecks, MessageSquareQuote, SearchCode, Lightbulb, AlertTriangle, ThumbsUp, Telescope, Edit3, BarChartHorizontalBig, Users, ShieldCheck, BookCopy, BookMarked, TrendingUp, FileJson, GanttChartSquare, PieChartIcon, LineChartIcon, BarChartIcon, ScatterChartIcon, Brain, LightbulbIcon, Maximize, Settings, FileQuestion, Activity, Library, UsersRound, ShieldAlert, ClipboardList, Milestone, Scale, GitBranch } from 'lucide-react';
import NextImage from 'next/image';
import { cn } from '@/lib/utils';
import PlaceholderChart from './PlaceholderChart';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';


interface ResearchReportDisplayProps {
  report: GenerateResearchReportOutput;
  originalQuestion: string;
  generatedImageUrl?: string | null;
}

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string, defaultOpen?: boolean }> = ({ title, icon, children, className, defaultOpen = false }) => (
  <AccordionItem value={title.replace(/\s+/g, '-').toLowerCase()} className={cn('border-b-0 mb-2 rounded-lg overflow-hidden shadow-sm bg-card hover:shadow-md transition-shadow duration-200', className)}>
    <AccordionTrigger className="py-3.5 px-4 hover:no-underline hover:bg-secondary/50 transition-colors duration-150 rounded-t-lg data-[state=open]:rounded-b-none data-[state=open]:border-b data-[state=open]:border-border">
      <h3 className="text-md md:text-lg font-semibold flex items-center text-primary">
        {icon && <span className="mr-2.5 text-accent">{icon}</span>}
        {title}
      </h3>
    </AccordionTrigger>
    <AccordionContent className="bg-card rounded-b-lg">
      <div className="text-foreground/90 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none marker:text-accent px-4 py-3 pt-2">
        {children}
      </div>
    </AccordionContent>
  </AccordionItem>
);

export default function ResearchReportDisplay({ report, originalQuestion, generatedImageUrl }: ResearchReportDisplayProps) {
  const renderParagraphs = (text: string | undefined | null) => {
    if (!text) return <p className="italic text-muted-foreground">Not provided in the report.</p>;
    return text.split(/\n\s*\n|\n(?=\s*(?:•|-|\*)\s)|\n(?=\s*\d+\.\s)/) 
               .filter(p => p.trim() !== "")
               .map((paragraph, index) => {
                 if (paragraph.match(/^\s*(?:•|-|\*)\s/) || paragraph.match(/^\s*\d+\.\s/)) {
                   const listItems = paragraph.split('\n').map(item => item.trim()).filter(item => item);
                   if (listItems.length > 0) {
                     const listType = paragraph.match(/^\s*(\d+\.)/) ? 'ol':'ul';
                     const ListTag = listType as keyof JSX.IntrinsicElements;
                     return (
                       <ListTag key={index} className={`list-${listType === 'ol' ? 'decimal' : 'disc'} list-inside mb-3 pl-2 space-y-1`}>
                         {listItems.map((item, subIndex) => (
                           <li key={subIndex} className="leading-normal">{item.replace(/^\s*(?:•|-|\*|\d+\.)\s*/, '')}</li>
                         ))}
                       </ListTag>
                     );
                   }
                 }
                 return <p key={index} className="mb-3 last:mb-0 leading-normal">{paragraph}</p>;
               });
  };

  const getDefaultOpenAccordionItems = () => {
    const items = ['introduction', 'executive-summary', 'conceptual-overview'];
    if (report.resultsAndAnalysis && report.resultsAndAnalysis.length > 0) {
        items.push('results-and-analysis');
    }
    if (report.conclusion) {
        items.push('conclusion');
    }
    return items;
  }

  const sectionIcons = {
    executiveSummary: <Telescope size={18}/>,
    introduction: <BookOpen size={18}/>,
    literatureReview: <Library size={18}/>,
    keyThemes: <UsersRound size={18}/>,
    detailedMethodology: <Settings size={18}/>,
    resultsAndAnalysis: <Activity size={18}/>,
    discussion: <MessageSquareQuote size={18}/>,
    conclusion: <ThumbsUp size={18}/>,
    limitations: <ShieldAlert size={18}/>,
    futureWork: <LightbulbIcon size={18}/>,
    ethicalConsiderations: <Scale size={18}/>,
    references: <ClipboardList size={18}/>,
    appendices: <FileText size={18}/>,
    glossary: <BookMarked size={18}/>,
    conceptualOverview: <Brain size={18}/>,
  };

  return (
    <Card className="w-full shadow-2xl border-primary/10 rounded-xl overflow-hidden bg-gradient-to-br from-card via-background/5 to-card transform transition-all duration-500 hover:shadow-primary/20">
      <CardHeader className="p-5 md:p-6 bg-gradient-to-r from-primary/80 via-primary to-primary/80 text-primary-foreground border-b border-primary/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="p-2.5 bg-accent/20 rounded-full shadow-lg border-2 border-accent/50 flex-shrink-0 ring-2 ring-accent/30 ring-offset-2 ring-offset-primary">
            <FileJson className="h-7 w-7 md:h-8 md:w-8 text-accent" />
          </div>
          <div className="flex-grow">
            <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
              {report.title || "Generated Research Report"}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-xs md:text-sm mt-1 max-w-2xl">
              Comprehensive analysis for: <em className='font-medium'>"{originalQuestion}"</em>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="h-[calc(100vh-350px)] md:h-[calc(100vh-300px)] bg-background/30">
        <CardContent className="p-3 md:p-5">
          <Accordion type="multiple" defaultValue={getDefaultOpenAccordionItems()} className="w-full space-y-2">
            {generatedImageUrl && (
              <Section title="Conceptual Overview" icon={sectionIcons.conceptualOverview} defaultOpen>
                 <div className="my-3 p-3 border border-border rounded-lg bg-secondary/30 shadow-inner flex justify-center items-center overflow-hidden">
                    <Dialog>
                      <DialogTrigger asChild>
                        <NextImage
                          src={generatedImageUrl}
                          alt="Conceptual visualization for the research report"
                          width={450} 
                          height={340}
                          className="rounded-md object-contain shadow-md max-h-[300px] cursor-pointer hover:scale-105 transition-transform duration-300"
                          data-ai-hint="research concept"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none">
                        <DialogHeader>
                          <DialogTitle className="sr-only">Conceptual Visualization - Full Screen</DialogTitle>
                          <DialogDescription className="sr-only">
                            A larger view of the AI-generated conceptual visualization for the research report.
                          </DialogDescription>
                        </DialogHeader>
                        <NextImage 
                            src={generatedImageUrl} 
                            alt="Conceptual visualization for the research report - fullscreen" 
                            width={1024} 
                            height={1024} 
                            className="rounded-lg object-contain w-full h-auto shadow-2xl"
                            data-ai-hint="research concept"
                          />
                      </DialogContent>
                    </Dialog>
                </div>
              </Section>
            )}
            
            <Section title="Executive Summary" icon={sectionIcons.executiveSummary} defaultOpen>
              {renderParagraphs(report.executiveSummary)}
            </Section>

            <Section title="Introduction" icon={sectionIcons.introduction} defaultOpen>
              {renderParagraphs(report.introduction)}
            </Section>

            <Section title="Literature Review" icon={sectionIcons.literatureReview}>
              {renderParagraphs(report.literatureReview)}
            </Section>

            <Section title="Key Themes & Discussion" icon={sectionIcons.keyThemes}>
              {report.keyThemes && report.keyThemes.length > 0 ? (
                report.keyThemes.map((themeObj, index) => (
                  <div key={index} className="mb-3.5 p-3.5 bg-secondary/20 dark:bg-secondary/10 rounded-md border border-border/50 shadow-sm last:mb-0">
                    <h4 className="font-semibold text-base text-accent-foreground mb-1.5 flex items-center">
                      <Milestone size={16} className="mr-2 text-accent/80"/>
                      {index + 1}. {themeObj.theme}
                    </h4>
                    {renderParagraphs(themeObj.discussion)}
                  </div>
                ))
              ) : renderParagraphs(undefined)}
            </Section>
            
            <Section title="Detailed Methodology" icon={sectionIcons.detailedMethodology}>
              {renderParagraphs(report.detailedMethodology)}
            </Section>

            <Section title="Results and Analysis" icon={sectionIcons.resultsAndAnalysis} defaultOpen>
              {report.resultsAndAnalysis && report.resultsAndAnalysis.length > 0 ? (
                report.resultsAndAnalysis.map((result, index) => (
                  <div key={index} className="mb-4 p-4 bg-secondary/20 dark:bg-secondary/10 rounded-lg border border-border/50 shadow-sm last:mb-0">
                    <h4 className="font-semibold text-base text-accent-foreground mb-2.5 flex items-center">
                      <GitBranch size={16} className="mr-2 text-accent/80"/>
                      {result.sectionTitle}
                    </h4>
                    <div className="prose prose-sm dark:prose-invert max-w-none marker:text-accent">
                      {renderParagraphs(result.content)}
                    </div>
                    {result.chartSuggestion && result.chartSuggestion.type !== 'none' && (
                      <div className="mt-3.5 pt-3.5 border-t border-dashed border-border/40">
                        <h5 className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center">
                          {result.chartSuggestion.type === 'bar' && <BarChartIcon className="h-4 w-4 mr-1.5 text-muted-foreground/80" />}
                          {result.chartSuggestion.type === 'line' && <LineChartIcon className="h-4 w-4 mr-1.5 text-muted-foreground/80" />}
                          {result.chartSuggestion.type === 'pie' && <PieChartIcon className="h-4 w-4 mr-1.5 text-muted-foreground/80" />}
                          {result.chartSuggestion.type === 'scatter' && <ScatterChartIcon className="h-4 w-4 mr-1.5 text-muted-foreground/80" />}
                          Suggested Visualization: {result.chartSuggestion.title || result.chartSuggestion.type.charAt(0).toUpperCase() + result.chartSuggestion.type.slice(1) + " Chart"}
                        </h5>
                        <p className="text-xs text-muted-foreground mb-2 italic">Description: {result.chartSuggestion.dataDescription}</p>
                        {(result.chartSuggestion.xAxisLabel || result.chartSuggestion.yAxisLabel) && (
                           <p className="text-xs text-muted-foreground mb-2">
                            {result.chartSuggestion.xAxisLabel && `X-axis: ${result.chartSuggestion.xAxisLabel}. `}
                            {result.chartSuggestion.yAxisLabel && `Y-axis: ${result.chartSuggestion.yAxisLabel}.`}
                           </p>
                        )}
                        <PlaceholderChart 
                          chartType={result.chartSuggestion.type} 
                          title={result.chartSuggestion.title || "Sample Chart"} 
                          description={result.chartSuggestion.dataDescription}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : renderParagraphs(undefined)}
            </Section>
            
            <Section title="Discussion of Findings" icon={sectionIcons.discussion}>
              {renderParagraphs(report.discussion)}
            </Section>

            <Section title="Conclusion" icon={sectionIcons.conclusion} defaultOpen>
              {renderParagraphs(report.conclusion)}
            </Section>

            {report.limitations && (
              <Section title="Limitations" icon={sectionIcons.limitations}>
                {renderParagraphs(report.limitations)}
              </Section>
            )}

            {report.futureWork && (
              <Section title="Future Work & Suggestions" icon={sectionIcons.futureWork}>
                {renderParagraphs(report.futureWork)}
              </Section>
            )}

            {report.ethicalConsiderations && (
              <Section title="Ethical Considerations" icon={sectionIcons.ethicalConsiderations}>
                {renderParagraphs(report.ethicalConsiderations)}
              </Section>
            )}
            
            {report.references && report.references.length > 0 && (
              <Section title="References (AI Synthesized)" icon={sectionIcons.references}>
                <ul className="list-decimal list-inside space-y-1.5 text-xs">
                  {report.references.map((ref, index) => (
                    <li key={index} className="leading-normal">{ref}</li>
                  ))}
                </ul>
              </Section>
            )}

            {report.appendices && report.appendices.length > 0 && (
               <Section title="Appendices" icon={sectionIcons.appendices}>
                {report.appendices.map((appendix, index) => (
                  <div key={index} className="mb-3 p-3 bg-secondary/20 dark:bg-secondary/10 rounded-md border border-border/40 shadow-sm last:mb-0">
                    <h4 className="font-medium text-sm text-accent-foreground mb-1.5">{appendix.title}</h4>
                    {renderParagraphs(appendix.content)}
                  </div>
                ))}
              </Section>
            )}

            {report.glossary && report.glossary.length > 0 && (
               <Section title="Glossary" icon={sectionIcons.glossary}>
                <ul className="space-y-2 text-xs">
                  {report.glossary.map((item, index) => (
                    <li key={index} className="border-b border-dashed border-border/30 pb-1.5 last:border-b-0 last:pb-0">
                      <strong className="text-foreground/90 font-medium">{item.term}:</strong> <span className="text-muted-foreground ml-1">{item.definition}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

          </Accordion>
        </CardContent>
      </ScrollArea>
      <CardFooter className="p-4 border-t border-border/20 bg-secondary/10 dark:bg-secondary/5 text-center">
        <p className="text-xs text-muted-foreground w-full">This report was automatically generated by ScholarAI using advanced AI models.</p>
      </CardFooter>
    </Card>
  );
}
