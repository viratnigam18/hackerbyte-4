import React from 'react';
import { Html } from '@react-three/drei';

const Loader: React.FC = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-lifeline-mint/30 border-t-lifeline-mint rounded-full animate-spin"></div>
        <p className="text-lifeline-mint text-sm font-medium tracking-wide">Loading 3D...</p>
      </div>
    </Html>
  );
};

export default Loader;
