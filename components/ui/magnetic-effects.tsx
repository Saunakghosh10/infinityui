'use client';

import { useState, useRef, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const magneticVariants = cva(
  "relative inline-block overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
        strong: "",
        subtle: "",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-12 w-12",
        lg: "h-16 w-16",
        auto: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "auto",
    }
  }
);

interface MagneticEffectProps extends VariantProps<typeof magneticVariants> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  tolerance?: number;
  speed?: number;
  disabled?: boolean;
}

export function MagneticEffect({
  children,
  variant,
  size,
  className,
  strength = 30,
  radius = 400,
  tolerance = 0.8,
  speed = 1,
  disabled = false,
}: MagneticEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const strengthMultiplier = {
    default: 1,
    strong: 1.5,
    subtle: 0.5,
  }[variant || "default"];

  const actualStrength = strength * strengthMultiplier;

  const springConfig = {
    damping: 15,
    stiffness: 150,
    mass: 0.1,
  };

  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const rotateX = useTransform(y, [-actualStrength, actualStrength], [8, -8]);
  const rotateY = useTransform(x, [-actualStrength, actualStrength], [-8, 8]);

  useEffect(() => {
    if (disabled) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !isHovered) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < radius) {
        const factor = (1 - distance / radius) * tolerance;
        x.set(distanceX * factor * speed);
        y.set(distanceY * factor * speed);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered, radius, tolerance, speed, x, y, disabled]);

  const handleMouseEnter = () => !disabled && setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={containerRef}
      className={cn(magneticVariants({ variant, size }), className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          x,
          y,
          rotateX,
          rotateY,
        }}
        transition={{
          type: "spring",
          ...springConfig,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
} 