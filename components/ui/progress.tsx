'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full transition-all",
  {
    variants: {
      variant: {
        default: "bg-zinc-800",
        secondary: "bg-zinc-700/50",
        success: "bg-emerald-900/50",
        warning: "bg-yellow-900/50",
        danger: "bg-red-900/50",
      },
      size: {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
      },
      animation: {
        default: "",
        pulse: "animate-pulse",
        shimmer: "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      animation: "default",
    }
  }
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all rounded-full",
  {
    variants: {
      variant: {
        default: "bg-zinc-500",
        secondary: "bg-zinc-400",
        success: "bg-emerald-500",
        warning: "bg-yellow-500",
        danger: "bg-red-500",
      },
      gradient: {
        true: "bg-gradient-to-r from-current to-current/50",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      gradient: false,
    }
  }
);

interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
  gradient?: boolean;
  showValue?: boolean;
  animate?: boolean;
  label?: string;
}

export function Progress({
  value,
  max = 100,
  variant,
  size,
  animation,
  gradient,
  showValue,
  animate = true,
  label,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full space-y-2">
      {(label || showValue) && (
        <div className="flex justify-between text-sm text-zinc-400">
          {label && <div>{label}</div>}
          {showValue && <div>{Math.round(percentage)}%</div>}
        </div>
      )}
      <div
        className={cn(progressVariants({ variant, size, animation }), className)}
        {...props}
      >
        <motion.div
          className={cn(
            progressIndicatorVariants({ variant, gradient }),
            "origin-left"
          )}
          initial={animate ? { scaleX: 0 } : false}
          animate={{ scaleX: percentage / 100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
