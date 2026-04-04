import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Wifi, Power } from 'lucide-react';

interface TopBarProps {
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onLogout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="
        w-full flex items-center justify-between px-8 py-4
        bg-white/[0.015] backdrop-blur-[16px]
        border-b border-white/[0.04]
        relative z-30
      "
    >
      {/* Left — Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ll-teal to-ll-cyan flex items-center justify-center shadow-glow-teal">
          <Shield size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-wide text-white">LifeLine</span>
          <span className="text-[10px] font-bold tracking-widest text-ll-teal/60 uppercase bg-ll-teal/[0.08] px-2 py-0.5 rounded-full border border-ll-teal/[0.15]">
            AI
          </span>
        </div>
      </div>

      {/* Center — Status */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2 text-white/30 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-ll-emerald animate-pulse" />
          <span>System Online</span>
        </div>
        <div className="w-px h-4 bg-white/[0.06]" />
        <div className="flex items-center gap-2 text-white/30 text-xs font-medium">
          <Wifi size={12} />
          <span>API Connected</span>
        </div>
        <div className="w-px h-4 bg-white/[0.06]" />
        <div className="flex items-center gap-2 text-white/30 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-ll-amber animate-glow-breathe" />
          <span>Watch: Disconnected</span>
        </div>
      </div>

      {/* Right — User */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ll-purple to-ll-cyan flex items-center justify-center text-xs font-bold text-white">
            A
          </div>
          <span className="text-sm font-medium text-white/70 hidden sm:block">Aditya</span>
        </div>
        <button
          onClick={onLogout}
          className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-ll-red hover:border-ll-red/20 hover:bg-ll-red/[0.05] transition-all duration-200"
        >
          <Power size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default TopBar;
