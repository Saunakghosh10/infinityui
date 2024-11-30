'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnimationState } from "@/hooks/use-animation-state";

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  readonly?: boolean;
  className?: string;
  error?: string;
  icon?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  label?: string;
  description?: string;
}

export function Rating({
  value = 0,
  onChange,
  max = 5,
  allowHalf = false,
  size = 'md',
  disabled = false,
  readonly = false,
  className,
  error,
  icon = <Star className="fill-current" />,
  emptyIcon = <Star />,
  label,
  description
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const { shouldAnimate, getTransition } = useAnimationState({
    disabled: disabled || readonly
  });

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (disabled || readonly) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const halfPoint = rect.width / 2;
    
    if (allowHalf) {
      setHoverValue(x < halfPoint ? index + 0.5 : index + 1);
    } else {
      setHoverValue(index + 1);
    }
  };

  const handleClick = (rating: number) => {
    if (disabled || readonly) return;
    onChange?.(rating);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (disabled || readonly) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(index + 1);
    }
  };

  const renderStar = (index: number) => {
    const isActive = (hoverValue ?? value) >= index + 1;
    const isHalfActive = allowHalf && (hoverValue ?? value) === index + 0.5;
    const currentValue = hoverValue ?? value;

    return (
      <motion.div
        key={index}
        role="radio"
        tabIndex={disabled || readonly ? -1 : 0}
        aria-checked={isActive || isHalfActive}
        aria-label={`Rate ${index + 1} out of ${max}`}
        className={cn(
          "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400 rounded-full",
          disabled && "cursor-not-allowed opacity-50",
          readonly && "cursor-default"
        )}
        onMouseMove={(e) => handleMouseMove(e, index)}
        onClick={() => handleClick(index + 1)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        whileHover={shouldAnimate ? { scale: 1.1 } : undefined}
        whileTap={shouldAnimate ? { scale: 0.9 } : undefined}
      >
        <motion.span 
          className={cn(
            "text-zinc-600 transition-colors",
            sizeClasses[size]
          )}
          animate={{
            rotate: isHovering && currentValue === index + 1 ? [0, -45, 45, 0] : 0
          }}
          transition={getTransition('bouncy')}
        >
          {emptyIcon}
        </motion.span>

        <AnimatePresence>
          {(isActive || isHalfActive) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={getTransition()}
              className={cn(
                "absolute inset-0 text-yellow-500",
                sizeClasses[size],
                isHalfActive && "clip-half"
              )}
            >
              {isHalfActive ? <StarHalf className="fill-current" /> : icon}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-zinc-200 mb-1.5">
          {label}
        </label>
      )}
      <div
        role="radiogroup"
        aria-label={label || "Rating"}
        aria-describedby={description ? "rating-description" : undefined}
        className="flex gap-1"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setHoverValue(null);
        }}
      >
        {Array.from({ length: max }, (_, i) => renderStar(i))}
      </div>
      {description && (
        <p id="rating-description" className="mt-1.5 text-sm text-zinc-400">
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