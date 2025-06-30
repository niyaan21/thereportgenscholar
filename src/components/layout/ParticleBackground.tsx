
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import * as TSParticlesReact from '@tsparticles/react'; 
import type { Container, Engine } from '@tsparticles/engine'; 
import { loadSlim } from '@tsparticles/slim'; 
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';

const ParticleBackground: React.FC = () => {
  const [init, setInit] = useState(false);
  const { theme, systemTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isMobile) {
      if (init) setInit(false);
      return;
    }
    
    if (!init && !isMobile && isClient) {
        TSParticlesReact.initParticlesEngine(async (engine: Engine) => {
          await loadSlim(engine);
        }).then(() => {
          setInit(true);
        }).catch((error) => {
          console.error("Error initializing particles engine:", error);
        });
    }
  }, [isMobile, init, isClient]);

  const particlesLoaded = useCallback(async (container?: Container) => {
  }, []);

  const getCurrentTheme = () => {
    if (theme === 'system') {
      return systemTheme;
    }
    return theme;
  };

  const particleColor = getCurrentTheme() === 'dark' ? '#ffffff' : '#333333';
  const linkColor = getCurrentTheme() === 'dark' ? '#ffffff' : '#555555';


  if (!isClient || !init || isMobile) {
    return null;
  }

  return (
    <TSParticlesReact.Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={{
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
            },
            onClick: {
                enable: true,
                mode: 'push',
            }
          },
          modes: {
            repulse: {
              distance: 50, 
              duration: 0.4,
            },
            push: {
                quantity: 1, 
            }
          },
        },
        particles: {
          color: {
            value: particleColor,
          },
          links: {
            color: linkColor,
            distance: 150,
            enable: true,
            opacity: 0.25, 
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 0.6, 
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000, 
            },
            value: 50, 
          },
          opacity: {
            value: 0.35, 
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 2.5 }, 
          },
        },
        detectRetina: true,
        background: {
          color: 'transparent', 
        },
      }}
      className="fixed top-0 left-0 w-full h-full z-[-1]" 
    />
  );
};

export default ParticleBackground;
