'use client';

import { useState, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const wizardVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "space-y-6",
        compact: "space-y-4",
        cards: "space-y-8",
      },
      progressStyle: {
        dots: "flex gap-2 justify-center",
        numbers: "flex gap-4 justify-center",
        progress: "relative",
        stepper: "flex justify-between",
      }
    },
    defaultVariants: {
      variant: "default",
      progressStyle: "stepper"
    }
  }
);

interface Step {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  validate?: () => Promise<boolean> | boolean;
}

interface FormWizardProps extends VariantProps<typeof wizardVariants> {
  steps: Step[];
  onComplete: () => void;
  className?: string;
  showStepIndicator?: boolean;
  allowSkipBack?: boolean;
  showSummary?: boolean;
  onStepChange?: (currentStep: number) => void;
}

const WizardContext = createContext<{
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  validateCurrentStep: () => Promise<boolean>;
} | null>(null);

export function FormWizard({
  steps,
  onComplete,
  variant,
  progressStyle,
  className,
  showStepIndicator = true,
  allowSkipBack = true,
  showSummary = true,
  onStepChange,
}: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isValidating, setIsValidating] = useState(false);
  const formRefs = useRef<(HTMLFormElement | null)[]>([]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const validateCurrentStep = async () => {
    const step = steps[currentStep];
    if (step.validate) {
      setIsValidating(true);
      try {
        return await step.validate();
      } finally {
        setIsValidating(false);
      }
    }
    return true;
  };

  const nextStep = async () => {
    if (await validateCurrentStep()) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (isLastStep) {
        onComplete();
      } else {
        setCurrentStep(prev => prev + 1);
        onStepChange?.(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
      onStepChange?.(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (allowSkipBack && step < currentStep) {
      setCurrentStep(step);
      onStepChange?.(step);
    }
  };

  const contextValue = {
    currentStep,
    totalSteps: steps.length,
    goToStep,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    validateCurrentStep,
  };

  return (
    <WizardContext.Provider value={contextValue}>
      <div className={cn(wizardVariants({ variant, progressStyle }), className)}>
        {/* Progress Indicator */}
        {showStepIndicator && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center",
                    index !== steps.length - 1 && "flex-1"
                  )}
                >
                  <button
                    onClick={() => goToStep(index)}
                    disabled={!allowSkipBack || index > currentStep}
                    className={cn(
                      "relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                      index === currentStep
                        ? "border-blue-500 bg-blue-500 text-white"
                        : completedSteps.has(index)
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-zinc-700 bg-zinc-800 text-zinc-400"
                    )}
                  >
                    {completedSteps.has(index) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </button>
                  {index !== steps.length - 1 && (
                    <div
                      className={cn(
                        "h-[2px] flex-1 mx-2",
                        index < currentStep
                          ? "bg-green-500"
                          : "bg-zinc-700"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <div
                  key={`title-${step.id}`}
                  className={cn(
                    "text-sm font-medium",
                    index === currentStep
                      ? "text-blue-500"
                      : completedSteps.has(index)
                      ? "text-green-500"
                      : "text-zinc-400"
                  )}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {steps[currentStep].component}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              isFirstStep
                ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            )}
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={isValidating}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLastStep ? "Complete" : "Next"}
          </button>
        </div>
      </div>
    </WizardContext.Provider>
  );
} 