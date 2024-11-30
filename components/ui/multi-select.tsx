'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  disabled = false,
  className,
  error
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[selectedIndex]) {
          handleSelect(filteredOptions[selectedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      searchInputRef.current?.focus();
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredOptions]);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        className={cn(
          "flex min-h-[42px] w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-sm",
          "hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500/50"
        )}
      >
        <div className="flex flex-wrap gap-1">
          {value.length > 0 ? (
            value.map(v => {
              const option = options.find(o => o.value === v);
              return (
                <span
                  key={v}
                  className="flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
                >
                  {option?.label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(v);
                    }}
                    className="text-zinc-400 hover:text-zinc-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-zinc-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-zinc-400 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute z-50 mt-1 w-full rounded-md border border-zinc-800 bg-zinc-900/90 p-2 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
              />
            </div>

            <div className="mt-2 max-h-60 space-y-1 overflow-y-auto">
              {filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm",
                    index === selectedIndex && "bg-zinc-800/50 text-zinc-100",
                    !option.disabled && "hover:bg-zinc-800/50 hover:text-zinc-100",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="text-zinc-300">{option.label}</span>
                  {value.includes(option.value) && (
                    <Check className="h-4 w-4 text-zinc-400" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <span className="mt-1 text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
} 