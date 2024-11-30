'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const hoverCardVariants = cva(
  "absolute z-50 rounded-lg border shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-zinc-900/90 border-zinc-800 text-zinc-100",
        light: "bg-white/90 border-zinc-200 text-zinc-900",
        dark: "bg-black/90 border-zinc-800 text-zinc-100",
      },
      size: {
        sm: "w-48",
        md: "w-64",
        lg: "w-80",
      },
      position: {
        top: "bottom-full mb-2",
        bottom: "top-full mt-2",
        left: "right-full mr-2",
        right: "left-full ml-2",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      position: "bottom",
    }
  }
);

interface HoverCardProps extends VariantProps<typeof hoverCardVariants> {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  openDelay?: number;
  closeDelay?: number;
  arrow?: boolean;
}

export function HoverCard({
  trigger,
  content,
  variant,
  size,
  position = "bottom",
  className,
  openDelay = 200,
  closeDelay = 0,
  arrow = true,
}: HoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openTimeout = useRef<NodeJS.Timeout>();
  const closeTimeout = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    openTimeout.current = setTimeout(() => setIsOpen(true), openDelay);
  };

  const handleMouseLeave = () => {
    if (openTimeout.current) clearTimeout(openTimeout.current);
    closeTimeout.current = setTimeout(() => setIsOpen(false), closeDelay);
  };

  const arrowStyles = {
    top: "bottom-[-6px] left-1/2 -translate-x-1/2 border-t-zinc-800",
    bottom: "top-[-6px] left-1/2 -translate-x-1/2 border-b-zinc-800",
    left: "right-[-6px] top-1/2 -translate-y-1/2 border-l-zinc-800",
    right: "left-[-6px] top-1/2 -translate-y-1/2 border-r-zinc-800",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? -10 : 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              hoverCardVariants({ variant, size, position }),
              "backdrop-blur-sm p-4",
              className
            )}
          >
            {content}
            {arrow && (
              <div
                className={cn(
                  "absolute w-3 h-3 rotate-45 border",
                  variant === "light" ? "bg-white border-zinc-200" : "bg-zinc-900 border-zinc-800",
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
