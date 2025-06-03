
// src/app/pricing/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { Check, Star, Users, Zap, TrendingUp, ShieldCheck, Package, ArrowRight, DollarSign, HelpCircle, MessageSquare } from 'lucide-react';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import React from 'react'; // Import React

export const metadata: Metadata = {
  title: 'ScholarAI Pricing - Unlock Your Research Potential',
  description: 'Explore flexible pricing plans for ScholarAI. Choose the perfect plan for your research needs, from individual explorers to enterprise teams, and start leveraging AI today.',
  openGraph: {
    title: 'ScholarAI Pricing - Plans for Every Researcher',
    description: 'Find the ScholarAI plan that fits your research workflow. AI-powered query formulation, synthesis, and report generation at your fingertips.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=ScholarAI+Pricing',
        width: 1200,
        height: 630,
        alt: 'ScholarAI Pricing Plans',
        'data-ai-hint': 'pricing plans infographic',
      },
    ],
  },
};

interface PricingTierProps {
  name: string;
  price: string;
  priceDescription: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  highlighted?: boolean;
  icon: React.ElementType;
  tagline: string;
}

const TierCard = React.memo(function TierCard({ name, price, priceDescription, features, ctaText, ctaLink, highlighted, icon: Icon, tagline }: PricingTierProps) {
  return (
    <Card className={cn(
      "flex flex-col rounded-xl shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1 border-2",
      highlighted ? "border-accent bg-accent/5 scale-105" : "border-primary/20 bg-card"
    )}>
      <CardHeader className="p-6 sm:p-8 text-center">
        <div className={cn("inline-flex items-center justify-center p-3 sm:p-3.5 rounded-full mb-4 sm:mb-5 mx-auto ring-2 shadow-lg", highlighted ? "bg-accent text-accent-foreground ring-accent/50" : "bg-primary text-primary-foreground ring-primary/40")}>
          <Icon className="h-7 w-7 sm:h-8 sm:h-8" />
        </div>
        <CardTitle className={cn("text-2xl sm:text-3xl font-bold tracking-tight", highlighted ? "text-accent-foreground" : "text-primary")}>{name}</CardTitle>
        <p className={cn("text-sm sm:text-base mt-2", highlighted ? "text-accent-foreground/80" : "text-muted-foreground")}>{tagline}</p>
        <div className="mt-4 sm:mt-5">
          <span className={cn("text-4xl sm:text-5xl font-extrabold", highlighted ? "text-accent-foreground" : "text-foreground")}>{price}</span>
          <span className={cn("text-sm font-medium ml-1.5", highlighted ? "text-accent-foreground/70" : "text-muted-foreground")}>{priceDescription}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow px-6 sm:px-8 pb-6 sm:pb-8">
        <ul className="space-y-3 sm:space-y-3.5 text-sm sm:text-base">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className={cn("h-5 w-5 mr-2.5 sm:mr-3 mt-0.5 flex-shrink-0", highlighted ? "text-accent" : "text-green-500")} />
              <span className={highlighted ? "text-accent-foreground/90" : "text-foreground/80"}>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-6 sm:p-8 pt-0">
        <Button asChild size="lg" className={cn("w-full text-base sm:text-lg py-3", highlighted ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-accent text-accent-foreground hover:bg-accent/90")}>
          <NextLink href={ctaLink}>
            {ctaText} <ArrowRight className="ml-2 h-5 w-5" />
          </NextLink>
        </Button>
      </CardFooter>
    </Card>
  );
});

export default function PricingPage() {
  const tiers: PricingTierProps[] = [
    {
      name: "Explorer",
      price: "$0",
      priceDescription: "/ month",
      tagline: "Start your AI research journey, no cost involved.",
      features: [
        "5 Research Queries / Day",
        "Basic Report Generation",
        "2 Conceptual Images / Month",
        "Limited History Access",
        "Community Support",
      ],
      ctaText: "Start Exploring",
      ctaLink: "/signup",
      icon: Package,
    },
    {
      name: "Innovator",
      price: "$29",
      priceDescription: "/ month",
      tagline: "For individuals and small teams pushing boundaries.",
      features: [
        "100 Research Queries / Day",
        "Advanced Report Generation & Customization",
        "25 Conceptual Images / Month",
        "Full Research History",
        "Priority Email Support",
        "Early Access to New Features",
        "(Coming Soon) Basic API Access",
      ],
      ctaText: "Choose Innovator",
      ctaLink: "/signup?plan=innovator", // Example, actual plan selection needs backend
      highlighted: true,
      icon: Star,
    },
    {
      name: "Pioneer",
      price: "Custom",
      priceDescription: "",
      tagline: "Tailored solutions for large organizations and enterprises.",
      features: [
        "Unlimited Research Queries",
        "Enterprise-Grade Reporting & Analytics",
        "Unlimited Conceptual Images",
        "Team Collaboration Tools",
        "Dedicated Account Manager & Support",
        "Custom Integrations & SLA",
        "Full API Access & Higher Rate Limits",
      ],
      ctaText: "Contact Sales",
      ctaLink: "/contact", 
      icon: Users,
    },
  ];

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center justify-center p-3.5 sm:p-4 bg-gradient-to-br from-primary to-primary/80 rounded-full mb-5 sm:mb-6 ring-2 ring-primary/40 shadow-lg text-primary-foreground">
          <DollarSign className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
          Find Your Perfect Plan
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Flexible and transparent pricing to supercharge your research workflow. No hidden fees, cancel anytime.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch">
        {tiers.map((tier) => (
          <TierCard key={tier.name} {...tier} />
        ))}
      </div>

      <section className="mt-16 sm:mt-24 text-center">
         <Card className="max-w-3xl mx-auto p-6 sm:p-10 bg-gradient-to-br from-secondary/20 via-transparent to-secondary/10 shadow-xl border-border/30 rounded-xl">
            <CardHeader className="p-0 mb-5 sm:mb-6">
                 <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-4 ring-2 ring-accent/30 shadow-md text-accent-foreground mx-auto">
                    <HelpCircle className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-5 text-left">
                <details className="group p-3 sm:p-4 rounded-lg hover:bg-accent/10 transition-colors">
                    <summary className="flex justify-between items-center font-medium cursor-pointer text-base sm:text-lg text-primary/90 group-hover:text-accent">
                        Can I try ScholarAI before committing to a paid plan?
                        <ArrowRight className="h-4 w-4 transform transition-transform duration-200 group-open:rotate-90" />
                    </summary>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base leading-relaxed">
                        Yes! Our "Explorer" plan is completely free and allows you to test core features. You can upgrade anytime when you need more power.
                    </p>
                </details>
                 <details className="group p-3 sm:p-4 rounded-lg hover:bg-accent/10 transition-colors">
                    <summary className="flex justify-between items-center font-medium cursor-pointer text-base sm:text-lg text-primary/90 group-hover:text-accent">
                        What payment methods do you accept?
                         <ArrowRight className="h-4 w-4 transform transition-transform duration-200 group-open:rotate-90" />
                    </summary>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base leading-relaxed">
                        We plan to accept all major credit cards (Visa, Mastercard, American Express). For Enterprise plans, we can also arrange invoicing. (Payment processing not yet implemented).
                    </p>
                </details>
                <details className="group p-3 sm:p-4 rounded-lg hover:bg-accent/10 transition-colors">
                    <summary className="flex justify-between items-center font-medium cursor-pointer text-base sm:text-lg text-primary/90 group-hover:text-accent">
                        Can I cancel my subscription anytime?
                         <ArrowRight className="h-4 w-4 transform transition-transform duration-200 group-open:rotate-90" />
                    </summary>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base leading-relaxed">
                        Absolutely. You can cancel your subscription at any time from your account settings. Your plan will remain active until the end of the current billing period.
                    </p>
                </details>
            </CardContent>
             <CardFooter className="p-0 pt-8 text-center">
                <p className="text-muted-foreground text-sm sm:text-base w-full">
                    Have more questions? <NextLink href="/contact" className="text-accent hover:underline">Contact our support team</NextLink>.
                </p>
            </CardFooter>
        </Card>
      </section>

      <div className="mt-16 sm:mt-20 text-center">
        <p className="text-lg sm:text-xl text-muted-foreground">
          Ready to accelerate your research?
        </p>
        <Button asChild size="lg" className="mt-5 sm:mt-6 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-2xl px-10 py-3.5 text-lg sm:text-xl">
          <NextLink href="/signup">
            Get Started with ScholarAI <ArrowRight className="ml-2.5 h-5 w-5 sm:h-6 sm:w-6" />
          </NextLink>
        </Button>
      </div>
    </div>
  );
}

