'use client';

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crop, ZoomIn, ZoomOut, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cropperVariants = cva(
  "relative rounded-lg border overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-zinc-800 bg-zinc-900",
        minimal: "border-transparent bg-transparent",
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

interface ImageCropperProps extends VariantProps<typeof cropperVariants> {
  src: string;
  aspect?: number;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
  onCrop?: (croppedImage: string) => void;
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
}

export function ImageCropper({
  src,
  aspect = 1,
  minZoom = 1,
  maxZoom = 3,
  variant,
  size,
  className,
  onCrop,
  quality = 0.9,
  format = 'png',
}: ImageCropperProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(maxZoom, Math.max(minZoom, prev + delta)));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const cropImage = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current.getBoundingClientRect();
    canvas.width = container.width;
    canvas.height = container.height;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(
      imageRef.current,
      position.x,
      position.y,
      canvas.width,
      canvas.height
    );

    ctx.restore();

    const croppedImage = canvas.toDataURL(`image/${format}`, quality);
    onCrop?.(croppedImage);
  }, [zoom, rotation, position, format, quality, onCrop]);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        ref={containerRef}
        className={cropperVariants({ variant, size })}
        style={{ aspectRatio: aspect }}
      >
        <motion.img
          ref={imageRef}
          src={src}
          alt="Crop preview"
          drag
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="absolute w-full h-full object-cover cursor-move"
          style={{
            scale: zoom,
            rotate: rotation,
            x: position.x,
            y: position.y,
          }}
        />

        {/* Crop Overlay */}
        <div className="absolute inset-0 border-2 border-white/30 pointer-events-none" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleZoom(0.1)}
          className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          onClick={handleRotate}
          className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          title="Rotate"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <button
          onClick={cropImage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Check className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 