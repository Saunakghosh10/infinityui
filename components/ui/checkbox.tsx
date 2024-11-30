'use client';

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const checkboxVariants = cva(
  "relative flex items-center justify-center rounded border transition-colors",
  {
    variants: {
      variant: {
        default: "border-zinc-700 bg-zinc-900/50 data-[state=checked]:border-zinc-500 data-[state=checked]:bg-zinc-700",
        success: "border-zinc-700 bg-zinc-900/50 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500/20",
        danger: "border-zinc-700 bg-zinc-900/50 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500/20",
      },
      size: {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    }
  }
);

interface CheckboxProps extends VariantProps<typeof checkboxVariants> {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
}

export function Checkbox({
  checked = false,
  indeterminate = false,
  onCheckedChange,
  disabled = false,
  label,
  description,
  error,
  variant,
  size,
  className,
}: CheckboxProps) {
  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size ?? 'md'];

  return (
    <div className="flex gap-2">
      <motion.button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        disabled={disabled}
        data-state={checked ? 'checked' : 'unchecked'}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          checkboxVariants({ variant, size }),
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500",
          className
        )}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: checked || indeterminate ? 1 : 0,
            scale: checked || indeterminate ? 1 : 0.5,
          }}
          transition={{ duration: 0.2 }}
        >
          {indeterminate ? (
            <Minus className={cn(
              "text-current",
              variant === 'default' ? 'text-zinc-100' : 'text-current',
            )} width={iconSize} height={iconSize} />
          ) : (
            <Check className={cn(
              "text-current",
              variant === 'default' ? 'text-zinc-100' : 'text-current',
            )} width={iconSize} height={iconSize} />
          )}
        </motion.div>
      </motion.button>
      
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label className={cn(
              "text-sm text-zinc-100",
              disabled && "opacity-50",
              error && "text-red-500"
            )}>
              {label}
            </label>
          )}
          {description && (
            <p className={cn(
              "text-xs text-zinc-400",
              disabled && "opacity-50"
            )}>
              {description}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
