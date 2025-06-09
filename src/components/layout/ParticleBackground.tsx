
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import * as TSParticlesReact from '@tsparticles/react'; // Changed to @tsparticles/react
import type { Container, Engine } from '@tsparticles/engine'; // Import types from @tsparticles/engine
import { loadSlim } from '@tsparticles/slim'; // Corrected import path
import { useTheme } from 'next-themes';

const ParticleBackground: React.FC = () => {
  const [init, setInit] = useState(false);
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    // Use TSParticlesReact.initParticlesEngine
    TSParticlesReact.initParticlesEngine(async (engine: Engine) => {
      // console.log('Particles engine initializing');
      await loadSlim(engine); // loadSlim is called with the engine from initParticlesEngine
      // console.log('Slim bundle loaded into engine');
    }).then(() => {
      setInit(true);
      // console.log('Particles engine initialized successfully');
    }).catch((error) => {
      console.error("Error initializing particles engine:", error);
    });
  }, []);

  const particlesLoaded = useCallback(async (container?: Container) => {
    // console.log('Particles container loaded', container);
  }, []);

  const getCurrentTheme = () => {
    if (theme === 'system') {
      return systemTheme;
    }
    return theme;
  };

  const particleColor = getCurrentTheme() === 'dark' ? '#ffffff' : '#333333';
  const linkColor = getCurrentTheme() === 'dark' ? '#ffffff' : '#555555';


  if (!init) {
    return null;
  }

  return (
    // Use TSParticlesReact.Particles
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
              distance: 60, // Reduced from 80
              duration: 0.4,
            },
            push: {
                quantity: 1, // Reduced from 2
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
            opacity: 0.25, // Slightly reduced link opacity
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 0.6, // Slightly reduced speed
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 900, // Increased area for slightly less density
            },
            value: 60, // Reduced from 80
          },
          opacity: {
            value: 0.35, // Slightly reduced particle opacity
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 2.5 }, // Slightly smaller max size
          },
        },
        detectRetina: true,
        background: {
          color: 'transparent', // Ensure particles are on a transparent background layer
        },
      }}
      className="fixed top-0 left-0 w-full h-full z-[-1]" // Ensure it's behind other content
    />
  );
};

export default ParticleBackground;
