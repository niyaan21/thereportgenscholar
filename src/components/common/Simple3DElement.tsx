
'use client';

import React, { useRef, useState, Suspense } from 'react'; // Removed useEffect
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import { OrbitControls, Box as DreiBox, Sphere as DreiSphere } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

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
      args={[1, 1, 1]}
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

// The main component is now simpler as SSR handling is done by next/dynamic at the page level
const Simple3DElement: React.FC<{className?: string}> = ({ className }) => {
  return (
    <div className={className || "w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg border border-border/30"}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        <Suspense fallback={null}> {/* Suspense for any async operations within the Canvas if needed */}
          <SpinningBox position={[-1.2, 0, 0]} />
          <PulsingSphere position={[1.2, 0, 0]} />
        </Suspense>
        
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
};

export default Simple3DElement;
