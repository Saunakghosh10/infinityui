'use client';

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'rotate';
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
  delay?: number;
  duration?: number;
  className?: string;
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slide: {
    initial: (direction: string) => ({
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      opacity: 0,
    }),
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
    },
  },
  scale: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  },
  rotate: {
    initial: { rotate: 180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
  },
};

export function ScrollAnimation({
  children,
  animation = 'fade',
  direction = 'up',
  threshold = 0.5,
  delay = 0,
  duration = 0.5,
  className,
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
    amount: threshold,
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const springProgress = useSpring(scrollYProgress, springConfig);
  
  const scale = useTransform(springProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(springProgress, [0, 1], [0.3, 1]);

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={animations[animation]}
      custom={direction}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      style={{
        scale: animation === 'scale' ? scale : 1,
        opacity: animation === 'fade' ? opacity : 1,
      }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );
} 