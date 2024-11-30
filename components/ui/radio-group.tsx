'use client';

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const radioGroupVariants = cva(
  "flex gap-2",
  {
    variants: {
      variant: {
        default: "",
        cards: "flex-col w-full gap-3",
        buttons: "inline-flex p-1 rounded-lg bg-zinc-900/50 border border-zinc-800",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      }
    },
    defaultVariants: {
      variant: "default",
      orientation: "vertical",
    }
  }
);

const radioItemVariants = cva(
  "relative flex items-center",
  {
    variants: {
      variant: {
        default: "gap-3 cursor-pointer",
        cards: "w-full p-4 gap-3 cursor-pointer rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors",
        buttons: "px-3 py-1.5 cursor-pointer rounded-md text-sm font-medium transition-colors",
      },
      state: {
        unchecked: "",
        checked: "",
      }
    },
    compoundVariants: [
      {
        variant: "default",
        state: "checked",
        className: "text-zinc-100",
      },
      {
        variant: "cards",
        state: "checked",
        className: "border-zinc-600 bg-zinc-800/50",
      },
      {
        variant: "buttons",
        state: "checked",
        className: "bg-zinc-800 text-zinc-100",
      },
    ],
    defaultVariants: {
      variant: "default",
      state: "unchecked",
    }
  }
);

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps extends VariantProps<typeof radioGroupVariants> {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  className?: string;
  required?: boolean;
}

export function RadioGroup({
  options,
  value,
  onChange,
  variant,
  orientation,
  name,
  className,
  required = false,
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn(radioGroupVariants({ variant, orientation }), className)}
    >
      {options.map((option) => (
        <motion.label
          key={option.value}
          whileHover={{ scale: variant === 'cards' ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={cn(
            radioItemVariants({
              variant,
              state: value === option.value ? "checked" : "unchecked",
            }),
            option.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            className="sr-only"
            disabled={option.disabled}
            required={required}
          />
          
          {variant === "default" && (
            <div className="relative flex h-5 w-5 items-center justify-center rounded-full border border-zinc-700">
              <AnimatePresence>
                {value === option.value && (
                  <motion.div
                    layoutId={`radio-check-${name}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="h-2.5 w-2.5 rounded-full bg-zinc-400"
                  />
                )}
              </AnimatePresence>
            </div>
          )}
          
          <div>
            <div className={cn(
              "text-sm",
              value === option.value ? "text-zinc-100" : "text-zinc-400"
            )}>
              {option.label}
            </div>
            {option.description && (
              <div className="text-xs text-zinc-500">{option.description}</div>
            )}
          </div>
        </motion.label>
      ))}
    </div>
  );
}
