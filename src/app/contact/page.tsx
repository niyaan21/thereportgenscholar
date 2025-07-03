// src/app/contact/page.tsx
'use client';

import React, { useState, FormEvent } from 'react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Mail, MessageSquare, Phone, Info, Building, MapPin } from 'lucide-react';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';


export default function ContactPage() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: t('contactPage.toastTitle'),
      description: t('contactPage.toastDescription'),
      variant: 'default',
    });

    // Reset form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl mx-auto shadow-2xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="text-center p-8 sm:p-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-t-xl">
          <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-5 sm:mb-8 mx-auto ring-2 ring-accent/40 shadow-lg text-accent-foreground">
            <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
          <CardTitle className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            {t('contactPage.title')}
          </CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto">
            {t('contactPage.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 md:p-10 grid md:grid-cols-2 gap-8 sm:gap-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t('contactPage.formTitle')}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">{t('contactPage.nameLabel')}</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder={t('contactPage.namePlaceholder')}
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">{t('contactPage.emailLabel')}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder={t('contactPage.emailPlaceholder')} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="subject">{t('contactPage.subjectLabel')}</Label>
                <Input 
                  id="subject" 
                  type="text" 
                  placeholder={t('contactPage.subjectPlaceholder')} 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  required 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message">{t('contactPage.messageLabel')}</Label>
                <Textarea 
                  id="message" 
                  placeholder={t('contactPage.messagePlaceholder')} 
                  rows={5} 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  required 
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full text-base py-3" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                {isSubmitting ? t('contactPage.buttonSending') : t('contactPage.buttonSend')}
              </Button>
            </form>
          </div>
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t('contactPage.infoTitle')}</h2>
            <div className="space-y-5 text-foreground/80">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-primary/90">{t('contactPage.infoEmail')}</h3>
                  <p className="text-sm">support@fossai.example.com (Placeholder)</p>
                  <a href="mailto:support@fossai.example.com" className="text-xs text-accent hover:underline">{t('contactPage.infoEmailLink')}</a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-primary/90">{t('contactPage.infoCall')}</h3>
                  <p className="text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
               <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-primary/90">{t('contactPage.infoOffice')}</h3>
                  <p className="text-sm">123 Innovation Drive, Tech City, TX 75001</p>
                </div>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-primary/90">{t('contactPage.infoHours')}</h3>
                  <p className="text-sm">{t('contactPage.infoHoursDetail')}</p>
                  <p className="text-sm">{t('contactPage.infoHoursWeekend')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
