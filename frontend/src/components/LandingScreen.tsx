import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import VitalsCard from './VitalsCard';
import ChatInputBar from './ChatInputBar';

interface LandingScreenProps {
  onSymptomSubmit: (message: string) => void;
  isLoading: boolean;
  userName: string;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onSymptomSubmit, isLoading, userName }) => {
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-5 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ll-cyan to-emerald-500 flex items-center justify-center shadow-glow-cyan">
            <Shield size={20} className="text-ll-bg" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-lg font-bold tracking-wide text-white">LifeLine</span>
            <span className="ml-2 text-[9px] font-bold tracking-widest text-ll-cyan/70 uppercase bg-ll-cyan/[0.1] px-2 py-0.5 rounded-full border border-ll-cyan/[0.2]">AI</span>
          </div>
        </motion.div>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute left-1/2 -translate-x-1/2 text-center"
        >
          <h1 className="text-2xl font-bold text-white neon-text-green">
            Welcome, <span className="text-ll-cyan">{userName}</span>
          </h1>
          <p className="text-xs text-white/30 mt-0.5">Your AI Health Assistant is ready</p>
        </motion.div>

        {/* Vitals Card — Top Right */}
        <VitalsCard />
      </div>

      {/* Center — Chat Input */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-10">
        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-extrabold text-white mb-2">
            How are you feeling<span className="text-ll-cyan">?</span>
          </h2>
          <p className="text-white/30 text-sm max-w-md mx-auto">
            Tell us your symptoms and our AI will analyze, predict risks, and find nearby hospitals instantly.
          </p>
        </motion.div>

        {/* Chat Input Bar */}
        <ChatInputBar onSubmit={onSymptomSubmit} isLoading={isLoading} />
      </div>

      {/* Bottom subtle info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="px-8 pb-5 flex items-center justify-center gap-8 text-[10px] text-white/15"
      >
        <span>🔒 End-to-end encrypted</span>
        <span>⚡ AI-powered analysis</span>
        <span>🏥 Real-time hospital data</span>
        <span>🧠 Mental health support</span>
      </motion.div>
    </div>
  );
};

export default LandingScreen;
