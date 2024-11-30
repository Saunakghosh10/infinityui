'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-lg transition-all duration-300", 
  {
    variants: {
      variant: {
        default: "bg-zinc-900/90 border border-zinc-800",
        ghost: "hover:bg-zinc-900/50",
        outline: "border border-zinc-800 hover:border-zinc-700",
        glass: "backdrop-blur-lg bg-zinc-900/50 border border-zinc-800/50",
        gradient: "bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800/50",
      },
      hover: {
        default: "hover:border-zinc-700/50",
        lift: "hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/20",
        glow: "hover:shadow-lg hover:shadow-zinc-900/50 hover:border-zinc-700/50",
        none: "",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      }
    },
    defaultVariants: {
      variant: "default",
      hover: "default",
      size: "md",
    }
  }
);

interface CardProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {
  as?: "div" | "article" | "section";
  animate?: boolean;
}

export function Card({
  className,
  variant,
  hover,
  size,
  as: Component = "div",
  animate = false,
  children,
  ...props
}: CardProps) {
  const Wrapper = animate ? motion.div : Component;
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  } : {};

  return (
    <Wrapper
      className={cn(cardVariants({ variant, hover, size }), className)}
      {...animationProps}
      {...props}
    >
      {children}
    </Wrapper>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div className={cn("mb-4", className)} {...props} />
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function CardTitle({
  className,
  as: Component = "h3",
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={cn(
        "text-lg font-semibold text-zinc-100",
        className
      )}
      {...props}
    />
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "text-sm text-zinc-400",
        className
      )}
      {...props}
    />
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div className={cn("", className)} {...props} />
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center",
        className
      )}
      {...props}
    />
  );
}
