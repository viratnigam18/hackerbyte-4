import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Trophy, CheckCircle, ArrowLeft, Gamepad2, RotateCcw, 
  Component, Play, Clock, Sparkles, Eye, Coffee, Brain, 
  Wind, Zap, Activity
} from 'lucide-react';
import BreathingGame from './BreathingGame';
import BubblePopGame from './BubblePopGame';
import ZenTraceGame from './ZenTraceGame';
import DriftSpace from './DriftSpace';

interface AntiStressProps {
  onBack: () => void;
}

interface UserStats {
  total_points: number;
  current_streak: number;
}

interface ActionTask {
  id: number;
  title: string;
  description: string;
  points: number;
  category: 'physical' | 'cognitive' | 'sensory';
}

type TabState = 'quests' | 'games';
type ActiveGame = 'none' | 'breath' | 'trace' | 'bubble' | 'drift';

const AntiStressGame: React.FC<AntiStressProps> = ({ onBack }) => {
  const [stats, setStats] = useState<UserStats>({ total_points: 0, current_streak: 0 });
  const [tasks, setTasks] = useState<ActionTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [successAnim, setSuccessAnim] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabState>('quests');
  const [activeGame, setActiveGame] = useState<ActiveGame>('none');

  const userId = 'demo_user_123';

  // Helper to get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical': return <Activity size={18} />;
      case 'cognitive': return <Brain size={18} />;
      case 'sensory': return <Eye size={18} />;
      default: return <Zap size={18} />;
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/stress/stats?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setStats({ total_points: data.total_points, current_streak: data.current_streak });
      }
    } catch (e) { console.error('Failed to fetch stats', e); }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://127.0.0.1:8000/stress/actions?user_id=${userId}&stress_level=HIGH`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        throw new Error('API down');
      }
    } catch (e) {
      // Expanded default relaxing tasks
      setTasks([
        { 
          id: 101, 
          title: 'Zen Palming', 
          description: 'Close your eyes and cover them gently with your palms for 30 seconds to reset visual strain.', 
          points: 15, 
          category: 'sensory' 
        },
        { 
          id: 102, 
          title: 'Shoulder Drop', 
          description: 'Inhale deeply, shrug your shoulders to your ears, then drop them heavily on the exhale. Repeat 5 times.', 
          points: 10, 
          category: 'physical' 
        },
        { 
          id: 103, 
          title: 'Mindful Hydration', 
          description: 'Take a slow sip of water, noticing the temperature and the sensation in your throat.', 
          points: 12, 
          category: 'sensory' 
        },
        { 
          id: 104, 
          title: 'Gratitude Anchor', 
          description: 'Identify one small thing in your immediate reach that you are thankful for (e.g., a comfortable chair).', 
          points: 20, 
          category: 'cognitive' 
        },
        { 
          id: 105, 
          title: 'Environmental Scan', 
          description: 'Identify 3 distinct sounds in your current environment that you usually ignore.', 
          points: 15, 
          category: 'cognitive' 
        },
        { 
          id: 106, 
          title: 'Peripheral Softening', 
          description: 'Stare at a point in front of you and try to notice everything in your peripheral vision without moving your eyes.', 
          points: 18, 
          category: 'sensory' 
        }
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, []);

  const handleEarnPoints = async (points: number, internalActionId: number) => {
    setStats(prev => ({ ...prev, total_points: prev.total_points + points }));
    setSuccessAnim(`+${points}`);
    setTimeout(() => setSuccessAnim(null), 2500);

    try {
      await fetch('http://127.0.0.1:8000/stress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action_id: internalActionId })
      });
      fetchStats();
    } catch (e) { console.error('Failed sync completion', e); }
  };

  const handleCompleteQuest = (task: ActionTask) => {
    setTasks(prev => prev.filter(t => t.id !== task.id));
    handleEarnPoints(task.points, task.id);
  };

  return (
    <div className="flex flex-col h-full bg-[#071a10] relative overflow-hidden text-neutral-200">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#40E0D0]/10 rounded-full blur-[120px]" 
        />
      </div>

      <AnimatePresence>
        {successAnim && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: -150, scale: 2.2 }}
            exit={{ opacity: 0, y: -300, scale: 3 }}
            transition={{ duration: 2, type: 'spring', damping: 12 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-black text-[#40E0D0] z-[100] drop-shadow-[0_0_40px_rgba(64,224,208,0.8)] pointer-events-none italic"
          >
            {successAnim}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Game Overlays */}
      <AnimatePresence>
        {activeGame === 'breath' && <BreathingGame key="breath" onComplete={(pts) => { handleEarnPoints(pts, 201); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />}
        {activeGame === 'trace' && <ZenTraceGame key="trace" onComplete={(pts) => { handleEarnPoints(pts, 202); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />}
        {activeGame === 'bubble' && <BubblePopGame key="bubble" onComplete={(pts) => { handleEarnPoints(pts, 203); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />}
        {activeGame === 'drift' && <DriftSpace key="drift" onComplete={(pts) => { handleEarnPoints(pts, 204); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />}
      </AnimatePresence>

      {/* Header */}
      <div className="px-10 py-6 border-b border-white/[0.05] bg-[rgba(10,35,22,0.8)] backdrop-blur-3xl flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-[#40E0D0] hover:bg-[#40E0D0]/10 transition-all group"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-widest uppercase italic">The Void</h1>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">Anti-Stress Protocol v4.2</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] pl-5 pr-6 py-3 rounded-2xl">
            <Trophy className="text-amber-400" size={20} />
            <div className="flex flex-col">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none mb-1">Energy Pool</span>
              <span className="text-xl font-black text-white leading-none">{stats.total_points}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] pl-5 pr-6 py-3 rounded-2xl">
            <Flame className="text-orange-500" size={20} />
            <div className="flex flex-col">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none mb-1">Resilience</span>
              <span className="text-xl font-black text-white leading-none">{stats.current_streak}d</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 relative z-10 custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center gap-5 mb-14 bg-white/[0.02] p-2 rounded-[24px] w-fit border border-white/[0.05] backdrop-blur-md">
            <button
              onClick={() => setActiveTab('quests')}
              className={`flex items-center gap-3 px-10 py-4 rounded-[20px] text-[12px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === 'quests' ? 'bg-[#40E0D0] text-[#071a10] shadow-[0_0_30px_rgba(64,224,208,0.3)]' : 'text-white/30 hover:text-white/60'
              }`}
            >
              <Component size={18} /> Reality Sync
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-3 px-10 py-4 rounded-[20px] text-[12px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === 'games' ? 'bg-[#40E0D0] text-[#071a10] shadow-[0_0_30px_rgba(64,224,208,0.3)]' : 'text-white/30 hover:text-white/60'
              }`}
            >
              <Sparkles size={18} /> Dreamscape
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'quests' ? (
              <motion.div key="quests" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5 }}>
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-5xl font-black text-white mb-4 tracking-tight">Reality Sync</h2>
                    <p className="text-white/40 text-xl font-medium">Physiological interventions to ground your current state.</p>
                  </div>
                  <button onClick={fetchTasks} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white/40 hover:text-[#40E0D0] transition-colors">
                    <RotateCcw size={20} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>

                {loading ? (
                   <div className="flex justify-center items-center py-40">
                     <div className="w-16 h-16 border-[4px] border-[#40E0D0]/5 border-t-[#40E0D0] rounded-full animate-spin"></div>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tasks.map((task, idx) => (
                      <motion.div 
                        key={task.id} 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -8, backgroundColor: 'rgba(255,255,255,0.04)' }} 
                        className="group relative bg-white/[0.02] border border-white/[0.07] p-8 rounded-[40px] transition-all"
                      >
                        <div className="flex justify-between items-start mb-8">
                          <div className="p-3 rounded-2xl bg-white/[0.04] text-[#40E0D0] border border-white/[0.05] group-hover:border-[#40E0D0]/30 transition-colors">
                            {getCategoryIcon(task.category)}
                          </div>
                          <div className="px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <span className="text-[14px] font-black text-emerald-400">+{task.points}</span>
                          </div>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-[#40E0D0] transition-colors">{task.title}</h3>
                        <p className="text-white/40 text-sm leading-relaxed mb-10 h-16 overflow-hidden line-clamp-3">
                          {task.description}
                        </p>
                        <button 
                          onClick={() => handleCompleteQuest(task)} 
                          className="w-full py-5 rounded-[22px] bg-white/[0.03] border border-white/[0.08] group-hover:bg-[#40E0D0] group-hover:text-[#071a10] group-hover:border-[#40E0D0] font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                          <CheckCircle size={16} /> Complete Task
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="games" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
                <div className="mb-14">
                  <h2 className="text-5xl font-black text-white mb-4 tracking-tight">Dreamscape</h2>
                  <p className="text-white/40 text-xl font-medium">Digital sensory environments for cognitive regulation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  
                  {/* Game Cards remain high-fidelity */}
                  <motion.div
                    onClick={() => setActiveGame('breath')}
                    whileHover={{ scale: 1.02, y: -10 }}
                    className="group relative h-[420px] rounded-[48px] bg-black/40 border border-white/10 overflow-hidden cursor-pointer shadow-3xl"
                  >
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-teal-500/20 via-transparent to-transparent flex items-center justify-center">
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }} 
                        transition={{ duration: 5, repeat: Infinity }}
                        className="w-60 h-60 rounded-full bg-[#40E0D0]/20 blur-[80px]" 
                      />
                    </div>
                    <div className="absolute inset-0 p-10 flex flex-col justify-between z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                      <div className="flex justify-between items-start">
                        <span className="px-5 py-2 rounded-full bg-teal-400/10 border border-teal-400/20 text-[#40E0D0] text-[10px] font-black uppercase tracking-[0.25em]">Breathwork</span>
                        <Play className="text-white/10 group-hover:text-teal-400 transition-colors" size={24} />
                      </div>
                      <div>
                        <h3 className="text-4xl font-black text-white mb-3 italic">4-7-8 Deep Sleep</h3>
                        <p className="text-white/40 text-sm max-w-[85%] mb-8 leading-loose">A neurological reset via paced respiration to trigger the parasympathetic nervous system.</p>
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#40E0D0]">
                          <span className="flex items-center gap-2"><Clock size={14} /> 2m 30s</span>
                          <span className="flex items-center gap-2"><Sparkles size={14} /> Low Intensity</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    onClick={() => setActiveGame('trace')}
                    whileHover={{ scale: 1.02, y: -10 }}
                    className="group relative h-[420px] rounded-[48px] bg-black/40 border border-white/10 overflow-hidden cursor-pointer shadow-3xl"
                  >
                    <div className="absolute inset-0 z-0 bg-emerald-500/10 overflow-hidden">
                       {Array.from({length: 30}).map((_, i) => (
                         <motion.div 
                           key={i}
                           className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
                           style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                           animate={{ y: [0, -100], opacity: [0, 0.5, 0] }}
                           transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
                         />
                       ))}
                    </div>
                    <div className="absolute inset-0 p-10 flex flex-col justify-between z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                      <div className="flex justify-between items-start">
                        <span className="px-5 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em]">Focus Shift</span>
                        <Play className="text-white/10 group-hover:text-emerald-400 transition-colors" size={24} />
                      </div>
                      <div>
                        <h3 className="text-4xl font-black text-white mb-3 italic">Flow Field Calm</h3>
                        <p className="text-white/40 text-sm max-w-[85%] mb-8 leading-loose">Guide energy streams through a soothing noise field to settle cognitive noise.</p>
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                          <span className="flex items-center gap-2"><Clock size={14} /> Continuous</span>
                          <span className="flex items-center gap-2"><Sparkles size={14} /> Meditation</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    onClick={() => setActiveGame('bubble')}
                    whileHover={{ scale: 1.02, y: -10 }}
                    className="group relative h-[420px] rounded-[48px] bg-black/40 border border-white/10 overflow-hidden cursor-pointer shadow-3xl"
                  >
                    <div className="absolute inset-0 z-0 flex items-center justify-center">
                       <motion.div 
                         animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }}
                         transition={{ duration: 8, repeat: Infinity }}
                         className="w-48 h-48 bg-purple-500/20 rounded-full blur-[60px]"
                       />
                    </div>
                    <div className="absolute inset-0 p-10 flex flex-col justify-between z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                      <div className="flex justify-between items-start">
                        <span className="px-5 py-2 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.25em]">Tactile Hub</span>
                        <Play className="text-white/10 group-hover:text-purple-400 transition-colors" size={24} />
                      </div>
                      <div>
                        <h3 className="text-4xl font-black text-white mb-3 italic">Liquid Relax</h3>
                        <p className="text-white/40 text-sm max-w-[85%] mb-8 leading-loose">Manipulate high-fidelity oil droplets. Experience physical cohesion and stress-free flow.</p>
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">
                          <span className="flex items-center gap-2"><Clock size={14} /> Infinite</span>
                          <span className="flex items-center gap-2"><Sparkles size={14} /> High-Performance</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    onClick={() => setActiveGame('drift')}
                    whileHover={{ scale: 1.02, y: -10 }}
                    className="group relative h-[420px] rounded-[48px] bg-black/40 border border-white/10 overflow-hidden cursor-pointer shadow-3xl"
                  >
                    <div className="absolute inset-0 z-0 bg-[#020308] flex items-center justify-center">
                       <div className="w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_20px_white]" />
                    </div>
                    <div className="absolute inset-0 p-10 flex flex-col justify-between z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                      <div className="flex justify-between items-start">
                        <span className="px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white/50 text-[10px] font-black uppercase tracking-[0.25em]">Spatial Reset</span>
                        <Play className="text-white/10 group-hover:text-white transition-colors" size={24} />
                      </div>
                      <div>
                        <h3 className="text-4xl font-black text-white mb-3 italic">Drift Space</h3>
                        <p className="text-white/40 text-sm max-w-[85%] mb-8 leading-loose">Navigate through a deep field of stars. Let go of gravity and spatial tension.</p>
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                          <span className="flex items-center gap-2"><Clock size={14} /> Asleep in Space</span>
                          <span className="flex items-center gap-2"><Sparkles size={14} /> Deep Space</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AntiStressGame;
