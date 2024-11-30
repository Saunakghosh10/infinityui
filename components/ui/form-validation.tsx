'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const validationVariants = cva(
  "text-sm",
  {
    variants: {
      variant: {
        default: "",
        card: "p-4 rounded-lg border border-zinc-800",
        inline: "flex items-center gap-2",
      },
      state: {
        error: "text-red-400",
        success: "text-green-400",
        warning: "text-yellow-400",
        info: "text-blue-400",
      }
    },
    defaultVariants: {
      variant: "default",
      state: "info"
    }
  }
);

interface ValidationRule {
  id: string;
  message: string;
  validate: (value: any) => boolean | Promise<boolean>;
  level?: 'error' | 'warning' | 'info';
}

interface FormValidationProps extends VariantProps<typeof validationVariants> {
  value: any;
  rules: ValidationRule[];
  className?: string;
  showSuccess?: boolean;
  live?: boolean;
  debounce?: number;
  onValidationChange?: (isValid: boolean) => void;
}

export function FormValidation({
  value,
  rules,
  variant,
  className,
  showSuccess = true,
  live = true,
  debounce = 300,
  onValidationChange,
}: FormValidationProps) {
  const [validationState, setValidationState] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();

  const validateRules = async () => {
    setIsValidating(true);
    const newState: Record<string, boolean> = {};

    for (const rule of rules) {
      try {
        const result = await rule.validate(value);
        newState[rule.id] = result;
      } catch (error) {
        newState[rule.id] = false;
      }
    }

    setValidationState(newState);
    setIsValidating(false);

    const isValid = Object.values(newState).every(Boolean);
    onValidationChange?.(isValid);
  };

  useEffect(() => {
    if (live) {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(validateRules, debounce);
      setDebounceTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [value, live, debounce]);

  const getIcon = (state: boolean, level: ValidationRule['level'] = 'error') => {
    if (isValidating) return <motion.div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />;
    if (state) return <Check className="h-4 w-4 text-green-400" />;
    return level === 'error' ? <X className="h-4 w-4 text-red-400" /> : <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence mode="wait">
        {rules.map((rule) => {
          const state = validationState[rule.id];
          const shouldShow = !showSuccess ? !state : true;

          return shouldShow && (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                validationVariants({
                  variant,
                  state: state ? 'success' : (rule.level || 'error')
                })
              )}
            >
              <div className="flex items-center gap-2">
                {getIcon(state, rule.level)}
                <span>{rule.message}</span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
} 