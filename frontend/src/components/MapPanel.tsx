import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Filter } from 'lucide-react';
import GlassCard from './GlassCard';

const filters = ['All', 'ER', 'Cardiology', 'Pediatrics', 'General'];

const MapPanel: React.FC = () => {
  return (
    <GlassCard className="flex flex-col h-full relative" noPadding delay={0.4}>
      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden rounded-t-2xl">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(45,212,191,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(45,212,191,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />

        {/* Radial glow in center */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(45,212,191,0.06) 0%, transparent 60%)'
        }} />

        {/* Animated location pins */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[35%] left-[45%]"
        >
          <div className="relative">
            <MapPin size={20} className="text-ll-teal fill-ll-teal/20" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-ll-teal/20 rounded-full blur-[2px]" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-[50%] left-[60%]"
        >
          <div className="relative">
            <MapPin size={16} className="text-ll-cyan fill-ll-cyan/20" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-ll-cyan/20 rounded-full blur-[2px]" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[25%] left-[70%]"
        >
          <div className="relative">
            <MapPin size={14} className="text-ll-purple fill-ll-purple/20" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-ll-purple/20 rounded-full blur-[2px]" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
          className="absolute top-[60%] left-[30%]"
        >
          <div className="relative">
            <MapPin size={16} className="text-ll-amber fill-ll-amber/20" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-ll-amber/20 rounded-full blur-[2px]" />
          </div>
        </motion.div>

        {/* Your Location Pulse */}
        <div className="absolute top-[45%] left-[42%]">
          <div className="w-3 h-3 rounded-full bg-ll-teal relative">
            <div className="absolute inset-0 rounded-full bg-ll-teal animate-ping-slow" />
          </div>
        </div>

        {/* Map label */}
        <div className="absolute top-3 left-4 flex items-center gap-2 bg-white/[0.05] backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/[0.06]">
          <MapPin size={12} className="text-ll-teal" />
          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Hospital Locator</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-4 py-3 flex items-center gap-2 border-t border-white/[0.04]">
        <Filter size={12} className="text-white/20" />
        {filters.map((f, i) => (
          <button
            key={f}
            className={`
              text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all duration-200
              ${i === 0
                ? 'bg-ll-teal/15 text-ll-teal border border-ll-teal/20'
                : 'text-white/30 hover:text-white/50 hover:bg-white/[0.04]'
              }
            `}
          >
            {f}
          </button>
        ))}
      </div>
    </GlassCard>
  );
};

export default MapPanel;
