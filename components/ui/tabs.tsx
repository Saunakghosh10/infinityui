'use client';

import * as React from 'react';
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Create TabsContext to share state between components
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

const tabsListVariants = cva(
  "inline-flex items-center rounded-lg p-1",
  {
    variants: {
      variant: {
        default: "bg-zinc-900/50 border border-zinc-800",
        pills: "gap-1",
        underline: "w-full border-b border-zinc-800",
      }
    },
    defaultVariants: {
      variant: "default",
    }
  }
);

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100",
        pills: "data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100",
        underline: "rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-400",
      }
    },
    defaultVariants: {
      variant: "default",
    }
  }
);

interface TabsProps extends VariantProps<typeof tabsListVariants> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  variant,
  className,
  children,
}: TabsProps) {
  const [localValue, setLocalValue] = useState(defaultValue || '');
  const controlled = typeof value !== 'undefined';
  const currentValue = controlled ? value : localValue;

  const handleValueChange = (newValue: string) => {
    if (!controlled) {
      setLocalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps extends VariantProps<typeof tabsListVariants> {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({
  variant,
  className,
  children,
}: TabsListProps) {
  return (
    <div className={cn(tabsListVariants({ variant }), className)}>
      {children}
    </div>
  );
}

interface TabsTriggerProps extends VariantProps<typeof tabsTriggerVariants> {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsTrigger({
  value,
  variant,
  className,
  children,
}: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }

  const { value: currentValue, onValueChange } = context;
  const isActive = currentValue === value;

  return (
    <button
      role="tab"
      data-state={isActive ? "active" : "inactive"}
      className={cn(tabsTriggerVariants({ variant }), className)}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsContent({
  value,
  className,
  children,
}: TabsContentProps) {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  const isSelected = context.value === value;

  return isSelected ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  ) : null;
}
