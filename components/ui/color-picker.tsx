'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const colorPickerVariants = cva(
  "relative w-full rounded-lg border bg-zinc-900/50 text-zinc-100 transition-colors",
  {
    variants: {
      variant: {
        default: "border-zinc-800 hover:border-zinc-700",
        error: "border-red-500/50 hover:border-red-500",
      },
      size: {
        sm: "h-8 text-sm",
        md: "h-10",
        lg: "h-12 text-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    }
  }
);

const defaultColors = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", 
  "#22c55e", "#06b6d4", "#3b82f6", "#6366f1",
  "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e"
];

interface ColorPickerProps extends VariantProps<typeof colorPickerVariants> {
  value?: string;
  onChange?: (color: string) => void;
  colors?: string[];
  showHex?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function ColorPicker({
  value = "#3b82f6",
  onChange,
  colors = defaultColors,
  showHex = true,
  disabled = false,
  error,
  variant,
  size,
  className,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleColorChange = (color: string) => {
    onChange?.(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          colorPickerVariants({ variant, size }),
          "flex items-center gap-2 px-3",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className="flex items-center gap-2 flex-1">
          <div
            className="h-5 w-5 rounded-md border border-zinc-700"
            style={{ backgroundColor: value }}
          />
          {showHex && (
            <span className="text-sm text-zinc-300">{value}</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-2 p-3 rounded-lg border border-zinc-800 bg-zinc-900/90 backdrop-blur-xl z-50"
          >
            <div className="grid grid-cols-6 gap-2 mb-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className="relative group aspect-square rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors"
                  style={{ backgroundColor: color }}
                >
                  {color === value && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1 px-2 h-8 rounded-md border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-100"
                placeholder="#000000"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mt-1.5 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
} 