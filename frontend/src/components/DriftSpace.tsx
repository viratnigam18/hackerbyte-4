import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import spaceMusic from './Zachariehs_-_Asleep_In_Space_(SkySound.cc).mp3';

interface Props {
  onComplete: (points: number) => void;
  onExit?: () => void;
}

class Star {
  x: number; y: number; z: number; px: number; py: number;

  constructor(w: number, h: number) {
    this.x = (Math.random() - 0.5) * w;
    this.y = (Math.random() - 0.5) * h;
    this.z = Math.random() * w;
    this.px = this.x; this.py = this.y;
  }

  update(w: number, h: number, speed: number) {
    this.z -= speed;
    if (this.z <= 1) {
      this.z = w;
      this.x = (Math.random() - 0.5) * w;
      this.y = (Math.random() - 0.5) * h;
      this.px = (this.x / this.z) * (w / 2) + w / 2;
      this.py = (this.y / this.z) * (h / 2) + h / 2;
    }
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const sx = (this.x / this.z) * (w / 2) + w / 2;
    const sy = (this.y / this.z) * (h / 2) + h / 2;
    const r = (1 - this.z / w) * 3;
    
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${1 - this.z / w})`;
    ctx.fill();

    // Streak
    ctx.beginPath();
    ctx.moveTo(this.px, this.py);
    ctx.lineTo(sx, sy);
    ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - this.z / w) * 0.25})`;
    ctx.stroke();

    this.px = sx; this.py = sy;
  }
}

const DriftSpace: React.FC<Props> = ({ onComplete, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [completed, setCompleted] = useState(false);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const speedRef = useRef(8);
  const MIN_SPEED = 8;
  const MAX_SPEED = 65;
  const ACCEL = 0.45;
  const DECEL = 0.8;

  useEffect(() => {
    // Start music on mount
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Auto-play blocked, waiting for interaction"));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const stars = Array.from({ length: 1200 }, () => new Star(w, h));

    let animId: number;
    const render = () => {
      ctx.fillStyle = '#020308';
      ctx.fillRect(0, 0, w, h);

      // Smooth speed transition
      if (isAccelerating) {
        speedRef.current = Math.min(MAX_SPEED, speedRef.current + ACCEL);
      } else {
        speedRef.current = Math.max(MIN_SPEED, speedRef.current - DECEL);
      }
      
      for (const star of stars) {
        star.update(w, h, speedRef.current);
        star.draw(ctx, w, h);
      }

      animId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animId);
  }, [isAccelerating]);

  const handleAudioEnd = () => {
    setCompleted(true);
    setTimeout(() => onComplete(50), 3000); // 50 points for the full song
  };

  return (
    <motion.div
      className="fixed inset-0 z-[99999] overflow-hidden select-none cursor-none bg-[#020308]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={() => {
        setIsAccelerating(true);
        if (audioRef.current?.paused) audioRef.current.play();
      }}
      onMouseUp={() => setIsAccelerating(false)}
      onTouchStart={() => {
        setIsAccelerating(true);
        if (audioRef.current?.paused) audioRef.current.play();
      }}
      onTouchEnd={() => setIsAccelerating(false)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      
      {/* Audio element */}
      <audio 
        ref={audioRef} 
        src={spaceMusic} 
        onEnded={handleAudioEnd}
        autoPlay
      />

      <div className="absolute top-10 left-10 z-50 pointer-events-none">
        <h2 className="text-3xl font-black text-white/80 tracking-widest uppercase mb-1">Drift Space</h2>
        <p className="text-white/30 text-sm tracking-widest">TAP to float · LONG PRESS to drift</p>
      </div>

      {onExit && (
        <button
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            onExit();
          }}
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all backdrop-blur-sm border border-white/10"
        >
          <X size={20} />
        </button>
      )}

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center backdrop-blur-3xl pointer-events-none"
            style={{ background: 'rgba(2,3,8,0.7)' }}
          >
            <CheckCircle size={90} className="text-white/60 mx-auto mb-8" />
            <h3 className="text-5xl font-black text-white tracking-widest uppercase mb-3">Voyage Complete</h3>
            <p className="text-white/40 font-bold text-xl tracking-widest">+50 PTS</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DriftSpace;
