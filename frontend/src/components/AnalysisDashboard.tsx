import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import AIAnalysisPanel from './AIAnalysisPanel';
import FutureHealthPrediction from './FutureHealthPrediction';
import HealthScoreCard from './HealthScoreCard';
import NearbyHospitalsPanel from './NearbyHospitalsPanel';
import MedicineRemediesPanel from './MedicineRemediesPanel';
import MapSection from './MapSection';

interface AnalysisDashboardProps {
  symptoms: string;
  onBack: () => void;
}

export interface Hospital {
  name: string;
  specialty: string;
  lat: number;
  lng: number;
  color: string;
  rating: number;
  eta: string;
  distance?: number;
}

const generateHospitals = (lat: number, lng: number): Hospital[] => [
  { name: 'CityMD Emergency', specialty: 'Emergency Care', lat: lat + 0.005, lng: lng - 0.005, color: '#ff4d4d', rating: 4.5, eta: '3 min' },
  { name: 'Fortis Hospital', specialty: 'Cardiology', lat: lat - 0.008, lng: lng + 0.008, color: '#4ade80', rating: 4.8, eta: '8 min' },
  { name: 'Apollo Clinic', specialty: 'General Medicine', lat: lat + 0.012, lng: lng + 0.005, color: '#a78bfa', rating: 4.3, eta: '12 min' },
  { name: 'AIIMS', specialty: 'Multi-specialty', lat: lat - 0.015, lng: lng - 0.010, color: '#facc15', rating: 4.9, eta: '18 min' },
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface AnalysisData {
  response: string;
  confidence: number;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ symptoms, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  // GPS and Search States
  const [userLocation, setUserLocation] = useState<[number, number]>([28.5450, 77.1950]);
  const [activeRadius, setActiveRadius] = useState(5);
  const [isGpsLoading, setIsGpsLoading] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: symptoms })
        });
        
        if (!res.ok) throw new Error('Failed to fetch from AI Doctor API');
        const data = await res.json();
        setAnalysis({
          response: data.response,
          confidence: data.confidence * 100
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    if (symptoms) fetchPrediction();
  }, [symptoms]);

  // Geolocation Effect
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setIsGpsLoading(false);
        },
        (error) => {
          console.error("GPS Error:", error);
          setIsGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsGpsLoading(false);
    }
  }, []);

  // Adaptive Search Logic (Expanding Zones) - Animated Stepping
  useEffect(() => {
    if (isGpsLoading) return;

    const radii = [5, 10, 25, 50, 100, 500, 1000, 5000];
    const currentIndex = radii.indexOf(activeRadius);
    
    // Calculate distances to all hospitals
    const hospitalsWithDist = generateHospitals(userLocation[0], userLocation[1]).map(h => ({
      ...h,
      distance: calculateDistance(userLocation[0], userLocation[1], h.lat, h.lng)
    })).sort((a, b) => a.distance! - b.distance!);

    // Check if any are within current radius
    const found = hospitalsWithDist.filter(h => h.distance! <= activeRadius);

    if (found.length > 0) {
      setNearbyHospitals(found);
      setIsExpanding(false);
    } else if (currentIndex < radii.length - 1) {
      // Not found, sweep faster to next zone
      setIsExpanding(true);
      const timer = setTimeout(() => {
        setActiveRadius(radii[currentIndex + 1]);
      }, 200); // Fast 200ms sweep
      return () => clearTimeout(timer);
    } else {
      // Safety Fallback: If we hit 5000km and still nothing (e.g. user is in another continent)
      // Just show the nearest hospitals anyway so the UI isn't empty
      setNearbyHospitals(hospitalsWithDist);
      setIsExpanding(false);
    }
  }, [userLocation, isGpsLoading, activeRadius]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[rgba(8,32,20,0.6)] backdrop-blur-xl relative z-20">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-ll-cyan hover:border-ll-cyan/20 transition-all"
          >
            <ArrowLeft size={16} />
          </motion.button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ll-cyan to-emerald-400 flex items-center justify-center shadow-glow-cyan">
              <Shield size={14} className="text-ll-bg" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-white">LifeLine</span>
            <span className="text-[9px] font-bold text-ll-cyan/60 uppercase bg-ll-cyan/[0.08] px-2 py-0.5 rounded-full border border-ll-cyan/[0.15]">AI Analysis</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-5 text-[10px] text-white/25 font-medium">
          <span className="flex items-center gap-1.5"><span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-ll-emerald'}`} />{loading ? 'Analyzing...' : 'System Online'}</span>
          <span className="w-px h-3 bg-white/[0.06]" />
          <span>{loading ? 'Processing Input' : 'Analysis Complete'}</span>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20">
        <div className="max-w-[1500px] mx-auto">

          {/* Top Row: AI Analysis | Future Prediction + Health Score | Nearby Hospitals */}
          <div className="grid grid-cols-12 gap-4 mb-4" style={{ minHeight: '380px' }}>
            {/* LEFT: AI Analysis — 4 cols, full height */}
            <div className="col-span-12 md:col-span-4">
              <AIAnalysisPanel symptoms={symptoms} loading={loading} error={error} analysis={analysis} />
            </div>

            {/* CENTER: Future Prediction (top) + Health Score (bottom) — 4 cols */}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
              <div className="flex-1">
                <FutureHealthPrediction analysis={analysis} symptoms={symptoms} />
              </div>
              <div className="flex-1">
                <HealthScoreCard analysis={analysis} symptoms={symptoms} />
              </div>
            </div>

            {/* RIGHT: Nearby Hospitals — 4 cols, full height */}
            <div className="col-span-12 md:col-span-4">
              <NearbyHospitalsPanel hospitals={nearbyHospitals} isSearching={isExpanding} />
            </div>
          </div>

          {/* Bottom Row: Medicine & Remedies | Map */}
          <div className="grid grid-cols-12 gap-4" style={{ minHeight: '280px' }}>
            {/* LEFT: Medicine & Remedies — 6 cols */}
            <div className="col-span-12 md:col-span-6">
              <MedicineRemediesPanel />
            </div>

            {/* RIGHT: Map — 6 cols */}
            <div className="col-span-12 md:col-span-6">
              <MapSection 
                userLocation={userLocation} 
                hospitals={nearbyHospitals} 
                radius={activeRadius}
                isLocating={isGpsLoading} 
                isExpanding={isExpanding}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;

