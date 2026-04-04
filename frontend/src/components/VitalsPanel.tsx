import React, { useState, useEffect } from 'react';
import { Heart, Droplets, Brain as BrainIcon } from 'lucide-react';
import GlassCard from './GlassCard';

interface VitalData {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  colorDim: string;
  waveType: 'ecg' | 'sine' | 'irregular';
  min: number;
  max: number;
  status: string;
}

const vitals: VitalData[] = [
  {
    label: 'HEART RATE',
    value: 74,
    unit: 'BPM',
    icon: <Heart size={14} />,
    color: '#F87171',
    colorDim: 'rgba(248,113,113,0.15)',
    waveType: 'ecg',
    min: 70,
    max: 82,
    status: 'Normal',
  },
  {
    label: 'OXYGEN (SPO2)',
    value: 98,
    unit: '%',
    icon: <Droplets size={14} />,
    color: '#22D3EE',
    colorDim: 'rgba(34,211,238,0.15)',
    waveType: 'sine',
    min: 96,
    max: 99,
    status: 'Healthy',
  },
  {
    label: 'STRESS LEVEL',
    value: 32,
    unit: '',
    icon: <BrainIcon size={14} />,
    color: '#A78BFA',
    colorDim: 'rgba(167,139,250,0.15)',
    waveType: 'irregular',
    min: 25,
    max: 45,
    status: 'Low',
  },
];

const ECGWave: React.FC<{ color: string }> = ({ color }) => (
  <div className="w-full h-10 overflow-hidden relative">
    <div className="absolute inset-0 flex animate-wave-scroll" style={{ width: '200%' }}>
      <svg viewBox="0 0 200 40" className="w-1/2 h-full" preserveAspectRatio="none">
        <polyline
          points="0,20 15,20 20,20 25,14 30,28 33,8 36,35 39,12 42,22 47,20 65,20 70,20 75,14 80,28 83,8 86,35 89,12 92,22 97,20 115,20 120,20 125,14 130,28 133,8 136,35 139,12 142,22 147,20 165,20 170,20 175,14 180,28 183,8 186,35 189,12 192,22 200,20"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>
      <svg viewBox="0 0 200 40" className="w-1/2 h-full" preserveAspectRatio="none">
        <polyline
          points="0,20 15,20 20,20 25,14 30,28 33,8 36,35 39,12 42,22 47,20 65,20 70,20 75,14 80,28 83,8 86,35 89,12 92,22 97,20 115,20 120,20 125,14 130,28 133,8 136,35 139,12 142,22 147,20 165,20 170,20 175,14 180,28 183,8 186,35 189,12 192,22 200,20"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>
    </div>
  </div>
);

const SineWave: React.FC<{ color: string }> = ({ color }) => {
  const points = Array.from({ length: 200 }, (_, i) => {
    const x = i;
    const y = 20 + Math.sin(i * 0.08) * 10;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full h-10 overflow-hidden relative">
      <div className="absolute inset-0 flex animate-wave-scroll" style={{ width: '200%' }}>
        <svg viewBox="0 0 200 40" className="w-1/2 h-full" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
        <svg viewBox="0 0 200 40" className="w-1/2 h-full" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
};

const IrregularWave: React.FC<{ color: string }> = ({ color }) => {
  const points = Array.from({ length: 200 }, (_, i) => {
    const x = i;
    const y = 20 + Math.sin(i * 0.05) * 6 + Math.sin(i * 0.15) * 4 + Math.sin(i * 0.3) * 2;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full h-10 overflow-hidden relative">
      <div className="absolute inset-0 flex animate-wave-scroll" style={{ width: '200%', animationDuration: '6s' }}>
        <svg viewBox="0 0 200 40" className="w-1/2 h-full" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
        <svg viewBox="0 0 200 40" className="w-1/2 h-full" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
};

const WaveComponents = { ecg: ECGWave, sine: SineWave, irregular: IrregularWave };

const VitalsPanel: React.FC = () => {
  const [values, setValues] = useState(vitals.map(v => v.value));

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(prev => prev.map((val, i) => {
        const v = vitals[i];
        const delta = (Math.random() - 0.5) * 2;
        return Math.round(Math.min(v.max, Math.max(v.min, val + delta)));
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="flex flex-col gap-3 h-full" delay={0.1}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-bold tracking-widest text-white/40 uppercase">Live Vitals</h3>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-ll-emerald animate-pulse" />
          <span className="text-[10px] text-ll-emerald font-medium">LIVE</span>
        </span>
      </div>

      {vitals.map((vital, i) => {
        const Wave = WaveComponents[vital.waveType];
        return (
          <div key={vital.label} className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: vital.colorDim, color: vital.color }}
                >
                  {vital.icon}
                </div>
                <span className="text-[10px] font-bold tracking-wider text-white/40">{vital.label}</span>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: vital.colorDim, color: vital.color }}
              >
                {vital.status}
              </span>
            </div>
            <div className="flex items-end gap-2 mb-1">
              <span className="font-mono text-2xl font-bold text-white/90" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {values[i]}
              </span>
              {vital.unit && <span className="text-xs text-white/30 pb-1">{vital.unit}</span>}
            </div>
            <Wave color={vital.color} />
          </div>
        );
      })}
    </GlassCard>
  );
};

export default VitalsPanel;
