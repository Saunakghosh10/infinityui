'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Toggle({ 
  checked, 
  onCheckedChange, 
  disabled = false,
  className,
  size = 'md'
}: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "group relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-zinc-700" : "bg-zinc-800",
        size === 'sm' && "h-4 w-7",
        size === 'md' && "h-5 w-9",
        size === 'lg' && "h-6 w-11",
        className
      )}
    >
      <motion.span
        className={cn(
          "pointer-events-none inline-block rounded-full bg-white",
          "group-hover:scale-110 transition-transform",
          size === 'sm' && "h-3 w-3 translate-x-0.5",
          size === 'md' && "h-4 w-4 translate-x-0.5",
          size === 'lg' && "h-5 w-5 translate-x-0.5",
        )}
        animate={{
          translateX: checked ? "calc(100% + 2px)" : "2px"
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      />
    </button>
  );
}
