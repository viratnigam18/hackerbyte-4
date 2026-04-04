import React from 'react';
import { User, Droplets, Calendar, Activity, AlertCircle, HeartPulse, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const profileData = {
  name: 'Aditya',
  age: 22,
  bloodGroup: 'O+',
  previousDiseases: ['Mild Asthma', 'Seasonal Allergies'],
  suggestions: [
    'Keep your inhaler handy during seasonal changes.',
    'Maintain a regular sleep schedule to reduce stress.',
    'Stay hydrated and track your SpO2 levels.'
  ]
};

const ProfileView: React.FC = () => {
  return (
    <div className="h-full flex flex-col pt-16 px-8 relative z-20 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Patient Profile</h2>
        <p className="text-white/40 text-sm">Your medical information and personalized AI suggestions.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-6 neon-glow-green"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ll-cyan to-emerald-500 flex items-center justify-center shadow-glow-cyan text-ll-bg">
              <User size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{profileData.name}</h3>
              <span className="text-xs text-ll-cyan font-bold tracking-widest uppercase bg-ll-cyan/[0.1] px-2 py-0.5 rounded-full border border-ll-cyan/[0.2]">Verified</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
              <div className="flex items-center gap-2 text-white/40">
                <Calendar size={16} />
                <span className="text-sm font-medium">Age</span>
              </div>
              <span className="text-white font-mono-data font-semibold">{profileData.age} yrs</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
              <div className="flex items-center gap-2 text-white/40">
                <Droplets size={16} />
                <span className="text-sm font-medium">Blood Group</span>
              </div>
              <span className="text-ll-red font-mono-data font-semibold bg-ll-red/[0.1] px-2 py-0.5 rounded-md border border-ll-red/[0.2]">{profileData.bloodGroup}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-white/40">
                <Activity size={16} />
                <span className="text-sm font-medium">Status</span>
              </div>
              <span className="text-ll-cyan font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-ll-cyan animate-pulse"></span> Active</span>
            </div>
          </div>
        </motion.div>

        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Medical History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={18} className="text-ll-purple" />
              <h3 className="text-lg font-bold text-white">Previous Diagnosed Diseases</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {profileData.previousDiseases.map((disease, i) => (
                <div key={i} className="bg-white/[0.05] border border-white/[0.1] px-4 py-2 rounded-xl flex items-center gap-2 text-white/80">
                  <HeartPulse size={14} className="text-ll-purple/60" />
                  <span className="text-sm font-medium">{disease}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <HeartPulse size={18} className="text-ll-cyan" />
              <h3 className="text-lg font-bold text-white">Personalized AI Suggestions</h3>
            </div>
            <div className="space-y-3">
              {profileData.suggestions.map((suggestion, i) => (
                <div key={i} className="flex items-start gap-3 bg-ll-cyan/[0.02] border border-ll-cyan/[0.1] p-3 rounded-xl">
                  <CheckCircle2 size={16} className="text-ll-cyan mt-0.5 shrink-0" />
                  <p className="text-sm text-white/70">{suggestion}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
