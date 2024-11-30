'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { advancedAnimations, springConfigs } from '@/lib/animation-variants';

interface InteractiveElementProps {
  children: React.ReactNode;
  className?: string;
  effects?: ('hover' | 'tilt' | 'magnetic' | 'ripple' | 'glow')[];
  intensity?: number;
  disabled?: boolean;
}

export function InteractiveElement({
  children,
  className,
  effects = ['hover'],
  intensity = 1,
  disabled = false,
}: InteractiveElementProps) {
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfigs.gentle);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfigs.gentle);
  const scale = useSpring(isHovered ? 1.05 : 1, springConfigs.soft);
  const brightness = useSpring(isHovered ? 1.2 : 1, springConfigs.soft);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovered(false);
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const getAnimationStyles = () => {
    const styles: any = {};

    if (effects.includes('tilt')) {
      styles.rotateX = rotateX;
      styles.rotateY = rotateY;
    }

    if (effects.includes('magnetic')) {
      styles.x = useSpring(mouseX, springConfigs.soft);
      styles.y = useSpring(mouseY, springConfigs.soft);
    }

    if (effects.includes('hover')) {
      styles.scale = scale;
    }

    if (effects.includes('glow')) {
      styles.filter = `brightness(${brightness})`;
    }

    return styles;
  };

  return (
    <motion.div
      ref={elementRef}
      className={cn(
        'relative overflow-hidden rounded-lg transition-colors',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={getAnimationStyles()}
      style={{ perspective: 1000 }}
    >
      {children}
      
      {effects.includes('ripple') && isHovered && (
        <motion.div
          className="absolute inset-0 bg-white/10 pointer-events-none"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
} 