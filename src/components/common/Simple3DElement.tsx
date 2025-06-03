'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// This component is a wrapper that ensures client-side mounting
// before dynamically importing the component with actual R3F logic.

const LoaderPlaceholder: React.FC<{className?: string}> = ({ className }) => (
  <div className={className || "w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg border border-border/30 bg-muted/20 flex items-center justify-center"} aria-label="Loading 3D element...">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Dynamically import the actual 3D component (Simple3DElementInternal)
// This internal component contains the R3F imports.
const Actual3DComponent = dynamic(() => import('./Simple3DElementInternal'), {
  ssr: false, 
  loading: () => <LoaderPlaceholder />,
});


const Simple3DElement: React.FC<{className?: string}> = ({ className }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a placeholder or null during SSR and initial client render before hydration.
    // The loading state of the dynamic import for Actual3DComponent will handle further loading.
    return <LoaderPlaceholder className={className} />;
  }

  // Actual3DComponent will only be rendered client-side after this wrapper has mounted.
  return <Actual3DComponent className={className} />;
};

export default Simple3DElement;
