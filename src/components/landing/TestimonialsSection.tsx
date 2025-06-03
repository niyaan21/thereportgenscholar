
// src/components/landing/TestimonialsSection.tsx
'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquareQuote } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatarSrc?: string;
  avatarFallback: string;
  stars: number;
}

// Ensuring this is explicitly an array of Testimonial
export const testimonialsData: Testimonial[] = [
  {
    quote: "ScholarAI has revolutionized how I approach literature reviews. The AI-driven synthesis saves me hours, allowing me to focus on critical analysis and writing. The report generation is a game-changer!",
    name: "Dr. Evelyn Reed",
    title: "Senior Researcher, Institute of Advanced Studies",
    avatarSrc: "https://placehold.co/100x100/E2E8F0/4A5568.png?text=ER",
    avatarFallback: "ER",
    stars: 5,
  },
  {
    quote: "As a PhD student, managing vast amounts of information is daunting. ScholarAI's query formulation and summarization tools are incredibly intuitive and have significantly accelerated my research process. Highly recommended!",
    name: "John B. Carter",
    title: "PhD Candidate, Tech University",
    avatarSrc: "https://placehold.co/100x100/CBD5E0/4A5568.png?text=JC",
    avatarFallback: "JC",
    stars: 5,
  },
  {
    quote: "The ability to generate comprehensive reports from a simple question is astounding. ScholarAI helps our team quickly produce initial drafts, freeing up time for deeper investigation and refinement.",
    name: "Sarah Chen",
    title: "Lead Analyst, Innovate Solutions Inc.",
    avatarSrc: "https://placehold.co/100x100/A0AEC0/4A5568.png?text=SC",
    avatarFallback: "SC",
    stars: 4,
  },
  {
    quote: "I was skeptical about AI in research, but ScholarAI proved me wrong. It's like having a super-efficient research assistant available 24/7. The conceptual image generation is a surprisingly useful feature for brainstorming.",
    name: "Dr. Alistair Finch",
    title: "Professor of Sociology",
    avatarSrc: "https://placehold.co/100x100/ECC94B/4A5568.png?text=AF",
    avatarFallback: "AF",
    stars: 5,
  },
  {
    quote: "The user interface is clean and the workflow is logical. ScholarAI has definitely improved the quality and speed of my market research projects. Downloading reports in multiple formats is also a big plus.",
    name: "Maria Rodriguez",
    title: "Market Research Manager",
    avatarSrc: "https://placehold.co/100x100/F56565/4A5568.png?text=MR",
    avatarFallback: "MR",
    stars: 4,
  },
  {
    quote: "Integrating ScholarAI into our curriculum has helped students grasp complex topics faster by providing them with synthesized information and diverse query vectors to explore. It's a valuable educational tool.",
    name: "Prof. David Lee",
    title: "Educational Technology Coordinator",
    avatarSrc: "https://placehold.co/100x100/4FD1C5/4A5568.png?text=DL",
    avatarFallback: "DL",
    stars: 5,
  },
  {
    quote: "The report generation feature is incredibly detailed and well-structured. It provides a solid foundation that I can then build upon with my specific insights and analyses. A huge time saver!",
    name: "Dr. Kenji Tanaka",
    title: "Postdoctoral Fellow, BioTech Innovations",
    avatarSrc: "https://placehold.co/100x100/9F7AEA/FFFFFF.png?text=KT",
    avatarFallback: "KT",
    stars: 5,
  },
  {
    quote: "ScholarAI's ability to formulate multiple search queries from a single research question helps me explore various facets of a topic I might not have considered initially. It broadens my research scope effectively.",
    name: "Laura Williams",
    title: "Independent Consultant & Analyst",
    avatarSrc: "https://placehold.co/100x100/FBBF24/4A5568.png?text=LW",
    avatarFallback: "LW",
    stars: 4,
  },
  {
    quote: "For quick overviews and understanding complex papers, ScholarAI is fantastic. The synthesis feature helps me get the gist quickly, which is invaluable when dealing with a high volume of reading material.",
    name: "Samuel Green",
    title: "Graduate Student, Environmental Science",
    avatarSrc: "https://placehold.co/100x100/68D391/FFFFFF.png?text=SG",
    avatarFallback: "SG",
    stars: 5,
  }
]; // Explicitly an array

export const TestimonialCard: React.FC<Testimonial & {className?: string}> = ({ quote, name, title, avatarSrc, avatarFallback, stars, className }) => {
  return (
    <Card className={cn("flex flex-col h-full shadow-lg hover:shadow-accent/20 transition-all duration-300 ease-out bg-card border-primary/15 hover:-translate-y-1", className)}>
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

