import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Droplets, Brain, Activity } from 'lucide-react';

interface VitalItem {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  min: number;
  max: number;
}

const vitalsList: VitalItem[] = [
  { label: 'Heart', value: 0, unit: 'BPM', icon: <Heart size={14} />, color: '#ff4d4d', min: 0, max: 0 },
  { label: 'SpO2', value: 0, unit: '%', icon: <Droplets size={14} />, color: '#4ade80', min: 0, max: 0 },
  { label: 'Stress', value: 0, unit: '', icon: <Brain size={14} />, color: '#a78bfa', min: 0, max: 0 },
];

const VitalsCard: React.FC = () => {
  const [values] = useState(vitalsList.map(v => v.value));

  // Simulation disabled
  useEffect(() => {
    // keeping effect hook structure in case it's needed later
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="
        bg-[rgba(8,32,20,0.6)] backdrop-blur-[24px] border border-white/[0.08]
        rounded-2xl p-4 w-[260px]
        neon-glow-green
      "
    >
      <div className="flex items-center gap-2 mb-3">
        <Activity size={14} className="text-ll-cyan" />
        <span className="text-xs font-bold tracking-widest text-white/40 uppercase">Vitals</span>
        <span className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-ll-emerald animate-pulse" />
          <span className="text-[9px] text-ll-emerald font-bold">LIVE</span>
        </span>
      </div>

      <div className="space-y-2.5">
        {vitalsList.map((v, i) => (
          <div key={v.label} className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${v.color}18`, color: v.color }}
            >
              {v.icon}
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-white/30 font-semibold">{v.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-white/90 font-mono-data">{values[i]}</span>
                {v.unit && <span className="text-[10px] text-white/30">{v.unit}</span>}
              </div>
            </div>
            <div className="w-16 h-5 overflow-hidden opacity-50">
              <svg viewBox="0 0 60 20" className="w-full h-full" preserveAspectRatio="none">
                <polyline
                  points={v.label === 'Heart'
                    ? "0,10 8,10 12,4 15,16 18,2 21,18 24,8 30,10 38,10 42,4 45,16 48,2 51,18 54,8 60,10"
                    : v.label === 'SpO2'
                    ? Array.from({length: 60}, (_, j) => `${j},${10 + Math.sin(j * 0.2) * 6}`).join(' ')
                    : Array.from({length: 60}, (_, j) => `${j},${10 + Math.sin(j * 0.15) * 4 + Math.sin(j * 0.4) * 2}`).join(' ')
                  }
                  fill="none"
                  stroke={v.color}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default VitalsCard;
