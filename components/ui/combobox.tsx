'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Command } from "./command";
import { useAnimationState } from "@/hooks/use-animation-state";

interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  label?: string;
  description?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  disabled = false,
  className,
  error,
  label,
  description,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const { shouldAnimate, getTransition } = useAnimationState({
    disabled: disabled
  });

  const handleSelect = (currentValue: string) => {
    setSelected(currentValue);
    setOpen(false);
    onChange?.(currentValue);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={comboboxRef} className={className}>
      {label && (
        <label className="block text-sm font-medium text-zinc-200 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls="combobox-options"
          className={cn(
            "w-full justify-between",
            error && "border-red-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && setOpen(!open)}
        >
          {selected
            ? options.find((option) => option.value === selected)?.label
            : placeholder}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={getTransition()}
          >
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </motion.div>
        </Button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={getTransition()}
              className="absolute z-10 mt-1 w-full"
            >
              <Command className="border border-zinc-800 rounded-lg shadow-lg">
                <div className="max-h-60 overflow-auto">
                  {options.map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={shouldAnimate ? { backgroundColor: "rgba(255,255,255,0.1)" } : undefined}
                      className={cn(
                        "flex items-center px-4 py-2 cursor-pointer",
                        selected === option.value && "bg-zinc-800/50"
                      )}
                      onClick={() => handleSelect(option.value)}
                    >
                      <span className="flex-grow">{option.label}</span>
                      {selected === option.value && (
                        <Check className="h-4 w-4 text-zinc-400" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </Command>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {description && (
        <p className="mt-1.5 text-sm text-zinc-400">
          {description}
        </p>
      )}

      {error && (
        <span role="alert" className="mt-1.5 text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
} 