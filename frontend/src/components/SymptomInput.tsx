import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mic, Camera, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';

const quickChips = ['Chest pain', 'Headache', 'Shortness of breath', 'Fever', 'Dizziness'];

const SymptomInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <GlassCard className="flex flex-col h-full" delay={0.35}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-ll-teal/10 flex items-center justify-center">
          <Search size={14} className="text-ll-teal" />
        </div>
        <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase">Symptom Checker</h3>
      </div>

      {/* Input area */}
      <div className="relative mb-3">
        <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 focus-within:border-ll-teal/30 focus-within:bg-white/[0.04] transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="Describe your symptoms..."
            className="bg-transparent outline-none w-full text-sm text-white/50 placeholder-white/30"
          />
          <div className="flex gap-2 ml-2">
            <button className="text-white/50 hover:text-ll-teal transition-colors">
              <Mic size={16} />
            </button>
            <button className="text-white/50 hover:text-ll-cyan transition-colors">
              <Camera size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {quickChips.map((chip) => (
          <button
            key={chip}
            onClick={() => setInput(chip)}
            className="
              text-[10px] font-medium px-2.5 py-1.5 rounded-lg
              bg-white/[0.04] border border-white/[0.08]
              text-white/50 hover:text-white/50 hover:bg-white/[0.04] hover:border-white/[0.08]
              transition-all duration-200
            "
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Analyze button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAnalyze}
        disabled={!input.trim() || isAnalyzing}
        className="
          w-full py-2.5 rounded-xl text-sm font-semibold
          bg-gradient-to-r from-ll-teal/20 to-ll-cyan/20
          border border-ll-teal/20
          text-ll-teal
          hover:from-ll-teal/30 hover:to-ll-cyan/30
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-all duration-300
          flex items-center justify-center gap-2
        "
      >
        {isAnalyzing ? (
          <>
            <div className="w-4 h-4 border-2 border-ll-teal/30 border-t-ll-teal rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles size={14} />
            Analyze Symptoms
          </>
        )}
      </motion.button>

      {/* Status */}
      <div className="mt-auto pt-3">
        <p className="text-[10px] text-white/50 text-center">
          AI-powered analysis • Instant results
        </p>
      </div>
    </GlassCard>
  );
};

export default SymptomInput;
