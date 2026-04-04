import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone } from 'lucide-react';
import GlassCard from './GlassCard';

const EmergencySeverity: React.FC = () => {
  const severity = 'HIGH';
  const ringColor = '#F87171';
  const ringColorDim = 'rgba(248,113,113,0.12)';

  return (
    <GlassCard className="flex flex-col items-center justify-center h-full relative overflow-visible" delay={0.3}>
      {/* Header */}
      <div className="absolute top-4 left-5 flex items-center gap-2">
        <AlertTriangle size={14} className="text-ll-amber" />
        <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Emergency Severity</span>
      </div>

      {/* Pulse Rings */}
      <div className="relative flex items-center justify-center my-4">
        {/* Ring 3 — outer */}
        <div
          className="absolute w-32 h-32 rounded-full animate-pulse-ring-slow"
          style={{ border: `1px solid ${ringColorDim}`, animationDelay: '0.8s' }}
        />
        {/* Ring 2 */}
        <div
          className="absolute w-24 h-24 rounded-full animate-pulse-ring"
          style={{ border: `1.5px solid ${ringColorDim}`, animationDelay: '0.4s' }}
        />
        {/* Ring 1 — inner */}
        <div
          className="absolute w-16 h-16 rounded-full animate-pulse-ring"
          style={{ border: `2px solid ${ringColor}30` }}
        />

        {/* Center Circle */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-20 h-20 rounded-full flex flex-col items-center justify-center z-10"
          style={{
            background: `radial-gradient(circle, ${ringColorDim} 0%, transparent 70%)`,
            boxShadow: `0 0 40px ${ringColor}20`,
          }}
        >
          <span className="text-lg font-bold text-white tracking-wide">{severity}</span>
          <span className="text-[9px] text-white/40 font-bold tracking-widest uppercase">Level</span>
        </motion.div>
      </div>

      {/* SOS Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="
          mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-gradient-to-r from-red-500/20 to-red-400/10
          border border-red-500/20
          text-red-400 text-xs font-bold tracking-wide uppercase
          hover:from-red-500/30 hover:to-red-400/20
          hover:border-red-500/30 hover:shadow-glow-red
          transition-all duration-300
        "
      >
        <Phone size={14} />
        SOS Emergency
      </motion.button>
    </GlassCard>
  );
};

export default EmergencySeverity;
