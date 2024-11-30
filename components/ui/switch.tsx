'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAnimationState } from "@/hooks/use-animation-state";
import { springPresets } from "@/lib/animation-config";
import { cva, type VariantProps } from "class-variance-authority";

const switchVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors",
  {
    variants: {
      variant: {
        default: "bg-zinc-800 data-[state=checked]:bg-zinc-600",
        success: "bg-zinc-800 data-[state=checked]:bg-emerald-600",
        danger: "bg-zinc-800 data-[state=checked]:bg-red-600",
        warning: "bg-zinc-800 data-[state=checked]:bg-yellow-600",
        info: "bg-zinc-800 data-[state=checked]:bg-blue-600",
      },
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false,
    }
  }
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-zinc-100 shadow-lg ring-0 transition-transform",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      }
    },
    defaultVariants: {
      size: "md",
    }
  }
);

interface SwitchProps extends React.HTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof switchVariants> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  thumbClassName?: string;
}

export function Switch({
  className,
  variant,
  size,
  disabled,
  checked = false,
  onCheckedChange,
  thumbClassName,
  ...props
}: SwitchProps) {
  const { shouldAnimate, getTransition } = useAnimationState({
    defaultPreset: 'bouncy',
    disabled,
  });

  const getOffset = () => {
    switch(size) {
      case 'sm': return checked ? '16px' : '2px';
      case 'lg': return checked ? '32px' : '4px';
      default: return checked ? '24px' : '3px';
    }
  };

  return (
    <motion.button
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className={cn(switchVariants({ variant, size, disabled }), className)}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      disabled={disabled}
      whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
      whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
      {...props}
    >
      <motion.span
        className={cn(thumbVariants({ size }), thumbClassName)}
        animate={{ 
          x: getOffset(),
          scale: checked ? 1.1 : 1,
        }}
        transition={getTransition()}
        initial={false}
      />
    </motion.button>
  );
}
