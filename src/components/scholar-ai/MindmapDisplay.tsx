
// src/components/scholar-ai/MindmapDisplay.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, BrainCircuit, Share2, CircleDot, ChevronRight, Tag } from 'lucide-react';
import type { ExtractMindmapConceptsOutput } from '@/ai/flows/extract-mindmap-concepts';

interface MindmapDisplayProps {
    data: ExtractMindmapConceptsOutput;
}

const MindmapDisplay = React.memo(function MindmapDisplay({ data }: MindmapDisplayProps) {
    if (!data) return null;

    return (
        <Card className="w-full shadow-2xl border-accent/30 rounded-xl overflow-hidden">
            <CardHeader className="p-6 bg-gradient-to-br from-accent/15 via-transparent to-accent/5">
                <CardTitle className="text-2xl font-semibold text-primary flex items-center">
                    <BrainCircuit className="mr-3 h-7 w-7 text-accent" />
                    Extracted Mindmap Structure
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                    Here are the key ideas and concepts identified from your text, ready to build a visual mind map.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                        <CircleDot className="mr-2.5 h-5 w-5 text-accent/80"/> Main Idea / Central Theme
                    </h3>
                    <p className="text-base text-foreground/90 bg-secondary/40 dark:bg-secondary/20 p-3 rounded-md shadow-sm border border-border/60">
                        {data.mainIdea}
                    </p>
                </div>
                <Separator />
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                        <Share2 className="mr-2.5 h-5 w-5 text-accent/80"/> Key Concepts & Related Terms
                    </h3>
                    {data.keyConcepts.length > 0 ? (
                        <div className="space-y-4">
                        {data.keyConcepts.map((conceptObj, index) => (
                            <div key={index} className="p-4 bg-card rounded-lg border border-border/70 shadow-md hover:shadow-lg transition-shadow">
                            <h4 className="text-md font-semibold text-accent-foreground mb-2.5 flex items-center">
                                <ChevronRight className="mr-1.5 h-5 w-5 text-accent/70"/> {conceptObj.concept}
                            </h4>
                            {conceptObj.relatedTerms.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                {conceptObj.relatedTerms.map((term, termIndex) => (
                                    <Badge key={termIndex} variant="outline" className="text-xs bg-secondary/50 border-secondary text-secondary-foreground hover:bg-secondary/70">
                                    <Tag className="h-3 w-3 mr-1.5"/>
                                    {term}
                                    </Badge>
                                ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground italic">No specific related terms identified for this concept.</p>
                            )}
                            </div>
                        ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground italic">No specific key concepts were extracted.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
});
MindmapDisplay.displayName = "MindmapDisplay";
export default MindmapDisplay;
