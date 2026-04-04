import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, CheckCircle, ArrowLeft, Gamepad2, RotateCcw, Box, Component } from 'lucide-react';
import BreathingGame from './BreathingGame';
import BubblePopGame from './BubblePopGame';
import ZenTraceGame from './ZenTraceGame';

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
  category: string;
}

type TabState = 'quests' | 'games';

const AntiStressGame: React.FC<AntiStressProps> = ({ onBack }) => {
  const [stats, setStats] = useState<UserStats>({ total_points: 0, current_streak: 0 });
  const [tasks, setTasks] = useState<ActionTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [successAnim, setSuccessAnim] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabState>('quests');

  const userId = 'demo_user_123'; // Static for demo purposes

  const fetchStats = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/stress/stats?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setStats({ total_points: data.total_points, current_streak: data.current_streak });
      }
    } catch (e) {
      console.error('Failed to fetch stats', e);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://127.0.0.1:8000/stress/actions?user_id=${userId}&stress_level=HIGH`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error('Failed to fetch tasks', e);
      setTasks([
         { id: 101, title: 'Drink Water', description: 'Hydrate your body.', points: 5, category: 'physical' },
         { id: 102, title: 'Stretch', description: 'Stand up and reach for the sky.', points: 10, category: 'physical' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, []);

  const handleEarnPoints = async (points: number, internalActionId: number) => {
    // Optimistic UI Update
    setStats(prev => ({ ...prev, total_points: prev.total_points + points }));
    setSuccessAnim(`+${points}`);

    setTimeout(() => setSuccessAnim(null), 2000);

    try {
      await fetch('http://127.0.0.1:8000/stress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action_id: internalActionId })
      });
      fetchStats(); // silently sync
    } catch (e) {
      console.error('Failed to sync completion', e);
    }
  };

  const handleCompleteQuest = (task: ActionTask) => {
    setTasks(prev => prev.filter(t => t.id !== task.id));
    handleEarnPoints(task.points, task.id);
  };

  return (
    <div className="flex flex-col h-full bg-[#071a10] relative overflow-hidden">
      
      {/* Dynamic Pop-up Animation for points */}
      <AnimatePresence>
        {successAnim && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: -100, scale: 1.5 }}
            exit={{ opacity: 0, y: -200, scale: 2 }}
            transition={{ duration: 1.5, type: 'spring' }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black text-[#40E0D0] z-50 drop-shadow-[0_0_25px_rgba(64,224,208,0.8)] pointer-events-none"
          >
            {successAnim}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] bg-[rgba(8,32,20,0.6)] backdrop-blur-xl flex justify-between items-center z-10 relative shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-[#40E0D0] hover:bg-[#40E0D0]/10 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#40E0D0]/20 text-[#40E0D0]">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Health Quest</h1>
              <p className="text-xs text-white/50">Anti-Stress Engine</p>
            </div>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-2xl">
            <Trophy className="text-purple-400" size={18} />
            <span className="text-lg font-black text-white">{stats.total_points} <span className="text-[10px] text-purple-200 font-normal ml-0.5">PTS</span></span>
          </div>
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl">
            <Flame className="text-orange-400" size={18} />
            <span className="text-lg font-black text-white">{stats.current_streak} <span className="text-[10px] text-orange-200 font-normal ml-0.5">DAY STREAK</span></span>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto p-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Tabs */}
          <div className="flex items-center gap-4 mb-8 bg-white/[0.02] p-1.5 rounded-2xl w-fit border border-white/[0.05]">
            <button
              onClick={() => setActiveTab('quests')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'quests' ? 'bg-[#40E0D0] text-[#071a10] shadow-[0_0_15px_rgba(64,224,208,0.3)]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Component size={18} /> Action Quests
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'games' ? 'bg-[#40E0D0] text-[#071a10] shadow-[0_0_15px_rgba(64,224,208,0.3)]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Box size={18} /> Interactive Games
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'quests' ? (
              <motion.div
                key="quests"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Real-world Tasks</h2>
                    <p className="text-gray-400">Complete physical wellness tasks to earn points.</p>
                  </div>
                  <button 
                    onClick={fetchTasks}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center gap-2 transition-all text-sm font-medium"
                  >
                    <RotateCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh Quests
                  </button>
                </div>

                {loading ? (
                   <div className="flex justify-center items-center py-20">
                     <div className="w-10 h-10 border-4 border-[#40E0D0]/30 border-t-[#40E0D0] rounded-full animate-spin"></div>
                   </div>
                ) : tasks.length === 0 ? (
                   <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
                     <CheckCircle className="mx-auto text-[#40E0D0] mb-4" size={48} />
                     <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
                     <p className="text-gray-400">You've completed all recommended quests for now.</p>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {tasks.map(task => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9, y: 20 }}
                          whileHover={{ scale: 1.02 }}
                          className="group relative bg-[rgba(20,25,22,0.6)] backdrop-blur-md border border-[rgba(64,224,208,0.15)] p-6 rounded-3xl overflow-hidden shadow-lg transition-all"
                        >
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#40E0D0]/5 rounded-full blur-2xl group-hover:bg-[#40E0D0]/10 transition-colors"></div>
                          <div className="flex justify-between items-start mb-6 border-b border-white/[0.05] pb-4 relative z-10">
                            <div>
                              <span className="px-2.5 py-1 rounded-md bg-white/[0.05] text-[#40E0D0] text-[10px] font-bold uppercase tracking-wider mb-3 inline-block">
                                {task.category}
                              </span>
                              <h3 className="text-xl font-bold text-white">{task.title}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#40E0D0]/20 to-emerald-500/10 border border-[#40E0D0]/30 flex items-center justify-center shadow-inner">
                              <span className="font-bold text-[#40E0D0]">+{task.points}</span>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed mb-8 relative z-10">
                            {task.description}
                          </p>
                          <button
                            onClick={() => handleCompleteQuest(task)}
                            className="w-full py-4 rounded-xl font-bold tracking-widest text-[#071a10] bg-[#40E0D0] shadow-[0_0_15px_rgba(64,224,208,0.4)] hover:shadow-[0_0_25px_rgba(64,224,208,0.6)] hover:bg-[#3cecdb] hover:scale-[1.01] transition-all relative z-10 flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={18} /> COMPLETE QUEST
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="games"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Sensory Mini-Games</h2>
                  <p className="text-gray-400">Play these interactive digital tools to ease anxiety and earn points.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Game 1: Breathing */}
                  <BreathingGame onComplete={(pts) => handleEarnPoints(pts, 201)} />
                  
                  {/* Game 2: Trace */}
                  <ZenTraceGame onComplete={(pts) => handleEarnPoints(pts, 202)} />
                  
                  {/* Game 3: Bubble Pop */}
                  <div className="lg:col-span-2">
                    <BubblePopGame onComplete={(pts) => handleEarnPoints(pts, 203)} />
                  </div>
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
