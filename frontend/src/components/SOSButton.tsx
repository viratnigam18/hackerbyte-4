import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mic, MicOff, AlertTriangle, X } from 'lucide-react';
import { profileData } from './ProfileView';

interface SOSButtonProps {
  symptoms: string;
}

const SOS_WEBHOOK = "http://localhost:8001/sos";

const SOSButton: React.FC<SOSButtonProps> = ({ symptoms }) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [helpCount, setHelpCount] = useState(0);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sosStatus, setSosStatus] = useState<'idle' | 'triggering' | 'sent' | 'error'>('idle');

  // Request location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  const triggerSOS = useCallback(async () => {
    if (sosStatus === 'triggering' || sosStatus === 'sent') return;
    
    setIsSOSActive(true);
    setSosStatus('triggering');

    // Get fresh location if possible
    let currentLoc = location;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        currentLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(currentLoc);
      });
    }

    const payload = {
      current_data: symptoms || "No symptoms recorded yet",
      previous_data: profileData.previousDiseases || [],
      location: currentLoc || "Location not available",
      timestamp: new Date().toISOString(),
      patient_name: profileData.name
    };

    try {
      const response = await fetch(SOS_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
          setSosStatus('sent');
      } else {
          setSosStatus('error');
      }
    } catch (err) {
      console.error("SOS Webhook failed:", err);
      setSosStatus('error');
    }
  }, [location, symptoms, sosStatus]);

  // Voice Recognition Logic
  useEffect(() => {
    if (!isMicOn) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const lastResultIndex = event.results.length - 1;
      const transcript = event.results[lastResultIndex][0].transcript.toLowerCase();
      
      if (transcript.includes('help')) {
        setHelpCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            triggerSOS();
            return 0; // Reset after trigger
          }
          return newCount;
        });

        // Auto-reset help count after 5 seconds of silence
        const timer = setTimeout(() => setHelpCount(0), 5000);
        return () => clearTimeout(timer);
      }
    };

    recognition.start();
    return () => recognition.stop();
  }, [isMicOn, triggerSOS]);

  return (
    <>
      {/* Visual Emergency Overlay */}
      <AnimatePresence>
        {isSOSActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ll-red/20 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1a0808] border border-ll-red/30 p-12 rounded-[40px] text-center max-w-md shadow-[0_0_100px_rgba(220,38,38,0.4)]"
            >
              <div className="w-24 h-24 rounded-full bg-ll-red flex items-center justify-center mx-auto mb-6 animate-pulse">
                <AlertTriangle size={48} className="text-white" />
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">EMERGENCY SOS</h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                {sosStatus === 'triggering' ? 'Transmitting your symptoms and GPS location to emergency responders...' : 
                 sosStatus === 'sent' ? 'Help is on the way. Emergency services have received your medical profile.' :
                 'Failed to send signal. Please call 112 manually!'}
              </p>
              
              <div className="flex flex-col gap-3">
                  {sosStatus === 'sent' && (
                    <div className="bg-ll-emerald/10 border border-ll-emerald/20 text-ll-emerald py-3 px-6 rounded-2xl text-sm font-bold">
                        SIGNAL DELIVERED
                    </div>
                  )}
                  <button 
                    onClick={() => { setIsSOSActive(false); setSosStatus('idle'); }}
                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <X size={18} /> DISMISS
                  </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Control Group */}
      <div className="fixed bottom-24 right-8 z-[60] flex flex-col gap-4 items-end">
        
        {/* Help Status Indicator */}
        <AnimatePresence>
           {helpCount > 0 && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="bg-ll-red text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-glow-red"
             >
                HELP DETECTED ({helpCount}/3)
             </motion.div>
           )}
        </AnimatePresence>

        <div className="flex gap-3 items-center">
            {/* Mic Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMicOn(!isMicOn)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                isMicOn 
                ? 'bg-ll-cyan/10 border-ll-cyan text-ll-cyan shadow-glow-cyan' 
                : 'bg-white/5 border-white/10 text-white/30 hover:border-white/20'
              }`}
              title={isMicOn ? "Voice Trigger: Enabled" : "Voice Trigger: Disabled"}
            >
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </motion.button>

            {/* Main SOS Trigger Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={triggerSOS}
              className="group relative overflow-hidden bg-ll-red hover:bg-red-500 w-20 h-20 rounded-[28px] flex flex-col items-center justify-center text-white shadow-[0_0_40px_rgba(220,38,38,0.3)] transition-colors"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Phone size={24} className="mb-0.5" strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-tighter">SOS</span>
              
              {/* Pulse Ring */}
              <div className="absolute inset-0 border-2 border-white rounded-[28px] animate-ping opacity-20" />
            </motion.button>
        </div>
      </div>
    </>
  );
};

export default SOSButton;
