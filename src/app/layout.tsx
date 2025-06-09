
import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Navbar from '@/components/layout/Navbar';
import ParticleBackground from '@/components/layout/ParticleBackground';
import { ThemeProvider } from 'next-themes';
import Footer from '@/components/layout/Footer';
import PageProgressBar from '@/components/layout/PageProgressBar';

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
        url: 'https://placehold.co/1200x630.png?text=ScholarAI+Research+Platform',
        width: 1200,
        height: 630,
        alt: 'ScholarAI - AI Research and Report Generation Tool',
        'data-ai-hint': 'research platform homepage' as any,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScholarAI: Advanced AI Research & Report Generation',
    description: 'Elevate your research with ScholarAI. Leverage cutting-edge AI for query formulation, knowledge synthesis, and comprehensive report generation.',
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
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PageProgressBar />
          <ParticleBackground />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Toaster />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
