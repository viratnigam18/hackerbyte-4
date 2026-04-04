import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Paperclip, Sparkles } from 'lucide-react';

interface ChatInputBarProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSubmit, isLoading = false }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[700px]"
    >
      {/* Subtle label */}
      <div className="flex items-center gap-2 mb-3 pl-2">
        <Sparkles size={14} className="text-ll-cyan" />
        <span className="text-xs text-white/40 font-medium">Describe your symptoms to get AI-powered analysis</span>
      </div>

      {/* Input bar */}
      <div className="
        relative flex items-center
        bg-white/[0.03] backdrop-blur-[24px]
        border border-white/[0.08]
        rounded-2xl px-5 py-3
        focus-within:border-ll-cyan/30
        focus-within:bg-white/[0.05]
        neon-glow-green
        transition-all duration-300
      ">
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="E.g. I have chest pain and shortness of breath..."
          className="
            flex-1 bg-transparent outline-none
            text-[15px] text-white/90
            placeholder-white/20
            font-medium
          "
          disabled={isLoading}
        />

        {/* Action buttons */}
        <div className="flex items-center gap-2 ml-4">
          {/* Mic */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="
              w-9 h-9 rounded-xl
              bg-white/5 border border-white/10
              flex items-center justify-center
              text-white/40 hover:text-ll-cyan hover:border-ll-cyan/20 hover:bg-ll-cyan/[0.05]
              transition-all duration-200
            "
            title="Voice input"
          >
            <Mic size={16} />
          </motion.button>

          {/* File Upload */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="
              w-9 h-9 rounded-xl
              bg-white/5 border border-white/10
              flex items-center justify-center
              text-white/40 hover:text-ll-purple hover:border-ll-purple/20 hover:bg-ll-purple/[0.05]
              transition-all duration-200
            "
            title="Upload medical report"
          >
            <Paperclip size={16} />
          </motion.button>

          {/* Send */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="
              w-10 h-10 rounded-xl
              bg-gradient-to-br from-ll-cyan to-emerald-400
              flex items-center justify-center
              text-ll-bg
              disabled:opacity-20 disabled:cursor-not-allowed
              hover:shadow-glow-cyan
              transition-all duration-200
              font-bold
            "
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-ll-bg/30 border-t-ll-bg rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Quick suggestion chips */}
      <div className="flex flex-wrap gap-2 mt-3 pl-2">
        {['Chest pain', 'Headache', 'Breathing difficulty', 'High fever', 'Dizziness'].map((chip) => (
          <button
            key={chip}
            onClick={() => setInput(chip)}
            className="
              text-[11px] font-medium px-3 py-1.5 rounded-full
              bg-white/5 border border-white/10
              text-white/40 hover:text-ll-cyan hover:bg-ll-cyan/[0.05] hover:border-ll-cyan/20
              transition-all duration-200
            "
          >
            {chip}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ChatInputBar;
