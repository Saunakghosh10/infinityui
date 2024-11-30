'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnimationState } from "@/hooks/use-animation-state";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  bordered?: boolean;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  variant = 'circle',
  status,
  bordered = false,
  className,
  onClick,
  loading = false,
  disabled = false,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const { shouldAnimate, getTransition } = useAnimationState({
    disabled: disabled || loading,
  });

  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl"
  };

  const variantClasses = {
    circle: "rounded-full",
    rounded: "rounded-xl",
    square: "rounded-none"
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-zinc-500",
    away: "bg-yellow-500",
    busy: "bg-red-500"
  };

  const handleImageError = () => setImageError(true);

  return (
    <motion.div
      aria-label={alt || "Avatar"}
      role={onClick ? "button" : "img"}
      tabIndex={onClick && !disabled ? 0 : undefined}
      whileHover={shouldAnimate ? { scale: 1.05 } : undefined}
      whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
      transition={getTransition('gentle')}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden bg-zinc-800",
        sizeClasses[size],
        variantClasses[variant],
        bordered && "ring-2 ring-zinc-700",
        loading && "animate-pulse",
        disabled && "opacity-50 cursor-not-allowed",
        onClick && !disabled && "cursor-pointer",
        className
      )}
      onClick={!disabled ? onClick : undefined}
      onKeyDown={(e) => {
        if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <AnimatePresence mode="wait">
        {src && !imageError ? (
          <motion.img
            key="image"
            src={src}
            alt={alt || "Avatar"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={getTransition()}
            className="h-full w-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={getTransition()}
            className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-400"
            aria-hidden="true"
          >
            {fallback || <User className="h-1/2 w-1/2" />}
          </motion.div>
        )}
      </AnimatePresence>

      {status && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={getTransition('bouncy')}
          className={cn(
            "absolute bottom-0 right-0 h-1/4 w-1/4 rounded-full ring-2 ring-zinc-900",
            statusColors[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </motion.div>
  );
}
