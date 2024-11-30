'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, Wand2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const filterVariants = cva(
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

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
  grayscale: number;
  invert: number;
}

interface ImageFiltersProps extends VariantProps<typeof filterVariants> {
  src: string;
  onFilterChange?: (settings: FilterSettings, filteredImage?: string) => void;
  className?: string;
  presets?: boolean;
  showPreview?: boolean;
  quality?: number;
}

const defaultSettings: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  sepia: 0,
  grayscale: 0,
  invert: 0,
};

const presetFilters = {
  none: defaultSettings,
  vintage: {
    ...defaultSettings,
    sepia: 50,
    contrast: 120,
    brightness: 90,
  },
  blackAndWhite: {
    ...defaultSettings,
    grayscale: 100,
    contrast: 120,
  },
  warm: {
    ...defaultSettings,
    hue: 30,
    saturation: 120,
    brightness: 105,
  },
  cool: {
    ...defaultSettings,
    hue: -30,
    saturation: 90,
    brightness: 95,
  },
};

export function ImageFilters({
  src,
  onFilterChange,
  variant,
  size,
  className,
  presets = true,
  showPreview = true,
  quality = 0.9,
}: ImageFiltersProps) {
  const [settings, setSettings] = useState<FilterSettings>(defaultSettings);
  const [activePreset, setActivePreset] = useState<string>("none");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applyFilters = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `
        brightness(${settings.brightness}%)
        contrast(${settings.contrast}%)
        saturate(${settings.saturation}%)
        hue-rotate(${settings.hue}deg)
        blur(${settings.blur}px)
        sepia(${settings.sepia}%)
        grayscale(${settings.grayscale}%)
        invert(${settings.invert}%)
      `;

      ctx.drawImage(img, 0, 0);
      const filteredImage = canvas.toDataURL('image/jpeg', quality);
      onFilterChange?.(settings, filteredImage);
    };
  };

  useEffect(() => {
    applyFilters();
  }, [settings]);

  const handleSettingChange = (key: keyof FilterSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setActivePreset("custom");
  };

  const applyPreset = (presetName: string) => {
    const preset = presetFilters[presetName as keyof typeof presetFilters];
    setSettings(preset);
    setActivePreset(presetName);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <canvas ref={canvasRef} className="hidden" />

      {showPreview && (
        <div className={filterVariants({ variant, size })}>
          <img
            src={src}
            alt="Filter preview"
            className="w-full h-auto"
            style={{
              filter: `
                brightness(${settings.brightness}%)
                contrast(${settings.contrast}%)
                saturate(${settings.saturation}%)
                hue-rotate(${settings.hue}deg)
                blur(${settings.blur}px)
                sepia(${settings.sepia}%)
                grayscale(${settings.grayscale}%)
                invert(${settings.invert}%)
              `
            }}
          />
        </div>
      )}

      {presets && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.keys(presetFilters).map((preset) => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                activePreset === preset
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100"
              )}
            >
              {preset.charAt(0).toUpperCase() + preset.slice(1)}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <span className="text-zinc-500">{value}</span>
            </div>
            <input
              type="range"
              min={key === 'hue' ? -180 : 0}
              max={key === 'hue' ? 180 : key === 'blur' ? 20 : 200}
              value={value}
              onChange={(e) => handleSettingChange(key as keyof FilterSettings, Number(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 