import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverScale?: boolean;
  gradientBorder?: boolean;
  delay?: number;
  noPadding?: boolean;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glowColor,
  hoverScale = true,
  gradientBorder = false,
  delay = 0,
  noPadding = false,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hoverScale ? { y: -3, transition: { duration: 0.25 } } : undefined}
      onClick={onClick}
      className={`
        relative rounded-2xl overflow-hidden
        bg-[rgba(8,32,20,0.55)] backdrop-blur-[24px]
        border border-white/[0.08]
        transition-all duration-300
        hover:bg-[rgba(12,45,28,0.65)] hover:border-white/[0.12]
        ${gradientBorder ? 'gradient-border' : ''}
        ${noPadding ? '' : 'p-5'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={glowColor ? {
        boxShadow: `0 0 40px ${glowColor}15, inset 0 1px 0 rgba(255,255,255,0.06)`
      } : {
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)'
      }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
