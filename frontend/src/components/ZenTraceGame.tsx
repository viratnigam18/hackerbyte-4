import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic } from 'lucide-react';
import zenMusic from './freemusiclab-soft-massage-music-sleep-meditation-ultimate-stress-relief-337588.mp3';

interface Props {
  onComplete: (points: number) => void;
  onExit?: () => void;
}

// Perlin-like smooth noise
const noise = (x: number, y: number, z: number) =>
  Math.sin(x * 0.009 + z * 1.1) * Math.cos(y * 0.011 + z * 0.8) +
  Math.sin(y * 0.007 - z * 1.3) * 0.5 +
  Math.cos(x * 0.013 - y * 0.006 + z) * 0.5;

class Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number;
  hue: number; brightness: number;
  size: number; baseSize: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = 0; this.vy = 0;
    this.maxLife = Math.random() * 150 + 100;
    this.life = this.maxLife;
    this.hue = 160 + Math.random() * 60; // Teal to Blue range
    this.brightness = 50 + Math.random() * 20;
    this.baseSize = 0.6 + Math.random() * 1.2;
    this.size = this.baseSize;
  }

  update(w: number, h: number, zOff: number, mouseX: number, mouseY: number, mouseActive: boolean, audioIntensity: number) {
    const angle = noise(this.x, this.y, zOff) * Math.PI * 2.5;
    const fieldStrength = 0.03 + audioIntensity * 0.05;
    this.vx += Math.cos(angle) * fieldStrength;
    this.vy += Math.sin(angle) * fieldStrength;

    if (mouseActive && mouseX > 0 && mouseY > 0) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distSq = dx * dx + dy * dy;
      const radius = 250;
      if (distSq < radius * radius) {
        const dist = Math.sqrt(distSq);
        const force = (radius - dist) / radius;
        // Soothing tangential pull
        const nx = dx / dist;
        const ny = dy / dist;
        this.vx += (ny * 0.4 - nx * 0.02) * force;
        this.vy += (-nx * 0.4 - ny * 0.02) * force;
        this.hue = 180 + force * 40;
      }
    }

    this.vx *= 0.95;
    this.vy *= 0.95;
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.size = this.baseSize * (1 + audioIntensity * 2);

    if (this.x < -20) this.x = w + 20;
    if (this.x > w + 20) this.x = -20;
    if (this.y < -20) this.y = h + 20;
    if (this.y > h + 20) this.y = -20;
  }

  draw(ctx: CanvasRenderingContext2D, audioIntensity: number) {
    const alpha = (this.life / this.maxLife) * (0.4 + audioIntensity * 0.6);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 80%, ${this.brightness}%, ${alpha})`;
    ctx.fill();
  }
}

class Ripple {
  x: number; y: number; r: number; maxR: number; opacity: number;
  constructor(x: number, y: number) {
    this.x = x; this.y = y;
    this.r = 0;
    this.maxR = 150 + Math.random() * 100;
    this.opacity = 0.5;
  }
  update() {
    this.r += 2.5;
    this.opacity *= 0.96;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(100, 255, 230, ${this.opacity})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

const ZenTraceGame: React.FC<Props> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const mouseRef = useRef({ x: -2000, y: -2000, active: false });
  const ripplesRef = useRef<Ripple[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const P_COUNT = 2200;
    const particles = Array.from({ length: P_COUNT }, () => new Particle(w, h));
    const dataArray = new Uint8Array(128);

    let zOff = 0;
    let animId: number;

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      let audioIntensity = 0;
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < 32; i++) sum += dataArray[i];
        audioIntensity = (sum / 32) / 255;
      }

      const { x: mx, y: my, active: ma } = mouseRef.current;

      // Deep trail effect
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(2, 8, 12, 0.08)';
      ctx.fillRect(0, 0, w, h);

      // Draw particles
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < P_COUNT; i++) {
        const p = particles[i];
        p.update(w, h, zOff, mx, my, ma, audioIntensity);
        p.draw(ctx, audioIntensity);
        if (p.life <= 0) particles[i] = new Particle(w, h);
      }

      // Draw ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.update();
        r.draw(ctx);
        if (r.opacity < 0.01) ripplesRef.current.splice(i, 1);
      }

      zOff += 0.001 + audioIntensity * 0.005;
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleInteraction = () => {
    if (!isAudioStarted) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(audioRef.current!);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyserRef.current = analyser;
      audioRef.current?.play();
      setIsAudioStarted(true);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[99999] overflow-hidden cursor-none bg-[#02080c]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={(e) => {
        mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
        if (isAudioStarted && Math.random() > 0.92) {
          ripplesRef.current.push(new Ripple(e.clientX, e.clientY));
        }
      }}
      onMouseDown={(e) => {
        handleInteraction();
        ripplesRef.current.push(new Ripple(e.clientX, e.clientY));
      }}
      onMouseLeave={() => { mouseRef.current.active = false; }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      <audio ref={audioRef} src={zenMusic} loop />

      {/* Floating Cursor Halo */}
      <motion.div
        className="absolute pointer-events-none z-30"
        style={{ top: 0, left: 0, x: mouseRef.current.x - 20, y: mouseRef.current.y - 20 }}
        animate={isAudioStarted ? { opacity: 1, scale: 1 } : { opacity: 0 }}
      >
        <div className="w-10 h-10 rounded-full border border-teal-400/30 shadow-[0_0_20px_rgba(45,212,191,0.2)]" />
      </motion.div>

      {/* Soothing UI */}
      <div className="absolute top-10 left-10 z-50 pointer-events-none">
        <motion.h2
          className="text-3xl font-black text-teal-400/80 mb-2 tracking-[0.2em] uppercase"
          style={{ textShadow: '0 0 30px rgba(45,212,191,0.4)' }}
        >
          Flow Field Calm
        </motion.h2>
        <p className="text-white/30 max-w-sm text-base tracking-wide leading-relaxed">
          {isAudioStarted ? "Gently guide the energy. No goals, no points—just the flow." : "Click anywhere to begin your session."}
        </p>
      </div>

      {!isAudioStarted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <Mic className="text-teal-400/50 mb-4" size={48} />
            <span className="text-white/20 uppercase tracking-[0.3em] text-sm font-bold">Touch to Sync</span>
          </motion.div>
        </div>
      )}

      {onExit && (
        <button
          onClick={() => {
            audioRef.current?.pause();
            onExit();
          }}
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/5 hover:bg-teal-500/10 text-white/40 hover:text-teal-400 transition-all backdrop-blur-sm border border-white/10"
        >
          <X size={20} />
        </button>
      )}
    </motion.div>
  );
};

export default ZenTraceGame;
