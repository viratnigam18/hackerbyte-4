import React from 'react';
import { Pill, Leaf, AlertTriangle } from 'lucide-react';
import GlassCard from './GlassCard';

const MedicinePanel: React.FC = () => {
  return (
    <GlassCard className="flex flex-col h-full" delay={0.55}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-ll-teal/10 flex items-center justify-center">
          <Pill size={14} className="text-ll-teal" />
        </div>
        <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase">Medicine & Remedies</h3>
      </div>

      {/* Medicines */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Pill size={12} className="text-ll-cyan" />
          <span className="text-[10px] font-bold text-ll-cyan tracking-wide">SUGGESTED MEDICINES</span>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
          <p className="text-xs text-white/50 italic">Awaiting symptom analysis...</p>
          <p className="text-[10px] text-white/50 mt-1">Medicines will appear after AI analysis</p>
        </div>
      </div>

      {/* Remedies */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Leaf size={12} className="text-ll-emerald" />
          <span className="text-[10px] font-bold text-ll-emerald tracking-wide">HOME REMEDIES</span>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
          <p className="text-xs text-white/50 italic">Awaiting symptom analysis...</p>
          <p className="text-[10px] text-white/50 mt-1">Natural remedies will be suggested</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-auto">
        <div className="flex items-start gap-2 bg-ll-red/[0.05] border border-ll-red/[0.1] rounded-xl px-3 py-2.5">
          <AlertTriangle size={12} className="text-ll-red flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-ll-red/60 leading-relaxed">
            AI suggestions are NOT medical advice. Always consult a healthcare professional before taking any medication.
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

export default MedicinePanel;
