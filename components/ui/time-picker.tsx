'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const timePickerVariants = cva(
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

interface TimePickerProps extends VariantProps<typeof timePickerVariants> {
  value?: Date;
  onChange?: (date: Date) => void;
  is24Hour?: boolean;
  minuteStep?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function TimePicker({
  value = new Date(),
  onChange,
  is24Hour = false,
  minuteStep = 1,
  disabled = false,
  error,
  variant,
  size,
  className,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(value.getHours());
  const [minutes, setMinutes] = useState(value.getMinutes());
  const [period, setPeriod] = useState(hours >= 12 ? 'PM' : 'AM');
  const containerRef = useRef<HTMLDivElement>(null);

  const displayHours = is24Hour 
    ? hours 
    : hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  const formatTime = (hours: number, minutes: number) => {
    const h = is24Hour 
      ? hours.toString().padStart(2, '0')
      : (hours === 0 ? 12 : hours > 12 ? hours - 12 : hours).toString();
    const m = minutes.toString().padStart(2, '0');
    return `${h}:${m}${!is24Hour ? ` ${period}` : ''}`;
  };

  const updateTime = (newHours: number, newMinutes: number, newPeriod?: string) => {
    let h = newHours;
    if (!is24Hour && newPeriod) {
      h = newPeriod === 'PM' ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
    }
    const newDate = new Date(value);
    newDate.setHours(h);
    newDate.setMinutes(newMinutes);
    onChange?.(newDate);
    setHours(h);
    setMinutes(newMinutes);
    if (newPeriod) setPeriod(newPeriod);
  };

  const incrementHours = () => {
    const newHours = is24Hour
      ? (hours + 1) % 24
      : ((hours % 12) + 1);
    updateTime(newHours, minutes);
  };

  const decrementHours = () => {
    const newHours = is24Hour
      ? (hours - 1 + 24) % 24
      : ((hours - 1 + 12) % 12);
    updateTime(newHours, minutes);
  };

  const incrementMinutes = () => {
    const newMinutes = (minutes + minuteStep) % 60;
    updateTime(hours, newMinutes);
  };

  const decrementMinutes = () => {
    const newMinutes = (minutes - minuteStep + 60) % 60;
    updateTime(hours, newMinutes);
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
          timePickerVariants({ variant, size }),
          "flex items-center px-3 w-full",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <Clock className="h-4 w-4 mr-2 text-zinc-400" />
        <span className="flex-grow text-left">
          {formatTime(hours, minutes)}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute z-50 mt-1 w-64 rounded-lg border border-zinc-800 bg-zinc-900/90 backdrop-blur-sm p-4 shadow-lg"
          >
            <div className="grid grid-cols-3 gap-4">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <button onClick={incrementHours} className="p-1 hover:bg-zinc-800 rounded-md">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <span className="text-lg font-medium my-2">
                  {displayHours.toString().padStart(2, '0')}
                </span>
                <button onClick={decrementHours} className="p-1 hover:bg-zinc-800 rounded-md">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <button onClick={incrementMinutes} className="p-1 hover:bg-zinc-800 rounded-md">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <span className="text-lg font-medium my-2">
                  {minutes.toString().padStart(2, '0')}
                </span>
                <button onClick={decrementMinutes} className="p-1 hover:bg-zinc-800 rounded-md">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* AM/PM */}
              {!is24Hour && (
                <div className="flex flex-col items-center justify-center gap-2">
                  <button
                    onClick={() => updateTime(hours, minutes, 'AM')}
                    className={cn(
                      "px-3 py-1 rounded-md transition-colors",
                      period === 'AM' ? "bg-zinc-700 text-zinc-100" : "hover:bg-zinc-800/50"
                    )}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => updateTime(hours, minutes, 'PM')}
                    className={cn(
                      "px-3 py-1 rounded-md transition-colors",
                      period === 'PM' ? "bg-zinc-700 text-zinc-100" : "hover:bg-zinc-800/50"
                    )}
                  >
                    PM
                  </button>
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