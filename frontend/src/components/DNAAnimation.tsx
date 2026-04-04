import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const DNASpiral = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create DNA structure data
  const particles = useMemo(() => {
    const temp = [];
    const numPairs = 40;
    const radius = 1.5;
    const heightSpacing = 0.3;
    const angleOffset = Math.PI;

    for (let i = 0; i < numPairs; i++) {
      const y = (i - numPairs / 2) * heightSpacing;
      const angle = i * 0.3;

      // Position for strand 1
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      // Position for strand 2
      const x2 = Math.cos(angle + angleOffset) * radius;
      const z2 = Math.sin(angle + angleOffset) * radius;

      // Generate a color gradient mix between light blue, pink, and violet
      const progress = i / numPairs;
      const color1 = new THREE.Color().lerpColors(
        new THREE.Color('#7dd3fc'), // light blue
        new THREE.Color('#f472b6'), // pink
        progress
      );
      const color2 = new THREE.Color().lerpColors(
        new THREE.Color('#f472b6'), // pink
        new THREE.Color('#c084fc'), // violet
        progress
      );

      temp.push({
        p1: [x1, y, z1],
        p2: [x2, y, z2],
        color1: color1,
        color2: color2,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Slow vertical rotation
    groupRef.current.rotation.y = time * 0.2;
    
    // Slight wave motion (sinusoidal)
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    
    // Heartbeat pulse effect (scale animation)
    const pulse = 1 + Math.sin(time * 3) * 0.02 + Math.sin(time * 6) * 0.01;
    groupRef.current.scale.set(pulse, pulse, pulse);

    // Mouse movement parallax
    const targetX = (state.pointer.x * Math.PI) / 10;
    const targetY = (state.pointer.y * Math.PI) / 10;
    
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.z += (-targetX - groupRef.current.rotation.z) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {particles.map((pair, i) => (
        <group key={i}>
          {/* Node 1 */}
          <mesh position={pair.p1 as [number, number, number]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial 
              color={pair.color1} 
              emissive={pair.color1}
              emissiveIntensity={0.4}
              roughness={0.2} 
              metalness={0.1} 
            />
          </mesh>
          
          {/* Node 2 */}
          <mesh position={pair.p2 as [number, number, number]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial 
              color={pair.color2} 
              emissive={pair.color2}
              emissiveIntensity={0.4}
              roughness={0.2} 
              metalness={0.1} 
            />
          </mesh>
          
          {/* Connecting Bond */}
          <mesh position={[0, pair.p1[1], 0]} rotation={[0, -i * 0.3, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
            <meshStandardMaterial color="#e2e8f0" transparent opacity={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const DNAAnimation = () => {
  return (
    <group>
      <DNASpiral />
      {/* Background Particles for Light Theme */}
      <Sparkles 
        count={150} 
        scale={12} 
        size={2} 
        speed={0.2} 
        color="#94a3b8" 
        opacity={0.4} 
      />
      <Sparkles 
        count={50} 
        scale={10} 
        size={3} 
        speed={0.4} 
        color="#7dd3fc" 
        opacity={0.6} 
      />
    </group>
  );
};

export default DNAAnimation;
