import React from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, Activity } from 'lucide-react';
import GlassCard from './GlassCard';
import { AnalysisData } from './AnalysisDashboard';

interface AIAnalysisPanelProps {
  symptoms: string;
  loading: boolean;
  error: string | null;
  analysis: AnalysisData | null;
}

const severityColors: Record<string, string> = {
  low: '#4ade80',
  moderate: '#facc15',
  high: '#ff4d4d',
  critical: '#ff4d4d',
};

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ symptoms, loading, error, analysis }) => {
  const severityLevel = analysis ? (analysis.confidence > 75 ? 'critical' : analysis.confidence > 40 ? 'moderate' : 'low') : 'low';
  const confidencePercent = analysis ? analysis.confidence.toFixed(1) : 0;

  return (
    <GlassCard className="h-full flex flex-col" glowColor={severityColors[severityLevel] || '#4ade80'} delay={0.1}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
           animate={{ rotate: loading ? 360 : [0, 5, -5, 0] }}
           transition={{ duration: loading ? 1.5 : 4, repeat: Infinity, ease: loading ? "linear" : "easeInOut" }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-ll-cyan/20 to-emerald-500/10 flex items-center justify-center border border-ll-cyan/15"
        >
          <Brain size={20} className="text-ll-cyan" />
        </motion.div>
        <div>
          <h2 className="text-base font-bold text-white">AI Analysis</h2>
          <p className="text-[10px] text-white/50">Powered by LifeLine AI Engine</p>
        </div>
      </div>

      {/* User input echo */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 mb-4">
        <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest mb-1">Your symptoms</p>
        <p className="text-sm text-white/50 italic">"{symptoms}"</p>
      </div>

      {/* Analysis Response */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-50">
               <div className="w-5 h-5 border-2 border-ll-cyan/30 border-t-ll-cyan rounded-full animate-spin" />
               <p className="text-xs text-white/40">Analyzing symptoms...</p>
            </div>
        ) : error ? (
             <div className="flex items-center gap-2 text-red-400 p-3 bg-red-400/10 rounded-xl border border-red-400/20">
                <AlertTriangle size={16} />
                <span className="text-xs font-medium">{error}</span>
             </div>
        ) : analysis ? (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 relative"
            >
               <div className="flex items-center gap-2 mb-3">
                  <Activity size={14} className="text-ll-cyan" />
                  <span className="text-xs font-bold text-white/80 uppercase tracking-wide">Diagnosis Context</span>
               </div>
               <p className="text-sm text-white/70 leading-relaxed">
                   {analysis.response}
               </p>
            </motion.div>
        ) : null}
      </div>

      {/* Animated progress indicator */}
      {!loading && analysis && (
        <div className="mt-4 pt-3 border-t border-white/[0.04]">
            <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-white/25 font-semibold">Analysis Confidence</span>
            <span className="text-xs font-bold text-ll-cyan font-mono-data">{confidencePercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidencePercent}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-ll-cyan to-emerald-400"
            />
            </div>
        </div>
      )}
    </GlassCard>
  );
};

export default AIAnalysisPanel;

