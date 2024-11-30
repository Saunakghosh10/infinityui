'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SkipLink() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <AnimatePresence>
      {isFocused && (
        <motion.a
          href="#main-content"
          className={cn(
            "fixed top-4 left-4 z-50 rounded-md bg-zinc-900 px-4 py-2 text-sm text-zinc-100",
            "border border-zinc-800 shadow-lg focus:outline-none"
          )}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          Skip to main content
        </motion.a>
      )}
    </AnimatePresence>
  );
} 