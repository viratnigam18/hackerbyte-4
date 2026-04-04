import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import DNAAnimation from './DNAAnimation';
import Loader from './Loader';

interface HeroDNAProps {
  onGetStarted: () => void;
}

const HeroDNA: React.FC<HeroDNAProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-white overflow-hidden">
      {/* Left Section - Content */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-12 lg:px-24 z-10 relative">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-12 -left-12 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 max-w-xl"
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold tracking-wider uppercase">
            Evolution of Care
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
            AI-Powered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-500 to-pink-500">
              Health Intelligence
            </span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-md">
            Harnessing the power of predictive genetics and real-time biometric analysis to deliver hyper-personalized, proactive medical insights. Welcome to the future of well-being.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGetStarted}
            className="group relative px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-semibold text-lg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 flex items-center gap-3"
          >
            <span className="relative z-10">Get Started</span>
            <svg 
              className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.button>
        </motion.div>
      </div>

      {/* Right Section - 3D Visual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        className="hidden lg:block w-full lg:w-1/2 h-full relative"
      >
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(148, 163, 184, 0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>

        <div className="absolute inset-0 z-10 pointer-events-auto">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
            <Suspense fallback={<Loader />}>
              <ambientLight intensity={1.8} color="#ffffff" />
              <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
              <spotLight position={[-5, 5, 5]} intensity={1} color="#f472b6" angle={0.5} penumbra={1} />
              <spotLight position={[5, -5, -5]} intensity={1} color="#7dd3fc" angle={0.5} penumbra={1} />

              <group position={[0, 0, 0]}>
                <DNAAnimation />
              </group>

              <EffectComposer>
                <Bloom 
                  intensity={0.6} 
                  luminanceThreshold={0.8} 
                  luminanceSmoothing={0.9} 
                  mipmapBlur
                />
              </EffectComposer>
            </Suspense>
          </Canvas>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroDNA;
