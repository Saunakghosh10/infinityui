'use client';

import { useContext, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { FormContext } from "./form";

const formFieldVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "space-y-1.5",
        floating: "relative",
        inline: "flex items-center gap-3",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
      state: {
        default: "",
        error: "text-red-500",
        success: "text-green-500",
        warning: "text-yellow-500",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
    }
  }
);

interface FormFieldProps extends VariantProps<typeof formFieldVariants> {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  showError?: boolean;
  validate?: (value: any) => Promise<string | undefined> | string | undefined;
}

export function FormField({
  name,
  label,
  description,
  required = false,
  variant,
  size,
  state,
  className,
  children,
  showError = true,
  validate,
}: FormFieldProps) {
  const id = useId();
  const form = useContext(FormContext);

  if (!form) {
    throw new Error("FormField must be used within a Form component");
  }

  const { values, errors, touched, setFieldValue, setFieldError, setFieldTouched } = form;
  const error = errors[name];
  const isTouched = touched[name];
  const value = values[name];

  const handleChange = async (newValue: any) => {
    setFieldValue(name, newValue);
    setFieldTouched(name, true);

    // Field-level validation
    if (validate) {
      const validationError = await validate(newValue);
      if (validationError) {
        setFieldError(name, validationError);
      }
    }
  };

  return (
    <div className={cn(
      formFieldVariants({ variant, size, state: error ? "error" : state }),
      className
    )}>
      <div className="flex items-center justify-between">
        <label 
          htmlFor={id}
          className={cn(
            "text-sm font-medium",
            error ? "text-red-500" : "text-zinc-200"
          )}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>

        {description && (
          <span className="text-xs text-zinc-500">{description}</span>
        )}
      </div>

      {/* Cloned child with additional props */}
      {React.cloneElement(children as React.ReactElement, {
        id,
        name,
        value,
        onChange: handleChange,
        "aria-invalid": !!error,
        "aria-describedby": error ? `${id}-error` : undefined,
        required,
      })}

      {/* Error message */}
      {showError && (
        <AnimatePresence mode="wait">
          {error && isTouched && (
            <motion.div
              id={`${id}-error`}
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-500 mt-1"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
} 