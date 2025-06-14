
'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { BookText, UserPlus, LogIn, Home, Palette, Settings, Moon, Sun, Check, LogOut, Info, BookOpenText, Code2, Menu, X as CloseIcon, UserCircle, ChevronDown, Sparkles, FileText as FeaturesIcon, Settings2 as AccountSettingsIcon, LayoutDashboard, DollarSign, MessageSquare, UploadCloud as FileReportIcon, BrainCircuit as MindMapIcon, AudioLines, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,

} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme, systemTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      setMobileMenuOpen(false); 
      router.push('/'); 
    } catch (error) {
      console.error("Logout Error:", error);
      toast({ title: "Logout Failed", description: "Could not log you out. Please try again.", variant: "destructive" });
    }
  };

  const commonNavLinksBase = [
    { href: "/", label: "Home", icon: Home },
    { href: "/file-report", label: "File Report", icon: FileReportIcon },
    { href: "/mindmap", label: "Mind Map", icon: MindMapIcon }, 
    { href: "/voice-notes", label: "Voice Notes", icon: Mic },
    { href: "/interview-transcription", label: "Transcription", icon: AudioLines },
    { href: "/features", label: "Features", icon: Sparkles },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
    { href: "/about", label: "About", icon: Info },
    { href: "/docs", label: "Docs", icon: BookOpenText },
    { href: "/contact", label: "Contact", icon: MessageSquare },
  ];
  
  const commonNavLinks = currentUser
    ? [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, ...commonNavLinksBase]
    : commonNavLinksBase;
  
  const NavLinkItem = React.memo(function NavLinkItem({ href, label, icon: Icon, onClick }: { href: string; label: string; icon: React.ElementType; onClick?: () => void }) {
    return (
      <NextLink href={href} passHref legacyBehavior>
        <Button
          variant={pathname === href ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "text-xs sm:text-sm w-full justify-start sm:w-auto",
            pathname === href && "font-semibold ring-1 sm:ring-2 ring-primary/50"
          )}
          onClick={onClick}
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </NextLink>
    );
  });
  NavLinkItem.displayName = "NavLinkItem";
  
  const AuthButtons: React.FC<{ isMobile?: boolean; onLinkClick?: () => void }> = React.memo(function AuthButtons({ isMobile, onLinkClick }) {
    return (
        <>
        {!currentUser && !authLoading && (
            <>
            <NextLink href="/login" passHref legacyBehavior>
                <Button 
                variant={pathname === "/login" ? "default" : "outline"} 
                size="sm" 
                className={cn("text-xs sm:text-sm", pathname === "/login" && "font-semibold", isMobile && "w-full justify-start")}
                onClick={onLinkClick}
                >
                <LogIn className="mr-1.5 sm:mr-2 h-4 w-4" /> Login
                </Button>
            </NextLink>
            <NextLink href="/signup" passHref legacyBehavior>
                <Button 
                variant={pathname === "/signup" ? "default" : "primary"} 
                size="sm" 
                className={cn("text-xs sm:text-sm", pathname === "/signup" && "font-semibold", isMobile && "w-full justify-start")}
                onClick={onLinkClick}
                >
                <UserPlus className="mr-1.5 sm:mr-2 h-4 w-4" /> Sign Up
                </Button>
            </NextLink>
            </>
        )}
        {currentUser && (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={cn("text-xs sm:text-sm flex items-center gap-2", isMobile && "w-full justify-start")}>
                <UserCircle className="h-5 w-5" />
                <span className="truncate max-w-[100px] sm:max-w-[150px]">{currentUser.displayName || currentUser.email || "Profile"}</span>
                <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{currentUser.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                <NextLink href="/dashboard" onClick={onLinkClick}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </NextLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                <NextLink href="/account-settings" onClick={onLinkClick}>
                    <AccountSettingsIcon className="mr-2 h-4 w-4" /> Account Settings
                </NextLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { handleLogout(); onLinkClick?.(); }} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        )}
        {authLoading && (
            <div className="flex items-center space-x-2">
                <div className="h-7 w-16 bg-muted/50 rounded-md animate-pulse"></div>
                <div className="h-7 w-20 bg-muted/50 rounded-md animate-pulse"></div>
            </div>
        )}
        </>
    );
  });
  AuthButtons.displayName = "AuthButtons";
  
  const ThemeSwitcherDropdown: React.FC<{ isMobile?: boolean; onLinkClick?: () => void }> = React.memo(function ThemeSwitcherDropdown({ isMobile, onLinkClick }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={isMobile ? "sm" : "icon"} className={cn("text-muted-foreground hover:bg-accent/15 hover:text-accent-foreground", isMobile ? "w-full justify-start" : "h-9 w-9 sm:h-10 sm:w-10 rounded-full")} aria-label="Theme settings">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5" /> {isMobile && <span className="ml-2">Theme</span>}
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-border/70 bg-popover shadow-xl rounded-lg p-1.5">
            <DropdownMenuLabel className="font-semibold text-popover-foreground px-2 py-1.5 text-sm">Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50 -mx-1 my-1" />
            <DropdownMenuItem onClick={() => { setTheme('light'); onLinkClick?.(); }} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                <Sun className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                <span>Light Mode</span>
                {theme === 'light' && <Check className="ml-auto h-4 w-4 text-accent" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setTheme('dark'); onLinkClick?.(); }} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                <Moon className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                <span>Dark Mode</span>
                {theme === 'dark' && <Check className="ml-auto h-4 w-4 text-accent" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setTheme('system'); onLinkClick?.(); }} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                <Settings className="mr-2.5 h-4 w-4 text-muted-foreground transition-colors" />
                <span>System Default</span>
                {theme === 'system' && <Check className="ml-auto h-4 w-4 text-accent" />}
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
  });
  ThemeSwitcherDropdown.displayName = "ThemeSwitcherDropdown";


  return (
    <nav className="bg-background/80 backdrop-blur-md text-foreground shadow-xl sticky top-0 z-50 border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <NextLink href="/" passHref legacyBehavior>
          <a className="flex items-center space-x-2.5 group">
            <div className={cn(
                "p-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center",
                pathname === "/" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary"
            )}>
              <BookText className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className={cn(
                "text-lg sm:text-xl font-bold transition-colors duration-200",
                 pathname === "/" ? "text-primary" : "text-foreground group-hover:text-primary"
            )}>
              Foss AI
            </span>
          </a>
        </NextLink>

        <div className="hidden lg:flex items-center space-x-1">
          {commonNavLinks.map(link => <NavLinkItem key={link.href} {...link} />)}
        </div>

        <div className="hidden lg:flex items-center space-x-2">
          <AuthButtons />
          <ThemeSwitcherDropdown />
        </div>

        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0 bg-background flex flex-col">
              <SheetHeader className="p-4 border-b border-border/60">
                <SheetTitle>
                   <NextLink href="/" passHref legacyBehavior>
                      <a className="flex items-center space-x-2.5 group" onClick={() => setMobileMenuOpen(false)}>
                        <div className="p-2 rounded-md bg-primary text-primary-foreground">
                          <BookText className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold text-primary">Foss AI Menu</span>
                      </a>
                    </NextLink>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col space-y-2 px-4 py-4 flex-grow overflow-y-auto">
                {commonNavLinks.map(link => <NavLinkItem key={link.href} {...link} onClick={() => setMobileMenuOpen(false)} />)}
                <DropdownMenuSeparator className="my-2" />
                <NavLinkItem href="/api-docs" label="API Docs" icon={Code2} onClick={() => setMobileMenuOpen(false)} />
              </div>
              <div className="mt-auto p-4 border-t border-border/60 space-y-3">
                <AuthButtons isMobile onLinkClick={() => setMobileMenuOpen(false)} />
                <ThemeSwitcherDropdown isMobile onLinkClick={() => setMobileMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
