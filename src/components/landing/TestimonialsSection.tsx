
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
  },
    {
    quote: "The conceptual image generation is surprisingly inspiring. It gives a fresh visual perspective on my research topics, often sparking new ideas or ways to present my findings.",
    name: "Dr. Olivia Huang",
    title: "Art History Professor",
    avatarSrc: "https://placehold.co/100x100/D6BCFA/4A5568.png?text=OH",
    avatarFallback: "OH",
    stars: 5,
  },
  {
    quote: "As a non-native English speaker, the report structuring and formal language generation by ScholarAI are incredibly helpful for producing professional-quality academic documents.",
    name: "Marco Rossi",
    title: "Visiting Scholar, International Relations",
    avatarSrc: "https://placehold.co/100x100/FBD38D/4A5568.png?text=MR",
    avatarFallback: "MR",
    stars: 5,
  },
  {
    quote: "What used to take me days of sifting through articles now takes a fraction of the time. ScholarAI's AI query formulation is like having an expert librarian guide my search.",
    name: "Priya Sharma",
    title: "Policy Analyst, Civic Think Tank",
    avatarSrc: "https://placehold.co/100x100/FFC0CB/4A5568.png?text=PS",
    avatarFallback: "PS",
    stars: 4,
  },
  {
    quote: "The iterative process of refining queries and summaries in ScholarAI is fantastic. It feels like a true collaborative partner in research, not just a static tool. The AI adapts!",
    name: "Dr. Ben Isaac",
    title: "Cognitive Scientist",
    avatarSrc: "https://placehold.co/100x100/718096/FFFFFF.png?text=BI",
    avatarFallback: "BI",
    stars: 5,
  },
  {
    quote: "ScholarAI has streamlined our team's initial research phase for new projects. We can quickly get a comprehensive overview and identify key areas for deeper manual investigation. Huge efficiency gain.",
    name: "Aisha Khan",
    title: "R&D Project Manager",
    avatarSrc: "https://placehold.co/100x100/ED8936/FFFFFF.png?text=AK",
    avatarFallback: "AK",
    stars: 5,
  },
  {
    quote: "The depth of the generated reports is impressive. It covers aspects I wouldn't have thought to include initially, providing a more holistic view of the research topic. The chart suggestions are also spot on.",
    name: "Tom Evans",
    title: "Freelance Technical Writer",
    avatarSrc: "https://placehold.co/100x100/4299E1/FFFFFF.png?text=TE",
    avatarFallback: "TE",
    stars: 4,
  },
  {
    quote: "This app is a lifesaver for students! It helps break down complex research tasks into manageable steps. The AI assistance feels like having a tutor by your side.",
    name: "Chloe Davis",
    title: "Undergraduate Student, Liberal Arts",
    avatarSrc: "https://placehold.co/100x100/F6AD55/FFFFFF.png?text=CD",
    avatarFallback: "CD",
    stars: 5,
  },
  {
    quote: "ScholarAI's report generation feature is a brilliant starting point for any white paper or detailed analysis. It saves so much time on structuring and initial content generation.",
    name: "Marcus Wei",
    title: "Strategy Consultant",
    avatarSrc: "https://placehold.co/100x100/48BB78/FFFFFF.png?text=MW",
    avatarFallback: "MW",
    stars: 5,
  },
  {
    quote: "The visual concepts generated by the AI are surprisingly insightful and provide a great way to communicate complex ideas. It's a unique addition to a research tool.",
    name: "Dr. Sofia Petrova",
    title: "Data Scientist & Visualisation Expert",
    avatarSrc: "https://placehold.co/100x100/90CDF4/FFFFFF.png?text=SP",
    avatarFallback: "SP",
    stars: 4,
  }
];

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

    