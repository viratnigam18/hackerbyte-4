import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import GlassCard from './GlassCard';

interface PredictionItem {
  label: string;
  risk: string;
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'up' | 'down';
  timeframe: string;
}

const predictions: PredictionItem[] = [
  { label: 'Cardiac Event', risk: '34%', riskLevel: 'high', trend: 'up', timeframe: '24h' },
  { label: 'Respiratory Issue', risk: '21%', riskLevel: 'medium', trend: 'up', timeframe: '48h' },
  { label: 'Recovery Rate', risk: '78%', riskLevel: 'low', trend: 'down', timeframe: '7d' },
];

const riskColors = {
  low: '#4ade80',
  medium: '#facc15',
  high: '#ff4d4d',
};

const FutureHealthPrediction: React.FC = () => {
  return (
    <GlassCard className="h-full flex flex-col" delay={0.2}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-ll-yellow-dim flex items-center justify-center border border-yellow-500/15">
          <TrendingUp size={16} className="text-ll-yellow" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Future Health Prediction</h3>
          <p className="text-[10px] text-white/50">AI-predicted risk assessment</p>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {predictions.map((pred, i) => (
          <motion.div
            key={pred.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.12 }}
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50 font-medium">{pred.label}</span>
              <span className="text-[9px] text-white/50 font-mono-data">{pred.timeframe}</span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-xl font-bold font-mono-data"
                style={{ color: riskColors[pred.riskLevel] }}
              >
                {pred.risk}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase"
                  style={{
                    background: `${riskColors[pred.riskLevel]}15`,
                    color: riskColors[pred.riskLevel],
                    border: `1px solid ${riskColors[pred.riskLevel]}25`,
                  }}
                >
                  {pred.riskLevel}
                </span>
                {pred.trend === 'up' ? (
                  <ArrowUp size={14} style={{ color: riskColors[pred.riskLevel] }} />
                ) : (
                  <ArrowDown size={14} className="text-ll-cyan" />
                )}
              </div>
            </div>
            {/* Risk bar */}
            <div className="w-full h-1 bg-white/[0.04] rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: pred.risk }}
                transition={{ duration: 1.2, delay: 0.6 + i * 0.2 }}
                className="h-full rounded-full"
                style={{ background: riskColors[pred.riskLevel] }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

export default FutureHealthPrediction;
