'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useAnimationState } from "@/hooks/use-animation-state";

const tooltipVariants = cva(
  "absolute z-50 px-2 py-1 text-xs rounded-md shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-zinc-900 text-zinc-100 border border-zinc-800",
        dark: "bg-black text-zinc-100 border border-zinc-800",
        light: "bg-white text-zinc-900 border border-zinc-200",
      },
      position: {
        top: "bottom-full mb-2",
        bottom: "top-full mt-2",
        left: "right-full mr-2",
        right: "left-full ml-2",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base px-3 py-2",
      }
    },
    defaultVariants: {
      variant: "default",
      position: "top",
      size: "sm",
    }
  }
);

interface TooltipProps extends VariantProps<typeof tooltipVariants> {
  content: React.ReactNode;
  children: React.ReactNode;
  delayShow?: number;
  delayHide?: number;
  className?: string;
  arrow?: boolean;
}

export function Tooltip({
  content,
  children,
  variant,
  position = "top",
  size,
  delayShow = 200,
  delayHide = 0,
  className,
  arrow = true,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const showTimeout = useRef<NodeJS.Timeout>();
  const hideTimeout = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { shouldAnimate, getTransition } = useAnimationState();

  useEffect(() => {
    return () => {
      if (showTimeout.current) clearTimeout(showTimeout.current);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    showTimeout.current = setTimeout(() => setIsVisible(true), delayShow);
  };

  const handleMouseLeave = () => {
    if (showTimeout.current) clearTimeout(showTimeout.current);
    hideTimeout.current = setTimeout(() => setIsVisible(false), delayHide);
  };

  const arrowStyles = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-zinc-800",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-b-zinc-800",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-l-zinc-800",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-r-zinc-800",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            role="tooltip"
            initial={shouldAnimate ? { opacity: 0, scale: 0.95 } : false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={getTransition('gentle')}
            className={cn(
              tooltipVariants({ variant, position, size }),
              "whitespace-nowrap",
              className
            )}
          >
            {content}
            {arrow && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={getTransition()}
                className={cn(
                  "absolute w-2 h-2 rotate-45 border border-transparent",
                  variant === "light" ? "bg-white" : "bg-zinc-900",
                  arrowStyles[position]
                )}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
