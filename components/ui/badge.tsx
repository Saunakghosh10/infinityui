'use client';

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useAnimationState } from "@/hooks/use-animation-state";

const badgeVariants = cva(
  "inline-flex items-center rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-zinc-900/90 text-zinc-100 border border-zinc-800",
        secondary: "bg-zinc-800/50 text-zinc-300 border border-zinc-700",
        success: "bg-emerald-900/50 text-emerald-200 border border-emerald-800/50",
        warning: "bg-yellow-900/50 text-yellow-200 border border-yellow-800/50",
        danger: "bg-red-900/50 text-red-200 border border-red-800/50",
        info: "bg-blue-900/50 text-blue-200 border border-blue-800/50",
        gradient: "bg-gradient-to-r from-zinc-900 to-zinc-800 text-zinc-100 border border-zinc-700",
        interactive: "cursor-pointer hover:bg-zinc-800/50 active:bg-zinc-700/50",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-0.5",
        lg: "text-base px-3 py-1",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        glow: "animate-glow",
        shimmer: "animate-shimmer",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      animation: "none",
    }
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  interactive?: boolean;
  loading?: boolean;
}

export function Badge({
  className,
  variant,
  size,
  animation,
  icon,
  removable,
  onRemove,
  interactive,
  loading,
  children,
  ...props
}: BadgeProps) {
  const { shouldAnimate, getTransition } = useAnimationState({
    disabled: !interactive || loading,
  });

  return (
    <motion.div
      role={interactive ? "button" : "status"}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        badgeVariants({ variant, size, animation }),
        interactive && "cursor-pointer",
        loading && "animate-pulse",
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      whileHover={shouldAnimate ? { 
        scale: 1.05,
        transition: getTransition('gentle')
      } : undefined}
      whileTap={shouldAnimate ? { 
        scale: 0.95,
        transition: getTransition('bouncy')
      } : undefined}
      {...props}
    >
      <AnimatePresence mode="wait">
        {icon && (
          <motion.span
            key="icon"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={getTransition()}
            className="mr-1 -ml-0.5 h-3.5 w-3.5"
          >
            {icon}
          </motion.span>
        )}
        <motion.span
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={getTransition()}
        >
          {children}
        </motion.span>
        {removable && (
          <motion.button
            key="remove"
            type="button"
            className="ml-1 -mr-0.5 h-3.5 w-3.5 rounded-full hover:bg-zinc-800/50"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Remove badge"
          >
            <motion.svg
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 90 }}
            >
              <path d="M4 12L12 4M4 4l8 8" />
            </motion.svg>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
