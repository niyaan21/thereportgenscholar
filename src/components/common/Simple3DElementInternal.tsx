
'use client';

import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import type { CanvasProps, ThreeElements } from '@react-three/fiber';
import type { OrbitControlsProps } from '@react-three/drei';

// Define types for the modules we'll import dynamically
type R3fModule = typeof import('@react-three/fiber');
type DreiModule = typeof import('@react-three/drei');

interface LoadedModules {
  Canvas: R3fModule['Canvas'];
  useFrame: R3fModule['useFrame'];
  OrbitControls: DreiModule['OrbitControls'];
  Box: DreiModule['Box'];
  Sphere: DreiModule['Sphere'];
}

const Simple3DElementInternal: React.FC<{ className?: string }> = ({ className }) => {
  const [modules, setModules] = useState<LoadedModules | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadModules = async () => {
      try {
        const r3f = await import('@react-three/fiber');
        const drei = await import('@react-three/drei');
        if (active) {
          setModules({
            Canvas: r3f.Canvas,
            useFrame: r3f.useFrame,
            OrbitControls: drei.OrbitControls,
            Box: drei.Box,
            Sphere: drei.Sphere,
          });
          setIsLoading(false);
        }
      } catch (err) {
        if (active) {
          console.error("Failed to load 3D modules", err);
          setError("Failed to initialize 3D experience. Please try refreshing the page.");
          setIsLoading(false);
        }
      }
    };
    loadModules();
    return () => { active = false; };
  }, []);

  if (isLoading) {
    return (
      <div className={className || "w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg border border-border/30 bg-muted/20 flex items-center justify-center"} aria-label="Loading 3D element...">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Initializing 3D Scene...</p>
      </div>
    );
  }

  if (error || !modules) {
    return (
      <div className={className || "w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg border border-destructive/30 bg-destructive/10 flex flex-col items-center justify-center text-destructive p-4"} aria-label="Error loading 3D element">
        <AlertTriangle className="h-10 w-10 mb-3" />
        <p className="font-semibold">3D Element Error</p>
        <p className="text-sm text-center">{error || "Could not load 3D components."}</p>
      </div>
    );
  }

  const { Canvas, useFrame, OrbitControls, Box, Sphere } = modules;

  // Define internal components that use the dynamically loaded modules
  const SpinningBoxComponent: React.FC<ThreeElements['mesh']> = (props) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    useFrame((_state, delta) => {
      if (meshRef.current) {
        meshRef.current.rotation.x += delta * 0.5;
        meshRef.current.rotation.y += delta * 0.7;
      }
    });

    return (
      <Box
        {...props}
        ref={meshRef}
        scale={active ? 1.5 : 1}
        onClick={() => setActive(!active)}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        args={[1, 1, 1]}
      >
        <meshStandardMaterial color={hovered ? 'hotpink' : 'royalblue'} wireframe={false} />
      </Box>
    );
  }

  const PulsingSphereComponent: React.FC<ThreeElements['mesh']> = (props) => {
      const meshRef = useRef<THREE.Mesh>(null!);
      useFrame(({ clock }) => {
          if (meshRef.current) {
              const time = clock.getElapsedTime();
              meshRef.current.scale.setScalar(Math.sin(time * 2) * 0.2 + 1);
          }
      });
      return (
          <Sphere {...props} ref={meshRef} args={[0.7, 32, 32]}>
              <meshStandardMaterial color="aquamarine" emissive="darkcyan" emissiveIntensity={0.3} metalness={0.6} roughness={0.2} />
          </Sphere>
      )
  }

  return (
    <div className={className || "w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg border border-border/30"}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        <Suspense fallback={
            <mesh>
                <boxGeometry args={[1,1,1]} />
                <meshStandardMaterial wireframe color="gray" />
            </mesh>
        }>
          <SpinningBoxComponent position={[-1.2, 0, 0]} />
          <PulsingSphereComponent position={[1.2, 0, 0]} />
        </Suspense>
        
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
};

export default Simple3DElementInternal;
