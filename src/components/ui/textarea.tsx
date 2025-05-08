import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border border-input bg-background/80 px-4 py-3.5 text-base ring-offset-background placeholder:text-muted-foreground/70 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-sm hover:border-primary/60 focus:shadow-lg focus:shadow-accent/25 text-lg leading-relaxed', // Enhanced styles
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
