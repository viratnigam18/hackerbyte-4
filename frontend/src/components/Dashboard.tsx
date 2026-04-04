import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LowPolyBackground from './LowPolyBackground';
import LandingScreen from './LandingScreen';
import AnalysisDashboard from './AnalysisDashboard';
import MentalHealthChat from './MentalHealthChat';
import FloatingDock from './FloatingDock';
import AntiStressGame from './AntiStressGame';
import ProfileView from './ProfileView';
import HistoryView from './HistoryView';
import VitalsPanel from './VitalsPanel';
import SOSButton from './SOSButton';

interface DashboardProps {
  onLogout: () => void;
}

type Screen = 'landing' | 'analysis' | 'mental-health' | 'history' | 'profile' | 'watch' | 'anti-stress';

const Dashboard: React.FC<DashboardProps> = ({ onLogout: _onLogout }) => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSymptomSubmit = (msg: string) => {
    setSymptoms(msg);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setScreen('analysis');
    }, 1500);
  };

  const handleNavigate = (page: string) => {
    if (page === 'dashboard') setScreen('landing');
    else if (page === 'mental-health') setScreen('mental-health');
    else if (page === 'anti-stress') setScreen('anti-stress');
    else if (page === 'history') setScreen('history');
    else if (page === 'profile') setScreen('profile');
    else if (page === 'watch') setScreen('watch');
    else setScreen('landing');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden" style={{ background: '#071a10' }}>
      {/* Green Low-Poly Geometric Background */}
      <LowPolyBackground />

      {/* Screens with transitions */}
      <div className="relative z-10 h-full">
        <AnimatePresence mode="wait">
          {screen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <LandingScreen
                onSymptomSubmit={handleSymptomSubmit}
                isLoading={isAnalyzing}
                userName="Aditya"
              />
            </motion.div>
          )}

          {screen === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <AnalysisDashboard
                symptoms={symptoms}
                onBack={() => setScreen('landing')}
              />
            </motion.div>
          )}

          {screen === 'mental-health' && (
            <motion.div
              key="mental-health"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full flex flex-col"
            >
              <div className="px-6 py-3 border-b border-white/[0.06] bg-[rgba(8,32,20,0.6)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setScreen('landing')}
                    className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-ll-cyan transition-colors"
                  >
                    ←
                  </button>
                  <span className="text-sm font-bold text-white">Mental Health</span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <MentalHealthChat onBack={() => setScreen('landing')} />
              </div>
            </motion.div>
          )}

          {screen === 'anti-stress' && (
            <motion.div
              key="anti-stress"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <AntiStressGame onBack={() => setScreen('landing')} />
            </motion.div>
          )}

          {screen === 'watch' && (
            <motion.div
              key="watch"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full flex flex-col"
            >
              <div className="px-6 py-3 border-b border-white/[0.06] bg-[rgba(8,32,20,0.6)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setScreen('landing')}
                    className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-ll-cyan transition-colors"
                  >
                    ←
                  </button>
                  <span className="text-sm font-bold text-white">Smartwatch Connection Center</span>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 md:p-12 flex justify-center items-center pt-8 pb-32">
                  <div className="w-full max-w-5xl min-h-[400px]">
                      <VitalsPanel />
                  </div>
              </div>
            </motion.div>
          )}

          {screen === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full overflow-y-auto pb-24"
            >
              <HistoryView />
            </motion.div>
          )}

          {screen === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full overflow-y-auto pb-24"
            >
              <ProfileView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Dock */}
      <FloatingDock
        activePage={screen === 'landing' || screen === 'analysis' ? 'dashboard' : screen}
        onNavigate={handleNavigate}
      />

      {/* Global SOS Emergency System */}
      <SOSButton symptoms={symptoms} />
    </div>
  );
};

export default Dashboard;
