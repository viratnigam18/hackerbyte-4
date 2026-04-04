import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Brain,
  Clock,
  User,
  Watch,
  Pill,
} from 'lucide-react';

interface FloatingDockProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const dockItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'mental-health', icon: Brain, label: 'Mental Health' },
  { id: 'history', icon: Clock, label: 'History' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'watch', icon: Watch, label: 'Watch' },
  { id: 'medication', icon: Pill, label: 'Medication' },
];

const FloatingDock: React.FC<FloatingDockProps> = ({ activePage, onNavigate }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="
        flex items-center gap-1 px-3 py-2.5
        bg-white/[0.04] backdrop-blur-[24px]
        border border-white/[0.08]
        rounded-2xl
        shadow-glass-lg
      ">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          const isHovered = hoveredId === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative flex flex-col items-center px-3 py-2 rounded-xl transition-colors duration-200"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.9 }}
                    animate={{ opacity: 1, y: -6, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-9 px-2.5 py-1 rounded-lg bg-white/[0.1] backdrop-blur-[24px] border border-white/[0.1] whitespace-nowrap"
                  >
                    <span className="text-[11px] font-medium text-white/80">{item.label}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Icon */}
              <Icon
                size={20}
                className={`transition-colors duration-200 ${
                  isActive ? 'text-ll-teal' : 'text-white/40 hover:text-white/70'
                }`}
                strokeWidth={isActive ? 2 : 1.5}
              />

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="dock-indicator"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-ll-teal"
                  style={{ boxShadow: '0 0 8px rgba(45, 212, 191, 0.6)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* Mental health pulse */}
              {item.id === 'mental-health' && !isActive && (
                <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-ll-purple animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FloatingDock;
