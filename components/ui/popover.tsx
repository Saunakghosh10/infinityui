'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const popoverVariants = cva(
  "absolute z-50 rounded-lg border shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-zinc-900/90 border-zinc-800 text-zinc-100",
        light: "bg-white/90 border-zinc-200 text-zinc-900",
        dark: "bg-black/90 border-zinc-800 text-zinc-100",
      },
      size: {
        sm: "w-48 p-2",
        md: "w-64 p-3",
        lg: "w-80 p-4",
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

interface PopoverProps extends VariantProps<typeof popoverVariants> {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  arrow?: boolean;
  backdrop?: boolean;
  closeOnClickOutside?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  trigger,
  content,
  variant,
  size,
  position = "bottom",
  className,
  arrow = true,
  backdrop = false,
  closeOnClickOutside = true,
  onOpenChange,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (closeOnClickOutside) {
      const handleClickOutside = (event: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          onOpenChange?.(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [closeOnClickOutside, onOpenChange]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  const arrowStyles = {
    top: "bottom-[-6px] left-1/2 -translate-x-1/2 border-t-zinc-800",
    bottom: "top-[-6px] left-1/2 -translate-x-1/2 border-b-zinc-800",
    left: "right-[-6px] top-1/2 -translate-y-1/2 border-l-zinc-800",
    right: "left-[-6px] top-1/2 -translate-y-1/2 border-r-zinc-800",
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={handleToggle}>{trigger}</div>
      
      <AnimatePresence>
        {isOpen && (
          <>
            {backdrop && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => {
                  setIsOpen(false);
                  onOpenChange?.(false);
                }}
              />
            )}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? -10 : 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? -10 : 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={cn(
                popoverVariants({ variant, size, position }),
                "backdrop-blur-sm",
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
