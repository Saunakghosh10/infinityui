'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnimationState } from "@/hooks/use-animation-state";
import { useKeyPress } from "@/hooks/use-key-press";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  overlay?: boolean;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const sizeVariants = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
  xl: 'w-[448px]',
  full: 'w-screen'
};

const heightVariants = {
  sm: 'h-64',
  md: 'h-80',
  lg: 'h-96',
  xl: 'h-[448px]',
  full: 'h-screen'
};

export function Sheet({
  open = false,
  onOpenChange,
  position = 'right',
  size = 'md',
  overlay = true,
  title,
  description,
  children,
  className
}: SheetProps) {
  const [mounted, setMounted] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { shouldAnimate, getTransition } = useAnimationState();
  
  // Focus trap
  useFocusTrap(sheetRef, open);
  
  // Escape key handler
  useKeyPress('Escape', () => {
    if (open) onOpenChange?.(false);
  });

  useEffect(() => {
    setMounted(true);
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!mounted) return null;

  const slideVariants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' }
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' }
    },
    top: {
      initial: { y: '-100%' },
      animate: { y: 0 },
      exit: { y: '-100%' }
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' }
    }
  };

  const isHorizontal = position === 'left' || position === 'right';
  const sizeClass = isHorizontal ? sizeVariants[size] : heightVariants[size];

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "sheet-title" : undefined}
          aria-describedby={description ? "sheet-description" : undefined}
        >
          {overlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={getTransition('gentle')}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => onOpenChange?.(false)}
            />
          )}
          
          <motion.div
            ref={sheetRef}
            variants={slideVariants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={getTransition('bouncy')}
            className={cn(
              "fixed z-50 bg-zinc-900/90 border-zinc-800 backdrop-blur-lg",
              position === 'left' && "left-0 h-full border-r",
              position === 'right' && "right-0 h-full border-l",
              position === 'top' && "top-0 w-full border-b",
              position === 'bottom' && "bottom-0 w-full border-t",
              sizeClass[size],
              className
            )}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <div>
                  {title && (
                    <h2 className="text-lg font-semibold text-zinc-100">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-zinc-400 mt-1">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onOpenChange?.(false)}
                  className="rounded-md p-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
