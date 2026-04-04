import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';
import GlassCard from './GlassCard';

const AIRecommendation: React.FC = () => {
  return (
    <GlassCard
      className="flex flex-col h-full relative overflow-hidden"
      gradientBorder={true}
      glowColor="#A78BFA"
      delay={0.25}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 animate-shimmer-border bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none rounded-2xl" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-ll-purple/30 to-ll-teal/20 flex items-center justify-center border border-ll-purple/20"
        >
          <Sparkles size={16} className="text-ll-purple" />
        </motion.div>
        <div>
          <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase">AI Analysis</h3>
          <p className="text-[10px] text-white/50">Powered by LifeLine AI</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={12} className="text-ll-teal" />
            <span className="text-[10px] font-bold text-ll-teal tracking-wide">IDENTIFIED CONDITION</span>
          </div>
          <p className="text-sm text-white/50 italic">Awaiting symptom analysis...</p>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-ll-cyan tracking-wide">RECOMMENDED FILTERS</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] text-ll-teal font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-ll-teal" />
              Emergency Room
            </span>
            <span className="flex items-center gap-1 text-[10px] text-white/50 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-white/[0.04]" />
              Cardiology
            </span>
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-ll-amber tracking-wide">CONFIDENCE</span>
          </div>
          <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '0%' }}
              className="h-full rounded-full bg-gradient-to-r from-ll-purple to-ll-teal"
            />
          </div>
          <p className="text-[10px] text-white/50 mt-1">Enter symptoms to begin analysis</p>
        </div>
      </div>

      {/* Action */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="
          w-full mt-3 py-2 rounded-xl text-xs font-semibold
          bg-gradient-to-r from-ll-purple/15 to-ll-teal/15
          border border-ll-purple/15
          text-ll-purple hover:text-ll-purple
          hover:from-ll-purple/25 hover:to-ll-teal/25
          transition-all duration-300
          flex items-center justify-center gap-2
          relative z-10
        "
      >
        View Full Report
        <ArrowRight size={12} />
      </motion.button>
    </GlassCard>
  );
};

export default AIRecommendation;
