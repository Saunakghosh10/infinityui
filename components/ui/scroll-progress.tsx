'use client';

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-[63px] left-0 right-0 h-[1px] bg-gradient-to-r from-zinc-500/0 via-zinc-300/70 to-zinc-500/0 transform origin-left z-50"
      style={{ scaleX }}
    />
  );
} 