import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface Props {
  onComplete: (points: number) => void;
}

interface Point {
  x: number;
  y: number;
  id: number;
}

const ZenTraceGame: React.FC<Props> = ({ onComplete }) => {
  const [trails, setTrails] = useState<Point[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const targetScore = 500;
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || score >= targetScore) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTrails(prev => [...prev.slice(-40), { x, y, id: Date.now() }]);
    setScore(s => Math.min(targetScore, s + 1));
  };

  useEffect(() => {
    if (score >= targetScore) {
      setTimeout(() => {
         onComplete(20); // +20 points for zen tracing
      }, 500);
    }
  }, [score, onComplete]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full flex-col h-[400px] bg-[#071a10] rounded-3xl border border-white/5 relative overflow-hidden cursor-crosshair shadow-inner"
    >
      <div className="absolute top-6 left-8 z-10 pointer-events-none">
        <h3 className="text-xl font-bold text-white mb-1">Zen Tracing</h3>
        <p className="text-sm text-white/50">Move your cursor slowly to paint mindfulness.</p>
        
        <div className="w-48 h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full bg-emerald-400 transition-all duration-100 ease-linear"
            style={{ width: `${(score / targetScore) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence>
        {score >= targetScore && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto"
          >
            <CheckCircle size={64} className="text-emerald-400 mb-4" />
            <h3 className="text-2xl font-bold text-white">Mind Cleared.</h3>
            <p className="text-emerald-400 font-bold mt-2">+20 PTS</p>
            <button 
              onClick={() => { setScore(0); setTrails([]); }}
              className="mt-6 px-6 py-2 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-400/10 rounded-lg transition-colors"
            >
              Trace Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {trails.map((pt, i) => {
          if (i === 0) return null;
          const prev = trails[i - 1];
          const opacity = (i / trails.length) * 0.8;
          return (
            <line
              key={pt.id}
              x1={prev.x}
              y1={prev.y}
              x2={pt.x}
              y2={pt.y}
              stroke="rgba(52, 211, 153, 1)"
              strokeWidth={40 * (i / trails.length)}
              strokeLinecap="round"
              opacity={opacity}
              style={{ mixBlendMode: 'screen' }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default ZenTraceGame;
