
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Navbar from '@/components/layout/Navbar'; // New import

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'ScholarAI: Advanced AI Research & Report Generation',
    template: '%s | ScholarAI',
  },
  description: 'Elevate your research with ScholarAI. Leverage cutting-edge AI for query formulation, knowledge synthesis, conceptual visualization, and comprehensive report generation. Start your intelligent research journey today.',
  keywords: ['AI research', 'report generator', 'knowledge synthesis', 'academic research', 'AI tool', 'data analysis', 'generative AI', 'research assistant', 'automated reporting'],
  openGraph: {
    title: 'ScholarAI: Advanced AI Research & Report Generation',
    description: 'Elevate your research with ScholarAI. Leverage cutting-edge AI for query formulation, knowledge synthesis, conceptual visualization, and comprehensive report generation.',
    url: 'https://scholarai.example.com', // Replace with your actual domain
    siteName: 'ScholarAI',
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=ScholarAI+Research+Platform', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: 'ScholarAI - AI Research and Report Generation Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScholarAI: Advanced AI Research & Report Generation',
    description: 'Elevate your research with ScholarAI. Leverage cutting-edge AI for query formulation, knowledge synthesis, and comprehensive report generation.',
    // images: ['https://placehold.co/1200x630.png?text=ScholarAI+Research+Platform'], // OG image will be used by default if not specified
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/site.webmanifest', // Ensure you create this file for PWA capabilities
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
