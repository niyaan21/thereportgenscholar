
// src/components/landing/TestimonialsSection.tsx
'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquareQuote, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatarSrc?: string;
  avatarFallback: string;
  stars: number;
}

const testimonialsData: Testimonial[] = [
  {
    quote: "ScholarAI has revolutionized how I approach literature reviews. The AI-driven synthesis saves me hours, allowing me to focus on critical analysis and writing. The report generation is a game-changer!",
    name: "Dr. Evelyn Reed",
    title: "Senior Researcher, Institute of Advanced Studies",
    avatarSrc: "https://placehold.co/100x100/E2E8F0/4A5568.png?text=ER", // Placeholder
    avatarFallback: "ER",
    stars: 5,
  },
  {
    quote: "As a PhD student, managing vast amounts of information is daunting. ScholarAI's query formulation and summarization tools are incredibly intuitive and have significantly accelerated my research process. Highly recommended!",
    name: "John B. Carter",
    title: "PhD Candidate, Tech University",
    avatarSrc: "https://placehold.co/100x100/CBD5E0/4A5568.png?text=JC", // Placeholder
    avatarFallback: "JC",
    stars: 5,
  },
  {
    quote: "The ability to generate comprehensive reports from a simple question is astounding. ScholarAI helps our team quickly produce initial drafts, freeing up time for deeper investigation and refinement.",
    name: "Sarah Chen",
    title: "Lead Analyst, Innovate Solutions Inc.",
    avatarSrc: "https://placehold.co/100x100/A0AEC0/4A5568.png?text=SC", // Placeholder
    avatarFallback: "SC",
    stars: 4,
  },
];

const TestimonialCard: React.FC<Testimonial & {className?: string}> = ({ quote, name, title, avatarSrc, avatarFallback, stars, className }) => {
  return (
    <Card className={cn("flex flex-col h-full shadow-lg hover:shadow-accent/20 transition-all duration-300 ease-out bg-card border-primary/15", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-1 mb-2">
          {Array(5).fill(0).map((_, i) => (
            <Star
              key={i}
              className={cn("h-5 w-5", i < stars ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50")}
            />
          ))}
        </div>
         <CardTitle className="text-base sm:text-lg font-normal text-foreground/80 leading-relaxed italic">
          <MessageSquareQuote className="inline-block h-6 w-6 text-accent/70 mr-2 transform -scale-x-100" />
          "{quote}"
          <MessageSquareQuote className="inline-block h-6 w-6 text-accent/70 ml-1" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent> 
      <CardFooter className="pt-0 mt-auto">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-accent/40">
            <AvatarImage src={avatarSrc} alt={name} data-ai-hint="person portrait" />
            <AvatarFallback className="bg-muted text-muted-foreground font-semibold">{avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm sm:text-base font-semibold text-primary">{name}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};


export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-20 bg-secondary/30 dark:bg-secondary/10 rounded-xl sm:rounded-2xl mt-12 md:mt-16 border border-border/40 shadow-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-primary to-primary/80 rounded-full mb-4 ring-2 ring-primary/30 shadow-lg text-primary-foreground">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Trusted by Researchers & Innovators
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            See how ScholarAI is transforming the research landscape for professionals like you.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
