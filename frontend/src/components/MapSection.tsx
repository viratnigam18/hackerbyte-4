import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation2, Filter } from 'lucide-react';
import GlassCard from './GlassCard';

const MapSection: React.FC = () => {
  return (
    <GlassCard className="h-full flex flex-col relative overflow-hidden" noPadding delay={0.45}>
      {/* Map area */}
      <div className="flex-1 relative">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,245,212,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,245,212,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '35px 35px',
          }}
        />

        {/* Radial glow */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 40% 40%, rgba(0,245,212,0.06) 0%, transparent 50%)'
        }} />

        {/* Animated pins */}
        {[
          { top: '30%', left: '40%', color: '#4ade80', size: 22, delay: 0 },
          { top: '50%', left: '65%', color: '#ff4d4d', size: 18, delay: 0.5 },
          { top: '25%', left: '72%', color: '#a78bfa', size: 16, delay: 1 },
          { top: '65%', left: '28%', color: '#facc15', size: 16, delay: 0.7 },
          { top: '45%', left: '50%', color: '#4ade80', size: 14, delay: 1.2 },
        ].map((pin, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: pin.delay }}
            className="absolute"
            style={{ top: pin.top, left: pin.left }}
          >
            <MapPin size={pin.size} style={{ color: pin.color }} fill={`${pin.color}30`} />
          </motion.div>
        ))}

        {/* User location pulse */}
        <div className="absolute" style={{ top: '42%', left: '38%' }}>
          <div className="w-3 h-3 rounded-full bg-ll-cyan relative">
            <div className="absolute inset-0 rounded-full bg-ll-cyan animate-ping-slow" />
          </div>
        </div>

        {/* Label */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/[0.05] backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/[0.06]">
          <Navigation2 size={12} className="text-ll-cyan" />
          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Map</span>
        </div>

        {/* Distance markers */}
        <div className="absolute bottom-3 right-3 bg-white/[0.05] backdrop-blur-sm px-2 py-1 rounded-lg border border-white/[0.06]">
          <span className="text-[9px] text-white/25 font-mono-data">5 km radius</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-4 py-2.5 flex items-center gap-2 border-t border-white/[0.04]">
        <Filter size={11} className="text-white/15" />
        {['All', 'ER', 'Cardio', 'General'].map((f, i) => (
          <button
            key={f}
            className={`text-[9px] font-semibold px-2 py-1 rounded-lg transition-all
              ${i === 0
                ? 'bg-ll-cyan/[0.1] text-ll-cyan border border-ll-cyan/20'
                : 'text-white/25 hover:text-white/40 hover:bg-white/[0.03]'
              }`}
          >
            {f}
          </button>
        ))}
      </div>
    </GlassCard>
  );
};

export default MapSection;
