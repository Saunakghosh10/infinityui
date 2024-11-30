'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-zinc-800 to-zinc-900 text-zinc-100 hover:from-zinc-700 hover:to-zinc-800 border border-zinc-800 shadow-lg shadow-zinc-900/20",
        destructive: "bg-gradient-to-r from-red-900 to-red-800 text-red-100 hover:from-red-800 hover:to-red-700 border border-red-800/50 shadow-lg shadow-red-900/20",
        outline: "border border-zinc-800 hover:bg-zinc-800/50 hover:text-zinc-100 backdrop-blur-sm",
        secondary: "bg-zinc-800/50 text-zinc-100 hover:bg-zinc-800 border border-zinc-700/50 backdrop-blur-sm",
        ghost: "hover:bg-zinc-800/50 hover:text-zinc-100",
        link: "text-zinc-100 underline-offset-4 hover:underline",
        glow: "bg-gradient-to-r from-zinc-800 to-zinc-900 text-zinc-100 hover:from-zinc-700 hover:to-zinc-800 border border-zinc-700/50 shadow-lg shadow-zinc-900/20 hover:shadow-zinc-800/50 hover:border-zinc-600/50",
        gradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border border-white/10 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg shadow-purple-900/20",
        white: "bg-white text-black hover:bg-gray-50 border-0 shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        bounce: "hover:animate-bounce",
        pulse: "hover:animate-pulse",
        wiggle: "hover:animate-wiggle",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glowColor?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, isLoading, leftIcon, rightIcon, glowColor, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, animation, className }),
          glowColor && `hover:shadow-${glowColor}`
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
