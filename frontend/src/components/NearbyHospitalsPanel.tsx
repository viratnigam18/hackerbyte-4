import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Star, Clock } from 'lucide-react';
import GlassCard from './GlassCard';

const hospitals = [
  { name: 'CityMD Emergency', specialty: 'Emergency Care', distance: '0.8 km', rating: 4.5, eta: '3 min', color: '#ff4d4d' },
  { name: 'Fortis Hospital', specialty: 'Cardiology', distance: '2.1 km', rating: 4.8, eta: '8 min', color: '#4ade80' },
  { name: 'Apollo Clinic', specialty: 'General Medicine', distance: '3.5 km', rating: 4.3, eta: '12 min', color: '#a78bfa' },
  { name: 'AIIMS', specialty: 'Multi-specialty', distance: '5.2 km', rating: 4.9, eta: '18 min', color: '#facc15' },
];

const NearbyHospitalsPanel: React.FC = () => {
  return (
    <GlassCard className="h-full flex flex-col" delay={0.25}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-ll-cyan/[0.08] flex items-center justify-center border border-ll-cyan/15">
            <MapPin size={16} className="text-ll-cyan" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Nearby Hospitals</h3>
            <p className="text-[10px] text-white/25">Based on your location</p>
          </div>
        </div>
        <span className="text-[10px] text-white/20 font-medium bg-white/[0.03] px-2 py-1 rounded-lg border border-white/[0.05]">
          {hospitals.length} found
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {hospitals.map((h, i) => (
          <motion.div
            key={h.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="
              group p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]
              hover:bg-white/[0.05] hover:border-white/[0.08]
              transition-all duration-200
            "
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: h.color }} />
                  <h4 className="text-sm font-semibold text-white/85">{h.name}</h4>
                </div>
                <p className="text-[10px] text-white/25 font-medium pl-4">{h.specialty}</p>
              </div>
              <div className="flex items-center gap-0.5 text-ll-yellow">
                <Star size={10} fill="currentColor" />
                <span className="text-[11px] font-bold">{h.rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[10px] text-white/25">
                <span className="flex items-center gap-1"><MapPin size={9} />{h.distance}</span>
                <span className="flex items-center gap-1"><Clock size={9} />{h.eta}</span>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="w-6 h-6 rounded-lg bg-ll-cyan/[0.08] flex items-center justify-center text-ll-cyan hover:bg-ll-cyan/15 transition-colors">
                  <Phone size={10} />
                </button>
                <button className="w-6 h-6 rounded-lg bg-ll-purple/[0.08] flex items-center justify-center text-ll-purple hover:bg-ll-purple/15 transition-colors">
                  <Navigation size={10} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

export default NearbyHospitalsPanel;
