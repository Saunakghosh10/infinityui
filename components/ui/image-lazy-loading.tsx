'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const lazyImageVariants = cva(
  "relative rounded-lg overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-zinc-900/50",
        blur: "backdrop-blur-sm",
        skeleton: "bg-gradient-to-r from-zinc-900 to-zinc-800",
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        full: "w-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    }
  }
);

interface ImageLazyLoadingProps extends VariantProps<typeof lazyImageVariants> {
  src: string;
  alt?: string;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholderSrc?: string;
  blur?: boolean;
  loading?: 'eager' | 'lazy';
}

export function ImageLazyLoading({
  src,
  alt,
  variant,
  size,
  className,
  threshold = 0.1,
  rootMargin = "50px",
  onLoad,
  onError,
  placeholderSrc,
  blur = true,
  loading = 'lazy',
}: ImageLazyLoadingProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imageRef.current || loading === 'eager') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(imageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  return (
    <div className={cn(lazyImageVariants({ variant, size }), className)}>
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {variant === 'skeleton' ? (
              <div className="w-full h-full animate-pulse" />
            ) : (
              <Loader className="h-6 w-6 animate-spin text-zinc-400" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {(isInView || loading === 'eager') && !error && (
        <motion.img
          ref={imageRef}
          src={src}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          className={cn(
            "w-full h-full object-cover",
            blur && !isLoaded && "blur-sm scale-105"
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {error && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt={alt}
          className="w-full h-full object-cover opacity-50"
        />
      )}
    </div>
  );
} 