import React, { useState, useEffect } from 'react';
import { Heart, Droplets, Brain as BrainIcon, Watch, Battery } from 'lucide-react';
import GlassCard from './GlassCard';

interface VitalData {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  colorDim: string;
  waveType: 'ecg' | 'sine' | 'irregular';
  min: number;
  max: number;
  status: string;
}

const vitals: VitalData[] = [
  {
    label: 'HEART RATE',
    value: 74,
    unit: 'BPM',
    icon: <Heart size={14} />,
    color: '#F87171',
    colorDim: 'rgba(248,113,113,0.15)',
    waveType: 'ecg',
    min: 70,
    max: 82,
    status: 'Normal',
  },
  {
    label: 'OXYGEN (SPO2)',
    value: 98,
    unit: '%',
    icon: <Droplets size={14} />,
    color: '#22D3EE',
    colorDim: 'rgba(34,211,238,0.15)',
    waveType: 'sine',
    min: 96,
    max: 99,
    status: 'Healthy',
  },
  {
    label: 'STRESS LEVEL',
    value: 32,
    unit: '',
    icon: <BrainIcon size={14} />,
    color: '#A78BFA',
    colorDim: 'rgba(167,139,250,0.15)',
    waveType: 'irregular',
    min: 25,
    max: 45,
    status: 'Low',
  },
];

const ECGWave: React.FC<{ color: string }> = ({ color }) => (
  <div className="w-full h-10 overflow-hidden relative">
    <div className="absolute inset-0 flex animate-wave-scroll" style={{ width: '200%' }}>
      <svg viewBox="0 0 200 40" className="w-1/2 h-full" preserveAspectRatio="none">
        <polyline
          points="0,20 15,20 20,20 25,14 30,28 33,8 36,35 39,12 42,22 47,20 65,20 70,20 75,14 80,28 83,8 86,35 89,12 92,22 97,20 115,20 120,20 125,14 130,28 133,8 136,35 139,12 142,22 147,20 165,20 170,20 175,14 180,28 183,8 186,35 189,12 192,22 200,20"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>
      <svg viewBox="0 0 200 40" className="w-1/2 h-full" preserveAspectRatio="none">
        <polyline
          points="0,20 15,20 20,20 25,14 30,28 33,8 36,35 39,12 42,22 47,20 65,20 70,20 75,14 80,28 83,8 86,35 89,12 92,22 97,20 115,20 120,20 125,14 130,28 133,8 136,35 139,12 142,22 147,20 165,20 170,20 175,14 180,28 183,8 186,35 189,12 192,22 200,20"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>
    </div>
  </div>
);

const SineWave: React.FC<{ color: string }> = ({ color }) => {
  const points = Array.from({ length: 200 }, (_, i) => {
    const x = i;
    const y = 20 + Math.sin(i * 0.08) * 10;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full h-10 overflow-hidden relative">
      <div className="absolute inset-0 flex animate-wave-scroll" style={{ width: '200%' }}>
        <svg viewBox="0 0 200 40" className="w-1/2 h-full" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
        <svg viewBox="0 0 200 40" className="w-1/2 h-full" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
};

const IrregularWave: React.FC<{ color: string }> = ({ color }) => {
  const points = Array.from({ length: 200 }, (_, i) => {
    const x = i;
    const y = 20 + Math.sin(i * 0.05) * 6 + Math.sin(i * 0.15) * 4 + Math.sin(i * 0.3) * 2;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full h-10 overflow-hidden relative">
      <div className="absolute inset-0 flex animate-wave-scroll" style={{ width: '200%', animationDuration: '6s' }}>
        <svg viewBox="0 0 200 40" className="w-1/2 h-full" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
        <svg viewBox="0 0 200 40" className="w-1/2 h-full" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
};

const WaveComponents = { ecg: ECGWave, sine: SineWave, irregular: IrregularWave };

const VitalsPanel: React.FC = () => {
  const [values, setValues] = useState(vitals.map(v => v.value));
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceDetails, setDeviceDetails] = useState<{name: string, battery: number | null} | null>(null);

  const connectBluetooth = async () => {
    const nav: any = navigator;
    if (!nav.bluetooth) {
      alert("Web Bluetooth is not supported in this browser.");
      return;
    }
    
    try {
      setIsConnecting(true);
      const device = await nav.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['heart_rate', 'battery_service']
      });
      
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');
      
      await characteristic.startNotifications();
      
      characteristic.addEventListener('characteristicvaluechanged', (e: any) => {
        const value = e.target.value;
        if (!value) return;

        const flags = value.getUint8(0);
        const heartRate = (flags & 0x01) === 1 ? value.getUint16(1, true) : value.getUint8(1);

        setValues((prev: number[]) => {
          const newValues = [...prev];
          newValues[0] = heartRate;
          return newValues;
        });
      });

      let battery = null;
      try {
        const batteryService = await server.getPrimaryService('battery_service');
        const batteryCharacteristic = await batteryService.getCharacteristic('battery_level');
        const batteryValue = await batteryCharacteristic.readValue();
        battery = batteryValue.getUint8(0);
      } catch (e) {
        console.log("Battery service not available");
      }

      setDeviceDetails({ name: device.name || 'Smartwatch', battery });

      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setDeviceDetails(null);
      });

      setIsConnected(true);
    } catch (error: any) {
      if (error && error.name !== 'NotFoundError') {
        console.error("Bluetooth connection failed:", error);
      }
      // If error.name is 'NotFoundError', the user just cancelled the chooser popup. No need to log an error.
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(prev => prev.map((val, i) => {
        if (i === 0 && isConnected) return val; // Skip simulation if connected to watch
        const v = vitals[i];
        const delta = (Math.random() - 0.5) * 2;
        return Math.round(Math.min(v.max, Math.max(v.min, val + delta)));
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <GlassCard className="flex flex-col gap-3 h-full" delay={0.1}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase">Live Vitals</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={connectBluetooth}
            disabled={isConnecting}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border shadow-sm ${
              isConnected 
                ? 'bg-[#40E0D0]/10 text-[#40E0D0] border-[#40E0D0]/30' 
                : 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20 hover:scale-105'
            }`}
          >
            {isConnecting ? (
              <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Watch size={14} />
            )}
            {isConnecting ? 'CONNECTING...' : isConnected ? (deviceDetails?.name || 'CONNECTED') : 'CONNECT WATCH'}
          </button>
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isConnected ? 'bg-green-400' : 'bg-ll-emerald'}`} />
            <span className={`text-[10px] font-medium ${isConnected ? 'text-green-400' : 'text-ll-emerald'}`}>
              LIVE
            </span>
          </span>
        </div>
      </div>

      {isConnected && deviceDetails && (
        <div className="flex items-center justify-between bg-white/[0.04] p-3 rounded-xl mb-4 border border-[#40E0D0]/20 relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[#40E0D0]/5 animate-pulse rounded-xl"></div>
          <div className="flex items-center gap-3 relative z-20">
            <div className="w-8 h-8 rounded-lg bg-[#40E0D0]/10 flex items-center justify-center text-[#40E0D0] border border-[#40E0D0]/20 shadow-glow-cyan">
               <Watch size={16} />
            </div>
            <div>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Active Device</p>
              <p className="text-sm text-white font-bold tracking-wide">{deviceDetails.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 relative z-20 shadow-inner">
            <Battery size={16} className={deviceDetails.battery !== null && deviceDetails.battery > 20 ? "text-green-400" : "text-red-400"} />
            <span className="text-xs font-bold text-white/90">{deviceDetails.battery !== null ? `${deviceDetails.battery}%` : 'N/A'}</span>
          </div>
        </div>
      )}

      {/* Grid rendering based on connection */}
      <div className={`flex-1 ${isConnected ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'flex flex-col items-center justify-center py-12'}`}>
        {!isConnected ? (
           <div className="flex flex-col items-center text-center px-4">
             <div className="w-20 h-20 rounded-full bg-[#40E0D0]/5 flex items-center justify-center text-[#40E0D0]/40 mb-6 border border-[#40E0D0]/10 shadow-[0_0_30px_rgba(64,224,208,0.05)]">
               <Watch size={40} className="opacity-50" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-3">No Device Connected</h3>
             <p className="text-sm text-white/40 max-w-md leading-relaxed">
               Securely link your Bluetooth-enabled smartwatch to stream live cardiovascular data, oxygen metrics, and real-time distress signals directly into your LifeLine dashboard.
             </p>
             <button
               onClick={connectBluetooth}
               className="mt-8 px-6 py-3 bg-[#40E0D0]/10 text-[#40E0D0] border border-[#40E0D0]/30 rounded-xl font-bold tracking-wide hover:bg-[#40E0D0]/20 hover:scale-105 transition-all shadow-glow-cyan flex items-center gap-2"
             >
               <Watch size={18} />
               PAIR SMARTWATCH NOW
             </button>
           </div>
        ) : (
          vitals.map((vital, i) => {
            const Wave = WaveComponents[vital.waveType];
            return (
              <div key={vital.label} className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 shadow-glass-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shadow-inner"
                        style={{ background: vital.colorDim, color: vital.color }}
                      >
                        {vital.icon}
                      </div>
                      <span className="text-xs font-bold tracking-wider text-white/50">{vital.label}</span>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/5 shadow-sm"
                      style={{ background: vital.colorDim, color: vital.color }}
                    >
                      {vital.status}
                    </span>
                  </div>
                  <div className="flex items-end gap-2 mb-4 pl-1">
                    <span className="font-mono text-4xl font-extrabold text-white/80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {values[i]}
                    </span>
                    {vital.unit && <span className="text-sm font-semibold text-white/40 pb-1.5">{vital.unit}</span>}
                  </div>
                </div>
                <div className="bg-black/20 rounded-xl p-2 border border-white/5">
                  <Wave color={vital.color} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
};

export default VitalsPanel;
