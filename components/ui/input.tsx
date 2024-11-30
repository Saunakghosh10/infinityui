'use client';

import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, helperText, type = "text", ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
              "placeholder:text-zinc-500",
              "focus-visible:outline-none focus-visible:ring-1",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-red-500/50 focus-visible:ring-red-500"
                : "border-zinc-800 focus-visible:ring-zinc-400",
              className
            )}
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500"
              >
                <AlertCircle className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {(error || helperText) && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "block text-xs mt-1",
                error ? "text-red-500" : "text-zinc-500"
              )}
            >
              {error || helperText}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";
