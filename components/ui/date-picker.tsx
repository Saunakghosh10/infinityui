'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const datePickerVariants = cva(
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

interface DatePickerProps extends VariantProps<typeof datePickerVariants> {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  formatDate?: (date: Date) => string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  error,
  variant,
  size,
  className,
  minDate,
  maxDate,
  formatDate = (date) => date.toLocaleDateString(),
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onChange?.(selectedDate);
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          datePickerVariants({ variant, size }),
          "flex items-center px-3 w-full",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <Calendar className="h-4 w-4 mr-2 text-zinc-400" />
        <span className={cn(
          "flex-grow text-left",
          !value && "text-zinc-500"
        )}>
          {value ? formatDate(value) : placeholder}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute z-50 mt-1 w-64 rounded-lg border border-zinc-800 bg-zinc-900/90 p-3 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                className="p-1 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-medium">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                className="p-1 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-zinc-400">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                );
                const isSelected = value?.toDateString() === date.toDateString();
                const isDisabled = isDateDisabled(date);

                return (
                  <button
                    key={day}
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                    className={cn(
                      "h-8 w-8 rounded-md text-sm transition-colors",
                      isSelected && "bg-zinc-700 text-zinc-100",
                      !isSelected && !isDisabled && "hover:bg-zinc-800/50",
                      isDisabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {day}
                  </button>
                );
              })}
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