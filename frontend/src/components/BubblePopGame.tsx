import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface Props {
  onComplete: (points: number) => void;
}

const BubblePopGame: React.FC<Props> = ({ onComplete }) => {
  const GRID_SIZE = 25; // 5x5
  const [popped, setPopped] = useState<Set<number>>(new Set());
  const target = 25;
  
  const playPopSound = () => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    // Start at a soothing pitch (around C5) and quickly drop
    oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    
    // Fast, soft envelope
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);
  };

  const handlePop = (idx: number) => {
    if (popped.has(idx)) return;
    
    playPopSound();
    
    // Play a tiny audio logic could go here if we had sounds
    const newPopped = new Set(popped).add(idx);
    setPopped(newPopped);
    
    if (newPopped.size === target) {
      setTimeout(() => {
        onComplete(15); // +15 pts
      }, 500);
    }
  };

  const isComplete = popped.size === target;

  return (
    <div className="w-full flex-col h-[400px] bg-black/20 rounded-3xl border border-white/5 flex items-center justify-center relative">
      <div className="absolute top-6 left-8 z-10">
        <h3 className="text-xl font-bold text-white mb-1">Infinite Bubble Pop</h3>
        <p className="text-sm text-white/50">Relieve stress by popping the grid. Popped: {popped.size}/{target}</p>
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl"
          >
            <CheckCircle size={64} className="text-pink-400 mb-4" />
            <h3 className="text-2xl font-bold text-white">So Satisfying!</h3>
            <p className="text-pink-400 font-bold mt-2">+15 PTS</p>
            <button 
              onClick={() => setPopped(new Set())}
              className="mt-6 px-6 py-2 border border-white/20 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Reset Board
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-5 gap-3 p-8 mt-10">
        {Array.from({ length: GRID_SIZE }).map((_, idx) => {
          const isPopped = popped.has(idx);
          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.85 }}
              onClick={() => handlePop(idx)}
              className={`w-12 h-12 rounded-full relative transition-colors duration-200 ${
                isPopped ? 'bg-pink-500/20 shadow-inner' : 'bg-pink-400/80 shadow-md cursor-pointer hover:bg-pink-400'
              }`}
            >
              <div className={`absolute top-1/4 left-1/4 w-2 h-2 rounded-full transition-opacity ${isPopped ? 'opacity-0' : 'bg-white/40'}`}></div>
              
              {/* Pop ripple */}
              <AnimatePresence>
                {isPopped && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1, borderWidth: '10px' }}
                    animate={{ scale: 2, opacity: 0, borderWidth: '0px' }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border-pink-400 pointer-events-none"
                    key={`ripple-${idx}`}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BubblePopGame;
