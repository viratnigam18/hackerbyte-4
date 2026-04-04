import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import GlassCard from './GlassCard';

const HealthScoreCard: React.FC = () => {
  const score = 62;
  const maxScore = 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / maxScore) * circumference;
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      if (current >= score) {
        clearInterval(timer);
        current = score;
      }
      setAnimatedScore(current);
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#4ade80';
    if (s >= 60) return '#facc15';
    return '#ff4d4d';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Moderate';
    if (s >= 40) return 'At Risk';
    return 'Critical';
  };

  const color = getScoreColor(score);

  return (
    <GlassCard className="h-full flex flex-col items-center justify-center" delay={0.3}>
      <div className="flex items-center gap-2 self-start mb-3">
        <Heart size={14} className="text-ll-red" />
        <span className="text-xs font-bold tracking-widest text-white/40 uppercase">Health Score</span>
      </div>

      {/* Circular gauge */}
      <div className="relative flex items-center justify-center my-2">
        <svg width="120" height="120" className="-rotate-90">
          {/* Background circle */}
          <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
          {/* Score arc */}
          <motion.circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-extrabold font-mono-data"
            style={{ color }}
          >
            {animatedScore}
          </motion.span>
          <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
            / {maxScore}
          </span>
        </div>
      </div>

      {/* Label */}
      <span
        className="text-sm font-bold mt-2 px-3 py-1 rounded-full"
        style={{
          background: `${color}15`,
          color: color,
          border: `1px solid ${color}25`,
        }}
      >
        {getScoreLabel(score)}
      </span>

      {/* Mini stats */}
      <div className="flex gap-4 mt-3 text-[10px] text-white/25">
        <span>Heart: <span className="text-white/50 font-bold">Good</span></span>
        <span>Lungs: <span className="text-white/50 font-bold">Fair</span></span>
        <span>Vitals: <span className="text-white/50 font-bold">Normal</span></span>
      </div>
    </GlassCard>
  );
};

export default HealthScoreCard;
