'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAnimationState } from "@/hooks/use-animation-state";

interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
  showValue?: boolean;
  error?: string;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
  showTicks?: boolean;
  tickCount?: number;
  showTooltip?: boolean;
}

export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  onChange,
  disabled = false,
  className,
  showValue = false,
  error,
  label,
  description,
  size = 'md',
  variant = 'default',
  showTicks = false,
  tickCount = 5,
  showTooltip = false,
}: RangeSliderProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltipValue, setShowTooltipValue] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { shouldAnimate, getTransition } = useAnimationState({
    disabled: disabled
  });

  const percentage = ((currentValue - min) / (max - min)) * 100;

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  };

  const thumbSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setCurrentValue(newValue);
    onChange?.(newValue);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging || !sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newValue = Math.round((percentage * (max - min) + min) / step) * step;
    
    setCurrentValue(newValue);
    onChange?.(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', () => setIsDragging(false));
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', () => setIsDragging(false));
    };
  }, [isDragging]);

  const renderTicks = () => {
    return Array.from({ length: tickCount }).map((_, i) => {
      const tickValue = min + ((max - min) / (tickCount - 1)) * i;
      const tickPercentage = ((tickValue - min) / (max - min)) * 100;
      
      return (
        <div
          key={i}
          className="absolute top-full pt-1 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${tickPercentage}%` }}
        >
          <div className="w-px h-1 bg-zinc-600" />
          {showValue && (
            <span className="mt-1 text-xs text-zinc-400">
              {Math.round(tickValue)}
            </span>
          )}
        </div>
      );
    });
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-zinc-200 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative" ref={sliderRef}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleSliderChange}
          disabled={disabled}
          className={cn(
            "absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent",
            disabled && "cursor-not-allowed"
          )}
        />
        
        <div className={cn(
          "relative rounded-full",
          sizeClasses[size],
          variant === 'default' ? 'bg-zinc-800' : 'bg-gradient-to-r from-zinc-800 to-zinc-700'
        )}>
          <motion.div
            className={cn(
              "absolute h-full rounded-full",
              variant === 'default' ? 'bg-zinc-400' : 'bg-gradient-to-r from-zinc-400 to-zinc-300'
            )}
            style={{ width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={getTransition('spring')}
          />
        </div>

        <motion.div
          className={cn(
            "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border border-zinc-600 bg-zinc-900 shadow-lg",
            thumbSizes[size],
            disabled && "cursor-not-allowed"
          )}
          style={{ left: `${percentage}%` }}
          animate={{ 
            left: `${percentage}%`,
            scale: isDragging ? 1.2 : 1
          }}
          transition={getTransition('spring')}
          onMouseDown={() => !disabled && setIsDragging(true)}
          onMouseEnter={() => setShowTooltipValue(true)}
          onMouseLeave={() => setShowTooltipValue(false)}
        >
          {showTooltip && showTooltipValue && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: -30 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs"
            >
              {currentValue}
            </motion.div>
          )}
        </motion.div>

        {showTicks && renderTicks()}
      </div>

      {description && (
        <p className="mt-1.5 text-sm text-zinc-400">
          {description}
        </p>
      )}

      {error && (
        <span className="mt-1.5 text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
} 