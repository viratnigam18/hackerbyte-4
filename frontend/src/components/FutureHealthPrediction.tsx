import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import GlassCard from './GlassCard';
import { AnalysisData } from './AnalysisDashboard';

interface PredictionItem {
  label: string;
  risk: string;
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'up' | 'down';
  timeframe: string;
}

const riskColors = {
  low: '#4ade80',
  medium: '#facc15',
  high: '#ff4d4d',
};

interface FutureHealthPredictionProps {
  analysis: AnalysisData | null;
}

const FutureHealthPrediction: React.FC<FutureHealthPredictionProps> = ({ analysis }) => {
  // Generate dynamic predictions based on the fetched model confidence
  const predictions: PredictionItem[] = analysis ? [
    { 
      label: 'Immediate Risk', 
      risk: `${Math.round(analysis.confidence)}%`, 
      riskLevel: analysis.confidence > 70 ? 'high' : analysis.confidence > 40 ? 'medium' : 'low', 
      trend: analysis.confidence > 50 ? 'up' : 'down', 
      timeframe: '24h' 
    },
    { 
      label: 'Secondary Complications', 
      risk: `${Math.round(analysis.confidence * 0.6)}%`, 
      riskLevel: analysis.confidence * 0.6 > 50 ? 'high' : analysis.confidence * 0.6 > 30 ? 'medium' : 'low', 
      trend: 'up', 
      timeframe: '48h' 
    },
    { 
      label: 'Recovery Rate', 
      risk: `${Math.round(100 - (analysis.confidence * 0.5))}%`, 
      riskLevel: 'low', 
      trend: 'down', 
      timeframe: '7d' 
    },
  ] : [
    { label: 'Immediate Risk', risk: '--', riskLevel: 'low', trend: 'down', timeframe: '24h' },
    { label: 'Secondary Complications', risk: '--', riskLevel: 'low', trend: 'down', timeframe: '48h' },
    { label: 'Recovery Rate', risk: '--', riskLevel: 'low', trend: 'down', timeframe: '7d' },
  ];

  return (
    <GlassCard className="h-full flex flex-col" delay={0.2}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-xl ${analysis ? 'bg-ll-yellow-dim border-yellow-500/15' : 'bg-white/5 border-white/10'} flex items-center justify-center border`}>
          <TrendingUp size={16} className={analysis ? "text-ll-yellow" : "text-white/30"} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Future Health Prediction</h3>
          <p className="text-[10px] text-white/25">AI-predicted risk assessment</p>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {predictions.map((pred, i) => (
          <motion.div
            key={pred.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.12 }}
            className={`bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 ${!analysis && 'opacity-40'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50 font-medium">{pred.label}</span>
              <span className="text-[9px] text-white/20 font-mono-data">{pred.timeframe}</span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-xl font-bold font-mono-data"
                style={{ color: analysis ? riskColors[pred.riskLevel] : '#ffffff50' }}
              >
                {pred.risk}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase"
                  style={analysis ? {
                    background: `${riskColors[pred.riskLevel]}15`,
                    color: riskColors[pred.riskLevel],
                    border: `1px solid ${riskColors[pred.riskLevel]}25`,
                  } : { background: '#ffffff10', color: '#ffffff50', border: '1px solid #ffffff20' }}
                >
                  {analysis ? pred.riskLevel : 'Pending'}
                </span>
                {analysis && (pred.trend === 'up' ? (
                  <ArrowUp size={14} style={{ color: riskColors[pred.riskLevel] }} />
                ) : (
                  <ArrowDown size={14} className="text-ll-cyan" />
                ))}
              </div>
            </div>
            {/* Risk bar */}
            <div className="w-full h-1 bg-white/[0.04] rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: pred.risk === '--' ? 0 : pred.risk }}
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

