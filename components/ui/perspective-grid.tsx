'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PerspectiveGridProps {
  children?: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  itemCount?: number;
  gap?: number;
  hover?: boolean;
}

export function PerspectiveGrid({
  children,
  className,
  intensity = 'medium',
  itemCount = 16,
  gap = 20,
  hover = true,
}: PerspectiveGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const intensityValues = {
    subtle: { rotation: 10, z: 30 },
    medium: { rotation: 20, z: 50 },
    strong: { rotation: 30, z: 70 }
  };

  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative h-[500px] bg-zinc-900/50 rounded-lg overflow-hidden border border-zinc-800", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div 
          className="grid"
          style={{ 
            gridTemplateColumns: `repeat(${Math.sqrt(itemCount)}, 1fr)`,
            gap,
          }}
        >
          {Array.from({ length: itemCount }).map((_, i) => (
            <motion.div
              key={i}
              className="w-16 h-16 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-lg border border-zinc-700/30 backdrop-blur-sm"
              style={{
                transform: `translateZ(${Math.sin(i * 0.5) * intensityValues[intensity].z}px)`,
              }}
              whileHover={hover ? { 
                scale: 1.1, 
                rotateZ: 5,
                backgroundColor: 'rgba(255,255,255,0.1)',
              } : undefined}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="w-full h-full bg-gradient-to-br from-zinc-700/20 to-transparent" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ambient light effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
    </motion.div>
  );
} 