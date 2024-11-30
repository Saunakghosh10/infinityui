'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const selectVariants = cva(
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

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends VariantProps<typeof selectVariants> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  clearable = false,
  disabled = false,
  error,
  variant,
  size,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          selectVariants({ variant, size }),
          "flex items-center justify-between px-3 w-full",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <span className={cn(
          "truncate",
          !selectedOption && "text-zinc-500"
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 shrink-0 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 rounded-lg border border-zinc-800 bg-zinc-900/90 backdrop-blur-sm shadow-lg"
          >
            {searchable && (
              <div className="p-2 border-b border-zinc-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-9 pr-3 rounded-md bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                    placeholder="Search..."
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-60 overflow-auto py-1">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange?.(option.value);
                      setIsOpen(false);
                      setSearchQuery("");
                    }
                  }}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm transition-colors",
                    option.value === value ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="flex-grow text-left">{option.label}</span>
                  {option.value === value && (
                    <Check className="h-4 w-4 shrink-0" />
                  )}
                </button>
              ))}
              
              {filteredOptions.length === 0 && (
                <div className="px-3 py-2 text-sm text-zinc-500">
                  No options found
                </div>
              )}
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
