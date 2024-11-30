'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useAnimationState } from "@/hooks/use-animation-state";

const collapsibleVariants = cva(
  "w-full rounded-lg border transition-colors",
  {
    variants: {
      variant: {
        default: "border-zinc-800 bg-zinc-900/50",
        outline: "border-zinc-800",
        ghost: "border-transparent",
      },
      size: {
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    }
  }
);

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof collapsibleVariants> {
  trigger: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  animated?: boolean;
}

export function Collapsible({
  children,
  trigger,
  defaultOpen = false,
  onOpenChange,
  variant,
  size,
  animated = true,
  className,
  ...props
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const { shouldAnimate, getTransition } = useAnimationState({
    disabled: !animated
  });

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div
      className={cn(collapsibleVariants({ variant, size }), className)}
      {...props}
    >
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          onOpenChange?.(!isOpen);
        }}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        {trigger}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={getTransition()}
        >
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={contentRef}
            initial={shouldAnimate ? { height: 0, opacity: 0 } : false}
            animate={{ 
              height: contentHeight,
              opacity: 1,
            }}
            exit={shouldAnimate ? { 
              height: 0,
              opacity: 0,
            } : false}
            transition={getTransition('gentle')}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
