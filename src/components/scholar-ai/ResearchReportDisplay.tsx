// src/components/scholar-ai/ResearchReportDisplay.tsx
'use client';

import React, { useState } from 'react'; 
import type { GenerateResearchReportOutput } from '@/ai/flows/generate-research-report';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, BookOpen, ListChecks, MessageSquareQuote, SearchCode, Lightbulb, AlertTriangle, ThumbsUp, Telescope, Edit3, BarChartHorizontalBig, Users, ShieldCheck, BookCopy, BookMarked, TrendingUp, FileJson, GanttChartSquare, PieChartIcon, LineChartIcon, BarChartIcon, ScatterChartIcon, Brain, LightbulbIcon, MaximizeIcon, Settings, FileQuestion, Activity, Library, UsersRound, ShieldAlert, ClipboardList, Milestone, Scale, GitBranch, DownloadCloud, Share2Icon, BookText, FileType, Image as ImageIconLucide, Info as InfoIcon } from 'lucide-react';
import NextImage from 'next/image';
import { cn } from '@/lib/utils';
import PlaceholderChart from './PlaceholderChart';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export interface ResearchReportDisplayProps {
  report: GenerateResearchReportOutput;
  originalQuestion: string;
  generatedImageUrl?: string | null;
  onOpenImagePreview: () => void;
}

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string, defaultOpen?: boolean, value: string }> = ({ title, icon, children, className, defaultOpen = false, value }) => (
  <div>
    <AccordionItem value={value} className={cn('border-b-0 mb-3 sm:mb-3.5 rounded-lg sm:rounded-xl overflow-hidden shadow-lg bg-card hover:shadow-primary/15 transition-all duration-300', className)}>
      <AccordionTrigger className="py-3 px-4 sm:py-4 sm:px-6 hover:no-underline hover:bg-secondary/70 dark:hover:bg-secondary/35 transition-colors duration-200 rounded-t-lg sm:rounded-t-xl data-[state=open]:rounded-b-none data-[state=open]:border-b data-[state=open]:border-border/80 data-[state=open]:bg-accent/10 dark:data-[state=open]:bg-accent/20 group">
        <h3 className="text-md sm:text-lg md:text-xl font-semibold flex items-center text-primary group-hover:text-accent transition-colors duration-200">
          {icon && <span className="mr-2.5 sm:mr-3.5 text-accent group-data-[state=open]:text-accent-foreground transition-colors duration-200">{icon}</span>}
          {title}
        </h3>
      </AccordionTrigger>
      <AccordionContent className="bg-card rounded-b-lg sm:rounded-b-xl">
        <div className="text-foreground/90 text-sm sm:text-base leading-relaxed prose prose-sm sm:prose-base dark:prose-invert max-w-none marker:text-accent px-4 py-4 sm:px-6 sm:py-5 pt-3 sm:pt-4">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  </div>
);

const ResearchReportDisplay = React.memo(function ResearchReportDisplay({ report, originalQuestion, generatedImageUrl, onOpenImagePreview }: ResearchReportDisplayProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { toast } = useToast();

  const renderParagraphs = (text: string | undefined | null): JSX.Element[] | JSX.Element => {
    if (!text) return <p className="italic text-muted-foreground my-3 sm:my-3.5 text-sm sm:text-base">Content for this section was not provided.</p>;

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

  const sectionIconSize = 20;
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
    appendices: <BookText size={sectionIconSize}/>,
    glossary: <BookMarked size={sectionIconSize}/>,
    conceptualOverview: <Brain size={sectionIconSize}/>,
  };

  const handleDownloadReportJson = () => {
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

  const handleDownloadReportPdf = async () => {
    setIsGeneratingPdf(true);
    toast({
      title: "🚀 Generating PDF Report...",
      description: (
        <div className="flex flex-col gap-2 text-xs">
            <p>This may take a few moments. Report quality is best when viewed online.</p>
            <Alert variant="default" className="bg-primary/5 border-primary/20 p-2">
                <InfoIcon className="h-4 w-4 text-primary" />
                <AlertTitle className="text-xs font-medium text-primary">Important for Chart Accuracy:</AlertTitle>
                <AlertDescription className="text-xs text-primary/80">
                    Ensure all report sections containing charts are <strong className="text-primary">EXPANDED</strong> in the web view before starting the PDF generation. This helps include them accurately.
                </AlertDescription>
            </Alert>
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
    const lineHeight = 14;

    const addTextToPdf = (text: string, fontSize: number, styles: { bold?: boolean, italic?: boolean, color?: string } = {}, indent = 0) => {
        if (!text || text.trim() === "") {
            if (yPosition + lineHeight > pageHeight - margin) { doc.addPage(); yPosition = margin; }
            yPosition += lineHeight / 2; return;
        }
        doc.setFontSize(fontSize);
        doc.setFont(undefined, styles.bold ? 'bold' : (styles.italic ? 'italic' : 'normal'));
        if (styles.color) doc.setTextColor(styles.color); else doc.setTextColor(50, 50, 50);

        const splitText = text.split(/\n\s*\n|\n(?=\s*(?:•|-|\*)\s)|\n(?=\s*\d+\.\s)/);
        splitText.forEach(paragraphText => {
            if (paragraphText.trim() === "") return;
            if (paragraphText.match(/^(\s*(?:•|-|\*)\s|[ \t]*\d+\.\s+)/m)) {
                const listItems = paragraphText.split('\n').map(item => item.trim()).filter(item => item);
                listItems.forEach((item, itemIndex) => {
                    const itemMarker = item.match(/^\d+\.\s+/) ? `${itemIndex + 1}. ` : '• ';
                    const itemContent = item.replace(/^\s*(?:•|-|\*|\d+\.)\s*/, '');
                    const lines = doc.splitTextToSize(itemMarker + itemContent, contentWidth - indent - (itemMarker.length * (fontSize * 0.5)));
                    lines.forEach((line: string) => {
                        if (yPosition + lineHeight > pageHeight - margin) { doc.addPage(); yPosition = margin; }
                        doc.text(line, margin + indent + (itemMarker.length > 2 ? 0 : 10), yPosition);
                        yPosition += lineHeight;
                    });
                });
                yPosition += lineHeight / 2;
            } else {
                const lines = doc.splitTextToSize(paragraphText, contentWidth - indent);
                lines.forEach((line: string) => {
                    if (yPosition + lineHeight > pageHeight - margin) { doc.addPage(); yPosition = margin; }
                    doc.text(line, margin + indent, yPosition);
                    yPosition += lineHeight;
                });
                yPosition += lineHeight / 2;
            }
        });
        doc.setTextColor(50, 50, 50);
    };
    
    const addImageToPdf = async (imageDataUri: string, format: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
          const imgWidthOriginal = img.width;
          const imgHeightOriginal = img.height;
          let imgWidthPdf = contentWidth * 0.75;
          let imgHeightPdf = (imgHeightOriginal * imgWidthPdf) / imgWidthOriginal;

          if (imgHeightPdf > pageHeight * 0.4) { 
            imgHeightPdf = pageHeight * 0.4;
            imgWidthPdf = (imgWidthOriginal * imgHeightPdf) / imgHeightOriginal;
          }
           if (imgWidthPdf > contentWidth) {
            imgWidthPdf = contentWidth;
            imgHeightPdf = (imgHeightOriginal * imgWidthPdf) / imgWidthOriginal;
          }


          if (yPosition + imgHeightPdf > pageHeight - margin - 20) { doc.addPage(); yPosition = margin; }
          doc.addImage(imageDataUri, format.toUpperCase(), margin + (contentWidth - imgWidthPdf) / 2, yPosition, imgWidthPdf, imgHeightPdf);
          yPosition += imgHeightPdf + lineHeight * 1.5;
          resolve();
        };
        img.onerror = () => {
          console.error("Error loading image for PDF.");
          addTextToPdf("[Error embedding image in PDF. Please view on web.]", 10, {italic: true, color: "#AA0000"});
          yPosition += lineHeight * 1.5;
          resolve(); 
        };
        img.src = imageDataUri;
      });
    };


    addTextToPdf(report.title || "Generated Research Report", 18, { bold: true });
    yPosition += lineHeight;
    addTextToPdf(`Original Research Question: ${originalQuestion}`, 11, { italic: true, color: "#555555" });
    yPosition += lineHeight * 1.5;

    if (generatedImageUrl && generatedImageUrl.startsWith('data:image/')) {
        addTextToPdf("Conceptual Visualization:", 12, { bold: true });
        yPosition += lineHeight / 2;
        const MimeTypeMatch = generatedImageUrl.match(/data:(image\/[^;]+);/);
        await addImageToPdf(generatedImageUrl, MimeTypeMatch ? MimeTypeMatch[1].split('/')[1] : 'PNG');
    }
    
    
    const addPdfSection = async (title: string, content?: string | any[] | null, renderFn?: (item: any, index: number, doc: jsPDF, currentY: number, addTextFn: typeof addTextToPdf) => Promise<number>) => {
        const isOptionalAndEmpty = (["Acknowledged Limitations", "Future Research Avenues", "Ethical Considerations & Impact", "Supplementary Appendices", "Glossary of Key Terms"].includes(title) && (!content || (Array.isArray(content) && content.length === 0)) && !renderFn);
        if (isOptionalAndEmpty) return;

        if (yPosition + lineHeight * 3 > pageHeight - margin) { doc.addPage(); yPosition = margin; }
        addTextToPdf(title, 14, { bold: true });

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
        yPosition += lineHeight;
    };

    await addPdfSection("Executive Summary", report.executiveSummary);
    await addPdfSection("Introduction & Background", report.introduction);
    await addPdfSection("Comprehensive Literature Review", report.literatureReview);

    await addPdfSection("Key Themes & In-Depth Discussion", report.keyThemes, async (theme: any, index: number, docRef, currentY, addTextFn) => {
        yPosition = currentY; 
        addTextFn(`${index + 1}. ${theme.theme}`, 12, { bold: true });
        addTextFn(theme.discussion, 10, {}, 15);
        yPosition += lineHeight;
        return yPosition;
    });

    await addPdfSection("Detailed Research Methodology", report.detailedMethodology);

    
    const resultsSectionTitle = "Results Presentation & Analysis";
    if (yPosition + lineHeight * 3 > pageHeight - margin) { doc.addPage(); yPosition = margin; }
    addTextToPdf(resultsSectionTitle, 14, { bold: true });
    
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
                        if (yPosition + (pageHeight * 0.3) > pageHeight - margin) { doc.addPage(); yPosition = margin; } 
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
                                yPosition += chartImgHeightPdf + lineHeight;
                                resolve();
                            };
                            chartImg.onerror = () => {
                                addTextToPdf(`[Chart: ${result.chartSuggestion.title || 'Chart'} - Could not render image. View in web app.]`, 9, { italic: true, color: "#AA0000" }, 20);
                                yPosition += lineHeight * 1.5;
                                resolve();
                            };
                            chartImg.src = imgData;
                        });
                        await chartLoadPromise;

                    } catch (e) {
                        console.error(`Error capturing chart ${chartElementId}:`, e);
                        addTextToPdf(`[Chart: ${result.chartSuggestion.title || 'Chart'} - Error during capture. View in web app.]`, 9, { italic: true, color: "#AA0000" }, 20);
                        yPosition += lineHeight * 1.5;
                    }
                } else {
                    addTextToPdf(`[Chart: ${result.chartSuggestion.title || 'Chart'} - Not embedded. Ensure section is expanded in web view to include in PDF.]`, 9, { italic: true, color: "#006699" }, 20);
                    yPosition += lineHeight * 1.5;
                }
            }
            yPosition += lineHeight;
        }
    } else {
        addTextToPdf("Content for this section was not provided.", 10, { italic: true });
    }
     yPosition += lineHeight;


    await addPdfSection("Holistic Discussion of Findings", report.discussion);
    await addPdfSection("Concluding Remarks & Implications", report.conclusion);
    
    if (report.limitations && report.limitations.trim() !== "") await addPdfSection("Acknowledged Limitations", report.limitations);
    if (report.futureWork && report.futureWork.trim() !== "") await addPdfSection("Future Research Avenues", report.futureWork);
    if (report.ethicalConsiderations && report.ethicalConsiderations.trim() !== "") await addPdfSection("Ethical Considerations & Impact", report.ethicalConsiderations);

    if (report.references && report.references.length > 0) {
        await addPdfSection("References (AI Synthesized)", report.references, async (ref: string, index: number, docRef, currentY, addTextFn) => {
            yPosition = currentY;
            addTextFn(`${index + 1}. ${ref}`, 9, {}, 15);
            yPosition += lineHeight / 2;
            return yPosition;
        });
    }

    if (report.appendices && report.appendices.length > 0) {
        await addPdfSection("Supplementary Appendices", report.appendices, async (appendix: any, index: number, docRef, currentY, addTextFn) => {
            yPosition = currentY;
            addTextFn(appendix.title, 12, { bold: true });
            addTextFn(appendix.content, 10, {}, 15);
            yPosition += lineHeight;
            return yPosition;
        });
    }

    if (report.glossary && report.glossary.length > 0) {
        await addPdfSection("Glossary of Key Terms", report.glossary, async (item: any, index: number, docRef, currentY, addTextFn) => {
            yPosition = currentY;
            addTextFn(`${item.term}:`, 9, { bold: true });
            addTextFn(item.definition, 9, {}, 15);
            yPosition += lineHeight / 2;
            return yPosition;
        });
    }

    doc.save(`ScholarAI_Report_${report.title?.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_') || 'Untitled'}.pdf`);
    setIsGeneratingPdf(false);
    toast({
      title: "✅ PDF Report Downloaded!",
      description: "Your report has been generated successfully.",
      variant: 'default',
      duration: 5000,
    });
  }

  return (
    <div>
    <Card className="w-full shadow-2xl border-primary/30 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-card via-background/5 to-card">
      <CardHeader className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-primary/95 via-primary to-primary/90 text-primary-foreground border-b border-primary/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6">
          <div
            className="p-3 sm:p-4 bg-gradient-to-br from-accent to-accent/70 rounded-xl sm:rounded-2xl shadow-xl border-2 border-accent/60 flex-shrink-0 ring-2 ring-accent/40 ring-offset-2 ring-offset-primary"
            >
            <FileText className="h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 text-accent-foreground" />
          </div>
          <div className="flex-grow min-w-0">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight break-words">
              {report.title || "Generated Research Report"}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-sm sm:text-base md:text-lg mt-1.5 sm:mt-2 max-w-3xl break-words">
              In-depth exploration for: <em className='font-semibold'>"{originalQuestion}"</em>
            </CardDescription>
          </div>
           <div className="flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 mt-3 sm:mt-0 self-stretch sm:self-center w-full sm:w-auto">
             <Button variant="outline" size="sm" onClick={handleDownloadReportJson} disabled={isGeneratingPdf} className="bg-primary-foreground/15 hover:bg-primary-foreground/25 border-primary-foreground/40 text-primary-foreground rounded-md sm:rounded-lg px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm group w-full sm:w-auto">
                <FileJson size={16} className="mr-1.5 sm:mr-2 group-hover:animate-pulse" /> Download JSON
             </Button>
             <Button variant="outline" size="sm" onClick={handleDownloadReportPdf} disabled={isGeneratingPdf} className="bg-primary-foreground/15 hover:bg-primary-foreground/25 border-primary-foreground/40 text-primary-foreground rounded-md sm:rounded-lg px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm group w-full sm:w-auto">
                {isGeneratingPdf ? <Loader2 size={16} className="mr-1.5 sm:mr-2 animate-spin" /> : <FileType size={16} className="mr-1.5 sm:mr-2 group-hover:animate-pulse" />} 
                {isGeneratingPdf ? "Generating..." : "Download PDF"}
             </Button>
           </div>
        </div>
      </CardHeader>

      <ScrollArea className="max-h-[50vh] sm:max-h-[60vh] md:max-h-[calc(100svh-350px)] lg:max-h-[calc(100svh-320px)] bg-background/50">
        <CardContent className="p-4 sm:p-5 md:p-6 lg:p-7">
          <Accordion type="multiple" defaultValue={getDefaultOpenAccordionItems()} className="w-full space-y-3 sm:space-y-4">
            {generatedImageUrl && (
              <Section title="Visual Conceptualization" icon={sectionIcons.conceptualOverview} value="conceptual-overview" defaultOpen>
                 <div className="my-4 sm:my-5 p-3 sm:p-4 border border-border/80 rounded-lg sm:rounded-xl bg-secondary/40 dark:bg-secondary/15 shadow-lg flex justify-center items-center overflow-hidden">
                    <div onClick={onOpenImagePreview} className="relative overflow-hidden rounded-md sm:rounded-lg cursor-pointer group">
                        <NextImage
                            src={generatedImageUrl}
                            alt="Conceptual visualization for the research report"
                            width={600}
                            height={450}
                            className="rounded-md sm:rounded-lg object-contain shadow-xl max-h-[300px] sm:max-h-[400px]"
                            data-ai-hint="research visualization abstract"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <MaximizeIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white/80" />
                        </div>
                    </div>
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

            <Section title="Detailed Research Methodology" icon={sectionIcons.detailedMethodology} value="detailed-methodology">
              {renderParagraphs(report.detailedMethodology)}
            </Section>

            <Section title="Results Presentation & Analysis" icon={sectionIcons.resultsAndAnalysis} value="results-and-analysis" defaultOpen>
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
                    {result.chartSuggestion && result.chartSuggestion.type !== 'none' && (
                      <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-dashed border-border/50">
                        <h5 className="text-sm sm:text-base font-medium text-muted-foreground mb-2 sm:mb-2.5 flex items-center">
                          {result.chartSuggestion.type === 'bar' && <BarChartIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-2.5 text-muted-foreground/80" />}
                          {result.chartSuggestion.type === 'line' && <LineChartIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-2.5 text-muted-foreground/80" />}
                          {result.chartSuggestion.type === 'pie' && <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-2.5 text-muted-foreground/80" />}
                          {result.chartSuggestion.type === 'scatter' && <ScatterChartIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-2.5 text-muted-foreground/80" />}
                          {result.chartSuggestion.type !== 'bar' && result.chartSuggestion.type !== 'line' && result.chartSuggestion.type !== 'pie' && result.chartSuggestion.type !== 'scatter' && <ImageIconLucide className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-2.5 text-muted-foreground/80" />}
                          Suggested Visualization: {result.chartSuggestion.title || result.chartSuggestion.type.charAt(0).toUpperCase() + result.chartSuggestion.type.slice(1) + " Chart"}
                        </h5>
                         {result.chartSuggestion.dataDescription && <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 italic">Description: {result.chartSuggestion.dataDescription}</p>}
                        {(result.chartSuggestion.xAxisLabel || result.chartSuggestion.yAxisLabel) && (
                           <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                            {result.chartSuggestion.xAxisLabel && `X-axis: ${result.chartSuggestion.xAxisLabel}. `}
                            {result.chartSuggestion.yAxisLabel && `Y-axis: ${result.chartSuggestion.yAxisLabel}.`}
                           </p>
                        )}
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
                <ul className="list-decimal list-inside space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                  {report.references.map((ref, index) => (
                    <li key={index} className="leading-normal text-foreground/80">{ref}</li>
                  ))}
                </ul>
              </Section>
            )}

            {report.appendices && report.appendices.length > 0 && (
               <Section title="Supplementary Appendices" icon={sectionIcons.appendices} value="appendices">
                {report.appendices.map((appendix, index) => (
                  <div key={index} className="mb-3.5 sm:mb-4.5 p-3 sm:p-4 bg-secondary/35 dark:bg-secondary/10 rounded-lg sm:rounded-xl border border-border/60 shadow-sm last:mb-0">
                    <h4 className="font-medium text-sm sm:text-base text-accent-foreground mb-2 sm:mb-2.5">{appendix.title}</h4>
                    {renderParagraphs(appendix.content)}
                  </div>
                ))}
              </Section>
            )}

            {report.glossary && report.glossary.length > 0 && (
               <Section title="Glossary of Key Terms" icon={sectionIcons.glossary} value="glossary">
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
      </ScrollArea>
      <CardFooter className="p-4 sm:p-5 md:p-6 lg:p-7 border-t border-border/40 bg-secondary/25 dark:bg-secondary/10 text-center">
        <p className="text-sm sm:text-base text-muted-foreground w-full">This comprehensive report was meticulously generated by ScholarAI using advanced AI models.</p>
      </CardFooter>
    </Card>
    </div>
  );
});
ResearchReportDisplay.displayName = 'ResearchReportDisplay';
export default ResearchReportDisplay;
