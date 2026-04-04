import React from 'react';
import { Clock, ChevronRight, Activity, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const mockHistory = [
  {
    id: 1,
    date: 'Oct 24, 2026',
    time: '10:30 AM',
    symptoms: 'Chest pain and shortness of breath',
    diagnosis: 'Possible Angina / High Stress',
    severity: 'High',
  },
  {
    id: 2,
    date: 'Sep 15, 2026',
    time: '02:15 PM',
    symptoms: 'Severe headache and dizziness',
    diagnosis: 'Migraine episode',
    severity: 'Medium',
  },
  {
    id: 3,
    date: 'Aug 02, 2026',
    time: '09:00 AM',
    symptoms: 'Mild fever and sore throat',
    diagnosis: 'Viral Pharyngitis',
    severity: 'Low',
  }
];

const HistoryView: React.FC = () => {
  return (
    <div className="h-full flex flex-col pt-16 px-8 relative z-20 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Medical History</h2>
        <p className="text-white/40 text-sm">Past symptom analyses and AI diagnoses.</p>
      </motion.div>

      <div className="space-y-4">
        {mockHistory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="group flex gap-4 items-start"
          >
            {/* Timeline Line & Dot */}
            <div className="flex flex-col items-center mt-1">
              <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-white/40 group-hover:bg-ll-cyan/[0.1] group-hover:text-ll-cyan group-hover:border-ll-cyan/30 transition-all">
                <Clock size={14} />
              </div>
              {index !== mockHistory.length - 1 && (
                <div className="w-[1px] h-20 bg-gradient-to-b from-white/[0.1] to-transparent my-1"></div>
              )}
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300 rounded-2xl p-5 cursor-pointer relative overflow-hidden group">
              {item.severity === 'High' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-ll-red/[0.05] rounded-bl-full blur-2xl" />
              )}
              {item.severity === 'Medium' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-ll-yellow/[0.05] rounded-bl-full blur-2xl" />
              )}
              {item.severity === 'Low' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-ll-cyan/[0.05] rounded-bl-full blur-2xl" />
              )}

              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-3 text-white/40 text-xs font-mono-data font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {item.date}
                  </div>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
                
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border
                  ${item.severity === 'High' ? 'text-ll-red bg-ll-red/[0.1] border-ll-red/[0.2]' :
                    item.severity === 'Medium' ? 'text-ll-yellow bg-ll-yellow/[0.1] border-ll-yellow/[0.2]' :
                    'text-ll-cyan bg-ll-cyan/[0.1] border-ll-cyan/[0.2]'
                  }
                `}>
                  {item.severity} Risk
                </span>
              </div>

              <div className="space-y-4 relative z-10">
                <div>
                  <h4 className="text-sm font-medium text-white/50 mb-1">Symptoms Reported</h4>
                  <p className="text-white font-medium">"{item.symptoms}"</p>
                </div>
                
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity size={14} className="text-ll-purple" />
                    <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider">AI Diagnosis</h4>
                  </div>
                  <p className="text-ll-purple max-w-sm text-sm font-medium">{item.diagnosis}</p>
                </div>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={20} className="text-white/30 group-hover:text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
