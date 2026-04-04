import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './components/LoginForm';
import RightVisualComponent from './components/RightVisualComponent';
import HeroDNA from './components/HeroDNA';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {showLanding ? (
        <motion.div
          key="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <HeroDNA onGetStarted={() => setShowLanding(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex h-screen w-full bg-white overflow-hidden"
        >
          {/* Left Section - Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="w-full lg:w-[45%] h-full relative z-10 shadow-2xl shadow-black/10"
          >
            <LoginForm onLogin={() => alert('Logged In!')} />
          </motion.div>

          {/* Right Section - 3D Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            className="hidden lg:block w-[55%] h-full relative bg-white"
          >
            <RightVisualComponent />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;
