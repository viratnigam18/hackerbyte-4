import React from 'react';
import { Mic, Power } from 'lucide-react';

const Header: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <div className="w-full flex justify-end items-center px-8 py-6 z-10 sticky top-0 bg-[#F0FAF9]">
      <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm mr-4">
        <Mic size={16} className="text-gray-400" />
        <span className="text-xs font-semibold text-gray-500">OFF</span>
        <div className="w-px h-4 bg-gray-200 mx-2"></div>
        <Power size={16} className="text-[#40E0D0]" />
      </div>

      <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm">
          HI
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
          U
        </div>
        <button 
          onClick={onLogout}
          className="text-red-500 text-sm font-semibold ml-2 hover:text-red-600 px-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
