import React from 'react';
import { Navigation2, Filter } from 'lucide-react';
import GlassCard from './GlassCard';

const MapSection: React.FC = () => {
  return (
    <GlassCard className="h-full flex flex-col relative overflow-hidden" noPadding delay={0.45}>
      {/* Map area */}
      <div className="flex-1 relative bg-[#071a10]">
        <iframe
          src="https://maps.google.com/maps?q=iiitdm%20jabalpur&t=&z=14&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) opacity(0.8)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="IIITDM Jabalpur Map"
        />

        {/* Overlay to keep the styling dark and green-themed */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(7,26,16,0.6) 100%)'
        }} />

        {/* Label */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none">
          <Navigation2 size={12} className="text-ll-cyan" />
          <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase">IIITDM Jabalpur Area</span>
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
