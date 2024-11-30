'use client';

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const perspectiveVariants = cva(
  "relative rounded-lg overflow-hidden transform-gpu",
  {
    variants: {
      variant: {
        default: "bg-zinc-900 border border-zinc-800 shadow-lg",
        glass: "bg-zinc-900/30 backdrop-blur-[8px] border border-white/10 shadow-xl",
        minimal: "bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border-none shadow-sm",
      },
      intensity: {
        subtle: {
          rotateIntensity: 5,
          scale: 1.02,
          glareOpacity: 0.05
        },
        medium: {
          rotateIntensity: 15,
          scale: 1.05,
          glareOpacity: 0.1
        },
        strong: {
          rotateIntensity: 25,
          scale: 1.08,
          glareOpacity: 0.15
        }
      }
    },
    defaultVariants: {
      variant: "default",
      intensity: "medium",
    }
  }
);

interface PerspectiveEffectProps extends VariantProps<typeof perspectiveVariants> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  rotateIntensity?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
  shadow?: boolean;
}

export function PerspectiveEffect({
  children,
  variant,
  intensity,
  className,
  disabled = false,
  rotateIntensity = 15,
  perspective = 1000,
  scale = 1.05,
  glare = true,
  shadow = true,
}: PerspectiveEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const intensityMultiplier = {
    subtle: 0.5,
    medium: 1,
    strong: 1.5,
  }[intensity || "medium"];

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [rotateIntensity, -rotateIntensity]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-rotateIntensity, rotateIntensity]);
  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || disabled) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(perspectiveVariants({ variant, intensity }), className)}
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX: disabled ? 0 : springRotateX,
          rotateY: disabled ? 0 : springRotateY,
          scale: isHovered && !disabled ? scale : 1,
        }}
        transition={{ duration: 0.1 }}
        className="relative"
      >
        {children}

        {glare && isHovered && !disabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20 pointer-events-none"
            style={{
              rotateX: springRotateX,
              rotateY: springRotateY,
              scale,
            }}
          />
        )}

        {shadow && (
          <motion.div
            className="absolute -inset-2 bg-black/50 -z-10 blur-xl rounded-[inherit]"
            style={{
              opacity: isHovered && !disabled ? 0.3 : 0,
              scale: isHovered && !disabled ? 1 : 0.8,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
} 