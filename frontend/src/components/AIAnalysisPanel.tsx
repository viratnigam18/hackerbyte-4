import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ChevronRight, AlertTriangle, Shield, Zap } from 'lucide-react';
import GlassCard from './GlassCard';

interface AIAnalysisPanelProps {
  symptoms: string;
}

const analysisPoints = [
  { label: 'Primary Assessment', text: 'Possible cardiac-related symptoms detected', severity: 'high', icon: <AlertTriangle size={14} /> },
  { label: 'Risk Factor', text: 'Chest pain combined with breathlessness indicates elevated cardiac risk', severity: 'critical', icon: <Zap size={14} /> },
  { label: 'Secondary Analysis', text: 'Monitor for additional symptoms: dizziness, nausea, arm pain', severity: 'moderate', icon: <Shield size={14} /> },
  { label: 'Recommendation', text: 'Seek immediate medical attention — do not delay', severity: 'high', icon: <ChevronRight size={14} /> },
];

const severityColors: Record<string, string> = {
  low: '#4ade80',
  moderate: '#facc15',
  high: '#ff4d4d',
  critical: '#ff4d4d',
};

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ symptoms }) => {
  return (
    <GlassCard className="h-full flex flex-col" glowColor="#4ade80" delay={0.1}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-ll-cyan/20 to-emerald-500/10 flex items-center justify-center border border-ll-cyan/15"
        >
          <Brain size={20} className="text-ll-cyan" />
        </motion.div>
        <div>
          <h2 className="text-base font-bold text-white">AI Analysis</h2>
          <p className="text-[10px] text-white/30">Powered by LifeLine AI Engine</p>
        </div>
      </div>

      {/* User input echo */}
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-3 py-2.5 mb-4">
        <p className="text-[10px] text-white/25 font-semibold uppercase tracking-widest mb-1">Your symptoms</p>
        <p className="text-sm text-white/60 italic">"{symptoms}"</p>
      </div>

      {/* Analysis points */}
      <div className="flex-1 space-y-3">
        {analysisPoints.map((point, i) => (
          <motion.div
            key={point.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="flex items-start gap-3 group"
          >
            <div className="mt-0.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${severityColors[point.severity]}15`, color: severityColors[point.severity] }}
              >
                {point.icon}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{point.label}</span>
                <span
                  className="text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                  style={{
                    background: `${severityColors[point.severity]}15`,
                    color: severityColors[point.severity],
                    border: `1px solid ${severityColors[point.severity]}25`,
                  }}
                >
                  {point.severity}
                </span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{point.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animated progress indicator */}
      <div className="mt-4 pt-3 border-t border-white/[0.04]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-white/25 font-semibold">Analysis Confidence</span>
          <span className="text-xs font-bold text-ll-cyan font-mono-data">87.4%</span>
        </div>
        <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '87.4%' }}
            transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-ll-cyan to-emerald-400"
          />
        </div>
      </div>
    </GlassCard>
  );
};

export default AIAnalysisPanel;
