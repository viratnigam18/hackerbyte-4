import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, Sparkles, Heart, AlertTriangle, Shield, ArrowLeft, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  text: string;
  status?: string;
  confidence?: number;
  tips?: string[];
  severity?: string;
  color?: string;
  timestamp: Date;
}

interface MentalHealthChatProps {
  onBack: () => void;
}

const MENTAL_API_URL = 'http://localhost:8001';

const severityIcons: Record<string, React.ReactNode> = {
  low: <Shield size={16} className="text-emerald-400" />,
  moderate: <AlertTriangle size={16} className="text-amber-400" />,
  high: <AlertTriangle size={16} className="text-red-400" />,
  critical: <AlertTriangle size={16} className="text-red-600 animate-pulse" />,
};

const MentalHealthChat: React.FC<MentalHealthChatProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'system',
      text: "Hello! I'm your Mental Health Assistant. Share how you're feeling, and I'll provide supportive guidance. Remember, I'm an AI — for serious concerns, please reach out to a professional.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${MENTAL_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: data.response_message,
        status: data.predicted_status,
        confidence: data.confidence,
        tips: data.tips,
        severity: data.severity,
        color: data.color,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: "I'm having trouble connecting right now. Please make sure the Mental Health API server is running on port 8001.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const getSeverityBadge = (severity: string, color: string) => {
    const labels: Record<string, string> = {
      low: 'Low Concern', moderate: 'Moderate', high: 'High Priority', critical: '🚨 Critical — Seek Help',
    };
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase"
        style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}30` }}
      >
        {severityIcons[severity]}
        {labels[severity] || severity}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full text-white overflow-hidden" style={{ background: 'transparent' }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.08] bg-white/[0.04] backdrop-blur-md">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors">
          <ArrowLeft size={18} className="text-white/40" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ll-purple to-fuchsia-500 flex items-center justify-center shadow-glow-purple">
              <Brain size={20} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-ll-emerald border-2 border-[#070B14]" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide">Mental Health Assistant</h2>
            <p className="text-[11px] text-white/50 font-medium">AI-Powered Support • Always Listening</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-ll-purple/10 px-3 py-1.5 rounded-full border border-ll-purple/20">
          <Sparkles size={12} className="text-ll-purple" />
          <span className="text-[10px] font-bold text-ll-purple tracking-widest uppercase">DistilBERT</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.type === 'user' ? (
                <div className="max-w-[75%] bg-gradient-to-br from-ll-purple to-fuchsia-600 rounded-2xl rounded-br-md px-4 py-3 shadow-lg shadow-ll-purple/10">
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className="text-[10px] text-white/40 mt-1.5 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ) : msg.type === 'system' ? (
                <div className="max-w-[85%] mx-auto">
                  <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Heart size={14} className="text-pink-400" />
                      <span className="text-[11px] font-bold text-pink-400 uppercase tracking-widest">Safe Space</span>
                      <Heart size={14} className="text-pink-400" />
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-[85%] space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ll-purple to-fuchsia-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-glow-purple">
                      <Brain size={14} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl rounded-tl-md px-4 py-3">
                        <p className="text-sm leading-relaxed text-white/70">{msg.text}</p>
                        {msg.status && (
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.08]">
                            {msg.severity && msg.color && getSeverityBadge(msg.severity, msg.color)}
                            {msg.confidence !== undefined && (
                              <span className="text-[11px] text-white/50 font-medium">
                                {(msg.confidence * 100).toFixed(1)}% confidence
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {msg.tips && msg.tips.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3"
                        >
                          <p className="text-[11px] font-bold text-ll-purple uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                            <Sparkles size={12} /> Suggestions for you
                          </p>
                          <ul className="space-y-2">
                            {msg.tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-white/50 leading-relaxed">
                                <span
                                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5"
                                  style={{ backgroundColor: `${msg.color || '#8B5CF6'}15`, color: msg.color || '#8B5CF6' }}
                                >
                                  {i + 1}
                                </span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                      <p className="text-[10px] text-white/40 pl-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ll-purple to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-glow-purple">
              <Brain size={14} />
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="text-ll-purple animate-spin" />
                <span className="text-xs text-white/50">Analyzing your message...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Disclaimer */}
      <div className="px-6 pb-1">
        <p className="text-[10px] text-white/40 text-center">
          ⚠️ Not a replacement for professional care. Crisis: <span className="text-ll-red font-semibold">112</span> | <span className="text-ll-purple font-semibold">iCall: 9152987821</span>
        </p>
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex items-center gap-3 bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl px-4 py-2 focus-within:border-ll-purple/30 focus-within:bg-white/[0.05] transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share how you're feeling..."
            className="flex-1 bg-transparent outline-none text-sm text-white/90 placeholder-white/30"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-ll-purple to-fuchsia-600 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-glow-purple transition-all hover:scale-105 active:scale-95"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthChat;
