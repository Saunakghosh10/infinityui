'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AdvancedAnimationProps {
  children: React.ReactNode;
  type: 'parallax' | 'reveal' | 'morph' | 'float' | 'wave' | 'glitch';
  intensity?: number;
  delay?: number;
  duration?: number;
  className?: string;
}

export function AdvancedAnimation({
  children,
  type,
  intensity = 1,
  delay = 0,
  duration = 1,
  className,
}: AdvancedAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const springProgress = useSpring(scrollYProgress, springConfig);

  const getAnimationProps = () => {
    switch (type) {
      case 'parallax':
        return {
          y: useTransform(springProgress, [0, 1], [100 * intensity, -100 * intensity]),
        };
      case 'reveal':
        return {
          initial: { opacity: 0, y: 50 * intensity },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration },
        };
      case 'morph':
        return {
          animate: {
            borderRadius: ["20%", "50%", "20%"],
            rotate: [0, 180, 0],
          },
          transition: {
            duration: duration * 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case 'float':
        return {
          animate: {
            y: [-10 * intensity, 10 * intensity],
          },
          transition: {
            duration: duration * 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        };
      case 'wave':
        return {
          animate: {
            scale: [1, 1.05, 1],
            rotate: [-1, 1, -1],
          },
          transition: {
            duration: duration * 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case 'glitch':
        return {
          animate: {
            x: [-2, 2, -2, 2, 0],
            y: [2, -2, 2, -2, 0],
            filter: [
              "hue-rotate(0deg)",
              "hue-rotate(90deg)",
              "hue-rotate(180deg)",
              "hue-rotate(270deg)",
              "hue-rotate(0deg)",
            ],
          },
          transition: {
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 2,
          },
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      {...getAnimationProps()}
    >
      {children}
    </motion.div>
  );
} 