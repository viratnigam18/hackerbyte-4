import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Navigation, Star, Clock, MapPin } from 'lucide-react';
import GlassCard from './GlassCard';

interface Hospital {
  name: string;
  specialty: string;
  distance: string;
  rating: number;
  eta: string;
  phone: string;
  color: string;
}

const hospitals: Hospital[] = [
  { name: 'CityMD', specialty: 'Emergency', distance: '0.8 km', rating: 4.5, eta: '3 min', phone: '+1 212-555-0194', color: '#F87171' },
  { name: 'Fortis Hospital', specialty: 'Cardiology', distance: '2.1 km', rating: 4.8, eta: '8 min', phone: '+91 98765 43210', color: '#22D3EE' },
  { name: 'Apollo Clinic', specialty: 'General', distance: '3.5 km', rating: 4.3, eta: '12 min', phone: '+91 90000 11111', color: '#2DD4BF' },
  { name: 'AIIMS', specialty: 'Pediatrics', distance: '5.2 km', rating: 4.9, eta: '18 min', phone: '+91 98888 77777', color: '#A78BFA' },
];

const HospitalCards: React.FC = () => {
  return (
    <GlassCard className="flex flex-col h-full" delay={0.45}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-ll-cyan/10 flex items-center justify-center">
            <MapPin size={14} className="text-ll-cyan" />
          </div>
          <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase">Nearby Hospitals</h3>
        </div>
        <span className="text-[10px] text-white/50 font-medium">{hospitals.length} found</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {hospitals.map((h, i) => (
          <motion.div
            key={h.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="
              group p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]
              hover:bg-white/[0.04] hover:border-white/[0.08]
              transition-all duration-200
            "
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: h.color }} />
                  <h4 className="text-sm font-semibold text-white/50">{h.name}</h4>
                </div>
                <p className="text-[10px] text-white/50 font-medium pl-3.5">{h.specialty}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-ll-amber">
                  <Star size={10} fill="currentColor" />
                  <span className="text-[11px] font-bold">{h.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px] text-white/50">
                  <MapPin size={10} />
                  {h.distance}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-white/50">
                  <Clock size={10} />
                  {h.eta}
                </span>
              </div>

              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="w-7 h-7 rounded-lg bg-ll-teal/10 flex items-center justify-center text-ll-teal hover:bg-ll-teal/20 transition-colors">
                  <Phone size={12} />
                </button>
                <button className="w-7 h-7 rounded-lg bg-ll-cyan/10 flex items-center justify-center text-ll-cyan hover:bg-ll-cyan/20 transition-colors">
                  <Navigation size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

export default HospitalCards;
