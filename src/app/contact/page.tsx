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


export default function ContactPage() {
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
      title: 'Message Sent (Placeholder)',
      description: "Thank you for reaching out! We'll get back to you soon. (This is a demo, no email was actually sent).",
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
            Get In Touch
          </CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto">
            We're here to help and answer any question you might have. We look forward to hearing from you!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 md:p-10 grid md:grid-cols-2 gap-8 sm:gap-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary mb-4">Contact Form</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Your Full Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  type="text" 
                  placeholder="Reason for contacting" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  required 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message">Your Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Please type your message here..." 
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
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Our Information</h2>
            <div className="space-y-5 text-foreground/80">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-primary/90">Email Us</h3>
                  <p className="text-sm">support@fossai.example.com (Placeholder)</p>
                  <a href="mailto:support@fossai.example.com" className="text-xs text-accent hover:underline">Send Email</a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-primary/90">Call Us (Placeholder)</h3>
                  <p className="text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
               <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-primary/90">Our Office (Placeholder)</h3>
                  <p className="text-sm">123 Innovation Drive, Tech City, TX 75001</p>
                </div>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-primary/90">Business Hours</h3>
                  <p className="text-sm">Monday - Friday: 9 AM - 6 PM (CST)</p>
                  <p className="text-sm">Saturday - Sunday: Closed</p>
                </div>
              </div>
            </div>
             <div className="mt-6 pt-6 border-t border-border/60">
                <h3 className="text-xl font-semibold text-primary mb-3">Connect with Us (Placeholder)</h3>
                 <div className="flex space-x-3">
                    <Button variant="outline" size="icon" onClick={() => toast({title: "Social Media Link", description:"This is a placeholder for X/Twitter."})}>
                        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => toast({title: "Social Media Link", description:"This is a placeholder for LinkedIn."})}>
                         <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                    </Button>
                 </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
