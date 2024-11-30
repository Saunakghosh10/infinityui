'use client';

import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const morphingVariants = cva(
  "relative",
  {
    variants: {
      variant: {
        default: "text-zinc-400",
        accent: "text-zinc-200",
        highlight: "text-zinc-100",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    }
  }
);

interface MorphingEffectProps extends VariantProps<typeof morphingVariants> {
  shapes: string[];
  duration?: number;
  delay?: number;
  repeat?: boolean;
  className?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  onComplete?: () => void;
}

export function MorphingEffect({
  shapes,
  variant,
  size,
  duration = 0.5,
  delay = 0,
  repeat = false,
  className,
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
  onComplete,
}: MorphingEffectProps) {
  const progress = useMotionValue(0);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current || shapes.length < 2) return;

    const controls = animate(progress, 1, {
      duration: duration * shapes.length,
      delay,
      ease: "easeInOut",
      repeat: repeat ? Infinity : 0,
      onComplete,
      onUpdate: (latest) => {
        if (pathRef.current) {
          const currentIndex = Math.floor(latest * shapes.length);
          const nextIndex = (currentIndex + 1) % shapes.length;
          const localProgress = (latest * shapes.length) % 1;

          const currentPath = shapes[currentIndex];
          const nextPath = shapes[nextIndex];

          if (currentPath && nextPath) {
            const morphedPath = interpolatePaths(currentPath, nextPath, localProgress);
            pathRef.current.setAttribute('d', morphedPath);
          }
        }
      },
    });

    return () => controls.stop();
  }, [shapes, duration, delay, repeat, onComplete, progress]);

  const interpolatePaths = (pathA: string, pathB: string, progress: number) => {
    const pathACommands = parsePath(pathA);
    const pathBCommands = parsePath(pathB);
    
    // Ensure both paths have the same number of commands
    const maxLength = Math.max(pathACommands.length, pathBCommands.length);
    while (pathACommands.length < maxLength) pathACommands.push({ ...pathACommands[pathACommands.length - 1] });
    while (pathBCommands.length < maxLength) pathBCommands.push({ ...pathBCommands[pathBCommands.length - 1] });

    const interpolatedCommands = pathACommands.map((cmdA, i) => {
      const cmdB = pathBCommands[i];
      return {
        type: cmdA.type,
        values: cmdA.values.map((val, j) => 
          val + (cmdB.values[j] - val) * progress
        ),
      };
    });

    return interpolatedCommands
      .map(cmd => `${cmd.type}${cmd.values.join(',')}`)
      .join(' ');
  };

  const parsePath = (path: string) => {
    const commands: { type: string; values: number[] }[] = [];
    const regex = /([A-Za-z])([^A-Za-z]*)/g;
    let match;

    while ((match = regex.exec(path)) !== null) {
      const [_, type, valueStr] = match;
      const values = valueStr
        .trim()
        .split(/[,\s]+/)
        .map(Number);
      commands.push({ type, values });
    }

    return commands;
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(morphingVariants({ variant, size }), className)}
    >
      <motion.path
        ref={pathRef}
        d={shapes[0]}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
} 