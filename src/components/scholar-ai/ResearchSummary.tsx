// src/components/scholar-ai/ResearchSummary.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Lightbulb } from 'lucide-react';
import Image from 'next/image';

interface ResearchSummaryProps {
  summary: string;
}

export default function ResearchSummary({ summary }: ResearchSummaryProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl">Research Synthesis</CardTitle>
        </div>
        <CardDescription>Below is a coherent overview synthesized from multiple research sources.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-accent" />
            Key Insights
          </h3>
          {/* For a real app, structure this. For now, it's part of the LLM summary */}
          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-accent" />
            Sources & Further Reading (Mocked)
          </h3>
          <ul className="list-disc list-inside space-y-1 text-foreground/80">
            <li>The Future of AI in Academic Research</li>
            <li>Advanced Language Models for Query Understanding</li>
            <li>Synthesizing Knowledge: A Survey of Text Summarization Techniques</li>
            <li>Ethical Considerations in AI-Driven Research</li>
          </ul>
        </div>
        
        {/* Placeholder for potential visual element */}
        <div className="mt-6 p-4 bg-secondary/50 rounded-lg flex flex-col items-center text-center">
            <Image 
                src="https://picsum.photos/400/200" 
                alt="Conceptual research graphic" 
                width={400} 
                height={200}
                className="rounded-md shadow-md mb-3"
                data-ai-hint="research graph"
            />
            <p className="text-sm text-muted-foreground">Visualizing connections in research.</p>
        </div>
      </CardContent>
    </Card>
  );
}
