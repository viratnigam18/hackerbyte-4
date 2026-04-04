import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardGrid from './DashboardGrid';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  return (
    <div className="flex h-screen w-full bg-[#ecf9f8] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 overflow-y-auto relative flex flex-col items-center pb-24">
        <div className="w-full max-w-[1600px]">
          <Header onLogout={onLogout} />
        </div>
        <DashboardGrid />
      </div>
    </div>
  );
};

export default Dashboard;
