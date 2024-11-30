'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Settings, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const optimizationVariants = cva(
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

interface OptimizationSettings {
  quality: number;
  format: 'jpeg' | 'png' | 'webp' | 'avif';
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  progressive: boolean;
  stripMetadata: boolean;
}

interface ImageOptimizationProps extends VariantProps<typeof optimizationVariants> {
  src: string;
  alt?: string;
  onOptimize?: (optimizedImage: Blob, settings: OptimizationSettings) => void;
  className?: string;
  presets?: boolean;
}

export function ImageOptimization({
  src,
  alt,
  onOptimize,
  variant,
  size,
  className,
  presets = true,
}: ImageOptimizationProps) {
  const [settings, setSettings] = useState<OptimizationSettings>({
    quality: 80,
    format: 'webp',
    maintainAspectRatio: true,
    progressive: true,
    stripMetadata: true,
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);

  useEffect(() => {
    // Get original image size
    fetch(src)
      .then(response => response.blob())
      .then(blob => setOriginalSize(blob.size));
  }, [src]);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      
      // Simulate optimization (in real implementation, use actual image optimization library)
      const optimizedBlob = blob; // Replace with actual optimization
      setOptimizedSize(optimizedBlob.size);
      onOptimize?.(optimizedBlob, settings);
    } catch (error) {
      console.error('Optimization failed:', error);
    }
    setIsOptimizing(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className={cn(optimizationVariants({ variant, size }), className)}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Image Optimization</h3>
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isOptimizing ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Settings className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-zinc-400">Original Size:</span>
            <span className="ml-2 text-zinc-200">{formatBytes(originalSize)}</span>
          </div>
          {optimizedSize > 0 && (
            <div>
              <span className="text-zinc-400">Optimized Size:</span>
              <span className="ml-2 text-zinc-200">{formatBytes(optimizedSize)}</span>
              <span className="ml-2 text-green-500">
                ({Math.round((1 - optimizedSize / originalSize) * 100)}% smaller)
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Quality</label>
            <input
              type="range"
              min={1}
              max={100}
              value={settings.quality}
              onChange={(e) => setSettings({ ...settings, quality: Number(e.target.value) })}
              className="w-full"
            />
            <span className="text-sm text-zinc-500">{settings.quality}%</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Format</label>
            <select
              value={settings.format}
              onChange={(e) => setSettings({ ...settings, format: e.target.value as any })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2"
            >
              <option value="webp">WebP</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="avif">AVIF</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={settings.progressive}
                onChange={(e) => setSettings({ ...settings, progressive: e.target.checked })}
              />
              Progressive
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={settings.stripMetadata}
                onChange={(e) => setSettings({ ...settings, stripMetadata: e.target.checked })}
              />
              Strip Metadata
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 