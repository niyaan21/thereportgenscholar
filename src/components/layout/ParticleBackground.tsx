
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Particles, { type Container, type Engine } from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim'; 
import { useTheme } from 'next-themes'; // Using next-themes if available, or adapt to your theme context

const ParticleBackground: React.FC = () => {
  const [init, setInit] = useState(false);
  const { theme, systemTheme } = useTheme(); // Or your app's theme context

  useEffect(() => {
    loadSlim(async (engine: Engine) => {
      // console.log('Particles engine loaded', engine);
    }).then(() => {
      setInit(true);
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
  constlinkColor = getCurrentTheme() === 'dark' ? '#ffffff' : '#555555';


  if (!init) {
    return null;
  }

  return (
    <Particles
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
              distance: 80,
              duration: 0.4,
            },
            push: {
                quantity: 2,
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
            opacity: 0.2,
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 0.7,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000,
            },
            value: 50, // Reduced number of particles
          },
          opacity: {
            value: 0.3, // Slightly more visible particles
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 3 }, // Slightly larger particles
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
