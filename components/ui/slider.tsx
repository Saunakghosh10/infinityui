'use client';

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const sliderVariants = cva(
  "relative w-full rounded-full",
  {
    variants: {
      variant: {
        default: "bg-zinc-800",
        gradient: "bg-gradient-to-r from-zinc-800 to-zinc-700",
        accent: "bg-zinc-700",
      },
      size: {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    }
  }
);

const thumbVariants = cva(
  "absolute rounded-full bg-white shadow-lg cursor-pointer transform -translate-y-1/2 focus:outline-none",
  {
    variants: {
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      }
    },
    defaultVariants: {
      size: "md",
    }
  }
);

interface SliderProps extends VariantProps<typeof sliderVariants> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
  showTooltip?: boolean;
  formatTooltip?: (value: number) => string;
  disabled?: boolean;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 0,
  onChange,
  variant,
  size,
  className,
  showTooltip = false,
  formatTooltip = (value) => `${value}`,
  disabled = false,
}: SliderProps) {
  const [controlled] = useState(typeof value !== 'undefined');
  const [localValue, setLocalValue] = useState(defaultValue);
  const currentValue = controlled ? value! : localValue;
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const percentage = useTransform(x, [0, sliderRef.current?.clientWidth || 0], [0, 100]);

  useEffect(() => {
    if (sliderRef.current) {
      const width = sliderRef.current.clientWidth;
      const initialX = (currentValue / (max - min)) * width;
      x.set(initialX);
    }
  }, [currentValue, max, min, x]);

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    if (!sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    let newX = clientX - rect.left;
    newX = Math.max(0, Math.min(newX, rect.width));

    const percentage = (newX / rect.width) * (max - min);
    const steppedValue = Math.round(percentage / step) * step + min;
    const clampedValue = Math.min(max, Math.max(min, steppedValue));

    if (!controlled) {
      setLocalValue(clampedValue);
    }
    onChange?.(clampedValue);
    x.set(newX);
  };

  return (
    <div 
      ref={sliderRef}
      className={cn(
        "relative py-4",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className={cn(sliderVariants({ variant, size }))}>
        <motion.div
          className="absolute h-full rounded-full bg-zinc-400"
          style={{ width: percentage }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        />
        <motion.div
          drag="x"
          dragMuxX={[0, sliderRef.current?.clientWidth || 0]}
          dragElastic={0}
          dragConstraints={sliderRef.current}
          whileDrag={{ scale: 1.2 }}
          whileHover={{ scale: 1.1 }}
          onDrag={(_, info) => handleDrag(info.point as any)}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={cn(
            thumbVariants({ size }),
            disabled && "cursor-not-allowed"
          )}
          style={{ x }}
        >
          {showTooltip && isDragging && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: -30 }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 bg-zinc-900 text-zinc-100 px-2 py-1 rounded text-xs whitespace-nowrap"
            >
              {formatTooltip(currentValue)}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
