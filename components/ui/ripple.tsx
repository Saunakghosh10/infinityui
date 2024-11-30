'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RippleProps {
  x: number;
  y: number;
  size: number;
  color?: string;
}

interface RippleContainerProps {
  className?: string;
  color?: string;
}

export function RippleContainer({ className, color = "rgba(255, 255, 255, 0.1)" }: RippleContainerProps) {
  const [ripples, setRipples] = useState<RippleProps[]>([]);

  useEffect(() => {
    const cleanup = () => setRipples([]);
    return cleanup;
  }, []);

  const addRipple = (event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setRipples([...ripples, { x, y, size, color }]);
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      onMouseDown={addRipple}
    >
      <AnimatePresence>
        {ripples.map((ripple, i) => (
          <Ripple key={i} {...ripple} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Ripple({ x, y, size, color }: RippleProps) {
  return (
    <motion.span
      initial={{ 
        width: 0,
        height: 0,
        x: x - size / 2,
        y: y - size / 2,
        opacity: 0.5,
      }}
      animate={{ 
        width: size,
        height: size,
        opacity: 0,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute',
        borderRadius: '50%',
        backgroundColor: color,
        pointerEvents: 'none',
      }}
    />
  );
} 