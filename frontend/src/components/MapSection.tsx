import React, { useState } from 'react';
import { Navigation2, Filter, Star, DollarSign, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import GlassCard from './GlassCard';

// Custom icons using SVG since default images might not load smoothly
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: ${color}20; border: 2px solid ${color}; box-shadow: 0 0 10px ${color}80;">
             <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></div>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};


// Hardcoded location (Delhi approx)
const USER_LOCATION: [number, number] = [28.5450, 77.1950];

const hospitalsData = [
  { name: 'CityMD Emergency', specialty: 'Emergency Care', category: 'Nearest', lat: 28.5400, lng: 77.1850, color: '#ff4d4d', stat: '0.8 km' },
  { name: 'Fortis Hospital', specialty: 'Cardiology', category: 'Highest Rated', lat: 28.5550, lng: 77.2050, color: '#4ade80', stat: '★ 4.8' },
  { name: 'Apollo Clinic', specialty: 'General Medicine', category: 'Cheapest', lat: 28.5300, lng: 77.1750, color: '#a78bfa', stat: '$' },
  { name: 'AIIMS', specialty: 'Multi-specialty', category: 'All', lat: 28.5700, lng: 77.2100, color: '#facc15', stat: '5.2 km' },
];

const MapSection: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const filteredHospitals = filter === 'All' 
    ? hospitalsData 
    : hospitalsData.filter(h => h.category === filter);

  return (
    <GlassCard className="h-full flex flex-col relative overflow-hidden p-0 min-h-[350px]" delay={0.45}>
      {/* Interactive Map Area */}
      <div className="flex-1 relative rounded-t-xl overflow-hidden" style={{ minHeight: '260px', zIndex: 1 }}>
        <MapContainer 
          center={USER_LOCATION} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }} 
          zoomControl={false}
          attributionControl={false}
        >
          {/* Dark map tiles suitable for the dashboard's design */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* User Location Area */}
          <Circle 
            center={USER_LOCATION} 
            radius={2000} 
            pathOptions={{ color: '#00f5d4', fillColor: '#00f5d4', fillOpacity: 0.1, weight: 1 }} 
          />
          <Marker 
            position={USER_LOCATION} 
            icon={L.divIcon({
              className: 'user-pulse',
              html: `<div class="w-4 h-4 rounded-full bg-ll-cyan relative"><div class="absolute inset-0 rounded-full bg-ll-cyan animate-ping-slow"></div></div>`,
              iconSize: [16, 16]
            })}
          >
            <Popup className="custom-popup">
              <span className="text-xs font-bold font-sans text-gray-800">Your Location</span>
            </Popup>
          </Marker>

          {/* Hospital Markers */}
          {filteredHospitals.map(h => (
            <Marker key={h.name} position={[h.lat, h.lng]} icon={createCustomIcon(h.color)}>
              <Popup className="custom-popup">
                <div className="p-1 min-w-[120px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: h.color }}></span>
                    <strong className="text-sm text-gray-900 leading-tight">{h.name}</strong>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{h.specialty}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                    {h.category}: {h.stat}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Label */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-[400] pointer-events-none">
          <Navigation2 size={12} className="text-ll-cyan" />
          <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase">Live Map</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-4 py-3 flex flex-wrap items-center gap-2 border-t border-white/[0.04] bg-[#0A1A14] relative z-20">
        <Filter size={12} className="text-white/25 mr-1" />
        {[
          { label: 'All', icon: null },
          { label: 'Nearest', icon: <Clock size={10} /> },
          { label: 'Highest Rated', icon: <Star size={10} /> },
          { label: 'Cheapest', icon: <DollarSign size={10} /> }
        ].map(f => (
          <button
            key={f.label}
            onClick={() => setFilter(f.label)}
            className={`text-[10px] flex items-center gap-1.5 font-bold px-2.5 py-1.5 rounded-lg transition-all
              ${filter === f.label
                ? 'bg-ll-cyan/[0.15] text-ll-cyan border border-ll-cyan/30 shadow-[0_0_10px_rgba(0,245,212,0.2)]'
                : 'text-white/40 border border-transparent hover:text-white/70 hover:bg-white/[0.05]'
              }`}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      <style>{`
        .leaflet-container { background: transparent !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px; }
        .leaflet-popup-tip { background: white; }
      `}</style>
    </GlassCard>
  );
};

export default MapSection;

