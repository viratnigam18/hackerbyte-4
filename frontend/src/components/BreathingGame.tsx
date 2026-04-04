import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Wind } from 'lucide-react';

interface Props {
  onComplete: (points: number) => void;
  onExit?: () => void;
}

const phases = [
  {
    text: 'INHALE',
    duration: 4,
    scale: 1.9,
    colors: ['rgba(64,224,208,0.9)', 'rgba(0,200,180,0.5)'],
    shadowColor: '64,224,208',
    bg: '#030f0c',
    ringColor: 'rgba(64,224,208,',
    instruction: 'Breathe in deeply through your nose',
  },
  {
    text: 'HOLD',
    duration: 7,
    scale: 2.0,
    colors: ['rgba(120,240,230,1)', 'rgba(60,220,210,0.6)'],
    shadowColor: '100,240,220',
    bg: '#031210',
    ringColor: 'rgba(100,240,220,',
    instruction: 'Hold still — feel the stillness',
  },
  {
    text: 'EXHALE',
    duration: 8,
    scale: 0.75,
    colors: ['rgba(20,130,150,0.8)', 'rgba(10,80,100,0.4)'],
    shadowColor: '20,130,150',
    bg: '#020709',
    ringColor: 'rgba(20,130,150,',
    instruction: 'Release slowly through your mouth',
  },
];

// Animated SVG arc timer
const ArcTimer: React.FC<{ duration: number; phase: number }> = ({ duration, phase }) => {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    setElapsed(0);
    const id = setInterval(() => {
      const e = (Date.now() - startRef.current) / 1000;
      setElapsed(Math.min(e, duration));
    }, 50);
    return () => clearInterval(id);
  }, [phase, duration]);

  const r = 130;
  const circ = 2 * Math.PI * r;
  const progress = elapsed / duration;
  const dash = circ * progress;
  const curr = phases[phase];

  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      className="absolute"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    >
      {/* Track */}
      <circle cx="160" cy="160" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
      {/* Progress arc */}
      <circle
        cx="160"
        cy="160"
        r={r}
        fill="none"
        stroke={`rgba(${curr.shadowColor},0.7)`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 160 160)"
        style={{ transition: 'stroke-dasharray 0.1s linear, stroke 1.5s ease' }}
      />
      {/* Glow dots at tip */}
      <circle
        cx={160 + r * Math.cos((-Math.PI / 2) + progress * 2 * Math.PI)}
        cy={160 + r * Math.sin((-Math.PI / 2) + progress * 2 * Math.PI)}
        r="4"
        fill={`rgba(${curr.shadowColor},1)`}
        style={{ filter: `drop-shadow(0 0 6px rgba(${curr.shadowColor},1))` }}
      />
      {/* Seconds remaining */}
      <text x="160" y="300" textAnchor="middle" fill={`rgba(${curr.shadowColor},0.6)`} fontSize="13" fontFamily="monospace" letterSpacing="2">
        {Math.ceil(duration - elapsed)}s
      </text>
    </svg>
  );
};

// Floating ambient orbs in the background
const AmbientOrbs: React.FC<{ phase: typeof phases[0] }> = ({ phase }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 6 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: 120 + i * 60,
          height: 120 + i * 60,
          left: `${10 + i * 15}%`,
          top: `${5 + i * 12}%`,
          background: `radial-gradient(circle, rgba(${phase.shadowColor},0.07) 0%, transparent 70%)`,
          filter: 'blur(30px)',
        }}
        animate={{
          x: [0, 20 + i * 8, 0, -20 - i * 8, 0],
          y: [0, -15 + i * 5, 15, 0],
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

// Ring ripples
const Ripple: React.FC<{ color: string }> = ({ color }) => (
  <AnimatePresence>
    {[0, 0.4, 0.8].map((delay, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border"
        style={{ borderColor: `rgba(${color},0.3)` }}
        initial={{ width: 160, height: 160, opacity: 0.6, x: '-50%', y: '-50%', top: '50%', left: '50%' }}
        animate={{ width: 800, height: 800, opacity: 0 }}
        transition={{ duration: 4, ease: 'easeOut', delay, repeat: Infinity, repeatDelay: 1 }}
      />
    ))}
  </AnimatePresence>
);

const BreathingGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);
  const targetCycles = 3;

  useEffect(() => {
    if (!active) return;
    if (cycles >= targetCycles) {
      setActive(false);
      setTimeout(() => onComplete(25), 2000);
      return;
    }
    const tid = setTimeout(() => {
      if (phaseIdx === 2) { setPhaseIdx(0); setCycles(c => c + 1); }
      else setPhaseIdx(p => p + 1);
    }, phases[phaseIdx].duration * 1000);
    return () => clearTimeout(tid);
  }, [active, phaseIdx, cycles, onComplete]);

  const curr = phases[phaseIdx];
  const isComplete = cycles >= targetCycles;

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      style={{ backgroundColor: active ? curr.bg : '#020d0a', transition: 'background-color 3s ease' }}
    >
      {/* Ambient orbs */}
      {active && <AmbientOrbs phase={curr} />}

      {/* Exit button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all backdrop-blur-sm border border-white/10"
        >
          <X size={20} />
        </button>
      )}

      {/* Start screen */}
      {!active && !isComplete && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center z-10 flex flex-col items-center px-6"
        >
          {/* Decorative center orb */}
          <div className="relative mb-12">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-teal-400 to-cyan-300 opacity-20 blur-3xl absolute inset-0 m-auto" />
            <motion.div
              className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
              style={{ background: 'radial-gradient(circle at 35% 35%, rgba(100,230,220,0.5), rgba(30,140,160,0.2))', boxShadow: '0 0 60px rgba(64,224,208,0.3), inset 0 0 30px rgba(64,224,208,0.1)' }}
              animate={{ scale: [1, 1.08, 1], boxShadow: ['0 0 40px rgba(64,224,208,0.3)', '0 0 80px rgba(64,224,208,0.5)', '0 0 40px rgba(64,224,208,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Wind size={36} className="text-teal-300" />
            </motion.div>
          </div>

          <h3 className="text-5xl font-black text-white mb-4 tracking-widest uppercase">4-7-8 Breathing</h3>
          <p className="text-white/50 mb-3 max-w-md text-base leading-relaxed">
            A clinically-proven technique to activate your nervous system's rest mode.
          </p>
          <div className="flex gap-6 mb-12 text-sm">
            {['Inhale 4s', 'Hold 7s', 'Exhale 8s'].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-cyan-400' : i === 1 ? 'bg-teal-300' : 'bg-teal-700'}`} />
                <span className="text-white/40">{s}</span>
              </div>
            ))}
          </div>
          <motion.button
            onClick={() => setActive(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-12 py-4 bg-gradient-to-r from-[#40E0D0] to-teal-400 text-[#071a10] font-black rounded-2xl tracking-widest text-lg uppercase"
            style={{ boxShadow: '0 0 40px rgba(64,224,208,0.4), 0 4px 20px rgba(0,0,0,0.4)' }}
          >
            Begin
          </motion.button>
        </motion.div>
      )}

      {/* Completion screen */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center z-10 flex flex-col items-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <CheckCircle size={90} className="text-teal-400 mx-auto mb-8" style={{ filter: 'drop-shadow(0 0 30px rgba(64,224,208,0.7))' }} />
          </motion.div>
          <h3 className="text-5xl font-black text-white tracking-widest uppercase mb-3">Centered</h3>
          <p className="text-teal-400/70 tracking-widest text-lg">+25 Points Earned</p>
        </motion.div>
      )}

      {/* Active game */}
      {active && (
        <div className="relative flex items-center justify-center w-full h-full">

          {/* Phase label top */}
          <div className="absolute top-12 text-center w-full z-20 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={curr.text}
                initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(12px)' }}
                transition={{ duration: 0.9 }}
              >
                <h2
                  className="text-7xl font-black text-white tracking-[0.25em] uppercase"
                  style={{ textShadow: `0 0 60px rgba(${curr.shadowColor},0.9), 0 0 120px rgba(${curr.shadowColor},0.4)` }}
                >
                  {curr.text}
                </h2>
                <p className="text-sm text-white/40 mt-3 tracking-widest">{curr.instruction}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Cycle tracker */}
          <div className="absolute bottom-16 flex gap-3 z-20">
            {Array.from({ length: targetCycles }).map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                animate={i < cycles ? { scale: 1, opacity: 1 } : i === cycles ? { scale: [1, 1.4, 1], opacity: 1 } : { scale: 1, opacity: 0.2 }}
                transition={{ duration: 0.5, repeat: i === cycles ? Infinity : 0 }}
                style={{ background: i < cycles ? `rgba(${curr.shadowColor},1)` : i === cycles ? `rgba(${curr.shadowColor},0.8)` : 'rgba(255,255,255,0.2)' }}
              />
            ))}
            <span className="text-white/30 text-xs ml-2 self-center tracking-widest">CYCLE {cycles + 1}/{targetCycles}</span>
          </div>

          {/* Ripples */}
          {phaseIdx === 0 && <Ripple color={curr.shadowColor} />}

          {/* SVG arc timer */}
          <ArcTimer duration={curr.duration} phase={phaseIdx} />

          {/* Outer aurora ring */}
          <motion.div
            className="absolute rounded-full"
            animate={{
              scale: [1, 1.06, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: curr.duration, ease: 'easeInOut' }}
            style={{
              width: 300,
              height: 300,
              background: `radial-gradient(circle, rgba(${curr.shadowColor},0.12) 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />

          {/* Mid glow ring */}
          <motion.div
            className="absolute rounded-full"
            animate={{
              scale: phaseIdx === 2 ? 0.6 : phaseIdx === 0 ? 1.6 : 1.7,
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: curr.duration, ease: 'easeInOut' }}
            style={{
              width: 200,
              height: 200,
              background: `radial-gradient(circle, rgba(${curr.shadowColor},0.2) 0%, transparent 70%)`,
              filter: 'blur(8px)',
            }}
          />

          {/* Main breathing orb — layered */}
          <div className="relative flex items-center justify-center">
            {/* Outer soft halo */}
            <motion.div
              className="absolute rounded-full"
              animate={{
                scale: curr.scale * 1.3,
                opacity: phaseIdx === 2 ? 0.1 : 0.25,
              }}
              transition={{ duration: curr.duration, ease: 'easeInOut' }}
              style={{
                width: 140,
                height: 140,
                background: `radial-gradient(circle, rgba(${curr.shadowColor},0.4) 0%, transparent 70%)`,
                filter: 'blur(16px)',
              }}
            />
            {/* Middle layer */}
            <motion.div
              className="absolute rounded-full"
              animate={{ scale: curr.scale * 1.15 }}
              transition={{ duration: curr.duration, ease: 'easeInOut' }}
              style={{
                width: 140,
                height: 140,
                background: `radial-gradient(circle at 35% 30%, rgba(${curr.shadowColor},0.7), rgba(${curr.shadowColor},0.2))`,
                filter: 'blur(6px)',
              }}
            />
            {/* Core orb */}
            <motion.div
              className="rounded-full z-10"
              animate={{
                scale: curr.scale,
                boxShadow: `0 0 80px 20px rgba(${curr.shadowColor},0.6), 0 0 160px 60px rgba(${curr.shadowColor},0.2), inset 0 0 40px rgba(255,255,255,0.1)`,
              }}
              transition={{ duration: curr.duration, ease: 'easeInOut' }}
              style={{
                width: 140,
                height: 140,
                background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25), rgba(${curr.shadowColor},0.8) 50%, rgba(${curr.shadowColor},0.4))`,
              }}
            />
          </div>

          {/* Exhale downward particles */}
          {phaseIdx === 2 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => {
                const angle = (Math.random() - 0.5) * Math.PI;
                const dist = 60 + Math.random() * 200;
                return (
                  <motion.div
                    key={`p-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: 2 + Math.random() * 3,
                      height: 2 + Math.random() * 3,
                      backgroundColor: `rgba(${curr.shadowColor},0.8)`,
                      top: '50%',
                      left: '50%',
                      filter: 'blur(1px)',
                    }}
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 0.7, 0],
                      x: Math.sin(angle) * dist,
                      y: Math.cos(angle) * dist + 100,
                    }}
                    transition={{
                      duration: 3 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: 'easeOut',
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default BreathingGame;
