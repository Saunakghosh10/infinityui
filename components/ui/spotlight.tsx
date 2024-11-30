'use client';

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightProps extends React.HTMLProps<HTMLDivElement> {}

export function Spotlight({ className, ...props }: SpotlightProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-30 transition-opacity duration-300",
        className
      )}
      {...props}
    >
      <motion.div
        className="absolute h-56 w-56 rounded-full bg-gradient-to-r from-zinc-900/50 to-zinc-700/50 blur-3xl"
        style={{
          x: spotlightX,
          y: spotlightY,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}