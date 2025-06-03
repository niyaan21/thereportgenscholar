
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import { OrbitControls, Box as DreiBox, Sphere as DreiSphere } from '@react-three/drei'; // Using Drei for easier shapes

function SpinningBox(props: ThreeElements['mesh']) {
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
    <DreiBox
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      args={[1, 1, 1]} // Width, height, depth
    >
      <meshStandardMaterial color={hovered ? 'hotpink' : 'royalblue'} wireframe={false} />
    </DreiBox>
  );
}

function PulsingSphere(props: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!);
    useFrame(({ clock }) => {
        if (meshRef.current) {
            const time = clock.getElapsedTime();
            meshRef.current.scale.setScalar(Math.sin(time * 2) * 0.2 + 1);
        }
    });
    return (
        <DreiSphere {...props} ref={meshRef} args={[0.7, 32, 32]}>
            <meshStandardMaterial color="aquamarine" emissive="darkcyan" emissiveIntensity={0.3} metalness={0.6} roughness={0.2} />
        </DreiSphere>
    )
}

const Simple3DElement: React.FC<{className?: string}> = ({ className }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a placeholder or null while not mounted
    // to prevent SSR/hydration issues with the Canvas
    return (
      <div 
        className={className || "w-full h-64 md:h-96 rounded-lg shadow-lg border border-border/30 bg-muted/30 flex items-center justify-center"}
        aria-label="Loading 3D interactive element"
      >
        {/* You can add a more sophisticated loader here if needed */}
        {/* <Loader2 className="h-8 w-8 animate-spin text-primary" /> */}
      </div>
    );
  }

  return (
    <div className={className || "w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg border border-border/30"}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        <SpinningBox position={[-1.2, 0, 0]} />
        <PulsingSphere position={[1.2, 0, 0]} />
        
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
};

export default Simple3DElement;
