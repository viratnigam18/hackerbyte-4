import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Leaf, AlertTriangle, Shield } from 'lucide-react';
import GlassCard from './GlassCard';

const medicines = [
  { name: 'Aspirin 325mg', type: 'Anti-platelet', note: 'Take with food', color: '#4ade80' },
  { name: 'Nitroglycerin (sublingual)', type: 'Vasodilator', note: 'For chest pain relief', color: '#ff4d4d' },
  { name: 'Metoprolol 50mg', type: 'Beta-blocker', note: 'Once daily', color: '#a78bfa' },
];

const remedies = [
  { name: 'Deep Breathing', desc: 'Slow, deep breaths: 4s in, 4s hold, 4s out. Repeat 10x.', icon: '🫁' },
  { name: 'Cold Compress', desc: 'Apply to forehead and wrists to reduce anxiety.', icon: '🧊' },
  { name: 'Ginger Tea', desc: 'Boil ginger in water for 5 min. Relieves nausea.', icon: '🍵' },
];

const MedicineRemediesPanel: React.FC = () => {
  return (
    <GlassCard className="h-full flex flex-col" delay={0.4}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-ll-cyan/[0.08] flex items-center justify-center border border-ll-cyan/15">
          <Pill size={16} className="text-ll-cyan" />
        </div>
        <h3 className="text-sm font-bold text-white">Medicine & Remedies</h3>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        {/* Suggested Medicines */}
        <div className="overflow-y-auto">
          <div className="flex items-center gap-1.5 mb-3">
            <Shield size={12} className="text-ll-cyan" />
            <span className="text-[10px] font-bold text-ll-cyan uppercase tracking-widest">Suggested Medicines</span>
          </div>
          <div className="space-y-2">
            {medicines.map((med, i) => (
              <motion.div
                key={med.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: med.color }} />
                  <span className="text-xs font-semibold text-white/70">{med.name}</span>
                </div>
                <p className="text-[10px] text-white/25 pl-4">{med.type}</p>
                <p className="text-[10px] text-white/20 pl-4 italic mt-0.5">{med.note}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Home Remedies */}
        <div className="overflow-y-auto">
          <div className="flex items-center gap-1.5 mb-3">
            <Leaf size={12} className="text-ll-emerald" />
            <span className="text-[10px] font-bold text-ll-emerald uppercase tracking-widest">Home Remedies</span>
          </div>
          <div className="space-y-2">
            {remedies.map((rem, i) => (
              <motion.div
                key={rem.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{rem.icon}</span>
                  <span className="text-xs font-semibold text-white/70">{rem.name}</span>
                </div>
                <p className="text-[10px] text-white/30 leading-relaxed pl-6">{rem.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-3 pt-3 border-t border-white/[0.04]">
        <div className="flex items-start gap-2 text-[10px] text-ll-red/50">
          <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
          <span>AI suggestions are NOT medical advice. Always consult a healthcare professional.</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default MedicineRemediesPanel;
