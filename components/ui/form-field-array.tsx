'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const fieldArrayVariants = cva(
  "w-full space-y-2",
  {
    variants: {
      variant: {
        default: "",
        cards: "space-y-4",
        compact: "space-y-1",
      },
      layout: {
        stack: "",
        grid: "grid grid-cols-2 gap-4",
        inline: "flex items-center gap-4",
      }
    },
    defaultVariants: {
      variant: "default",
      layout: "stack"
    }
  }
);

interface FormFieldArrayProps extends VariantProps<typeof fieldArrayVariants> {
  name: string;
  label?: string;
  description?: string;
  min?: number;
  max?: number;
  defaultValue?: any[];
  renderField: (index: number, value: any) => React.ReactNode;
  onChange?: (values: any[]) => void;
  className?: string;
  sortable?: boolean;
  addLabel?: string;
  removeLabel?: string;
}

export function FormFieldArray({
  name,
  label,
  description,
  min = 0,
  max,
  defaultValue = [],
  renderField,
  onChange,
  variant,
  layout,
  className,
  sortable = false,
  addLabel = "Add Item",
  removeLabel = "Remove",
}: FormFieldArrayProps) {
  const [fields, setFields] = useState(defaultValue);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addField = () => {
    if (max && fields.length >= max) return;
    const newFields = [...fields, undefined];
    setFields(newFields);
    onChange?.(newFields);
  };

  const removeField = (index: number) => {
    if (fields.length <= min) return;
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    onChange?.(newFields);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newFields = [...fields];
    const draggedItem = newFields[draggedIndex];
    newFields.splice(draggedIndex, 1);
    newFields.splice(index, 0, draggedItem);
    
    setFields(newFields);
    setDraggedIndex(index);
    onChange?.(newFields);
  };

  return (
    <div className={cn(fieldArrayVariants({ variant, layout }), className)}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <div>
            <label className="text-sm font-medium text-zinc-200">{label}</label>
            {description && (
              <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={addField}
            disabled={max ? fields.length >= max : false}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md",
              "bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Plus className="h-3 w-3" />
            {addLabel}
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {fields.map((field, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              "relative group",
              variant === "cards" && "p-4 rounded-lg border border-zinc-800"
            )}
            draggable={sortable}
            onDragStart={() => handleDragStart(index)}
            onDragOver={() => handleDragOver(index)}
            onDragEnd={() => setDraggedIndex(null)}
          >
            <div className="flex items-start gap-2">
              {sortable && (
                <button
                  type="button"
                  className="mt-2 p-1 text-zinc-500 hover:text-zinc-300 cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
              )}
              
              <div className="flex-1">
                {renderField(index, field)}
              </div>

              <button
                type="button"
                onClick={() => removeField(index)}
                disabled={fields.length <= min}
                className={cn(
                  "mt-2 p-1 rounded-md",
                  "text-zinc-500 hover:text-red-400",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                title={removeLabel}
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 