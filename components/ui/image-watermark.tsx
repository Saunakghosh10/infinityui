'use client';

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Move, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const watermarkVariants = cva(
  "absolute rounded-lg select-none",
  {
    variants: {
      variant: {
        default: "text-white/50",
        light: "text-black/30",
        dark: "text-white/70",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    }
  }
);

interface WatermarkProps extends VariantProps<typeof watermarkVariants> {
  src: string;
  text?: string;
  logo?: string;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity?: number;
  rotation?: number;
  repeat?: boolean;
  className?: string;
  draggable?: boolean;
  onPositionChange?: (x: number, y: number) => void;
}

export function ImageWatermark({
  src,
  text,
  logo,
  variant,
  size,
  position = 'bottom-right',
  opacity = 0.5,
  rotation = 0,
  repeat = false,
  className,
  draggable = false,
  onPositionChange,
}: WatermarkProps) {
  const [customPosition, setCustomPosition] = useState<{ x: number; y: number }>();
  const containerRef = useRef<HTMLDivElement>(null);

  const positionStyles = {
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const handleDragEnd = (event: any, info: any) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (info.point.x - rect.left) / rect.width;
      const y = (info.point.y - rect.top) / rect.height;
      setCustomPosition({ x: x * 100, y: y * 100 });
      onPositionChange?.(x, y);
    }
  };

  const renderWatermark = (index?: number) => (
    <motion.div
      key={index}
      drag={draggable}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      className={cn(
        watermarkVariants({ variant, size }),
        !customPosition && positionStyles[position],
        "flex items-center gap-2 p-2",
        className
      )}
      style={{
        opacity,
        rotate: `${rotation}deg`,
        left: customPosition ? `${customPosition.x}%` : undefined,
        top: customPosition ? `${customPosition.y}%` : undefined,
        transform: customPosition ? 'translate(-50%, -50%)' : undefined,
      }}
    >
      {logo && <img src={logo} alt="Watermark logo" className="h-4 w-4" />}
      {text && <span>{text}</span>}
      {draggable && <Move className="h-4 w-4 opacity-50" />}
    </motion.div>
  );

  return (
    <div ref={containerRef} className="relative">
      <img src={src} alt="Watermarked image" className="w-full h-auto" />
      
      {repeat ? (
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, i) => renderWatermark(i))}
        </div>
      ) : (
        renderWatermark()
      )}
    </div>
  );
} 