
'use client';

import NextLink from 'next/link';
import { BookText, UserPlus, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

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
        </div>
      </div>
    </nav>
  );
}
