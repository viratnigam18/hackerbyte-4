import React from 'react';
import VitalsPanel from './VitalsPanel';
import HeartWidget from './HeartWidget';
import EmergencySeverity from './EmergencySeverity';
import AIRecommendation from './AIRecommendation';
import SymptomInput from './SymptomInput';
import MapPanel from './MapPanel';
import HospitalCards from './HospitalCards';
import TelemedicinePanel from './TelemedicinePanel';
import MedicinePanel from './MedicinePanel';

const DashboardView: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto px-6 py-5 pb-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Row 1 — Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mb-4">
          {/* Vitals — spans 3 cols */}
          <div className="lg:col-span-3" style={{ minHeight: '380px' }}>
            <VitalsPanel />
          </div>
          {/* Heart 3D — spans 3 cols */}
          <div className="lg:col-span-3" style={{ minHeight: '380px' }}>
            <HeartWidget />
          </div>
          {/* Emergency — spans 3 cols */}
          <div className="lg:col-span-3" style={{ minHeight: '380px' }}>
            <EmergencySeverity />
          </div>
          {/* AI Recommendation — spans 3 cols */}
          <div className="lg:col-span-3" style={{ minHeight: '380px' }}>
            <AIRecommendation />
          </div>
        </div>

        {/* Row 2 — Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mb-4">
          {/* Symptom Checker — 4 cols */}
          <div className="lg:col-span-4" style={{ minHeight: '320px' }}>
            <SymptomInput />
          </div>
          {/* Map — 4 cols */}
          <div className="lg:col-span-4" style={{ minHeight: '320px' }}>
            <MapPanel />
          </div>
          {/* Hospital Cards — 4 cols */}
          <div className="lg:col-span-4" style={{ minHeight: '320px' }}>
            <HospitalCards />
          </div>
        </div>

        {/* Row 3 — Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Telemedicine — 6 cols */}
          <div className="lg:col-span-6" style={{ minHeight: '280px' }}>
            <TelemedicinePanel />
          </div>
          {/* Medicine — 6 cols */}
          <div className="lg:col-span-6" style={{ minHeight: '280px' }}>
            <MedicinePanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
