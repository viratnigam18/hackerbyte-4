import React from 'react';
import { motion } from 'framer-motion';
import LoginForm from './components/LoginForm';
import RightVisualComponent from './components/RightVisualComponent';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);

  if (isAuthenticated) {
    return <Dashboard onLogout={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left Section - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full lg:w-[45%] h-full relative z-10 shadow-2xl shadow-black/10"
      >
        <LoginForm onLogin={() => setIsAuthenticated(true)} />
      </motion.div>

      {/* Right Section - 3D Visual */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="hidden lg:block w-[55%] h-full relative bg-fintech-dark"
      >
        <RightVisualComponent />
      </motion.div>
    </div>
  );
};

export default App;
