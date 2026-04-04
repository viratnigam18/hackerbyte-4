import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface Props {
  onComplete: (points: number) => void;
}

const phases = [
  { text: "IN", duration: 4 },
  { text: "HOLD", duration: 7 },
  { text: "OUT", duration: 8 }
];

const BreathingGame: React.FC<Props> = ({ onComplete }) => {
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);
  const targetCycles = 3;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (active) {
      if (cycles >= targetCycles) {
        setActive(false);
        onComplete(25); // Award 25 points for completing 3 cycles
        return;
      }

      timeout = setTimeout(() => {
        if (phaseIdx === 2) {
          setPhaseIdx(0);
          setCycles(c => c + 1);
        } else {
          setPhaseIdx(p => p + 1);
        }
      }, phases[phaseIdx].duration * 1000);
    }
    return () => clearTimeout(timeout);
  }, [active, phaseIdx, cycles, onComplete]);

  const currentPhase = phases[phaseIdx];
  const isComplete = cycles >= targetCycles;

  return (
    <div className="w-full flex-col h-[400px] bg-black/20 rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden">
      {!active && !isComplete && (
        <div className="text-center z-10 p-8">
          <h3 className="text-2xl font-bold text-white mb-2">4-7-8 Breathing</h3>
          <p className="text-white/60 mb-8 max-w-sm">
            Sync your breath with the glowing circle. Inhale for 4s, Hold for 7s, Exhale for 8s. Complete 3 cycles for +25 points.
          </p>
          <button 
            onClick={() => setActive(true)}
            className="px-8 py-3 bg-[#40E0D0] text-black font-bold rounded-xl shadow-lg hover:bg-[#3cecdb] hover:scale-105 transition-all"
          >
            START SYNC
          </button>
        </div>
      )}

      {isComplete && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10"
        >
          <CheckCircle size={64} className="text-[#40E0D0] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white">Feeling centered!</h3>
          <p className="text-[#40E0D0] font-bold mt-2">+25 PTS</p>
        </motion.div>
      )}

      {active && (
        <>
          <div className="absolute top-6 text-center w-full z-10">
            <p className="text-white/50 font-semibold tracking-widest text-sm uppercase">Phase</p>
            <AnimatePresence mode="wait">
              <motion.h2 
                key={currentPhase.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-4xl font-black text-white"
              >
                {currentPhase.text}
              </motion.h2>
            </AnimatePresence>
            <p className="text-[#40E0D0] font-bold mt-2">Cycle {cycles + 1} / {targetCycles}</p>
          </div>

          <motion.div
            animate={{
              scale: phaseIdx === 0 ? 1.5 : phaseIdx === 1 ? 1.5 : 0.8,
              opacity: phaseIdx === 1 ? 0.6 : 1,
            }}
            transition={{
              duration: currentPhase.duration,
              ease: "easeInOut"
            }}
            className="w-40 h-40 rounded-full border-[10px] border-[#40E0D0] shadow-[0_0_50px_rgba(64,224,208,0.5)] z-0"
          />
        </>
      )}
    </div>
  );
};

export default BreathingGame;
