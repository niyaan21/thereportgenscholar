
import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Navbar from '@/components/layout/Navbar';
import ParticleBackground from '@/components/layout/ParticleBackground';
import { ThemeProvider } from 'next-themes';
import Footer from '@/components/layout/Footer';
import GlobalKeyboardShortcuts from '@/components/layout/GlobalKeyboardShortcuts';
import { I18nProviderClient } from '@/components/layout/I18nProviderClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://fossai.netlify.app'),
  title: {
    default: 'Foss AI: Advanced AI Research & Report Generation',
    template: '%s | Foss AI',
  },
  description: 'Elevate your research with Foss AI. Leverage cutting-edge AI for query formulation, knowledge synthesis, conceptual visualization, and comprehensive report generation. Start your intelligent research journey today.',
  keywords: ['AI research', 'report generator', 'knowledge synthesis', 'academic research', 'AI tool', 'data analysis', 'generative AI', 'research assistant', 'automated reporting', 'Foss AI'],
  openGraph: {
    title: 'Foss AI: Advanced AI Research & Report Generation',
    description: 'Elevate your research with Foss AI. Leverage cutting-edge AI for query formulation, knowledge synthesis, conceptual visualization, and comprehensive report generation.',
    url: 'https://fossai.netlify.app',
    siteName: 'Foss AI',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Foss AI - AI Research and Report Generation Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foss AI: Advanced AI Research & Report Generation',
    description: 'Elevate your research with Foss AI. Leverage cutting-edge AI for query formulation, knowledge synthesis, and comprehensive report generation.',
    images: ['https://placehold.co/1200x630.png'],
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
};


const StructuredData = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Foss AI",
    "url": "https://fossai.netlify.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://fossai.netlify.app/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className="font-sans antialiased">
        <I18nProviderClient>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ParticleBackground />
            <GlobalKeyboardShortcuts />
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Toaster />
              <Footer />
            </div>
          </ThemeProvider>
        </I18nProviderClient>
      </body>
    </html>
  );
}
