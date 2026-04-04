import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Html, Sparkles, Stars } from '@react-three/drei';
import HeartModel from './HeartModel';
import Loader from './Loader';

const RightVisualComponent: React.FC = () => {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center bg-[#0B0D17]">
      {/* Background Overlay (Geometric Grid/Hex Pattern simulation) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(209, 242, 235, 0.4) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={<Loader />}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[2, 2, 5]} intensity={1.2} />
            <pointLight color="red" intensity={2} position={[0, 0, 2]} />
            <pointLight color="#00f2fe" intensity={1.5} position={[-3, 2, -2]} />

            {/* Heart */}
            <HeartModel />

            {/* Hovering UI Card */}
            <Html 
              position={[2.5, 1, 0]} 
              center 
              style={{ pointerEvents: 'none' }}
              className="hidden lg:block w-48"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-xl text-white transform -translate-y-8 animate-pulse">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-fintech-mint tracking-wider font-semibold uppercase">Heart Rate</span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                </div>
                <div className="text-2xl font-bold font-sans">
                  120 <span className="text-sm font-normal text-gray-300">bpm</span>
                </div>
                <div className="mt-2 h-6 border-b border-t border-white/10 flex items-center justify-center opacity-80 overflow-hidden">
                  {/* CSS Animated ECG Line Mock */}
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <polyline 
                      points="0,10 20,10 25,5 30,18 35,2 40,15 45,10 100,10" 
                      fill="none" 
                      stroke="#D1F2EB" 
                      strokeWidth="1.5"
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                </div>
              </div>
            </Html>

            {/* Particles / Sparkles */}
            <Sparkles count={100} scale={10} size={2} speed={0.4} color="#D1F2EB" opacity={0.3} />
            <Stars radius={10} depth={50} count={2000} factor={2} saturation={0} fade speed={1} />

            {/* Postprocessing */}
            <EffectComposer>
              <Bloom 
                intensity={1.5} 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                mipmapBlur
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>


    </div>
  );
};

export default RightVisualComponent;
