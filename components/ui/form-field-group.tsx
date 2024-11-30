'use client';

import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const fieldGroupVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "space-y-4",
        card: "p-4 rounded-lg border border-zinc-800 space-y-4",
        compact: "space-y-2",
        inline: "flex gap-4",
      },
      state: {
        default: "",
        error: "border-red-500/50",
        success: "border-green-500/50",
        warning: "border-yellow-500/50",
      }
    },
    defaultVariants: {
      variant: "default",
      state: "default"
    }
  }
);

interface FieldGroupContextValue {
  groupName: string;
  touched: boolean;
  error?: string;
  disabled: boolean;
  required: boolean;
  setTouched: (touched: boolean) => void;
  setError: (error?: string) => void;
  validate: () => Promise<boolean>;
}

const FieldGroupContext = createContext<FieldGroupContextValue | null>(null);

interface FormFieldGroupProps extends VariantProps<typeof fieldGroupVariants> {
  name: string;
  label?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  validate?: (values: Record<string, any>) => Promise<string | undefined>;
  disabled?: boolean;
  required?: boolean;
  showError?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function FormFieldGroup({
  name,
  label,
  description,
  children,
  variant,
  state,
  className,
  validate,
  disabled = false,
  required = false,
  showError = true,
  collapsible = false,
  defaultCollapsed = false,
}: FormFieldGroupProps) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string>();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const validateGroup = async () => {
    if (!validate) return true;
    const error = await validate({});
    setError(error);
    return !error;
  };

  const contextValue: FieldGroupContextValue = {
    groupName: name,
    touched,
    error,
    disabled,
    required,
    setTouched,
    setError,
    validate: validateGroup,
  };

  return (
    <FieldGroupContext.Provider value={contextValue}>
      <div
        className={cn(
          fieldGroupVariants({ variant, state: error ? "error" : state }),
          className
        )}
      >
        {label && (
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-zinc-200">
                  {label}
                  {required && <span className="text-red-400">*</span>}
                </h3>
                {collapsible && (
                  <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-zinc-400 hover:text-zinc-300"
                  >
                    {isCollapsed ? "Show" : "Hide"}
                  </button>
                )}
              </div>
              {description && (
                <p className="mt-1 text-xs text-zinc-500">{description}</p>
              )}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {(!collapsible || !isCollapsed) && (
            <motion.div
              initial={collapsible ? { height: 0, opacity: 0 } : false}
              animate={{ height: "auto", opacity: 1 }}
              exit={collapsible ? { height: 0, opacity: 0 } : false}
              transition={{ duration: 0.2 }}
            >
              <div className={variant === "inline" ? "flex gap-4" : "space-y-4"}>
                {children}
              </div>

              {/* Group-level error message */}
              {showError && error && touched && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 text-sm text-red-400"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FieldGroupContext.Provider>
  );
} 