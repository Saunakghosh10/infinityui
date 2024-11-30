'use client';

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'gradient';
}

export function Spinner({ size = 'md', className, variant = 'default' }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        size === 'sm' && "h-4 w-4",
        size === 'md' && "h-6 w-6",
        size === 'lg' && "h-8 w-8",
        variant === 'default' && "text-zinc-400",
        variant === 'gradient' && "bg-gradient-to-r from-zinc-400 via-zinc-300 to-zinc-400 border-none",
        className
      )}
    />
  );
}

interface SpinnerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  spinnerClassName?: string;
}

export function SpinnerButton({ 
  children, 
  loading, 
  disabled, 
  spinnerClassName,
  className,
  ...props 
}: SpinnerButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2",
        "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 disabled:opacity-50",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" className={spinnerClassName} />}
      {children}
    </button>
  );
} 