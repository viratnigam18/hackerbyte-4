import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Paperclip, Sparkles } from 'lucide-react';

interface ChatInputBarProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSubmit, isLoading = false }) => {
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:8002/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.status === 'success') {
        const generatedText = `[Image Analysis] ${data.problem}. ${data.details}`;
        setInput(generatedText);
        // Automatically submit the analysis
        onSubmit(generatedText);
        setInput('');
      }
    } catch (error) {
      console.error('Image analysis failed:', error);
      alert('Failed to analyze image. Ensure the image-to-text service is running.');
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
        <span className="text-xs text-white/30 font-medium">Describe your symptoms to get AI-powered analysis</span>
      </div>

      {/* Input bar */}
      <div className="
        relative flex items-center
        bg-white/[0.04] backdrop-blur-[24px]
        border border-white/[0.08]
        rounded-2xl px-5 py-3
        focus-within:border-ll-cyan/30
        focus-within:bg-white/[0.06]
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
            text-[15px] text-white/85
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
              bg-white/[0.04] border border-white/[0.06]
              flex items-center justify-center
              text-white/30 hover:text-ll-cyan hover:border-ll-cyan/20 hover:bg-ll-cyan/[0.05]
              transition-all duration-200
            "
            title="Voice input"
          >
            <Mic size={16} />
          </motion.button>

          {/* File Upload Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {/* File Upload Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="
              w-9 h-9 rounded-xl
              bg-white/[0.04] border border-white/[0.06]
              flex items-center justify-center
              text-white/30 hover:text-ll-purple hover:border-ll-purple/20 hover:bg-ll-purple/[0.05]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
            title="Upload medical report"
          >
            {isUploading ? (
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <Paperclip size={16} />
            )}
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
              bg-white/[0.03] border border-white/[0.06]
              text-white/30 hover:text-ll-cyan hover:bg-ll-cyan/[0.05] hover:border-ll-cyan/20
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
