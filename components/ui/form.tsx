'use client';

import { useState, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const formVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "space-y-4",
        compact: "space-y-2",
        grouped: "grid gap-4",
        wizard: "space-y-6",
      },
      layout: {
        stack: "flex flex-col",
        grid: "grid grid-cols-2 gap-4",
        inline: "flex items-start gap-4",
      }
    },
    defaultVariants: {
      variant: "default",
      layout: "stack"
    }
  }
);

interface FormContextValue {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  validateField: (field: string) => Promise<string | undefined>;
  submitForm: () => Promise<void>;
}

const FormContext = createContext<FormContextValue | undefined>(undefined);

interface FormProps extends VariantProps<typeof formVariants> {
  initialValues: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  validate?: (values: Record<string, any>) => Promise<Record<string, string>>;
  children: React.ReactNode;
  className?: string;
  autoSave?: boolean;
  autoSaveDelay?: number;
  showErrors?: boolean;
  resetOnSubmit?: boolean;
}

export function Form({
  initialValues,
  onSubmit,
  validate,
  children,
  variant,
  layout,
  className,
  autoSave = false,
  autoSaveDelay = 1000,
  showErrors = true,
  resetOnSubmit = false,
}: FormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  // Form validation and submission logic
  const validateField = async (field: string) => {
    if (validate) {
      const validationErrors = await validate(values);
      const error = validationErrors[field];
      setErrors(prev => ({ ...prev, [field]: error }));
      return error;
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      if (validate) {
        const validationErrors = await validate(values);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }
      await onSubmit(values);
      if (resetOnSubmit) {
        setValues(initialValues);
        setTouched({});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-save functionality
  const handleAutoSave = () => {
    if (autoSave) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      autoSaveTimerRef.current = setTimeout(() => {
        submitForm();
      }, autoSaveDelay);
    }
  };

  const contextValue: FormContextValue = {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue: (field, value) => {
      setValues(prev => ({ ...prev, [field]: value }));
      handleAutoSave();
    },
    setFieldError: (field, error) => {
      setErrors(prev => ({ ...prev, [field]: error }));
    },
    setFieldTouched: (field, isTouched) => {
      setTouched(prev => ({ ...prev, [field]: isTouched }));
    },
    validateField,
    submitForm,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}
        className={cn(formVariants({ variant, layout }), className)}
        noValidate
      >
        {children}
        
        {/* Form-level error messages */}
        {showErrors && Object.keys(errors).length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="text-sm text-red-400">
                    {error}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        )}
      </form>
    </FormContext.Provider>
  );
}
