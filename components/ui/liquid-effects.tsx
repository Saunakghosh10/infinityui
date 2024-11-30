'use client';

import { useState, useRef, useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const liquidVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-zinc-900/50",
        gradient: "bg-gradient-to-r from-zinc-900/50 to-zinc-800/50",
        glass: "bg-zinc-900/30 backdrop-blur-sm",
      },
      size: {
        sm: "h-32",
        md: "h-48",
        lg: "h-64",
        full: "h-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    }
  }
);

interface LiquidEffectsProps extends VariantProps<typeof liquidVariants> {
  className?: string;
  intensity?: number;
  frequency?: number;
  speed?: number;
  color?: string;
  interactive?: boolean;
  children?: React.ReactNode;
}

export function LiquidEffects({
  variant,
  size,
  className,
  intensity = 50,
  frequency = 4,
  speed = 1,
  color = "rgba(255, 255, 255, 0.1)",
  interactive = true,
  children,
}: LiquidEffectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [path, setPath] = useState<string>("");

  const springConfig = { damping: 20, stiffness: 200, mass: 1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const points = useRef<{ x: number; y: number }[]>([]);
  const controlPoints = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updatePoints = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const width = rect.width;
      const height = rect.height;
      const segmentCount = Math.floor(frequency * 2);
      
      points.current = Array.from({ length: segmentCount + 1 }, (_, i) => ({
        x: (width * i) / segmentCount,
        y: height / 2,
      }));

      controlPoints.current = Array.from({ length: segmentCount }, (_, i) => ({
        x: (width * (i + 0.5)) / segmentCount,
        y: height / 2,
      }));
    };

    updatePoints();
    window.addEventListener('resize', updatePoints);
    return () => window.removeEventListener('resize', updatePoints);
  }, [frequency]);

  useEffect(() => {
    const animate = () => {
      if (!containerRef.current) return;

      const time = Date.now() * speed * 0.001;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      points.current.forEach((point, i) => {
        const xOffset = Math.sin(time + i * frequency) * intensity;
        const yOffset = Math.cos(time + i * frequency) * intensity;
        
        if (interactive) {
          const dx = point.x - x.get();
          const dy = point.y - y.get();
          const distance = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - distance / 200);
          
          point.x = (rect.width * i) / (points.current.length - 1) + xOffset;
          point.y = centerY + yOffset + influence * intensity;
        } else {
          point.x = (rect.width * i) / (points.current.length - 1) + xOffset;
          point.y = centerY + yOffset;
        }
      });

      const pathData = points.current.reduce((acc, point, i) => {
        if (i === 0) return `M ${point.x} ${point.y}`;
        const prevPoint = points.current[i - 1];
        const cpx = (prevPoint.x + point.x) / 2;
        return `${acc} C ${cpx} ${prevPoint.y} ${cpx} ${point.y} ${point.x} ${point.y}`;
      }, "");

      setPath(pathData);
      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [intensity, frequency, speed, interactive, x, y]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      className={cn(liquidVariants({ variant, size }), className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: "blur(10px)" }}
      >
        <path d={path} fill={color} />
      </svg>
      {children}
    </div>
  );
}