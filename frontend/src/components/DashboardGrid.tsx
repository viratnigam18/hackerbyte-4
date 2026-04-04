import React from 'react';
import { Mic, Camera, Activity, AlertTriangle, PhoneCall, Bot, Pill } from 'lucide-react';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col ${className}`}>
    {children}
  </div>
);

const DashboardGrid: React.FC = () => {
  return (
    <div className="w-full px-8 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto auto-rows-max">
      
      {/* LEFT COLUMN (Cols 1-3) */}
      <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
        
        {/* Symptom Checker */}
        <Card>
          <h3 className="text-white/40 font-semibold mb-3">Symptom Checker</h3>
          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <input 
              type="text" 
              placeholder="Chest pain, shortness of breath" 
              className="bg-transparent outline-none w-full text-sm placeholder-gray-400"
            />
            <div className="flex gap-2 text-white/40">
              <button className="hover:text-[#40E0D0] transition-colors"><Mic size={18} /></button>
              <button className="hover:text-[#40E0D0] transition-colors"><Camera size={18} /></button>
            </div>
          </div>
        </Card>

        {/* Emergency Severity */}
        <Card className="items-center justify-center py-8 relative">
          <h3 className="text-white/40 font-semibold absolute top-5 left-5">Emergency Severity</h3>
          <div className="w-32 h-32 rounded-full border-[12px] border-[#40E0D0] flex flex-col items-center justify-center mt-6 shadow-sm">
             <Activity size={32} className="text-[#40E0D0] mb-1" />
             <span className="font-bold text-white/40 tracking-wide text-lg">HIGH</span>
          </div>
          <AlertTriangle className="absolute bottom-5 right-5 text-yellow-500" size={24} />
        </Card>

        {/* AI Recommendation */}
        <Card>
          <h3 className="text-white/40 font-semibold mb-2">AI Recommendation</h3>
          <p className="text-sm text-white/40 italic">Waiting for analysis...</p>
        </Card>

        {/* Real-time Watch Data */}
        <Card>
          <h3 className="text-white/40 font-semibold mb-4">Real-time Watch Data</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50/80 rounded-xl p-4 flex gap-4 border border-gray-100">
               <div className="text-red-500 bg-red-50 p-2 rounded-lg h-fit"><Activity size={20} /></div>
               <div>
                 <p className="text-xs text-white/40 font-semibold tracking-wider">HEART BEAT</p>
                 <p className="text-xl font-bold text-white/40">-- <span className="text-xs text-white/40 font-normal">BPM</span></p>
               </div>
            </div>
            
            <div className="bg-gray-50/80 rounded-xl p-4 flex gap-4 border border-gray-100">
               <div className="text-blue-500 bg-blue-50 p-2 rounded-lg h-fit"><Activity size={20} /></div>
               <div>
                 <p className="text-xs text-white/40 font-semibold tracking-wider">OXYGEN (SPO2)</p>
                 <p className="text-xl font-bold text-white/40">-- <span className="text-xs text-white/40 font-normal">%</span></p>
               </div>
            </div>

            <div className="bg-gray-50/80 rounded-xl p-4 flex gap-4 border border-gray-100">
               <div className="text-white/40 bg-gray-100 p-2 rounded-lg h-fit"><Activity size={20} /></div>
               <div>
                 <p className="text-xs text-white/40 font-semibold tracking-wider">STRESS LEVEL</p>
                 <p className="text-xl font-bold text-white/40">--</p>
               </div>
            </div>
          </div>
        </Card>

      </div>

      {/* MIDDLE COLUMN (Cols 4-8) */}
      <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">

        {/* Map Placeholder Window */}
        <Card className="h-[300px] bg-slate-100 overflow-hidden relative p-0 border-0 shadow-inner">
          <div className="absolute inset-0 border-4 border-white rounded-2xl pointer-events-none z-10"></div>
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-white/[0.04]">
            {/* The user requested this map area to be purely an empty placeholder/window */}
            <span className="text-sm font-semibold tracking-wider absolute top-4 left-4 bg-white/[0.04] px-3 py-1 rounded-full shadow-sm text-white/50">MAP WINDOW</span>
          </div>
        </Card>

        {/* Condition & SOS */}
        <div className="grid grid-cols-2 gap-4">
           <Card>
             <h3 className="text-xs text-white/40 font-semibold tracking-wider mb-2">Identified Condition</h3>
             <p className="text-sm text-white/40 italic mb-4 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Waiting for analysis...</p>
             <h3 className="text-xs text-white/40 font-semibold tracking-wider mb-2">Recommended Filters</h3>
             <div className="flex gap-4">
               <span className="text-xs font-semibold text-[#40E0D0] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#40E0D0]"></span> Emergency Room</span>
               <span className="text-xs font-semibold text-white/40 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Cardiology</span>
             </div>
           </Card>
           <Card className="items-center justify-center">
              <button className="w-24 h-24 rounded-full bg-red-50 text-red-500 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:bg-red-100 hover:scale-105 transition-all">
                <span className="font-bold tracking-tight text-lg leading-tight">SOS</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider">Emergency</span>
              </button>
           </Card>
        </div>

        {/* Medicine & Remedies */}
        <Card className="border-t-4 border-t-[#40E0D0]">
          <h3 className="text-white/40 font-semibold mb-4 text-lg">Medicine & Remedies</h3>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#40E0D0] flex items-center gap-2 mb-2"><Pill size={16} /> Suggested Medicines</h4>
            <p className="text-sm text-white/40 italic">Waiting for analysis...</p>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[#40E0D0] flex items-center gap-2 mb-2"><Activity size={16} /> Home Remedies</h4>
            <p className="text-sm text-white/40 italic">Waiting for analysis...</p>
          </div>

          <div className="bg-red-50/50 text-red-400 text-xs px-3 py-2 rounded-md font-medium border border-red-100">
            Disclaimer: AI suggestions are NOT medical advice. Consult a professional before use.
          </div>
        </Card>

      </div>

      {/* RIGHT COLUMN (Cols 9-12) */}
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-6 relative">
      
        {/* Recent Activity */}
        <Card>
          <h3 className="text-white/40 font-semibold">Recent Activity / Medical History</h3>
        </Card>

        {/* Hospital Directory */}
        <Card>
           <h3 className="text-white/40 font-semibold mb-3">Nearby Hospital Directory</h3>
           <p className="text-sm text-white/40">Perform a search to see nearby hospitals.</p>
        </Card>

        {/* Telemedicine */}
        <Card className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white/40 font-semibold text-lg">Telemedicine</h3>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 12 Doctors Online</span>
          </div>
          <p className="text-xs text-white/40 mb-6">Instantly connect with expert doctors available online.</p>
          
          <div className="space-y-4">
             {/* Doctor 1 */}
             <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h4 className="font-semibold text-white/40">Dr. Amit Sharma</h4>
                  <p className="text-xs text-white/40 mb-1">Pediatrics</p>
                  <p className="text-xs font-medium text-[#40E0D0]">+91 98888 77777</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-[#40E0D0]/10 flex items-center justify-center text-[#40E0D0] hover:bg-[#40E0D0] hover:text-white transition-colors">
                  <PhoneCall size={18} />
                </button>
             </div>

             {/* Doctor 2 */}
             <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h4 className="font-semibold text-white/40">Dr. Ananya Iyer</h4>
                  <p className="text-xs text-white/40 mb-1">Cardiology</p>
                  <p className="text-xs font-medium text-[#40E0D0]">+91 98765 43210</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-[#40E0D0]/10 flex items-center justify-center text-[#40E0D0] hover:bg-[#40E0D0] hover:text-white transition-colors">
                  <PhoneCall size={18} />
                </button>
             </div>

             {/* Doctor 3 */}
             <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white/40">Dr. Kavita Rao</h4>
                  <p className="text-xs text-white/40 mb-1">General Medicine</p>
                  <p className="text-xs font-medium text-[#40E0D0]">+91 90000 11111</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-[#40E0D0]/10 flex items-center justify-center text-[#40E0D0] hover:bg-[#40E0D0] hover:text-white transition-colors">
                  <PhoneCall size={18} />
                </button>
             </div>
          </div>
        </Card>
        
        {/* Chatbot trigger */}
        <div className="absolute bottom-[-15px] right-0 translate-y-full w-14 h-14 rounded-full bg-[#40E0D0] flex flex-col items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform z-50">
           <Bot size={24} />
           <span className="text-[8px] font-bold tracking-widest mt-0.5">ONLINE</span>
        </div>

      </div>

    </div>
  );
};

export default DashboardGrid;
