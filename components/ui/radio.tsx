'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RadioProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Radio({ 
  checked, 
  onCheckedChange, 
  disabled = false,
  label,
  className 
}: RadioProps) {
  return (
    <label className="flex items-center gap-2">
      <motion.button
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative h-4 w-4 rounded-full border transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "border-zinc-400" : "border-zinc-700",
          className
        )}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          initial={false}
          animate={checked ? { 
            opacity: 1, 
            scale: 1,
            backgroundColor: "rgb(161, 161, 170)" 
          } : { 
            opacity: 0, 
            scale: 0.8,
            backgroundColor: "rgb(161, 161, 170)" 
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-1 rounded-full"
        />
      </motion.button>
      {label && (
        <span className={cn(
          "text-sm text-zinc-400",
          disabled && "opacity-50"
        )}>
          {label}
        </span>
      )}
    </label>
  );
} 