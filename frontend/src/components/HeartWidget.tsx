import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Sparkles } from '@react-three/drei';
import HeartModel from './HeartModel';
import GlassCard from './GlassCard';

const HeartWidget: React.FC = () => {
  return (
    <GlassCard className="flex flex-col h-full relative overflow-hidden" noPadding delay={0.15}>
      {/* Label */}
      <div className="absolute top-4 left-5 z-20 flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">3D Heart</span>
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 min-h-0">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6.5], fov: 40 }}
          gl={{ antialias: false, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight color="#2DD4BF" intensity={2} position={[2, 2, 3]} />
            <pointLight color="#22D3EE" intensity={1} position={[-2, -1, 2]} />
            <pointLight color="#F87171" intensity={1.5} position={[0, 0, 3]} />

            <HeartModel />

            <Sparkles
              count={40}
              scale={5}
              size={1.5}
              speed={0.3}
              color="#2DD4BF"
              opacity={0.2}
            />

            <EffectComposer>
              <Bloom
                intensity={1.2}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.8}
                mipmapBlur
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* Stats overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/30 to-transparent z-20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/50 font-medium">Real-time Model</p>
            <p className="text-xs text-ll-teal font-semibold">Beating @ 74 BPM</p>
          </div>
          <div className="flex items-center gap-1 bg-red-400/10 px-2 py-1 rounded-full border border-red-400/15">
            <span className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[9px] font-bold text-red-400">LIVE</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default HeartWidget;
