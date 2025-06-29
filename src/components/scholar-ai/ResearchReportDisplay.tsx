
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import NextLink from 'next/link';
import type { GenerateResearchReportOutput } from '@/ai/flows/generate-research-report';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, BookOpen, MessageSquareQuote, ThumbsUp, Settings, LightbulbIcon, ShieldAlert, Library, UsersRound, ClipboardList, Milestone, Scale, GitBranch, DownloadCloud, BookText as AppendixIcon, BookMarked, Activity, FileType, FileJson, Loader2, Maximize, Minimize, Volume2, XCircle, ShieldCheck, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import dynamic from 'next/dynamic';
import { handleTextToSpeechAction, type TextToSpeechActionState, handlePlagiarismCheckAction, type PlagiarismCheckActionState } from '@/app/actions';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

const PlaceholderChart = dynamic(() => import('./PlaceholderChart'), {
  ssr: false,
  loading: () => <div className="h-[260px] w-full rounded-xl bg-muted/50 animate-pulse flex items-center justify-center"><Loader2 className="h-8 w-8 text-muted-foreground animate-spin" /></div>,
});


export interface ResearchReportDisplayProps {
  report: GenerateResearchReportOutput;
  originalQuestion: string;
}

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string, value: string, onReadAloud: () => void, isReading: boolean, canRead: boolean }> = ({ title, icon, children, className, value, onReadAloud, isReading, canRead }) => {
  const { t } = useTranslation();
  return (
    <div>
      <AccordionItem value={value} className={cn('border-b-0 mb-3 sm:mb-3.5 rounded-lg sm:rounded-xl overflow-hidden shadow-lg bg-card hover:shadow-primary/15 transition-all duration-300', className)}>
        <AccordionPrimitive.Header className="flex w-full items-center group data-[state=open]:rounded-b-none data-[state=open]:border-b data-[state=open]:border-border/80 data-[state=open]:bg-accent/10 dark:data-[state=open]:bg-accent/20 hover:bg-secondary/70 dark:hover:bg-secondary/35 transition-colors duration-200">
          <AccordionTrigger className="flex-1 text-left px-4 py-3 sm:py-4 sm:px-6 hover:no-underline bg-transparent">
            <div className="flex items-center">
              {icon && <span className="mr-2.5 sm:mr-3.5 text-accent group-data-[state=open]:text-accent-foreground transition-colors duration-200">{icon}</span>}
              <h3 className="text-md sm:text-lg md:text-xl font-semibold text-primary group-hover:text-accent transition-colors duration-200 flex items-center">
                {title}
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out group-data-[state=open]:text-accent-foreground group-data-[state=open]:rotate-180 ml-auto pl-2" />
              </h3>
            </div>
          </AccordionTrigger>
          <div className="pr-4 flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onReadAloud(); }} disabled={!canRead} className="h-8 w-8 rounded-full hover:bg-accent/20 focus:bg-accent/20 text-muted-foreground hover:text-accent-foreground ml-2">
                {isReading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Volume2 className="h-5 w-5" />}
                <span className="sr-only">{t('reportDisplay.readAloud')}</span>
            </Button>
          </div>
        </AccordionPrimitive.Header>
        <AccordionContent className="bg-card rounded-b-lg sm:rounded-b-xl">
          <div id={`section-content-${value}`} className="text-foreground/90 text-sm sm:text-base leading-relaxed prose prose-sm sm:prose-base dark:prose-invert max-w-none marker:text-accent px-4 py-4 sm:px-6 sm:py-5 pt-3 sm:pt-4">
            {children}
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};

const ResearchReportDisplay = React.memo(function ResearchReportDisplay({ report, originalQuestion }: ResearchReportDisplayProps) {
  const { t, i18n } = useTranslation();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { toast } = useToast();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [allSectionKeys, setAllSectionKeys] = useState<string[]>([]);

  const [readingSection, setReadingSection] = useState<string | null>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [plagiarismResult, setPlagiarismResult] = useState<PlagiarismCheckActionState['plagiarismReport']>(null);
  const [isCheckingPlagiarism, setIsCheckingPlagiarism] = useState(false);

  useEffect(() => {
    const sections = [
      'executive-summary',
      'introduction',
      'literature-review',
      'key-themes',
      'detailed-methodology',
      'results-and-analysis',
      'discussion-of-findings',
      'conclusion',
      report.limitations && 'limitations',
      report.futureWork && 'future-work',
      report.ethicalConsiderations && 'ethical-considerations',
      report.references && report.references.length > 0 && 'references',
      report.appendices && report.appendices.length > 0 && 'appendices',
      report.glossary && report.glossary.length > 0 && 'glossary',
    ].filter(Boolean) as string[];
    
    setAllSectionKeys(sections);

    const defaultOpen = ['executive-summary', 'introduction', 'results-and-analysis', 'conclusion'].filter(key => sections.includes(key));
    setOpenSections(defaultOpen);

  }, [report]);

  const handleExpandAll = () => setOpenSections(allSectionKeys);
  const handleCollapseAll = () => setOpenSections([]);

  const handleReadAloud = useCallback(async (sectionKey: string, content: string | undefined | null) => {
    if (readingSection) {
      audioRef.current?.pause();
      setReadingSection(null);
      setAudioDataUri(null);
      if (readingSection === sectionKey) return;
    }

    if (!content) {
      toast({ title: t('reportDisplay.noContent'), variant: "destructive" });
      return;
    }

    setReadingSection(sectionKey);
    try {
      const result: TextToSpeechActionState = await handleTextToSpeechAction(content);
      if (result.success && result.audioDataUri) {
        setAudioDataUri(result.audioDataUri);
      } else {
        toast({ title: t('reportDisplay.ttsFailed'), description: result.message, variant: "destructive" });
        setReadingSection(null);
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : t('reportDisplay.ttsError');
      toast({ title: "An error occurred during TTS", description: error, variant: "destructive" });
      setReadingSection(null);
    }
  }, [readingSection, toast, t]);

  useEffect(() => {
    if (audioDataUri && audioRef.current) {
      audioRef.current.src = audioDataUri;
      audioRef.current.play().catch(e => {
          console.error("Audio playback failed:", e);
          toast({ title: t('reportDisplay.audioPlaybackFailed'), description: "Your browser might be blocking autoplay.", variant: "destructive" });
          setReadingSection(null);
      });
    }
  }, [audioDataUri, toast, t]);

  const handleRunPlagiarismCheck = async () => {
    setIsCheckingPlagiarism(true);
    setPlagiarismResult(null);
    const fullText = Object.values(report).filter(val => typeof val === 'string').join('\n\n');
    
    try {
        const result = await handlePlagiarismCheckAction(fullText, i18n.language);
        if (result.success && result.plagiarismReport) {
            setPlagiarismResult(result.plagiarismReport);
            toast({ title: t('reportDisplay.checkComplete'), description: "The report has been analyzed for potential plagiarism.", variant: "default" });
        } else {
            toast({ title: t('reportDisplay.checkFailed'), description: result.message, variant: "destructive" });
        }
    } catch (e) {
        toast({ title: "An error occurred during originality check", variant: "destructive" });
    } finally {
        setIsCheckingPlagiarism(false);
    }
  };


  const renderParagraphs = (text: string | undefined | null): JSX.Element[] | JSX.Element => {
    if (!text) return <p className="italic text-muted-foreground my-3 sm:my-3.5 text-sm sm:text-base">{t('reportDisplay.noContent')}</p>;

    const paragraphs = text.split(/\n\s*\n|\n(?=\s*(?:•|-|\*|\d+\.)\s)/)
      .filter(p => p.trim() !== "");

    return paragraphs.map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      if (trimmedParagraph.match(/^(\s*(?:•|-|\*)\s|[ \t]*\d+\.\s+)/m)) {
        const listItems = trimmedParagraph.split('\n').map(item => item.trim()).filter(item => item);
        if (listItems.length > 0) {
          const listType = listItems[0].match(/^\d+\.\s+/) ? 'ol' : 'ul';
          const ListTag = listType as keyof JSX.IntrinsicElements;
          return (
            <ListTag key={index} className={`list-${listType === 'ol' ? 'decimal' : 'disc'} list-inside mb-3 sm:mb-4 pl-2.5 sm:pl-3.5 space-y-1 sm:space-y-1.5`}>
              {listItems.map((item, subIndex) => (
                <li key={subIndex} className="leading-relaxed text-foreground/85 text-sm sm:text-base">
                  {item.replace(/^\s*(?:•|-|\*|\d+\.)\s*/, '')}
                </li>
              ))}
            </ListTag>
          );
        }
      }
      return <p key={index} className="mb-3 sm:mb-4 last:mb-0 leading-relaxed text-foreground/85 text-sm sm:text-base">{trimmedParagraph}</p>;
    });
  };

  const getSectionContentAsString = (sectionKey: string): string => {
      switch(sectionKey) {
          case 'executive-summary': return report.executiveSummary || '';
          case 'introduction': return report.introduction || '';
          case 'literature-review': return report.literatureReview || '';
          case 'key-themes': return report.keyThemes?.map(t => `${t.theme}\n${t.discussion}`).join('\n\n') || '';
          case 'detailed-methodology': return report.detailedMethodology || '';
          case 'results-and-analysis': return report.resultsAndAnalysis?.map(r => `${r.sectionTitle}\n${r.content}`).join('\n\n') || '';
          case 'discussion-of-findings': return report.discussion || '';
          case 'conclusion': return report.conclusion || '';
          case 'limitations': return report.limitations || '';
          case 'future-work': return report.futureWork || '';
          case 'ethical-considerations': return report.ethicalConsiderations || '';
          default: return '';
      }
  };

  const sectionIconSize = 20;
  const sectionIcons = {
    executiveSummary: <BookOpen size={sectionIconSize}/>,
    introduction: <Milestone size={sectionIconSize}/>,
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
    appendices: <AppendixIcon size={sectionIconSize}/>,
    glossary: <BookMarked size={sectionIconSize}/>,
  };

  const sectionTitles: { [key: string]: string } = {
    executiveSummary: t('reportSections.executiveSummary'),
    introduction: t('reportSections.introduction'),
    literatureReview: t('reportSections.literatureReview'),
    keyThemes: t('reportSections.keyThemes'),
    detailedMethodology: t('reportSections.methodology'),
    resultsAndAnalysis: t('reportSections.results'),
    discussionOfFindings: t('reportSections.discussion'),
    conclusion: t('reportSections.conclusion'),
    limitations: t('reportSections.limitations'),
    futureWork: t('reportSections.futureWork'),
    ethicalConsiderations: t('reportSections.ethicalConsiderations'),
    references: t('reportSections.references'),
    appendices: t('reportSections.appendices'),
    glossary: t('reportSections.glossary'),
  };

  const handleDownloadReportJson = () => {
    const reportString = JSON.stringify({ report, originalQuestion }, null, 2);
    const blob = new Blob([reportString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FossAI_Report_${report.title?.replace(/\s+/g, '_') || 'Untitled'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadReportPdf = async () => {
    setIsGeneratingPdf(true);
    toast({
      title: t('reportDisplay.pdfToastTitle'),
      description: (
        <div className="flex flex-col gap-2 text-xs">
            <p>{t('reportDisplay.pdfToastDescription')}</p>
        </div>
      ),
      duration: 10000, 
    });

    
    await new Promise(resolve => setTimeout(resolve, 1500));


    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let yPosition = 40;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const contentWidth = pageWidth - 2 * margin;

    const addTextToPdf = (text: string, fontSize: number, styles: { bold?: boolean, italic?: boolean, color?: string } = {}, indent = 0) => {
        if (!text || text.trim() === "") {
            if (yPosition + 10 > pageHeight - margin) { doc.addPage(); yPosition = margin; }
            yPosition += 10 / 2; return;
        }
        doc.setFontSize(fontSize);
        doc.setFont(undefined, styles.bold ? 'bold' : (styles.italic ? 'italic' : 'normal'));
        if (styles.color) doc.setTextColor(styles.color); else doc.setTextColor(50, 50, 50);

        const calculatedLineHeight = fontSize * 1.25;

        const splitText = text.split(/\n\s*\n|\n(?=\s*(?:•|-|\*)\s)|\n(?=\s*\d+\.\s)/);
        splitText.forEach((paragraphText, pIndex) => {
            if (paragraphText.trim() === "") return;
            if (paragraphText.match(/^(\s*(?:•|-|\*)\s|[ \t]*\d+\.\s+)/m)) {
                const listItems = paragraphText.split('\n').map(item => item.trim()).filter(item => item);
                listItems.forEach((item, itemIndex) => {
                    const itemMarker = item.match(/^\d+\.\s+/) ? `${itemIndex + 1}. ` : '• ';
                    const itemContent = item.replace(/^\s*(?:•|-|\*|\d+\.)\s*/, '');
                    const lines = doc.splitTextToSize(itemMarker + itemContent, contentWidth - indent - (itemMarker.length * (fontSize * 0.5)));
                    lines.forEach((line: string) => {
                        if (yPosition + calculatedLineHeight > pageHeight - margin) { doc.addPage(); yPosition = margin; }
                        doc.text(line, margin + indent + (itemMarker.length > 2 ? 0 : 10), yPosition);
                        yPosition += calculatedLineHeight;
                    });
                });
                 if (pIndex < splitText.length - 1) {
                    yPosition += calculatedLineHeight / 2;
                }
            } else {
                const lines = doc.splitTextToSize(paragraphText, contentWidth - indent);
                lines.forEach((line: string) => {
                    if (yPosition + calculatedLineHeight > pageHeight - margin) { doc.addPage(); yPosition = margin; }
                    doc.text(line, margin + indent, yPosition);
                    yPosition += calculatedLineHeight;
                });
                if (pIndex < splitText.length - 1) {
                    yPosition += calculatedLineHeight * 0.5;
                }
            }
        });
        doc.setTextColor(50, 50, 50);
    };
    
    // Add title and ensure spacing for multiline titles
    const titleLines = doc.splitTextToSize(report.title || "Generated Research Report", contentWidth);
    addTextToPdf(report.title || "Generated Research Report", 18, { bold: true });
    yPosition += 5 * (titleLines.length - 1); // Add extra space for each wrapped line of the title

    addTextToPdf(`Original Research Question: ${originalQuestion}`, 11, { italic: true, color: "#555555" });
    yPosition += 20; // Space after header block
    
    const addPdfSection = async (title: string, content?: string | any[] | null, renderFn?: (item: any, index: number, doc: jsPDF, currentY: number, addTextFn: typeof addTextToPdf) => Promise<number>) => {
        const isOptionalAndEmpty = (["Acknowledged Limitations", "Future Research Avenues", "Ethical Considerations & Impact", "Supplementary Appendices", "Glossary of Key Terms"].includes(title) && (!content || (Array.isArray(content) && content.length === 0)) && !renderFn);
        if (isOptionalAndEmpty) return;

        if (yPosition + 30 > pageHeight - margin) { doc.addPage(); yPosition = margin; }
        addTextToPdf(title, 14, { bold: true });
        yPosition += 5;

        if (typeof content === 'string') {
            addTextToPdf(content, 10);
        } else if (Array.isArray(content) && renderFn) {
            if (content.length > 0) {
                for (let i = 0; i < content.length; i++) {
                    yPosition = await renderFn(content[i], i, doc, yPosition, addTextToPdf);
                }
            } else {
                addTextToPdf("No items to display in this list.", 10, { italic: true });
            }
        } else if ((typeof content === 'string' && content.trim() === "") || (!content && !renderFn)) {
            addTextToPdf("Content for this section was not provided.", 10, { italic: true });
        }
        yPosition += 20;
    };

    await addPdfSection(sectionTitles.executiveSummary, report.executiveSummary);
    await addPdfSection(sectionTitles.introduction, report.introduction);
    await addPdfSection(sectionTitles.literatureReview, report.literatureReview);

    await addPdfSection(sectionTitles.keyThemes, report.keyThemes, async (theme: any, index: number, docRef, currentY, addTextFn) => {
        yPosition = currentY; 
        addTextFn(`${index + 1}. ${theme.theme}`, 12, { bold: true });
        addTextFn(theme.discussion, 10, {}, 15);
        yPosition += 10;
        return yPosition;
    });

    await addPdfSection(sectionTitles.methodology, report.detailedMethodology);

    
    const resultsSectionTitle = sectionTitles.results;
    if (yPosition + 30 > pageHeight - margin) { doc.addPage(); yPosition = margin; }
    addTextToPdf(resultsSectionTitle, 14, { bold: true });
    yPosition += 5;
    
    if (report.resultsAndAnalysis && report.resultsAndAnalysis.length > 0) {
        for (let i = 0; i < report.resultsAndAnalysis.length; i++) {
            const result = report.resultsAndAnalysis[i];
            addTextToPdf(result.sectionTitle, 12, { bold: true });
            addTextToPdf(result.content, 10, {}, 15);

            if (result.chartSuggestion && result.chartSuggestion.type !== 'none' && result.chartSuggestion.data && result.chartSuggestion.data.length > 0) {
                const chartElementId = `pdf-chart-results-${i}`;
                const chartElement = document.getElementById(chartElementId);
                if (chartElement) {
                    try {
                        const canvas = await html2canvas(chartElement, { scale: 1.5, backgroundColor: '#FFFFFF', logging: false, useCORS: true });
                        const imgData = canvas.toDataURL('image/png');
                        
                        const chartImg = new window.Image();
                        const chartLoadPromise = new Promise<void>(resolve => {
                            chartImg.onload = () => {
                                const chartImgWidthOriginal = chartImg.width;
                                const chartImgHeightOriginal = chartImg.height;
                                let chartImgWidthPdf = contentWidth * 0.8; 
                                let chartImgHeightPdf = (chartImgHeightOriginal * chartImgWidthPdf) / chartImgWidthOriginal;

                                if (chartImgHeightPdf > pageHeight * 0.4) {
                                    chartImgHeightPdf = pageHeight * 0.4;
                                    chartImgWidthPdf = (chartImgWidthOriginal * chartImgHeightPdf) / chartImgHeightOriginal;
                                }
                                if (chartImgWidthPdf > contentWidth) {
                                   chartImgWidthPdf = contentWidth;
                                   chartImgHeightPdf = (chartImgHeightOriginal * chartImgWidthPdf) / chartImgWidthOriginal;
                                }


                                if (yPosition + chartImgHeightPdf > pageHeight - margin) { doc.addPage(); yPosition = margin; }
                                doc.addImage(imgData, 'PNG', margin + (contentWidth - chartImgWidthPdf) / 2, yPosition, chartImgWidthPdf, chartImgHeightPdf);
                                yPosition += chartImgHeightPdf + 14;
                                resolve();
                            };
                            chartImg.onerror = () => {
                                addTextToPdf(`[Chart: ${result.chartSuggestion.title || 'Chart'} - Could not render image. View in web app.]`, 9, { italic: true, color: "#AA0000" }, 20);
                                yPosition += 14 * 1.5;
                                resolve();
                            };
                            chartImg.src = imgData;
                        });
                        await chartLoadPromise;

                    } catch (e) {
                        console.error(`Error capturing chart ${chartElementId}:`, e);
                        addTextToPdf(`[Chart: ${result.chartSuggestion.title || 'Chart'} - Error during capture. View in web app.]`, 9, { italic: true, color: "#AA0000" }, 20);
                        yPosition += 14 * 1.5;
                    }
                } else {
                    addTextToPdf(`[Chart: ${result.chartSuggestion.title || 'Chart'} - Not embedded. Ensure section is expanded in web view to include in PDF.]`, 9, { italic: true, color: "#006699" }, 20);
                    yPosition += 14 * 1.5;
                }
            }
            yPosition += 14;
        }
    } else {
        addTextToPdf(t('reportDisplay.noContent'), 10, { italic: true });
    }
     yPosition += 14;


    await addPdfSection(sectionTitles.discussionOfFindings, report.discussion);
    await addPdfSection(sectionTitles.conclusion, report.conclusion);
    
    if (report.limitations && report.limitations.trim() !== "") await addPdfSection(sectionTitles.limitations, report.limitations);
    if (report.futureWork && report.futureWork.trim() !== "") await addPdfSection(sectionTitles.futureWork, report.futureWork);
    if (report.ethicalConsiderations && report.ethicalConsiderations.trim() !== "") await addPdfSection(sectionTitles.ethicalConsiderations, report.ethicalConsiderations);

    await addPdfSection(sectionTitles.references, report.references, async (ref: string, index: number, docRef, currentY, addTextFn) => {
        yPosition = currentY;
        addTextFn(`${index + 1}. ${ref}`, 9, {}, 15);
        yPosition += 14 / 2;
        return yPosition;
    });

    if (report.appendices && report.appendices.length > 0) {
        await addPdfSection(sectionTitles.appendices, report.appendices, async (appendix: any, index: number, docRef, currentY, addTextFn) => {
            yPosition = currentY;
            addTextFn(appendix.title, 12, { bold: true });
            addTextFn(appendix.content, 10, {}, 15);
            yPosition += 14;
            return yPosition;
        });
    }

    if (report.glossary && report.glossary.length > 0) {
        await addPdfSection(sectionTitles.glossary, report.glossary, async (item: any, index: number, docRef, currentY, addTextFn) => {
            yPosition = currentY;
            addTextFn(`${item.term}:`, 9, { bold: true });
            addTextFn(item.definition, 9, {}, 15);
            yPosition += 14 / 2;
            return yPosition;
        });
    }

    doc.save(`FossAI_Report_${report.title?.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_') || 'Untitled'}.pdf`);
    setIsGeneratingPdf(false);
    toast({
      title: t('reportDisplay.pdfToastSuccessTitle'),
      description: t('reportDisplay.pdfToastSuccessDescription'),
      variant: 'default',
      duration: 5000,
    });
  }

  return (
    <div>
    <audio ref={audioRef} onEnded={() => setReadingSection(null)} onPause={() => setReadingSection(null)} className="hidden" />
    <Card className="w-full shadow-2xl border-primary/30 rounded-xl sm:rounded-2xl flex flex-col bg-gradient-to-br from-card via-background/5 to-card">
      <CardHeader className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-primary/95 via-primary to-primary/90 text-primary-foreground border-b border-primary/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6">
          <div
            className="p-3 sm:p-4 bg-gradient-to-br from-accent to-accent/70 rounded-xl sm:rounded-2xl shadow-xl border-2 border-accent/60 flex-shrink-0 ring-2 ring-accent/40 ring-offset-2 ring-offset-primary"
            >
            <FileText className="h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 text-accent-foreground" />
          </div>
          <div className="flex-grow min-w-0">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight break-words">
              {report.title || t('reportDisplay.titleDefault')}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-sm sm:text-base md:text-lg mt-1.5 sm:mt-2 max-w-3xl break-words">
              {t('reportDisplay.originalQuestion', { question: originalQuestion })}
            </CardDescription>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-2 mt-4 pt-4 border-t border-primary-foreground/20">
             <Button variant="outline" size="sm" onClick={handleExpandAll} disabled={isGeneratingPdf} className="w-full sm:w-auto bg-primary-foreground/15 hover:bg-primary-foreground/25 border-primary-foreground/40 text-primary-foreground rounded-md sm:rounded-lg px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm group">
                <Maximize size={16} className="mr-1.5 sm:mr-2" /> {t('reportDisplay.expandAll')}
             </Button>
             <Button variant="outline" size="sm" onClick={handleCollapseAll} disabled={isGeneratingPdf} className="w-full sm:w-auto bg-primary-foreground/15 hover:bg-primary-foreground/25 border-primary-foreground/40 text-primary-foreground rounded-md sm:rounded-lg px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm group">
                <Minimize size={16} className="mr-1.5 sm:mr-2" /> {t('reportDisplay.collapseAll')}
             </Button>
             <Button variant="outline" size="sm" onClick={handleDownloadReportJson} disabled={isGeneratingPdf} className="w-full sm:w-auto bg-primary-foreground/15 hover:bg-primary-foreground/25 border-primary-foreground/40 text-primary-foreground rounded-md sm:rounded-lg px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm group">
                <FileJson size={16} className="mr-1.5 sm:mr-2 group-hover:animate-pulse" /> {t('reportDisplay.downloadJson')}
             </Button>
             <Button variant="outline" size="sm" onClick={handleDownloadReportPdf} disabled={isGeneratingPdf} className="w-full sm:w-auto bg-primary-foreground/15 hover:bg-primary-foreground/25 border-primary-foreground/40 text-primary-foreground rounded-md sm:rounded-lg px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm group">
                {isGeneratingPdf ? <Loader2 size={16} className="mr-1.5 sm:mr-2 animate-spin" /> : <FileType size={16} className="mr-1.5 sm:mr-2 group-hover:animate-pulse" />} 
                {isGeneratingPdf ? t('reportDisplay.generatingPdf') : t('reportDisplay.downloadPdf')}
             </Button>
        </div>
      </CardHeader>

      <div className="flex-grow min-h-0 bg-background/50">
        <CardContent className="p-4 sm:p-5 md:p-6 lg:p-7">
           <Card className="mb-4 sm:mb-6 bg-secondary/30 dark:bg-secondary/10 border-border/50 shadow-md">
              <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center justify-between text-primary/90">
                      <div className="flex items-center">
                          <ShieldCheck className="h-5 w-5 mr-3 text-accent"/>
                          {t('reportDisplay.originalityTitle')}
                      </div>
                      <Button size="sm" onClick={handleRunPlagiarismCheck} disabled={isCheckingPlagiarism}>
                        {isCheckingPlagiarism ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ShieldAlert className="mr-2 h-4 w-4"/>}
                        {t('reportDisplay.runCheck')}
                      </Button>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-xs sm:text-sm pt-1">
                    {t('reportDisplay.originalityDescription')}
                  </CardDescription>
              </CardHeader>
              <CardContent>
                {isCheckingPlagiarism ? (
                    <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>{t('reportDisplay.checking')}</div>
                ) : plagiarismResult ? (
                  <div className="space-y-4">
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-foreground">{t('reportDisplay.overallSimilarity')}</span>
                            <span className="font-mono text-sm text-primary/80">{plagiarismResult.similarityScore.toFixed(2)}%</span>
                        </div>
                        <Progress value={plagiarismResult.similarityScore} aria-label={`${plagiarismResult.similarityScore}% similarity`} />
                     </div>
                     {plagiarismResult.matches.length > 0 && (
                        <div>
                             <h4 className="font-medium text-sm mb-2 text-foreground">{t('reportDisplay.matchesFound')}</h4>
                             <div className="space-y-3">
                                {plagiarismResult.matches.map((match, index) => (
                                    <div key={index} className="p-3 bg-background/50 border rounded-md text-xs">
                                        <p className="italic text-muted-foreground">"{match.sentence}"</p>
                                        {match.justification && <p className="mt-2 text-foreground/80"><span className="font-semibold">{t('reportDisplay.justification')}</span> {match.justification}</p>}
                                        <p className="mt-1.5 text-right font-medium text-primary/90">
                                            <span className="font-mono bg-primary/10 px-1.5 py-0.5 rounded">{match.similarity.toFixed(0)}%</span> {t('reportDisplay.matchWith')} <span className="italic">{match.source}</span>
                                        </p>
                                    </div>
                                ))}
                             </div>
                        </div>
                     )}
                  </div>
                ) : (
                   <p className="text-sm text-muted-foreground italic">{t('reportDisplay.runToCheck')}</p>
                )}
              </CardContent>
          </Card>

          <Alert variant="default" className="mb-4 sm:mb-6 bg-accent/10 border-accent/25 text-accent-foreground shadow-md">
              <LightbulbIcon className="h-5 w-5 text-accent" />
              <AlertTitle className="font-semibold text-accent-foreground">{t('reportDisplay.pdfTipTitle')}</AlertTitle>
              <AlertDescription className="text-accent-foreground/80 mt-1 text-sm">
                  {t('reportDisplay.pdfTipDescription')}
              </AlertDescription>
          </Alert>

          <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="w-full space-y-3 sm:space-y-4">
             <Section title={sectionTitles.executiveSummary} icon={sectionIcons.executiveSummary} value="executive-summary" onReadAloud={() => handleReadAloud('executive-summary', getSectionContentAsString('executive-summary'))} isReading={readingSection === 'executive-summary'} canRead={!!report.executiveSummary}>
              {renderParagraphs(report.executiveSummary)}
            </Section>

            <Section title={sectionTitles.introduction} icon={sectionIcons.introduction} value="introduction" onReadAloud={() => handleReadAloud('introduction', getSectionContentAsString('introduction'))} isReading={readingSection === 'introduction'} canRead={!!report.introduction}>
              {renderParagraphs(report.introduction)}
            </Section>

            <Section title={sectionTitles.literatureReview} icon={sectionIcons.literatureReview} value="literature-review" onReadAloud={() => handleReadAloud('literature-review', getSectionContentAsString('literature-review'))} isReading={readingSection === 'literature-review'} canRead={!!report.literatureReview}>
              {renderParagraphs(report.literatureReview)}
            </Section>

            <Section title={sectionTitles.keyThemes} icon={sectionIcons.keyThemes} value="key-themes" onReadAloud={() => handleReadAloud('key-themes', getSectionContentAsString('key-themes'))} isReading={readingSection === 'key-themes'} canRead={!!report.keyThemes && report.keyThemes.length > 0}>
              {report.keyThemes && report.keyThemes.length > 0 ? (
                report.keyThemes.map((themeObj, index) => (
                  <div key={index} className="mb-4 sm:mb-5 p-3.5 sm:p-4.5 bg-secondary/35 dark:bg-secondary/10 rounded-lg sm:rounded-xl border border-border/60 shadow-md last:mb-0">
                    <h4 className="font-semibold text-md sm:text-lg text-accent-foreground mb-2 sm:mb-2.5 flex items-center">
                      <Milestone size={18} className="mr-2 sm:mr-3 text-accent/80"/>
                      {index + 1}. {themeObj.theme}
                    </h4>
                    {renderParagraphs(themeObj.discussion)}
                  </div>
                ))
              ) : renderParagraphs(undefined)}
            </Section>

            <Section title={sectionTitles.detailedMethodology} icon={sectionIcons.detailedMethodology} value="detailed-methodology" onReadAloud={() => handleReadAloud('detailed-methodology', getSectionContentAsString('detailed-methodology'))} isReading={readingSection === 'detailed-methodology'} canRead={!!report.detailedMethodology}>
              {renderParagraphs(report.detailedMethodology)}
            </Section>

            <Section title={sectionTitles.results} icon={sectionIcons.resultsAndAnalysis} value="results-and-analysis" onReadAloud={() => handleReadAloud('results-and-analysis', getSectionContentAsString('results-and-analysis'))} isReading={readingSection === 'results-and-analysis'} canRead={!!report.resultsAndAnalysis && report.resultsAndAnalysis.length > 0}>
              {report.resultsAndAnalysis && report.resultsAndAnalysis.length > 0 ? (
                report.resultsAndAnalysis.map((result, index) => (
                  <div key={index} className="mb-4 sm:mb-5 p-3.5 sm:p-4.5 bg-secondary/35 dark:bg-secondary/10 rounded-lg sm:rounded-xl border border-border/60 shadow-md last:mb-0">
                    <h4 className="font-semibold text-md sm:text-lg text-accent-foreground mb-2.5 sm:mb-3.5 flex items-center">
                      <GitBranch size={18} className="mr-2 sm:mr-3 text-accent/80"/>
                      {result.sectionTitle}
                    </h4>
                    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none marker:text-accent">
                      {renderParagraphs(result.content)}
                    </div>
                    {result.chartSuggestion && (
                      <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-dashed border-border/50">
                        <PlaceholderChart
                          chartSuggestion={result.chartSuggestion}
                          pdfChartId={`pdf-chart-results-${index}`} 
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : renderParagraphs(undefined)}
            </Section>

            <Section title={sectionTitles.discussionOfFindings} icon={sectionIcons.discussion} value="discussion-of-findings" onReadAloud={() => handleReadAloud('discussion-of-findings', getSectionContentAsString('discussion-of-findings'))} isReading={readingSection === 'discussion-of-findings'} canRead={!!report.discussion}>
              {renderParagraphs(report.discussion)}
            </Section>

            <Section title={sectionTitles.conclusion} icon={sectionIcons.conclusion} value="conclusion" onReadAloud={() => handleReadAloud('conclusion', getSectionContentAsString('conclusion'))} isReading={readingSection === 'conclusion'} canRead={!!report.conclusion}>
              {renderParagraphs(report.conclusion)}
            </Section>

            {report.limitations && (
              <Section title={sectionTitles.limitations} icon={sectionIcons.limitations} value="limitations" onReadAloud={() => handleReadAloud('limitations', getSectionContentAsString('limitations'))} isReading={readingSection === 'limitations'} canRead={!!report.limitations}>
                {renderParagraphs(report.limitations)}
              </Section>
            )}

            {report.futureWork && (
              <Section title={sectionTitles.futureWork} icon={sectionIcons.futureWork} value="future-work" onReadAloud={() => handleReadAloud('future-work', getSectionContentAsString('future-work'))} isReading={readingSection === 'future-work'} canRead={!!report.futureWork}>
                {renderParagraphs(report.futureWork)}
              </Section>
            )}

            {report.ethicalConsiderations && (
              <Section title={sectionTitles.ethicalConsiderations} icon={sectionIcons.ethicalConsiderations} value="ethical-considerations" onReadAloud={() => handleReadAloud('ethical-considerations', getSectionContentAsString('ethical-considerations'))} isReading={readingSection === 'ethical-considerations'} canRead={!!report.ethicalConsiderations}>
                {renderParagraphs(report.ethicalConsiderations)}
              </Section>
            )}

            {report.references && report.references.length > 0 && (
              <Section title={sectionTitles.references} icon={sectionIcons.references} value="references" onReadAloud={() => {}} isReading={false} canRead={false}>
                <ul className="list-decimal list-inside space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                  {report.references.map((ref, index) => (
                    <li key={index} className="leading-normal text-foreground/80">{ref}</li>
                  ))}
                </ul>
              </Section>
            )}

            {report.appendices && report.appendices.length > 0 && (
               <Section title={sectionTitles.appendices} icon={sectionIcons.appendices} value="appendices" onReadAloud={() => {}} isReading={false} canRead={false}>
                {report.appendices.map((appendix, index) => (
                  <div key={index} className="mb-3.5 sm:mb-4.5 p-3 sm:p-4 bg-secondary/35 dark:bg-secondary/10 rounded-lg sm:rounded-xl border border-border/60 shadow-sm last:mb-0">
                    <h4 className="font-medium text-sm sm:text-base text-accent-foreground mb-2 sm:mb-2.5">{appendix.title}</h4>
                    {renderParagraphs(appendix.content)}
                  </div>
                ))}
              </Section>
            )}

            {report.glossary && report.glossary.length > 0 && (
               <Section title={sectionTitles.glossary} icon={sectionIcons.glossary} value="glossary" onReadAloud={() => {}} isReading={false} canRead={false}>
                <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                  {report.glossary.map((item, index) => (
                    <li key={index} className="border-b border-dashed border-border/40 pb-2 sm:pb-2.5 last:border-b-0 last:pb-0">
                      <strong className="text-foreground/85 font-semibold">{item.term}:</strong> <span className="text-muted-foreground ml-1.5 sm:ml-2">{item.definition}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

          </Accordion>
        </CardContent>
      </div>
      <CardFooter className="p-4 sm:p-5 md:p-6 lg:p-7 border-t border-border/40 bg-secondary/25 dark:bg-secondary/10 text-center">
        <p className="text-sm sm:text-base text-muted-foreground w-full">{t('reportDisplay.footerText')}</p>
      </CardFooter>
    </Card>
    </div>
  );
});
ResearchReportDisplay.displayName = 'ResearchReportDisplay';
export default ResearchReportDisplay;
