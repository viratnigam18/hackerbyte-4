import React from 'react';
import { motion } from 'framer-motion';
import { Video, PhoneCall, Star } from 'lucide-react';
import GlassCard from './GlassCard';

interface Doctor {
  name: string;
  specialty: string;
  rating: number;
  online: boolean;
  phone: string;
  avatar: string;
}

const doctors: Doctor[] = [
  { name: 'Dr. Amit Sharma', specialty: 'Pediatrics', rating: 4.7, online: true, phone: '+91 98888 77777', avatar: 'AS' },
  { name: 'Dr. Ananya Iyer', specialty: 'Cardiology', rating: 4.9, online: true, phone: '+91 98765 43210', avatar: 'AI' },
  { name: 'Dr. Kavita Rao', specialty: 'General Medicine', rating: 4.5, online: true, phone: '+91 90000 11111', avatar: 'KR' },
  { name: 'Dr. Rajesh Patel', specialty: 'Neurology', rating: 4.8, online: false, phone: '+91 95555 22222', avatar: 'RP' },
];

const TelemedicinePanel: React.FC = () => {
  const onlineCount = doctors.filter(d => d.online).length;

  return (
    <GlassCard className="flex flex-col h-full" delay={0.5}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-ll-emerald/10 flex items-center justify-center">
            <Video size={14} className="text-ll-emerald" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase">Telemedicine</h3>
            <p className="text-[10px] text-white/50">Connect with doctors instantly</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-ll-emerald/10 px-2.5 py-1 rounded-full border border-ll-emerald/15">
          <span className="w-1.5 h-1.5 rounded-full bg-ll-emerald animate-pulse" />
          <span className="text-[10px] font-bold text-ll-emerald">{onlineCount} Online</span>
        </div>
      </div>

      {/* Doctor List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {doctors.map((doc, i) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            className={`
              group flex items-center gap-3 p-3 rounded-xl
              bg-white/[0.04] border border-white/[0.08]
              hover:bg-white/[0.04] hover:border-white/[0.08]
              transition-all duration-200
              ${!doc.online ? 'opacity-50' : ''}
            `}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white
                ${doc.online
                  ? 'bg-gradient-to-br from-ll-teal/30 to-ll-cyan/20'
                  : 'bg-white/[0.04]'
                }
              `}>
                {doc.avatar}
              </div>
              {doc.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-ll-emerald border-2 border-[#070B14]" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white/50 truncate">{doc.name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/50">{doc.specialty}</span>
                <span className="flex items-center gap-0.5 text-ll-amber">
                  <Star size={8} fill="currentColor" />
                  <span className="text-[10px] font-bold">{doc.rating}</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            {doc.online && (
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="w-8 h-8 rounded-lg bg-ll-teal/10 flex items-center justify-center text-ll-teal hover:bg-ll-teal/20 transition-colors">
                  <PhoneCall size={14} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-ll-cyan/10 flex items-center justify-center text-ll-cyan hover:bg-ll-cyan/20 transition-colors">
                  <Video size={14} />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

export default TelemedicinePanel;
