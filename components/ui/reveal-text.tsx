'use client';

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function RevealText({ children, className, delay = 0 }: RevealTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{
          duration: 0.8,
          delay: delay,
          ease: [0.21, 1.11, 0.81, 0.99],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
} 