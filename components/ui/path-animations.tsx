'use client';

import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const pathVariants = cva(
  "relative",
  {
    variants: {
      variant: {
        default: "stroke-zinc-400",
        accent: "stroke-zinc-200",
        highlight: "stroke-zinc-100",
      },
      thickness: {
        thin: "stroke-[1]",
        medium: "stroke-[2]",
        thick: "stroke-[3]",
      }
    },
    defaultVariants: {
      variant: "default",
      thickness: "medium",
    }
  }
);

interface PathAnimationProps extends VariantProps<typeof pathVariants> {
  path: string;
  className?: string;
  duration?: number;
  delay?: number;
  repeat?: boolean;
  fill?: string;
  onComplete?: () => void;
  direction?: 'normal' | 'reverse';
}

export function PathAnimation({
  path,
  variant,
  thickness,
  className,
  duration = 2,
  delay = 0,
  repeat = false,
  fill = "none",
  onComplete,
  direction = 'normal',
}: PathAnimationProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!pathRef.current) return;

    const length = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${length} ${length}`;
    
    const controls = animate(progress, 1, {
      duration,
      delay,
      ease: "easeInOut",
      repeat: repeat ? Infinity : 0,
      direction,
      onComplete,
      onUpdate: (latest) => {
        if (pathRef.current) {
          const drawLength = length * latest;
          pathRef.current.style.strokeDashoffset = direction === 'normal' 
            ? String(length - drawLength)
            : String(-length + drawLength);
        }
      },
    });

    return () => controls.stop();
  }, [progress, duration, delay, repeat, direction, onComplete]);

  return (
    <svg className={cn("w-full h-full", className)}>
      <motion.path
        ref={pathRef}
        d={path}
        className={cn(pathVariants({ variant, thickness }))}
        fill={fill}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
    </svg>
  );
}

// Helper component for drawing lines
interface LineAnimationProps extends Omit<PathAnimationProps, 'path'> {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export function LineAnimation({
  from,
  to,
  ...props
}: LineAnimationProps) {
  const path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  return <PathAnimation path={path} {...props} />;
}

// Helper component for drawing curves
interface CurveAnimationProps extends Omit<PathAnimationProps, 'path'> {
  start: { x: number; y: number };
  end: { x: number; y: number };
  control1: { x: number; y: number };
  control2?: { x: number; y: number };
}

export function CurveAnimation({
  start,
  end,
  control1,
  control2,
  ...props
}: CurveAnimationProps) {
  const path = control2
    ? `M ${start.x} ${start.y} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${end.x} ${end.y}`
    : `M ${start.x} ${start.y} Q ${control1.x} ${control1.y}, ${end.x} ${end.y}`;
  return <PathAnimation path={path} {...props} />;
} 