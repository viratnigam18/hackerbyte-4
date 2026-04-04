import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'aditya' && password === '123456') {
      setError('');
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-white to-fintech-mint/20 px-8 py-10 sm:px-16 lg:px-20 overflow-y-auto">
      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 mb-16"
      >
        <div className="w-8 h-8 bg-fintech-navy rounded-lg flex items-center justify-center">
          <div className="w-3 h-3 bg-fintech-mint rounded-full"></div>
        </div>
        <span className="font-bold text-xl tracking-tight text-fintech-navy">LifeLine</span>
      </motion.div>

      {/* Heading */}
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-white/40 mb-2">Welcome Back!</h1>
          <p className="text-white/40 mb-8">Please enter log in details below</p>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-500 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Username Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-white/40">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-fintech-navy focus:ring-4 focus:ring-fintech-navy/10 outline-none transition-all duration-300 shadow-soft"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1 relative">
            <label className="text-sm font-medium text-white/40">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-fintech-navy focus:ring-4 focus:ring-fintech-navy/10 outline-none transition-all duration-300 shadow-soft pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/40 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex justify-end pt-2">
              <a href="#" className="text-sm font-medium text-fintech-navy hover:text-blue-800 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-fintech-navy text-white rounded-xl font-semibold shadow-glow hover:shadow-lg transition-all"
          >
            Sign in
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-sm text-white/40 font-medium">or continue with</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Google Button */}
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="w-full py-3.5 bg-white text-white/40 border border-gray-200 rounded-xl font-medium flex items-center justify-center gap-3 shadow-sm transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Google
          </motion.button>
        </motion.form>

        {/* Signup Text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-sm text-white/40"
        >
          Don't have an account? <a href="#" className="font-semibold text-fintech-navy hover:underline">Sign Up</a>
        </motion.p>
      </div>
    </div>
  );
};

export default LoginForm;
