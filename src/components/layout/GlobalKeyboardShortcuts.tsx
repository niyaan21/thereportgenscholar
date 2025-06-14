
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function GlobalKeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;

      if (modifierKey) {
        switch (event.key.toLowerCase()) {
          case 'k':
            if (pathname === '/') { // Only focus input if on the homepage
              event.preventDefault();
              const researchInput = document.getElementById('researchQuestion');
              researchInput?.focus();
            }
            // Could add a global command palette trigger here in the future
            break;
          case 'h':
            if (event.shiftKey) {
              event.preventDefault();
              router.push('/');
            }
            break;
          case 'd':
            if (event.shiftKey) {
              event.preventDefault();
              router.push('/dashboard');
            }
            break;
          case ',': // Cmd/Ctrl + Shift + , (often used for settings)
            if (event.shiftKey) {
              event.preventDefault();
              router.push('/account-settings');
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, pathname]);

  return null;
}
