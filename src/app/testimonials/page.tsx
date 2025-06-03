
// src/app/testimonials/page.tsx
import { TestimonialCard, testimonialsData, type Testimonial } from '@/components/landing/TestimonialsSection';
import { Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Testimonials - What Our Users Say | ScholarAI',
  description: 'Read success stories and feedback from researchers, students, and professionals who have transformed their work using ScholarAI.',
  openGraph: {
    title: 'Testimonials - ScholarAI User Experiences',
    description: 'Discover how ScholarAI is helping users accelerate research, synthesize information, and generate comprehensive reports.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=ScholarAI+Testimonials', 
        width: 1200,
        height: 630,
        alt: 'User Testimonials for ScholarAI',
        'data-ai-hint': 'user feedback reviews',
      },
    ],
  },
};

export default function TestimonialsPage() {
  console.log('Debug testimonialsData:', typeof testimonialsData, testimonialsData);
  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center justify-center p-3.5 sm:p-4 bg-gradient-to-br from-primary to-primary/80 rounded-full mb-5 sm:mb-6 ring-2 ring-primary/40 shadow-lg text-primary-foreground">
          <Users className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
          What Our Users Say About ScholarAI
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Hear directly from researchers, students, and professionals who have experienced the transformative power of ScholarAI in their work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.isArray(testimonialsData) && testimonialsData.length > 0 ? (
            testimonialsData.map((testimonial, index) => (
            <TestimonialCard 
                key={index}
                quote={testimonial.quote}
                name={testimonial.name}
                title={testimonial.title}
                avatarSrc={testimonial.avatarSrc}
                avatarFallback={testimonial.avatarFallback}
                stars={testimonial.stars}
            />
            ))
        ) : (
          <p className="text-center text-muted-foreground col-span-full text-lg py-10">Testimonials are currently being gathered. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
