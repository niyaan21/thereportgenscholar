'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useActionState } from 'react';
import NextLink from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResearchReportDisplay from '@/components/scholar-ai/ResearchReportDisplay';
import MindmapDisplay from '@/components/scholar-ai/MindmapDisplay';
import { handleGenerateReportFromFileAction, type GenerateReportFromFileActionState, handleExtractMindmapConceptsAction, type ExtractMindmapConceptsActionState } from '@/app/actions';
import type { GenerateResearchReportOutput } from '@/ai/flows/generate-research-report';
import type { ExtractMindmapConceptsOutput } from '@/ai/flows/extract-mindmap-concepts';
import { UploadCloud, Wand2, Loader2, RotateCcw, AlertCircle, Lock, Info, BrainCircuit, Lightbulb, BarChartBig } from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { addResearchActivity } from '@/lib/historyService';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

const initialReportFromFileState: GenerateReportFromFileActionState = {
  success: false,
  message: '',
  researchReport: null,
  errors: null,
  originalGuidance: '',
};

const initialMindmapState: ExtractMindmapConceptsActionState = {
  success: false,
  message: '',
  extractedData: null,
  errors: null,
};


export default function AnalysisToolsPage() {
  const { t, i18n } = useTranslation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  const [reportState, fileReportFormAction, isGeneratingFileReport] = useActionState(handleGenerateReportFromFileAction, initialReportFromFileState);
  const [mindmapState, mindmapFormAction, isExtractingMindmap] = useActionState(handleExtractMindmapConceptsAction, initialMindmapState);

  const [activeTab, setActiveTab] = useState("file-report");
  const [fileName, setFileName] = useState<string | null>(null);
  const [guidanceQuery, setGuidanceQuery] = useState('');
  const [textToAnalyze, setTextToAnalyze] = useState('');

  const [reportResult, setReportResult] = useState<GenerateResearchReportOutput | null>(null);
  const [mindmapResult, setMindmapResult] = useState<ExtractMindmapConceptsOutput | null>(null);
  const [reportGuidance, setReportGuidance] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isGeneratingFileReport && reportState.message) {
      if (reportState.success && reportState.researchReport) {
        toast({
          title: t('fileReport.toastReportSuccess'),
          description: reportState.message,
          variant: 'default',
          duration: 7000,
        });
        setReportResult(reportState.researchReport);
        setReportGuidance(reportState.originalGuidance || '');
        setMindmapResult(null); // Clear other result
        
        if (currentUser && reportState.originalGuidance) {
           addResearchActivity({
            type: 'file-report-generation',
            question: reportState.originalGuidance,
            reportTitle: reportState.researchReport.title,
            executiveSummarySnippet: reportState.researchReport.executiveSummary?.substring(0, 150) + (reportState.researchReport.executiveSummary && reportState.researchReport.executiveSummary.length > 150 ? '...' : '')
          });
        }
        document.getElementById('analysis-results-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (!reportState.success) {
        let description = reportState.message;
        if (reportState.errors) {
          const errorDetails = Object.values(reportState.errors).flat().join(' ');
          if (errorDetails) { description += ` ${errorDetails}`; }
        }
        toast({ title: t('fileReport.toastReportFail'), description, variant: 'destructive', duration: 9000 });
      }
    }
  }, [reportState, isGeneratingFileReport, toast, currentUser, t]);

  useEffect(() => {
    if (!isExtractingMindmap && mindmapState.message) {
      if (mindmapState.success && mindmapState.extractedData) {
        toast({ title: t('fileReport.toastMindmapSuccess'), description: mindmapState.message, variant: 'default', duration: 5000 });
        setMindmapResult(mindmapState.extractedData);
        setReportResult(null); // Clear other result
        document.getElementById('analysis-results-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (!mindmapState.success) {
        let description = mindmapState.message;
        if (mindmapState.errors?.textToAnalyze) { description += ` ${mindmapState.errors.textToAnalyze.join(' ')}`; }
        toast({ title: t('fileReport.toastMindmapFail'), description, variant: 'destructive', duration: 7000 });
      }
    }
  }, [mindmapState, isExtractingMindmap, toast, t]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) { setFileName(file.name); } else { setFileName(null); }
  };

  const handleStartNew = () => {
    setReportResult(null);
    setMindmapResult(null);
    setFileName(null);
    setGuidanceQuery('');
    setTextToAnalyze('');
    const fileForm = document.getElementById('fileReportForm') as HTMLFormElement;
    fileForm?.reset();
    const mindmapForm = document.getElementById('mindmapForm') as HTMLFormElement;
    mindmapForm?.reset();
  };
  
  const isFormDisabled = (!currentUser && authChecked) || isGeneratingFileReport || isExtractingMindmap;

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 sm:mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          {t('fileReport.mainTitle')}
        </h1>
        <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('fileReport.mainDescription')}
        </p>
      </header>
      
      {!authChecked && (
        <Card className="w-full max-w-xl mx-auto mb-8 shadow-lg animate-pulse">
            <CardHeader><div className="h-8 w-3/4 bg-muted/50 rounded"></div></CardHeader>
            <CardContent className="space-y-4">
                <div className="h-6 w-1/4 bg-muted/50 rounded"></div>
                <div className="h-10 w-full bg-muted/50 rounded-md"></div>
            </CardContent>
            <CardFooter><div className="h-12 w-36 bg-muted/50 rounded-lg ml-auto"></div></CardFooter>
        </Card>
      )}

      {authChecked && !currentUser && (
        <Alert variant="destructive" className="max-w-xl mx-auto mb-8 bg-destructive/10 border-destructive/30 text-destructive">
          <Lock className="h-5 w-5" />
          <AlertTitle className="font-semibold">{t('fileReport.authRequiredTitle')}</AlertTitle>
          <AlertDescription>
            {t('fileReport.authRequiredDescription', {
              loginLink: '',
              signupLink: '',
              // @ts-ignore
              components: {
                loginLink: <NextLink href="/login" className="font-medium hover:underline underline-offset-2" />,
                signupLink: <NextLink href="/signup" className="font-medium hover:underline underline-offset-2" />,
              },
            })}
          </AlertDescription>
        </Alert>
      )}

      {authChecked && currentUser && (!reportResult && !mindmapResult) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-2xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file-report">{t('fileReport.tabFileReport')}</TabsTrigger>
                <TabsTrigger value="mindmap">{t('fileReport.tabMindmap')}</TabsTrigger>
            </TabsList>
            <TabsContent value="file-report">
                <Card className="shadow-2xl border-primary/20 rounded-xl overflow-hidden rounded-tl-none">
                    <form id="fileReportForm" action={fileReportFormAction}>
                    <CardHeader className="p-6 bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
                        <CardTitle className="text-2xl font-semibold text-primary flex items-center"><UploadCloud className="mr-3 h-7 w-7 text-accent" />{t('fileReport.uploadTitle')}</CardTitle>
                        <CardDescription className="text-muted-foreground mt-1">{t('fileReport.uploadDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <input type="hidden" name="language" value={i18n.language} />
                        {/* File Input */}
                        <div className="space-y-2">
                            <Label htmlFor="file" className="text-base">{t('fileReport.docFileLabel')}</Label>
                            <Input id="file" name="file" type="file" ref={fileInputRef} required onChange={handleFileChange} disabled={isFormDisabled} className="hidden" accept=".txt,.md,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,application/pdf" />
                            <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                <span className="text-muted-foreground truncate pr-4">{fileName || t('fileReport.fileSelect')}</span>
                                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isFormDisabled} className="shrink-0">{t('fileReport.fileChoose')}</Button>
                            </div>
                            {reportState.errors?.file && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="mr-1 h-3 w-3" /> {reportState.errors.file.join(', ')}</p>}
                        </div>
                        {/* Guidance Query */}
                        <div className="space-y-2">
                            <Label htmlFor="guidanceQuery" className="text-base">{t('fileReport.guidanceLabel')}</Label>
                            <Textarea id="guidanceQuery" name="guidanceQuery" placeholder={t('fileReport.guidancePlaceholder')} rows={5} required minLength={10} maxLength={1000} disabled={isFormDisabled} value={guidanceQuery} onChange={(e) => setGuidanceQuery(e.target.value)} className="text-base" />
                            {reportState.errors?.guidanceQuery && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="mr-1 h-3 w-3" /> {reportState.errors.guidanceQuery.join(', ')}</p>}
                        </div>
                        <Separator />
                        {/* Additional Outputs */}
                        <div className="space-y-3">
                            <Label className="text-base">{t('fileReport.additionalOutputsLabel')}</Label>
                             <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30 dark:bg-secondary/10 border border-border/50">
                                <Switch id="generateCharts" name="generateCharts" defaultChecked disabled={isFormDisabled}/>
                                <Label htmlFor="generateCharts" className="flex flex-col space-y-0.5"><span className="font-medium text-primary/90">{t('fileReport.chartsLabel')}</span><span className="text-xs text-muted-foreground">{t('fileReport.chartsDescription')}</span></Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30 dark:bg-secondary/10 border border-border/50">
                                <Switch id="generateMindmap" name="generateMindmap" disabled={isFormDisabled}/>
                                <Label htmlFor="generateMindmap" className="flex flex-col space-y-0.5"><span className="font-medium text-primary/90">{t('fileReport.mindmapLabel')}</span><span className="text-xs text-muted-foreground">{t('fileReport.mindmapDescription')}</span></Label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-6 bg-secondary/20 dark:bg-secondary/10 border-t">
                        <Button type="submit" className="w-full sm:w-auto ml-auto text-base py-3" disabled={isFormDisabled}>
                            {isGeneratingFileReport ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                            {isGeneratingFileReport ? t('fileReport.buttonGenerating') : t('fileReport.buttonGenerate')}
                        </Button>
                    </CardFooter>
                    </form>
                </Card>
            </TabsContent>
            <TabsContent value="mindmap">
                 <Card className="shadow-2xl border-primary/20 rounded-xl overflow-hidden rounded-tr-none">
                    <form id="mindmapForm" action={mindmapFormAction}>
                        <CardHeader className="p-6 bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
                            <CardTitle className="text-2xl font-semibold text-primary flex items-center"><Lightbulb className="mr-3 h-7 w-7 text-accent" />{t('fileReport.mindmapInputTitle')}</CardTitle>
                            <CardDescription className="text-muted-foreground mt-1">{t('fileReport.mindmapInputDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <input type="hidden" name="language" value={i18n.language} />
                            <div className="space-y-2">
                                <Label htmlFor="textToAnalyze" className="text-base">{t('fileReport.textToAnalyzeLabel')}</Label>
                                <Textarea id="textToAnalyze" name="textToAnalyze" placeholder={t('fileReport.textToAnalyzePlaceholder')} rows={10} required minLength={50} maxLength={10000} disabled={isFormDisabled} value={textToAnalyze} onChange={(e) => setTextToAnalyze(e.target.value)} className="text-base leading-relaxed" />
                                {mindmapState.errors?.textToAnalyze && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="mr-1 h-3 w-3" /> {mindmapState.errors.textToAnalyze.join(', ')}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="p-6 bg-secondary/20 dark:bg-secondary/10 border-t">
                            <Button type="submit" className="w-full sm:w-auto ml-auto text-base py-3" disabled={isFormDisabled}>
                                {isExtractingMindmap ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BrainCircuit className="mr-2 h-5 w-5" />}
                                {isExtractingMindmap ? t('fileReport.buttonExtracting') : t('fileReport.buttonExtract')}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
        </Tabs>
      )}

      <div id="analysis-results-section" className="mt-10 space-y-8">
        {reportResult && (
          <ResearchReportDisplay
            report={reportResult}
            originalQuestion={reportGuidance}
          />
        )}
        {(reportResult?.mindmapData || mindmapResult) && (
            <MindmapDisplay data={reportResult?.mindmapData || mindmapResult!} />
        )}
        
        {(reportResult || mindmapResult) && (
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={handleStartNew} variant="outline" size="lg" className="w-full sm:w-auto">
              <RotateCcw className="mr-2 h-5 w-5" />
              {t('fileReport.buttonStartNew')}
            </Button>
          </div>
        )}
       </div>

    </div>
  );
}
