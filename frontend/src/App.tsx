import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './components/LoginForm';
import RightVisualComponent from './components/RightVisualComponent';
import HeroDNA from './components/HeroDNA';
import CustomCursor from './components/CustomCursor';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
<<<<<<< HEAD
<<<<<<< HEAD
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);

  if (isAuthenticated) {
    return <Dashboard onLogout={() => setIsAuthenticated(false)} />;
  }
=======
=======
  const [isAuthenticated, setIsAuthenticated] = useState(false);
>>>>>>> fdadfab5adaa13db66c5f12c19e52e0bb83eef84
  const [showLanding, setShowLanding] = useState(true);
>>>>>>> 723cdab1dfc53278cee84a998e1209e43c93c6f2

  if (isAuthenticated) {
    return (
      <>
        <CustomCursor />
        <Dashboard onLogout={() => setIsAuthenticated(false)} />
      </>
    );
  }

  return (
    <>
      <CustomCursor />
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
            <LoginForm onLogin={() => setIsAuthenticated(true)} />
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
    </>
  );
};

export default App;
