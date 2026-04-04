import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface CustomCursorProps {
  variant?: 'default' | 'dashboard';
}

const CustomCursor: React.FC<CustomCursorProps> = ({ variant = 'default' }) => {
  const [isHovering, setIsHovering] = useState(false);

  // Springs for the liquid trailing effect
  const springConfig1 = { damping: 25, stiffness: 300, mass: 0.5 };
  const springConfig2 = { damping: 20, stiffness: 200, mass: 0.8 };
  const springConfig3 = { damping: 15, stiffness: 150, mass: 1.2 };
  
  const cursorX1 = useSpring(0, springConfig1);
  const cursorY1 = useSpring(0, springConfig1);
  
  const cursorX2 = useSpring(0, springConfig2);
  const cursorY2 = useSpring(0, springConfig2);

  const cursorX3 = useSpring(0, springConfig3);
  const cursorY3 = useSpring(0, springConfig3);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      cursorX1.set(e.clientX);
      cursorY1.set(e.clientY);
      cursorX2.set(e.clientX);
      cursorY2.set(e.clientY);
      cursorX3.set(e.clientX);
      cursorY3.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX1, cursorY1, cursorX2, cursorY2, cursorX3, cursorY3]);

  const colors = variant === 'dashboard' 
    ? {
        main: 'bg-green-700',
        trail1: 'bg-green-500',
        trail2: 'bg-green-400'
      }
    : {
        main: 'bg-fintech-navy',
        trail1: 'bg-blue-500',
        trail2: 'bg-violet-500'
      };

  return (
    <>
      {/* SVG gooey filter definition */}
      <svg width="0" height="0" className="absolute hidden">
        <filter id="goo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      <div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
        style={{ filter: 'url(#goo)' }}
      >
        {/* Main Blob */}
        <motion.div
          className={`absolute top-0 left-0 ${colors.main} rounded-full`}
          style={{
            x: cursorX1,
            y: cursorY1,
            translateX: '-50%',
            translateY: '-50%',
            width: isHovering ? 40 : 25,
            height: isHovering ? 40 : 25,
          }}
        />
        {/* Trailing Blob 1 */}
        <motion.div
          className={`absolute top-0 left-0 ${colors.trail1} rounded-full`}
          style={{
            x: cursorX2,
            y: cursorY2,
            translateX: '-50%',
            translateY: '-50%',
            width: 18,
            height: 18,
          }}
        />
        {/* Trailing Blob 2 */}
        <motion.div
          className={`absolute top-0 left-0 ${colors.trail2} rounded-full`}
          style={{
            x: cursorX3,
            y: cursorY3,
            translateX: '-50%',
            translateY: '-50%',
            width: 12,
            height: 12,
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
