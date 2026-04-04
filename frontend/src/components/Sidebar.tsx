import React from 'react';
import { 
  LineChart, 
  History, 
  User, 
  Watch, 
  Pill,
  Shield
} from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-full bg-[#40E0D0] flex flex-col items-center py-8 text-white relative z-20 shadow-xl">
      {/* Brand */}
      <div className="w-full px-6 flex items-center gap-3 mb-10">
        <Shield size={32} strokeWidth={1.5} />
        <span className="text-2xl font-bold tracking-wide">LifeLine</span>
      </div>

      {/* Nav items */}
      <div className="w-full px-4 space-y-2 mt-4 flex-1">
        <a href="#" className="flex items-center gap-4 w-full bg-white/20 px-4 py-3 rounded-xl font-medium">
          <LineChart size={20} />
          <span>Dashboard</span>
        </a>
        <a href="#" className="flex items-center gap-4 w-full px-4 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors opacity-80 hover:opacity-100">
          <History size={20} />
          <span>History</span>
        </a>
        <a href="#" className="flex items-center gap-4 w-full px-4 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors opacity-80 hover:opacity-100">
          <User size={20} />
          <span>Profile</span>
        </a>
        <a href="#" className="flex items-center gap-4 w-full px-4 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors opacity-80 hover:opacity-100">
          <Watch size={20} />
          <span>Watch Connect</span>
        </a>
        <a href="#" className="flex items-center gap-4 w-full px-4 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors opacity-80 hover:opacity-100">
          <Pill size={20} />
          <span>Medication Reminders</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
