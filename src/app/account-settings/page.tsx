
// src/app/account-settings/page.tsx
'use client';

import React, { useState, useEffect, FormEvent, useRef, ChangeEvent } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, sendEmailVerification, updatePassword, sendPasswordResetEmail, deleteUser, type User, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, UserCircle, Trash2, Palette, Bell, Settings2 as GeneralSettingsIcon, ShieldAlert, ExternalLink, Edit3, AlertCircle, CheckCircle2, Sun, Moon, History, UserRoundCog, FileText, BookOpen, ClockIcon, Search, FileSignature, Upload, Download, FileJson, Edit, Save, Settings as InterfaceSettingsIcon, Languages, Globe, MicVocal } from 'lucide-react';
import NextLink from 'next/link';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { getResearchHistory, setResearchHistory, type ResearchActivityItem } from '@/lib/historyService';
import { getVoiceNotes, deleteVoiceNote, updateVoiceNote, type VoiceNote } from '@/lib/voiceNotesService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/textarea';


const SettingsSection: React.FC<{ title: string; description?: string; icon?: React.ElementType; children: React.ReactNode; className?: string }> = ({ title, description, icon: Icon, children, className }) => (
  <Card className={cn("w-full shadow-lg border-border/60 hover:border-primary/40 transition-colors duration-300", className)}>
    <CardHeader className="pb-4">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="h-6 w-6 text-primary" />}
        <CardTitle className="text-xl font-semibold text-primary">{title}</CardTitle>
      </div>
      {description && <CardDescription className="mt-1 text-sm">{description}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
);


export default function AccountSettingsPage() {
  const { t, i18n } = useTranslation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPasswordForDelete, setCurrentPasswordForDelete] = useState('');
  
  const [displayName, setDisplayName] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const [activeTab, setActiveTab] = useState("general");
  
  const [researchHistoryItems, setResearchHistoryItems] = useState<ResearchActivityItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportConfirmDialog, setShowImportConfirmDialog] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<ResearchActivityItem[] | null>(null);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newsletterSubscription, setNewsletterSubscription] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [experimentalFeatures, setExperimentalFeatures] = useState(false);
  const [isSavingInterface, setIsSavingInterface] = useState(false);
  
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [editingNote, setEditingNote] = useState<VoiceNote | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setDisplayName(user.displayName || '');
        setProfilePicUrl(user.photoURL || '');

        const localTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        if (localTheme) setThemeState(localTheme);
        else {
            const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setThemeState(prefersDark ? 'dark' : 'system');
        }
        
        const storedEmailNotifications = localStorage.getItem('emailNotifications');
        if (storedEmailNotifications) setEmailNotifications(JSON.parse(storedEmailNotifications));
        const storedNewsletter = localStorage.getItem('newsletterSubscription');
        if (storedNewsletter) setNewsletterSubscription(JSON.parse(storedNewsletter));

        const storedItemsPerPage = localStorage.getItem('itemsPerPage');
        if (storedItemsPerPage) setItemsPerPage(storedItemsPerPage);
        const storedExperimentalFeatures = localStorage.getItem('experimentalFeatures');
        if (storedExperimentalFeatures) setExperimentalFeatures(JSON.parse(storedExperimentalFeatures));

        if (typeof window !== 'undefined') {
          const hash = window.location.hash.substring(1);
          if (hash === "history" || hash === "voice-notes") {
             if (activeTab !== "data-management") {
              setActiveTab("data-management");
            }
          }
          setResearchHistoryItems(getResearchHistory());
          setVoiceNotes(getVoiceNotes());
        }
      } else {
        router.push('/login'); 
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router, activeTab]); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const hash = window.location.hash.substring(1);
        if (activeTab === "data-management") {
          // You might want to scroll to a specific sub-section here if needed
          if (hash !== "history" && hash !== "voice-notes") {
             window.history.replaceState(null, '', "/account-settings#history");
          }
          setResearchHistoryItems(getResearchHistory());
          setVoiceNotes(getVoiceNotes());
        } else if (hash === "history" || hash === "voice-notes") { 
            window.history.replaceState(null, '', "/account-settings");
        }
    }
  }, [activeTab]);


  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.removeItem('theme');
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    toast({ title: "Theme Updated", description: `Switched to ${newTheme} theme.`, variant: 'default' });
  };

  const handleLanguageChange = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage);
    toast({
      title: t('languageChangeToastTitle'),
      description: t('languageChangeToastDescription', { language: t(`lang_${newLanguage}` as any) }),
      variant: 'default',
    });
  };

  const handleSendVerificationEmail = async () => {
    if (currentUser && !currentUser.emailVerified) {
      setIsLoading(true);
      try {
        await sendEmailVerification(currentUser);
        toast({ title: 'Verification Email Sent', description: 'Please check your inbox to verify your email address.', variant: 'default' });
      } catch (error: any) {
        toast({ title: 'Error Sending Verification Email', description: error.message, variant: 'destructive' });
      }
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (newPassword !== confirmNewPassword) {
      toast({ title: 'Password Mismatch', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Weak Password', description: 'Password should be at least 6 characters long.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      await updatePassword(currentUser, newPassword);
      toast({ title: 'Password Updated', description: 'Your password has been changed successfully.', variant: 'default' });
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'This operation is sensitive and requires recent authentication. Please log out and log back in to change your password.';
      }
      toast({ title: 'Error Updating Password', description: errorMessage, variant: 'destructive' });
    }
    setIsLoading(false);
  };

  const handleSendPasswordResetEmail = async () => {
    if (currentUser && currentUser.email) {
      setIsLoading(true);
      try {
        await sendPasswordResetEmail(auth, currentUser.email);
        toast({ title: 'Password Reset Email Sent', description: 'Please check your inbox to reset your password.', variant: 'default' });
      } catch (error: any) {
        toast({ title: 'Error Sending Password Reset', description: error.message, variant: 'destructive' });
      }
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    if (!currentPasswordForDelete) {
        toast({ title: 'Password Required', description: 'Please enter your current password to delete your account.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    try {
        const credential = EmailAuthProvider.credential(currentUser.email!, currentPasswordForDelete);
        await reauthenticateWithCredential(currentUser, credential);
        await deleteUser(currentUser);
        toast({ title: 'Account Deleted', description: 'Your account has been successfully deleted.', variant: 'default' });
        router.push('/signup'); 
    } catch (error: any) {
        let errMsg = "Failed to delete account. Please try again.";
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errMsg = "Incorrect password. Please verify your current password.";
        } else if (error.code === 'auth/requires-recent-login') {
            errMsg = "This operation requires a recent login. Please log out and log back in to delete your account.";
        } else {
            errMsg = error.message;
        }
        toast({ title: 'Error Deleting Account', description: errMsg, variant: 'destructive' });
    } finally {
        setIsLoading(false);
        setCurrentPasswordForDelete(''); 
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsUpdatingProfile(true);
    try {
        await updateProfile(currentUser, {
            displayName: displayName,
            photoURL: profilePicUrl,
        });
        toast({ title: "Profile Updated", description: "Your display name and profile picture URL have been updated.", variant: "default" });
    } catch (error: any) {
        toast({ title: "Profile Update Failed", description: error.message, variant: "destructive" });
    } finally {
        setIsUpdatingProfile(false);
    }
  };

  const handleSaveNotificationPreferences = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingNotifications(true);
    await new Promise(resolve => setTimeout(resolve, 700));
    try {
        localStorage.setItem('emailNotifications', JSON.stringify(emailNotifications));
        localStorage.setItem('newsletterSubscription', JSON.stringify(newsletterSubscription));
        toast({ title: "Notification Preferences Saved", description: "Your notification settings have been saved locally.", variant: "default" });
    } catch (error: any) {
        toast({ title: "Save Failed", description: "Could not save notification preferences to local storage.", variant: "destructive" });
    } finally {
        setIsSavingNotifications(false);
    }
  };
  
  const handleSaveInterfaceSettings = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingInterface(true);
    await new Promise(resolve => setTimeout(resolve, 700));
    try {
        localStorage.setItem('itemsPerPage', itemsPerPage);
        localStorage.setItem('experimentalFeatures', JSON.stringify(experimentalFeatures));
        toast({ title: "Interface Settings Saved", description: "Your interface settings have been saved locally.", variant: "default" });
    } catch (error: any) {
        toast({ title: "Save Failed", description: "Could not save interface settings to local storage.", variant: "destructive" });
    } finally {
        setIsSavingInterface(false);
    }
  };


  const handleExportHistory = () => {
    const history = getResearchHistory();
    if (history.length === 0) {
      toast({ title: "No History to Export", description: "Your research history is currently empty.", variant: "default" });
      return;
    }
    const jsonString = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fossai_research_history.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "History Exported", description: "Your research history has been downloaded.", variant: "default" });
  };

  const handleImportHistoryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const importedData = JSON.parse(text) as ResearchActivityItem[];
        if (!Array.isArray(importedData) || !importedData.every(item => item.id && item.type && item.question && item.date)) {
          throw new Error("Invalid history file format.");
        }
        setPendingImportData(importedData);
        setShowImportConfirmDialog(true);
      } catch (error: any) {
        toast({ title: "Import Failed", description: `Error processing file: ${error.message}`, variant: "destructive" });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      toast({ title: "Import Failed", description: "Could not read the selected file.", variant: "destructive" });
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };
  
  const confirmImport = () => {
    if (pendingImportData) {
      setResearchHistory(pendingImportData);
      setResearchHistoryItems(getResearchHistory());
      toast({ title: "History Imported", description: "Your research history has been replaced.", variant: "default" });
    }
    setShowImportConfirmDialog(false);
    setPendingImportData(null);
  };

  const handleViewHistoryDetails = (item: ResearchActivityItem) => {
    let detailText = `Type: ${item.type}\nQuestion/Guidance: ${item.question}`;
    if (item.reportTitle) {
      detailText += `\nReport Title: ${item.reportTitle}`;
    }
    if (item.executiveSummarySnippet) {
      detailText += `\nSummary Snippet: ${item.executiveSummarySnippet}`;
    } else {
      detailText += `\n(No detailed summary snippet stored for this item type)`;
    }
    toast({
      title: `History Item: ${item.reportTitle || item.question.substring(0,30)+'...'}`,
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
          <code className="text-white text-xs whitespace-pre-wrap">{detailText}</code>
        </pre>
      ),
      duration: 10000,
    });
  };

  const handleStartEditNote = (note: VoiceNote) => {
    setEditingNote(note);
    setEditingNoteContent(note.content);
  };

  const handleCancelEditNote = () => {
    setEditingNote(null);
    setEditingNoteContent('');
  };

  const handleUpdateNote = () => {
    if (editingNote) {
      const newNotes = updateVoiceNote({ ...editingNote, content: editingNoteContent });
      setVoiceNotes(newNotes);
      toast({ title: "Note Updated", variant: "default" });
      handleCancelEditNote();
    }
  };

  const handleDeleteNote = (id: string) => {
    const newNotes = deleteVoiceNote(id);
    setVoiceNotes(newNotes);
    toast({ title: "Note Deleted", variant: "default" });
  };


  if (isLoading || !currentUser) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 sm:mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">{t('accountSettingsTitle')}</h1>
        <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('accountSettingsDescription')}
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 md:max-w-md mx-auto h-auto">
          <TabsTrigger value="general" className="py-2.5 text-sm sm:text-base flex items-center gap-2">
            <UserRoundCog className="h-5 w-5" /> {t('generalTab')}
          </TabsTrigger>
          <TabsTrigger value="data-management" className="py-2.5 text-sm sm:text-base flex items-center gap-2">
            <History className="h-5 w-5" /> {t('dataManagementTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 sm:mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <SettingsSection title="Email & Verification" icon={Mail} description="Manage your primary email address and verification status.">
                <div className="space-y-3">
                    <Label htmlFor="currentEmail">Current Email Address</Label>
                    <Input id="currentEmail" type="email" value={currentUser.email || ''} readOnly disabled className="bg-muted/50 cursor-not-allowed"/>
                </div>
                {currentUser.emailVerified ? (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-md">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">Your email address is verified.</p>
                  </div>
                ) : (
                  <div className="space-y-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 rounded-md">
                    <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                        Your email address is not verified. Please verify to ensure full account functionality.
                        </p>
                    </div>
                    <Button onClick={handleSendVerificationEmail} variant="outline" size="sm" disabled={isLoading} className="border-yellow-500 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-500 dark:text-yellow-300 dark:hover:bg-yellow-700/50">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Mail className="mr-2 h-4 w-4"/>}
                      Resend Verification Email
                    </Button>
                  </div>
                )}
              </SettingsSection>

              <SettingsSection title="Password Management" icon={Lock} description="Update your password or send a reset link if you've forgotten it.">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password (min. 6 characters)" required />
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Confirm new password" required />
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Edit3 className="mr-2 h-4 w-4"/>}
                    Change Password
                  </Button>
                </form>
                <Separator className="my-4"/>
                <Button onClick={handleSendPasswordResetEmail} variant="outline" className="w-full sm:w-auto" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ExternalLink className="mr-2 h-4 w-4"/>}
                  Send Password Reset Email
                </Button>
              </SettingsSection>
              
              <SettingsSection title="Account Deletion" icon={Trash2} description="Permanently delete your Foss AI account and all associated data. This action is irreversible.">
                 <p className="text-sm text-destructive/90 bg-destructive/10 p-3 rounded-md border border-destructive/30">
                    <ShieldAlert className="inline h-4 w-4 mr-1.5 mb-0.5"/>Warning: This action cannot be undone. All your research history and settings will be lost.
                 </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4"/>}
                      Delete My Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers. Please enter your current password to confirm.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <Label htmlFor="currentPasswordForDelete" className="sr-only">Current Password</Label>
                        <Input
                            id="currentPasswordForDelete"
                            type="password"
                            placeholder="Enter your current password"
                            value={currentPasswordForDelete}
                            onChange={(e) => setCurrentPasswordForDelete(e.target.value)}
                            className="border-destructive/50 focus:border-destructive"
                        />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} disabled={isLoading || !currentPasswordForDelete} className="bg-destructive hover:bg-destructive/90">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        Yes, Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SettingsSection>
            </div>

            <div className="lg:col-span-1 space-y-6 sm:space-y-8">
              <SettingsSection title="Profile Information" icon={UserCircle} description="Customize your public profile details.">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your Name" disabled={isUpdatingProfile}/>
                    </div>
                    <div>
                      <Label htmlFor="profilePicUrl">Profile Picture URL</Label>
                      <Input id="profilePicUrl" type="url" value={profilePicUrl} onChange={(e) => setProfilePicUrl(e.target.value)} placeholder="https://example.com/image.png" disabled={isUpdatingProfile}/>
                    </div>
                    <Button type="submit" disabled={isUpdatingProfile} className="w-full sm:w-auto">
                      {isUpdatingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                      Save Profile
                    </Button>
                </form>
              </SettingsSection>

              <SettingsSection title="Appearance" icon={Palette} description="Choose how Foss AI looks and feels.">
                 <Label className="text-base">Theme</Label>
                 <RadioGroup value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => handleThemeChange(value)} className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
                    <div>
                      <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
                      <Label htmlFor="theme-light" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                        <Sun className="mb-1.5 h-5 w-5" /> Light
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
                      <Label htmlFor="theme-dark" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                        <Moon className="mb-1.5 h-5 w-5" /> Dark
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
                      <Label htmlFor="theme-system" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                        <GeneralSettingsIcon className="mb-1.5 h-5 w-5" /> System
                      </Label>
                    </div>
                </RadioGroup>
              </SettingsSection>
              
              <SettingsSection title={t('languageRegionSectionTitle')} icon={Globe} description={t('languageRegionDescription')}>
                <div className="space-y-3">
                    <div>
                        <Label htmlFor="language">{t('interfaceLanguageLabel')}</Label>
                        <Select onValueChange={handleLanguageChange} value={i18n.language}>
                            <SelectTrigger id="language" className="w-full">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">{t('lang_en')}</SelectItem>
                                <SelectItem value="es">{t('lang_es')}</SelectItem>
                                <SelectItem value="fr">{t('lang_fr')}</SelectItem>
                                <SelectItem value="de">{t('lang_de')}</SelectItem>
                                <SelectItem value="ja">{t('lang_ja')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
              </SettingsSection>

              <SettingsSection title="Notification Preferences" icon={Bell} description="Control how you receive updates. Saved locally.">
                <form onSubmit={handleSaveNotificationPreferences} className="space-y-4">
                    <div className="flex items-center justify-between space-x-2 py-2">
                      <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                        <span>Email Notifications</span>
                        <span className="font-normal leading-snug text-muted-foreground text-xs">
                          Receive important updates about your account and new features.
                        </span>
                      </Label>
                      <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} disabled={isSavingNotifications}/>
                    </div>
                    <div className="flex items-center justify-between space-x-2 py-2">
                      <Label htmlFor="newsletter-subscription" className="flex flex-col space-y-1">
                        <span>Foss AI Newsletter</span>
                        <span className="font-normal leading-snug text-muted-foreground text-xs">
                          Subscribe to our monthly newsletter for tips and insights.
                        </span>
                      </Label>
                      <Switch id="newsletter-subscription" checked={newsletterSubscription} onCheckedChange={setNewsletterSubscription} disabled={isSavingNotifications}/>
                    </div>
                    <Button type="submit" className="w-full sm:w-auto mt-2" disabled={isSavingNotifications}>
                      {isSavingNotifications ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                       Save Notifications
                    </Button>
                </form>
              </SettingsSection>

              <SettingsSection title="Interface Settings" icon={InterfaceSettingsIcon} description="Customize your Foss AI experience. Saved locally.">
                <form onSubmit={handleSaveInterfaceSettings} className="space-y-4">
                    <div>
                        <Label htmlFor="itemsPerPage">Items Per Page (e.g., in results)</Label>
                        <Input id="itemsPerPage" type="number" value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)} placeholder="10" min="5" max="50" disabled={isSavingInterface}/>
                    </div>
                    <div className="flex items-center justify-between space-x-2 py-2">
                      <Label htmlFor="experimental-features" className="flex flex-col space-y-1">
                        <span>Experimental Features</span>
                        <span className="font-normal leading-snug text-muted-foreground text-xs">
                          Enable cutting-edge features that are still in testing.
                        </span>
                      </Label>
                      <Switch id="experimental-features" checked={experimentalFeatures} onCheckedChange={setExperimentalFeatures} disabled={isSavingInterface}/>
                    </div>
                    <Button type="submit" className="w-full sm:w-auto mt-2" disabled={isSavingInterface}>
                       {isSavingInterface ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                       Save Interface Settings
                    </Button>
                </form>
              </SettingsSection>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data-management" className="mt-6 sm:mt-8">
            <SettingsSection 
                title="Your Research Journey" 
                icon={History} 
                description="Review, export, or import your past research activity stored locally in your browser."
                className="mb-8"
                id="history"
            >
                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 pt-2">
                    <Button onClick={handleExportHistory} variant="outline" className="w-full sm:w-auto" disabled={researchHistoryItems.length === 0}>
                        <Download className="mr-2 h-4 w-4" /> Export History
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".json" className="hidden" />
                    <Button onClick={handleImportHistoryClick} variant="outline" className="w-full sm:w-auto" disabled={isImporting}>
                        {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Import History
                    </Button>
                </div>
                 <Separator className="mb-6"/>
                {researchHistoryItems.length > 0 ? (
                    <div className="space-y-4">
                        {researchHistoryItems.map((item) => {
                          let itemIcon = <Search className="inline h-5 w-5 mr-2.5 text-accent"/>;
                          if (item.type === 'report-generation') itemIcon = <BookOpen className="inline h-5 w-5 mr-2.5 text-accent"/>;
                          if (item.type === 'file-report-generation') itemIcon = <FileSignature className="inline h-5 w-5 mr-2.5 text-accent"/>;
                          
                          const displayTitle = item.reportTitle || item.question;
                          const displaySnippet = item.executiveSummarySnippet || (item.type !== 'query-formulation' ? 'Report generated.' : 'Query formulated.');

                          return (
                            <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow border-border/70">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-medium text-primary truncate" title={displayTitle}>
                                        {itemIcon}
                                        {displayTitle.length > 80 ? `${displayTitle.substring(0, 80)}...` : displayTitle}
                                    </CardTitle>
                                    <CardDescription className="text-xs flex items-center text-muted-foreground">
                                        <ClockIcon className="inline h-3.5 w-3.5 mr-1.5"/>
                                        Initiated on: {new Date(item.date).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2" title={displaySnippet}>
                                        {displaySnippet}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="ml-auto text-xs"
                                        onClick={() => handleViewHistoryDetails(item)}
                                    >
                                        View Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                        })}
                         <p className="text-xs text-muted-foreground mt-6 text-center">
                            Note: This history is stored in your browser and will be lost if you clear your browser data (unless exported). Max {50} items.
                        </p>
                    </div>
                ) : (
                    <div className="min-h-[250px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border/60 rounded-lg bg-secondary/30 dark:bg-secondary/10">
                        <FileText className="h-16 w-16 text-muted-foreground/70 mb-4" />
                        <h3 className="text-xl font-semibold text-primary/90 mb-2">No History... Yet!</h3>
                        <p className="text-muted-foreground max-w-md">
                            Your past research sessions will appear here once you start exploring. This data is stored locally in your browser.
                        </p>
                        <Button asChild className="mt-6">
                            <NextLink href="/">Start New Research</NextLink>
                        </Button>
                    </div>
                )}
                 <AlertDialog open={showImportConfirmDialog} onOpenChange={setShowImportConfirmDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Confirm History Import</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will <span className="font-semibold text-destructive">replace</span> your current local research history with the content of the selected file. This action cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingImportData(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmImport}>Yes, Replace History</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SettingsSection>
            
            <Separator className="my-10" />

            <SettingsSection
                title="Your Voice Notes"
                icon={MicVocal}
                description="Manage your voice notes. These are stored locally in your browser."
                id="voice-notes"
            >
                {editingNote ? (
                  <Card className="p-4 shadow-inner">
                    <CardTitle className="text-lg mb-2">Editing Note</CardTitle>
                    <Textarea 
                      value={editingNoteContent} 
                      onChange={(e) => setEditingNoteContent(e.target.value)} 
                      rows={6}
                      className="mb-3"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={handleCancelEditNote}>Cancel</Button>
                      <Button onClick={handleUpdateNote}>Save Changes</Button>
                    </div>
                  </Card>
                ) : voiceNotes.length > 0 ? (
                    <div className="space-y-4">
                        {voiceNotes.map(note => (
                             <Card key={note.id} className="shadow-md hover:shadow-lg transition-shadow border-border/70">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-medium text-primary truncate" title={note.title}>{note.title}</CardTitle>
                                    <CardDescription className="text-xs flex items-center text-muted-foreground">
                                        <ClockIcon className="inline h-3.5 w-3.5 mr-1.5"/>
                                        Saved on: {new Date(note.date).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-4">
                                     <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3" title={note.content}>
                                        {note.content}
                                    </p>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleStartEditNote(note)}>
                                        <Edit className="h-4 w-4 mr-1.5" /> Edit
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This will permanently delete "{note.title}".</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>Delete Note</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="min-h-[200px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border/60 rounded-lg bg-secondary/30 dark:bg-secondary/10">
                        <MicVocal className="h-16 w-16 text-muted-foreground/70 mb-4" />
                        <h3 className="text-xl font-semibold text-primary/90 mb-2">No Voice Notes Yet</h3>
                        <p className="text-muted-foreground max-w-md">
                            Create voice notes from the "Notes & Transcription" page. They will appear here for you to manage.
                        </p>
                        <Button asChild className="mt-6">
                            <NextLink href="/notes">Go to Notes Page</NextLink>
                        </Button>
                    </div>
                )}
            </SettingsSection>
        </TabsContent>
      </Tabs>

      <CardFooter className="mt-10 sm:mt-12 text-center border-t pt-6 text-xs text-muted-foreground">
        <p className="mx-auto">
          Need help? Visit our <NextLink href="/docs" className="text-accent hover:underline">Documentation</NextLink> or <NextLink href="/contact" className="text-accent hover:underline">Contact Support</NextLink>.
        </p>
      </CardFooter>
    </div>
  );
}
