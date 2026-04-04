import React from 'react';

const RightVisualComponent: React.FC = () => {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center bg-white">
      {/* Background Overlay (Subtle Gradient/Grid for White Theme) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(148, 163, 184, 0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white via-white to-blue-50/50 pointer-events-none"></div>
      
      {/* Video Loop */}
      <div className="absolute inset-0 z-10 pointer-events-auto flex items-center justify-center">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

      </div>
    </div>
  );
};

export default RightVisualComponent;
