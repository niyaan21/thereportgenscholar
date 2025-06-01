
'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { BookText, UserPlus, Home, Palette, Settings, Moon, Sun, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const localTheme = localStorage.getItem('theme') as typeof theme | null;
    if (localTheme) {
      setThemeState(localTheme);
    } else {
      // Set initial theme based on system preference only if no theme is stored
      // This logic might be slightly different if `theme` state is also used to apply the class directly
      // For now, just setting the state for the dropdown
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light'); 
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else { 
      localStorage.removeItem('theme');
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  // The handleGoBack and isLoading logic would typically come from page props or context
  // For this example, I'll assume they are not part of the global navbar directly,
  // but a page could pass a 'showBackButton' prop if needed.
  // const showBackButton = pathname !== '/'; // Example logic

  return (
    <nav className="bg-background/80 backdrop-blur-md text-foreground shadow-lg sticky top-0 z-50 border-b border-border/60">
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
              ScholarAI
            </span>
          </a>
        </NextLink>

        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Example of a conditional back button, if logic were passed
          {showBackButton && (
            <Button 
              onClick={() => window.history.back()} // Or use Next.js router.back()
              variant="ghost" 
              size="icon"
              className="text-muted-foreground hover:bg-accent/15 hover:text-accent-foreground h-9 w-9 sm:h-10 sm:w-10 rounded-full"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
          */}
          <NextLink href="/" passHref legacyBehavior>
            <Button 
              variant={pathname === "/" ? "secondary" : "ghost"} 
              size="sm" 
              className={cn(
                "text-xs sm:text-sm",
                pathname === "/" && "font-semibold ring-2 ring-primary/50"
              )}
            >
              <Home className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Home
            </Button>
          </NextLink>
          <NextLink href="/signup" passHref legacyBehavior>
            <Button 
              variant={pathname === "/signup" ? "default" : "outline"} 
              size="sm" 
              className={cn(
                "text-xs sm:text-sm",
                 pathname === "/signup" ? "font-semibold ring-2 ring-primary/70" : "border-primary/60 text-primary hover:text-primary hover:bg-primary/10"
              )}
            >
              <UserPlus className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Sign Up
            </Button>
          </NextLink>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent/15 hover:text-accent-foreground h-9 w-9 sm:h-10 sm:w-10 rounded-full" aria-label="Theme settings">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-border/70 bg-popover shadow-xl rounded-lg p-1.5">
              <DropdownMenuLabel className="font-semibold text-popover-foreground px-2 py-1.5 text-sm">Appearance</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50 -mx-1 my-1" />
              <DropdownMenuItem onClick={() => setThemeState('light')} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                <Sun className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                <span>Light Mode</span>
                {theme === 'light' && <Check className="ml-auto h-4 w-4 text-accent" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setThemeState('dark')} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                <Moon className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                <span>Dark Mode</span>
                {theme === 'dark' && <Check className="ml-auto h-4 w-4 text-accent" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setThemeState('system')} className="cursor-pointer hover:bg-accent/15 focus:bg-accent/20 text-sm px-2 py-2 group flex items-center rounded-md">
                <Settings className="mr-2.5 h-4 w-4 text-muted-foreground transition-colors" />
                <span>System Default</span>
                {theme === 'system' && <Check className="ml-auto h-4 w-4 text-accent" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
