// src/components/scholar-ai/ResearchReportDisplay.tsx
'use client';

import type { GenerateResearchReportOutput } from '@/ai/flows/generate-research-report';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, BookOpen, ListChecks, MessageSquareQuote, SearchCode, Lightbulb, AlertTriangle, ThumbsUp, Telescope, Edit3, BarChartHorizontalBig, Users, ShieldCheck, BookCopy, BookMarked, TrendingUp, FileJson, GanttChartSquare, PieChartIcon, LineChartIcon, BarChartIcon, ScatterChartIcon, Brain, LightbulbIcon, MaximizeIcon, Settings, FileQuestion, Activity, Library, UsersRound, ShieldAlert, ClipboardList, Milestone, Scale, GitBranch, DownloadCloud, Share2Icon } from 'lucide-react';
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
import { motion } from 'framer-motion';

export interface ResearchReportDisplayProps {
  report: GenerateResearchReportOutput;
  originalQuestion: string;
  generatedImageUrl?: string | null;
}

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string, defaultOpen?: boolean, value: string }> = ({ title, icon, children, className, defaultOpen = false, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 15, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
  >
    <AccordionItem value={value} className={cn('border-b-0 mb-3.5 rounded-xl overflow-hidden shadow-lg bg-card hover:shadow-primary/15 transition-all duration-300 card-glow-border', className)}>
      <AccordionTrigger className="py-4 px-6 hover:no-underline hover:bg-secondary/70 dark:hover:bg-secondary/35 transition-colors duration-200 rounded-t-xl data-[state=open]:rounded-b-none data-[state=open]:border-b data-[state=open]:border-border/80 data-[state=open]:bg-secondary/50 dark:data-[state=open]:bg-secondary/25 group">
        <h3 className="text-lg md:text-xl font-semibold flex items-center text-primary group-hover:text-accent transition-colors duration-200">
          {icon && <span className="mr-3.5 text-accent group-data-[state=open]:text-primary transition-colors duration-200">{icon}</span>}
          {title}
        </h3>
      </AccordionTrigger>
      <AccordionContent className="bg-card rounded-b-xl">
        <div className="text-foreground/90 text-base leading-relaxed prose prose-base dark:prose-invert max-w-none marker:text-accent px-6 py-5 pt-4">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  </motion.div>
);

export default function ResearchReportDisplay({ report, originalQuestion, generatedImageUrl }: ResearchReportDisplayProps) {
  const renderParagraphs = (text: string | undefined | null) => {
    if (!text) return <p className="italic text-muted-foreground my-3.5">Content for this section was not provided in the generated report.</p>;
    return text.split(/\n\s*\n|\n(?=\s*(?:•|-|\*)\s)|\n(?=\s*\d+\.\s)/) 
               .filter(p => p.trim() !== "")
               .map((paragraph, index) => {
                 if (paragraph.match(/^\s*(?:•|-|\*)\s/) || paragraph.match(/^\s*\d+\.\s/)) {
                   const listItems = paragraph.split('\n').map(item => item.trim()).filter(item => item);
                   if (listItems.length > 0) {
                     const listType = paragraph.match(/^\s*(\d+\.)/) ? 'ol':'ul';
                     const ListTag = listType as keyof JSX.IntrinsicElements;
                     return (
                       <ListTag key={index} className={`list-${listType === 'ol' ? 'decimal' : 'disc'} list-inside mb-4.5 pl-3.5 space-y-2`}>
                         {listItems.map((item, subIndex) => (
                           <li key={subIndex} className="leading-relaxed text-foreground/85">{item.replace(/^\s*(?:•|-|\*|\d+\.)\s*/, '')}</li>
                         ))}
                       </ListTag>
                     );
                   }
                 }
                 return <p key={index} className="mb-4.5 last:mb-0 leading-relaxed text-foreground/85">{paragraph}</p>;
               });
  };

  const getDefaultOpenAccordionItems = () => {
    const items = ['conceptual-overview', 'executive-summary', 'introduction'];
    if (report.resultsAndAnalysis && report.resultsAndAnalysis.length > 0) {
        items.push('results-and-analysis');
    }
    if (report.conclusion) {
        items.push('conclusion');
    }
    return items.map(item => item.replace(/\s+/g, '-').toLowerCase());
  }

  const sectionIconSize = 22; // Slightly larger icons
  const sectionIcons = {
    executiveSummary: <Telescope size={sectionIconSize}/>,
    introduction: <BookOpen size={sectionIconSize}/>,
    literatureReview: <Library size={sectionIconSize}/>,
    keyThemes: <UsersRound size={sectionIconSize}/>,
    detailedMethodology: <Settings size={sectionIconSize}/>,
    resultsAndAnalysis: <Activity size={sectionIconSize}/>,
    discussion: <MessageSquareQuote size={sectionIconSize}/>,
    conclusion: <ThumbsUp size={sectionIconSize}/>,
    limitations: <ShieldAlert size={sectionIconSize}/>,
    futureWork: <LightbulbIcon size={sectionIconSize}/>,
    ethicalConsiderations: <Scale size={sectionIconSize}/>,
    references: <ClipboardList size={sectionIconSize}/>,
    appendices: <FileText size={sectionIconSize}/>,
    glossary: <BookMarked size={sectionIconSize}/>,
    conceptualOverview: <Brain size={sectionIconSize}/>,
  };

  const handleDownloadReport = () => {
    const reportString = JSON.stringify({ report, originalQuestion, generatedImageUrl }, null, 2);
    const blob = new Blob([reportString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ScholarAI_Report_${report.title?.replace(/\s+/g, '_') || 'Untitled'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "circOut", delay: 0.25 }}
      >
    <Card className="w-full shadow-2xl border-primary/30 rounded-2xl overflow-hidden bg-gradient-to-br from-card via-background/5 to-card transform transition-all duration-500 hover:shadow-primary/35">
      <CardHeader className="p-7 md:p-8 bg-gradient-to-r from-primary/95 via-primary to-primary/90 text-primary-foreground border-b border-primary/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <motion.div 
            className="p-4 bg-gradient-to-br from-accent to-accent/70 rounded-2xl shadow-xl border-2 border-accent/60 flex-shrink-0 ring-2 ring-accent/40 ring-offset-2 ring-offset-primary"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            >
            <FileJson className="h-9 w-9 md:h-11 md:w-11 text-accent-foreground" />
          </motion.div>
          <div className="flex-grow">
            <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {report.title || "Generated Research Report"}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-base md:text-lg mt-2 max-w-3xl">
              In-depth exploration for: <em className='font-semibold'>"{originalQuestion}"</em>
            </CardDescription>
          </div>
           <div className="flex-shrink-0 flex space-x-2.5 mt-4 sm:mt-0 self-start sm:self-center">
             <Button variant="outline" size="sm" onClick={handleDownloadReport} className="bg-primary-foreground/15 hover:bg-primary-foreground/25 border-primary-foreground/40 text-primary-foreground rounded-lg px-3.5 py-2 text-sm">
                <DownloadCloud size={18} className="mr-2" /> Download JSON
             </Button>
           </div>
        </div>
      </CardHeader>

      <ScrollArea className="h-[calc(100vh-420px)] md:h-[calc(100vh-380px)] bg-background/50">
        <CardContent className="p-5 md:p-7">
          <Accordion type="multiple" defaultValue={getDefaultOpenAccordionItems()} className="w-full space-y-4">
            {generatedImageUrl && (
              <Section title="Visual Conceptualization" icon={sectionIcons.conceptualOverview} value="conceptual-overview" defaultOpen>
                 <div className="my-5 p-4 border border-border/80 rounded-xl bg-secondary/40 dark:bg-secondary/15 shadow-lg flex justify-center items-center overflow-hidden card-glow-border">
                    <DialogTrigger asChild>
                        <div className="relative overflow-hidden rounded-lg cursor-pointer group">
                            <NextImage
                                src={generatedImageUrl}
                                alt="Conceptual visualization for the research report"
                                width={600} 
                                height={450} // Adjusted for better aspect ratio
                                className="rounded-lg object-contain shadow-xl max-h-[400px] transition-transform duration-300 ease-out group-hover:scale-105"
                                data-ai-hint="research concept"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <MaximizeIcon className="h-10 w-10 text-white/80" />
                            </div>
                        </div>
                    </DialogTrigger>
                </div>
              </Section>
            )}
            
            <Section title="Executive Summary" icon={sectionIcons.executiveSummary} value="executive-summary" defaultOpen>
              {renderParagraphs(report.executiveSummary)}
            </Section>

            <Section title="Introduction & Background" icon={sectionIcons.introduction} value="introduction" defaultOpen>
              {renderParagraphs(report.introduction)}
            </Section>

            <Section title="Comprehensive Literature Review" icon={sectionIcons.literatureReview} value="literature-review">
              {renderParagraphs(report.literatureReview)}
            </Section>

            <Section title="Key Themes & In-Depth Discussion" icon={sectionIcons.keyThemes} value="key-themes">
              {report.keyThemes && report.keyThemes.length > 0 ? (
                report.keyThemes.map((themeObj, index) => (
                  <div key={index} className="mb-5 p-4.5 bg-secondary/35 dark:bg-secondary/10 rounded-xl border border-border/60 shadow-md last:mb-0">
                    <h4 className="font-semibold text-lg text-accent-foreground mb-2.5 flex items-center">
                      <Milestone size={19} className="mr-3 text-accent/80"/>
                      {index + 1}. {themeObj.theme}
                    </h4>
                    {renderParagraphs(themeObj.discussion)}
                  </div>
                ))
              ) : renderParagraphs(undefined)}
            </Section>
            
            <Section title="Detailed Research Methodology" icon={sectionIcons.detailedMethodology} value="detailed-methodology">
              {renderParagraphs(report.detailedMethodology)}
            </Section>

            <Section title="Results Presentation & Analysis" icon={sectionIcons.resultsAndAnalysis} value="results-and-analysis" defaultOpen>
              {report.resultsAndAnalysis && report.resultsAndAnalysis.length > 0 ? (
                report.resultsAndAnalysis.map((result, index) => (
                  <div key={index} className="mb-5 p-4.5 bg-secondary/35 dark:bg-secondary/10 rounded-xl border border-border/60 shadow-md last:mb-0">
                    <h4 className="font-semibold text-lg text-accent-foreground mb-3.5 flex items-center">
                      <GitBranch size={19} className="mr-3 text-accent/80"/>
                      {result.sectionTitle}
                    </h4>
                    <div className="prose prose-base dark:prose-invert max-w-none marker:text-accent">
                      {renderParagraphs(result.content)}
                    </div>
                    {result.chartSuggestion && result.chartSuggestion.type !== 'none' && (
                      <div className="mt-5 pt-5 border-t border-dashed border-border/50">
                        <h5 className="text-base font-medium text-muted-foreground mb-2.5 flex items-center">
                          {result.chartSuggestion.type === 'bar' && <BarChartIcon className="h-5 w-5 mr-2.5 text-muted-foreground/80" />}
                          {result.chartSuggestion.type === 'line' && <LineChartIcon className="h-5 w-5 mr-2.5 text-muted-foreground/80" />}
                          {result.chartSuggestion.type === 'pie' && <PieChartIcon className="h-5 w-5 mr-2.5 text-muted-foreground/80" />}
                          {result.chartSuggestion.type === 'scatter' && <ScatterChartIcon className="h-5 w-5 mr-2.5 text-muted-foreground/80" />}
                          Suggested Visualization: {result.chartSuggestion.title || result.chartSuggestion.type.charAt(0).toUpperCase() + result.chartSuggestion.type.slice(1) + " Chart"}
                        </h5>
                        <p className="text-sm text-muted-foreground mb-3 italic">Description: {result.chartSuggestion.dataDescription}</p>
                        {(result.chartSuggestion.xAxisLabel || result.chartSuggestion.yAxisLabel) && (
                           <p className="text-sm text-muted-foreground mb-3">
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
            
            <Section title="Holistic Discussion of Findings" icon={sectionIcons.discussion} value="discussion-of-findings">
              {renderParagraphs(report.discussion)}
            </Section>

            <Section title="Concluding Remarks & Implications" icon={sectionIcons.conclusion} value="conclusion" defaultOpen>
              {renderParagraphs(report.conclusion)}
            </Section>

            {report.limitations && (
              <Section title="Acknowledged Limitations" icon={sectionIcons.limitations} value="limitations">
                {renderParagraphs(report.limitations)}
              </Section>
            )}

            {report.futureWork && (
              <Section title="Future Research Avenues" icon={sectionIcons.futureWork} value="future-work">
                {renderParagraphs(report.futureWork)}
              </Section>
            )}

            {report.ethicalConsiderations && (
              <Section title="Ethical Considerations & Impact" icon={sectionIcons.ethicalConsiderations} value="ethical-considerations">
                {renderParagraphs(report.ethicalConsiderations)}
              </Section>
            )}
            
            {report.references && report.references.length > 0 && (
              <Section title="References (AI Synthesized)" icon={sectionIcons.references} value="references">
                <ul className="list-decimal list-inside space-y-2.5 text-sm">
                  {report.references.map((ref, index) => (
                    <li key={index} className="leading-normal text-foreground/80">{ref}</li>
                  ))}
                </ul>
              </Section>
            )}

            {report.appendices && report.appendices.length > 0 && (
               <Section title="Supplementary Appendices" icon={sectionIcons.appendices} value="appendices">
                {report.appendices.map((appendix, index) => (
                  <div key={index} className="mb-4.5 p-4 bg-secondary/35 dark:bg-secondary/10 rounded-xl border border-border/60 shadow-sm last:mb-0">
                    <h4 className="font-medium text-base text-accent-foreground mb-2.5">{appendix.title}</h4>
                    {renderParagraphs(appendix.content)}
                  </div>
                ))}
              </Section>
            )}

            {report.glossary && report.glossary.length > 0 && (
               <Section title="Glossary of Key Terms" icon={sectionIcons.glossary} value="glossary">
                <ul className="space-y-3 text-sm">
                  {report.glossary.map((item, index) => (
                    <li key={index} className="border-b border-dashed border-border/40 pb-2.5 last:border-b-0 last:pb-0">
                      <strong className="text-foreground/85 font-semibold">{item.term}:</strong> <span className="text-muted-foreground ml-2">{item.definition}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

          </Accordion>
        </CardContent>
      </ScrollArea>
      <CardFooter className="p-6 md:p-7 border-t border-border/40 bg-secondary/25 dark:bg-secondary/10 text-center">
        <p className="text-base text-muted-foreground w-full">This comprehensive report was meticulously generated by ScholarAI using advanced AI models.</p>
      </CardFooter>
    </Card>
    </motion.div>
  );
}
