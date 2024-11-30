'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useAnimationState } from "@/hooks/use-animation-state";

const skeletonVariants = cva(
  "relative overflow-hidden before:absolute before:inset-0 before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-zinc-100/10 before:to-transparent",
  {
    variants: {
      variant: {
        default: "bg-zinc-800/50",
        card: "bg-zinc-900/50 border border-zinc-800/50 rounded-lg",
        input: "bg-zinc-800/30 rounded-md h-10",
      },
      animation: {
        shimmer: "before:animate-shimmer",
        pulse: "animate-pulse",
        none: "",
      },
      size: {
        sm: "h-4",
        md: "h-6",
        lg: "h-8",
        xl: "h-10",
        '2xl': "h-12",
        avatar: "h-10 w-10 rounded-full",
        thumbnail: "h-16 w-16 rounded-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      animation: "shimmer",
    }
  }
);

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  animate?: boolean;
  loading?: boolean;
  preserveAspectRatio?: boolean;
}

export function Skeleton({
  className,
  variant,
  animation,
  size,
  width,
  height,
  animate = true,
  loading = true,
  preserveAspectRatio = false,
  ...props
}: SkeletonProps) {
  const { shouldAnimate, getTransition } = useAnimationState({
    disabled: !animate || !loading,
  });

  const animationProps = shouldAnimate ? {
    initial: { opacity: 0.5 },
    animate: { opacity: 1 },
    transition: {
      repeat: Infinity,
      repeatType: "reverse" as const,
      duration: 1,
      ease: "easeInOut",
    },
  } : {};

  const style = {
    width,
    height,
    aspectRatio: preserveAspectRatio ? "1" : undefined,
  };

  return (
    <motion.div
      role="progressbar"
      aria-busy={loading}
      aria-valuetext="Loading..."
      className={cn(
        skeletonVariants({ variant, animation, size }),
        className
      )}
      style={style}
      {...animationProps}
      {...props}
    />
  );
}

interface SkeletonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  gap?: number;
  stagger?: boolean;
  loading?: boolean;
}

export function SkeletonGroup({
  count = 3,
  gap = 4,
  stagger = true,
  loading = true,
  className,
  children,
  ...props
}: SkeletonGroupProps) {
  const { shouldAnimate, getTransition } = useAnimationState({
    disabled: !loading,
  });

  return (
    <div 
      role="progressbar"
      aria-busy={loading}
      aria-valuetext={`Loading ${count} items...`}
      className={cn("flex flex-col", className)} 
      style={{ gap: `${gap * 0.25}rem` }}
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={shouldAnimate && stagger ? { opacity: 0, y: 20 } : false}
          animate={shouldAnimate && stagger ? { opacity: 1, y: 0 } : false}
          transition={getTransition('gentle', { delay: i * 0.1 })}
        >
          {children}
        </motion.div>
      ))}
    </div>
  );
}
