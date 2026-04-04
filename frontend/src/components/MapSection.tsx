import React, { useState, useEffect } from 'react';
import { Navigation2, Filter, Star, Clock, DollarSign } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
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

// Component to handle map center updates
const RecenterMap: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};


import { Hospital } from './AnalysisDashboard';

interface MapSectionProps {
  userLocation: [number, number];
  hospitals: Hospital[];
  radius: number;
  isLocating: boolean;
  isExpanding: boolean;
}

const MapSection: React.FC<MapSectionProps> = ({ userLocation, hospitals, radius, isLocating, isExpanding }) => {
  const [filter, setFilter] = useState('All');

  const finalHospitals = (() => {
    if (filter === 'All') return hospitals;
    if (filter === 'Nearest') {
      const sorted = [...hospitals].sort((a, b) => (a.distance || 0) - (b.distance || 0));
      return sorted.length > 0 ? [sorted[0]] : []; // Show only the absolute closest
    }
    if (filter === 'Highest Rated') {
      return hospitals.filter(h => h.rating >= 4.7); // Best hospitals
    }
    if (filter === 'Cheapest') {
      // Return a specific hospital to simulate 'Cheapest'
      const sorted = [...hospitals].sort((a, b) => a.name.localeCompare(b.name));
      return sorted.length > 0 ? [sorted[0]] : []; 
    }
    return hospitals;
  })();

  return (
    <GlassCard className="h-full flex flex-col relative overflow-hidden p-0 min-h-[350px]" delay={0.45}>
      {/* Interactive Map Area */}
      <div className="flex-1 relative rounded-t-xl overflow-hidden" style={{ minHeight: '260px', zIndex: 1 }}>
        <MapContainer 
          center={userLocation} 
          zoom={radius > 1000 ? 5 : radius > 100 ? 8 : 13} 
          style={{ height: '100%', width: '100%' }} 
          zoomControl={false}
          attributionControl={false}
        >
          <RecenterMap center={userLocation} />
          
          {/* Dark map tiles suitable for the dashboard's design */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* User Location Area (The Search Zone) */}
          <Circle 
            center={userLocation} 
            radius={radius * 1000} 
            pathOptions={{ color: '#00f5d4', fillColor: '#00f5d4', fillOpacity: 0.05, weight: 1 }} 
          />
          <Marker 
            position={userLocation} 
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
          {finalHospitals.map(h => (
            <Marker key={h.name} position={[h.lat, h.lng]} icon={createCustomIcon(h.color)}>
              <Popup className="custom-popup">
                <div className="p-1 min-w-[120px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: h.color }}></span>
                    <strong className="text-sm text-gray-900 leading-tight">{h.name}</strong>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{h.specialty}</p>
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400">{h.distance?.toFixed(1)} km</span>
                    <span className="text-[10px] font-bold text-ll-yellow flex items-center gap-0.5">
                      <Star size={8} fill="currentColor" /> {h.rating}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Label */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-[400] pointer-events-none">
          <Navigation2 size={12} className={isLocating || isExpanding ? "text-ll-cyan animate-pulse" : "text-ll-cyan"} />
          <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase">
            {isLocating ? "Locating..." : isExpanding ? `SCALING: ${radius}KM` : `ZONE: ${radius}KM`}
          </span>
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
        {hospitals.length === 0 && !isLocating && (
          <span className="text-[10px] text-red-400 font-bold ml-auto animate-pulse">Expanding search...</span>
        )}
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


