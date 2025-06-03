
// src/app/privacy-policy/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, ShieldCheck, UserCircle, Database, Clock, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ScholarAI',
  description: 'Understand how ScholarAI collects, uses, and protects your personal information. Our commitment to your privacy.',
  openGraph: {
    title: 'ScholarAI Privacy Policy',
    description: 'Detailed information on data handling, user rights, and security measures at ScholarAI.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=ScholarAI+Privacy',
        width: 1200,
        height: 630,
        alt: 'ScholarAI Privacy Policy',
        'data-ai-hint': 'privacy security document',
      },
    ],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="text-center p-8 sm:p-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-t-xl">
          <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-5 sm:mb-8 mx-auto ring-2 ring-accent/40 shadow-lg text-accent-foreground">
            <ShieldCheck className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
          <CardTitle className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            Privacy Policy
          </CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto">
            Your privacy is important to us. Last Updated: {new Date().toLocaleDateString()}.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 md:p-10 text-base text-foreground/90 leading-relaxed prose prose-lg dark:prose-invert max-w-none marker:text-accent">
          <p>
            Welcome to ScholarAI. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
          </p>

          <h2 className="text-2xl font-semibold text-primary flex items-center mt-8 mb-4"><UserCircle className="h-6 w-6 mr-3 text-accent"/>Information We Collect (Placeholder)</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect via the Application depends on the content and materials you use, and includes:
          </p>
          <ul className="list-disc list-outside space-y-1 pl-5 mt-2">
            <li><strong>Personal Data:</strong> Email address, name (if provided during signup or account settings).</li>
            <li><strong>Usage Data:</strong> Information your browser sends whenever you visit our Service or when you access the Service by or through a mobile device. This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data. Research queries and generated content are processed by our AI models but are not stored long-term associated with your personal identifiers unless explicitly stated for features like history (which is currently a placeholder).</li>
            <li><strong>AI Interaction Data:</strong> We use Google Gemini models through Genkit. Interactions with these models are subject to Google's privacy policies. ScholarAI itself does not persistently store the direct inputs to or outputs from the AI models tied to your personal account beyond the session, unless necessary for a feature like "Research History" (which would be explicitly opt-in or clearly noted).</li>
          </ul>

          <h2 className="text-2xl font-semibold text-primary flex items-center mt-8 mb-4"><Database className="h-6 w-6 mr-3 text-accent"/>How We Use Your Information (Placeholder)</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
          </p>
          <ul className="list-disc list-outside space-y-1 pl-5 mt-2">
            <li>Create and manage your account.</li>
            <li>Provide and improve our services, including AI-powered features.</li>
            <li>Communicate with you about your account or our services.</li>
            <li>Monitor and analyze usage and trends to improve your experience.</li>
            <li>Ensure the security and integrity of our services.</li>
            <li>Respond to user inquiries and offer support.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-primary flex items-center mt-8 mb-4"><ShieldCheck className="h-6 w-6 mr-3 text-accent"/>Data Security (Placeholder)</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>

          <h2 className="text-2xl font-semibold text-primary flex items-center mt-8 mb-4"><Clock className="h-6 w-6 mr-3 text-accent"/>Changes to This Privacy Policy (Placeholder)</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>

          <h2 className="text-2xl font-semibold text-primary flex items-center mt-8 mb-4"><Mail className="h-6 w-6 mr-3 text-accent"/>Contact Us (Placeholder)</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at:
            <br />
            ScholarAI Support Team
            <br />
            Email: privacy@scholarai.example.com (Placeholder)
            <br />
            Address: 123 Innovation Drive, Tech City, TX 75001 (Placeholder)
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            This is a placeholder privacy policy. In a real application, this would be a comprehensive legal document drafted by a legal professional.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
