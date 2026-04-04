import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Beaker } from 'lucide-react';

interface Props {
  onComplete: (points: number) => void;
  onExit?: () => void;
}

// Sparkle for collision/split feedback
class Particle {
  x: number; y: number; vx: number; vy: number; hue: number; life: number;
  constructor(x: number, y: number, hue: number) {
    this.x = x; this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const spd = Math.random() * 4 + 2;
    this.vx = Math.cos(angle) * spd;
    this.vy = Math.sin(angle) * spd;
    this.hue = hue;
    this.life = 1.0;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vx *= 0.93; this.vy *= 0.93;
    this.life -= 0.03;
  }
}

class Blob {
  x: number; y: number; vx: number; vy: number; r: number; hue: number;
  pulsePhase: number; mergeCooldown: number = 0;

  constructor(x: number, y: number, r: number, hue: number) {
    this.x = x; this.y = y;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.r = r;
    this.hue = hue;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update(w: number, h: number, mx: number, my: number, isDown: boolean) {
    if (isDown && mx > 0) {
      const dx = mx - this.x;
      const dy = my - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 350) {
        const force = (350 - dist) / 350;
        const nx = dx / dist;
        const ny = dy / dist;
        // Vortex attraction
        this.vx += nx * force * 0.7;
        this.vy += ny * force * 0.7;
        // Tangential swirl
        this.vx += ny * force * 0.3;
        this.vy -= nx * force * 0.3;
      }
    }

    this.vx *= 0.982;
    this.vy *= 0.982;
    this.x += this.vx;
    this.y += this.vy;
    this.mergeCooldown = Math.max(0, this.mergeCooldown - 1);

    const pad = this.r * 0.6;
    if (this.x < pad) { this.x = pad; this.vx *= -1.2; }
    if (this.x > w - pad) { this.x = w - pad; this.vx *= -1.2; }
    if (this.y < pad) { this.y = pad; this.vy *= -1.2; }
    if (this.y > h - pad) { this.y = h - pad; this.vy *= -1.2; }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.pulsePhase += 0.045;
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const sR = this.r * (1 + Math.sin(this.pulsePhase) * 0.04);
    
    // Squash & Stretch
    const stretch = Math.min(0.6, speed * 0.06);
    const angle = Math.atan2(this.vy, this.vx);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(angle);
    ctx.scale(1 + stretch, 1 - stretch * 0.82);

    ctx.beginPath();
    ctx.arc(0, 0, sR, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, sR);
    grad.addColorStop(0, `hsla(${this.hue}, 90%, 80%, 1)`);
    grad.addColorStop(0.6, `hsla(${this.hue + 12}, 85%, 60%, 1)`);
    grad.addColorStop(1, `hsla(${this.hue + 25}, 80%, 45%, 1)`);
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle highlight
    ctx.beginPath();
    ctx.arc(-sR * 0.3, -sR * 0.3, sR * 0.25, 0, Math.PI * 2);
    const shine = ctx.createRadialGradient(-sR * 0.3, -sR * 0.3, 0, -sR * 0.3, -sR * 0.3, sR * 0.25);
    shine.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = shine;
    ctx.fill();

    ctx.restore();
  }
}

const BubblePopGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [completed, setCompleted] = useState(false);
  const [intensity, setIntensity] = useState(0);
  const mouseRef = useRef({ x: -2000, y: -2000, down: false });
  const blobsRef = useRef<Blob[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  const playPlop = (freq: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.2, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    const bCanvas = bufferCanvasRef.current;
    const bCtx = bCanvas.getContext('2d');
    const DOWNSCALE = 0.5;
    bCanvas.width = w * DOWNSCALE;
    bCanvas.height = h * DOWNSCALE;

    // Initial 12 blobs
    blobsRef.current = Array.from({ length: 12 }, () => 
      new Blob(Math.random() * w, Math.random() * h, 40 + Math.random() * 40, 240 + Math.random() * 80)
    );

    let animId: number;
    const render = () => {
      const { x: mx, y: my, down: md } = mouseRef.current;
      const blobs = blobsRef.current;

      // 1. CLEAR & BG
      ctx.fillStyle = '#06010a';
      ctx.fillRect(0, 0, w, h);

      // 2. PHYSICS: Merging & Splitting
      for (let i = blobs.length - 1; i >= 0; i--) {
        const b1 = blobs[i];
        
        // Check for Merging (Joining like droplets)
        for (let j = i - 1; j >= 0; j--) {
          const b2 = blobs[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mergeDist = (b1.r + b2.r) * 0.65;
          if (dist < mergeDist && b1.mergeCooldown === 0 && b2.mergeCooldown === 0) {
            // FUSE! Consolidate mass (R = sqrt(r1^2 + r2^2))
            const newR = Math.sqrt(b1.r * b1.r + b2.r * b2.r);
            const newHue = (b1.hue + b2.hue) / 2;
            const fusedBlob = new Blob((b1.x + b2.x) / 2, (b1.y + b2.y) / 2, Math.min(newR, 180), newHue);
            fusedBlob.vx = (b1.vx + b2.vx) * 0.5;
            fusedBlob.vy = (b1.vy + b2.vy) * 0.5;
            fusedBlob.mergeCooldown = 30; // Prevent instant split back
            blobs[j] = fusedBlob;
            blobs.splice(i, 1);
            playPlop(400 - newR * 1.5);
            break; 
          }
        }

        // Check for Splitting (Pulled apart fast)
        const speed = Math.sqrt(b1.vx * b1.vx + b1.vy * b1.vy);
        const stretchRatio = Math.min(0.6, speed * 0.06);
        if (stretchRatio > 0.45 && b1.r > 35 && blobs.length < 24) {
          // Tension break -> spawn droplet
          const splitArea = (b1.r * b1.r) * 0.3;
          const newR = Math.sqrt(splitArea);
          const remainR = Math.sqrt(b1.r * b1.r - splitArea);
          
          const angle = Math.atan2(b1.vy, b1.vx);
          const droplet = new Blob(b1.x - Math.cos(angle) * b1.r, b1.y - Math.sin(angle) * b1.r, newR, b1.hue);
          droplet.vx = b1.vx * -0.2; // Push back slight rebound
          droplet.vy = b1.vy * -0.2;
          droplet.mergeCooldown = 40; 
          
          b1.r = remainR;
          b1.vx *= 0.8;
          b1.mergeCooldown = 40;
          blobs.push(droplet);
          playPlop(600 + Math.random() * 200);
          
          // Collision sparks for visual pop
          for(let p=0; p<4; p++) particlesRef.current.push(new Particle(b1.x, b1.y, b1.hue));
        }

        b1.update(w, h, mx, my, md);
      }

      // 3. RENDER BUFFER (Liquid Goo)
      if (bCtx) {
        bCtx.clearRect(0, 0, bCanvas.width, bCanvas.height);
        bCtx.save();
        bCtx.scale(DOWNSCALE, DOWNSCALE);
        bCtx.filter = 'url(#oil-goo)';
        for (const b of blobs) b.draw(bCtx);
        bCtx.filter = 'none';
        bCtx.restore();
        ctx.drawImage(bCanvas, 0, 0, w, h);
      }

      // 4. RENDER OVERLAYS (Sparkles)
      ctx.globalCompositeOperation = 'lighter';
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.update();
        if (p.life <= 0) particlesRef.current.splice(i, 1);
        else {
          ctx.fillStyle = `hsla(${p.hue}, 100%, 85%, ${p.life})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = 'source-over';

      if (md && mx > 0) {
        const newInt = Math.min(1, statsRef.current.intensity + 0.003);
        statsRef.current.intensity = newInt;
        setIntensity(newInt);
        if (newInt >= 1.0 && !completed) setCompleted(true);
      }

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      audioCtxRef.current?.close();
    };
  }, [completed]);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] overflow-hidden select-none cursor-crosshair bg-[#06010a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={(e) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; }}
      onMouseDown={() => { mouseRef.current.down = true; if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume(); }}
      onMouseUp={() => { mouseRef.current.down = false; }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* SVG filter for enhanced oil-liquid effect */}
      <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0">
        <defs>
          <filter id="oil-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="absolute top-10 left-10 z-50 pointer-events-none">
        <h2 className="text-3xl font-black text-purple-400 tracking-[0.25em] uppercase mb-1" style={{ textShadow: '0 0 30px rgba(168,85,247,0.4)' }}>
          Liquid Relax
        </h2>
        <p className="text-white/20 text-xs tracking-widest max-w-sm mb-6 font-bold uppercase">
          Dynamic Oil Drops • Merge & Separate • Tactile Bloops
        </p>
        <div className="w-52 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm">
          <motion.div
             className="h-full bg-gradient-to-r from-purple-500 to-pink-400"
             animate={{ width: `${intensity * 100}%` }}
          />
        </div>
      </div>

      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-6 right-6 z-50 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/30 hover:text-purple-400 transition-all border border-white/10 backdrop-blur-md"
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
            style={{ background: 'rgba(6,1,10,0.6)' }}
          >
            <motion.div 
              animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }} 
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="w-40 h-40 border border-purple-500/20 rounded-full flex items-center justify-center mb-10"
            >
              <Beaker size={80} className="text-purple-400" />
            </motion.div>
            <h3 className="text-6xl font-black text-white tracking-[0.4em] uppercase mb-3">Fusion</h3>
            <p className="text-purple-400 font-bold text-xl tracking-[0.2em]">+40 ENERGY</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BubblePopGame;
