'use client';

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Edit2, Move } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const annotationVariants = cva(
  "absolute rounded-lg border shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-zinc-900/90 border-zinc-800",
        highlight: "bg-yellow-500/20 border-yellow-500/50",
        error: "bg-red-500/20 border-red-500/50",
        success: "bg-green-500/20 border-green-500/50",
      },
      size: {
        sm: "p-2 text-sm",
        md: "p-3 text-base",
        lg: "p-4 text-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    }
  }
);

interface Annotation {
  id: string;
  x: number;
  y: number;
  content: string;
  variant?: VariantProps<typeof annotationVariants>['variant'];
}

interface ImageAnnotationsProps {
  src: string;
  annotations?: Annotation[];
  onChange?: (annotations: Annotation[]) => void;
  className?: string;
  editable?: boolean;
  maxAnnotations?: number;
}

export function ImageAnnotations({
  src,
  annotations: initialAnnotations = [],
  onChange,
  className,
  editable = true,
  maxAnnotations = 10,
}: ImageAnnotationsProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddAnnotation = (e: React.MouseEvent) => {
    if (!editable || annotations.length >= maxAnnotations) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      x,
      y,
      content: "",
      variant: "default",
    };

    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);
    setSelectedAnnotation(newAnnotation.id);
    onChange?.(updatedAnnotations);
  };

  const handleUpdateAnnotation = (id: string, updates: Partial<Annotation>) => {
    const updatedAnnotations = annotations.map(ann =>
      ann.id === id ? { ...ann, ...updates } : ann
    );
    setAnnotations(updatedAnnotations);
    onChange?.(updatedAnnotations);
  };

  const handleDeleteAnnotation = (id: string) => {
    const updatedAnnotations = annotations.filter(ann => ann.id !== id);
    setAnnotations(updatedAnnotations);
    setSelectedAnnotation(null);
    onChange?.(updatedAnnotations);
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative select-none", className)}
      onClick={isAdding ? handleAddAnnotation : undefined}
    >
      <img src={src} alt="Annotated image" className="w-full h-auto" />

      {/* Annotations */}
      <AnimatePresence>
        {annotations.map((annotation) => (
          <motion.div
            key={annotation.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              left: `${annotation.x}%`,
              top: `${annotation.y}%`,
            }}
            className={cn(
              annotationVariants({ variant: annotation.variant }),
              "transform -translate-x-1/2 -translate-y-1/2",
              selectedAnnotation === annotation.id && "ring-2 ring-blue-500"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAnnotation(annotation.id);
            }}
          >
            {selectedAnnotation === annotation.id ? (
              <div className="min-w-[200px]">
                <textarea
                  value={annotation.content}
                  onChange={(e) => handleUpdateAnnotation(annotation.id, { content: e.target.value })}
                  className="w-full bg-transparent border-none focus:outline-none resize-none"
                  autoFocus
                  placeholder="Add annotation..."
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => handleDeleteAnnotation(annotation.id)}
                    className="p-1 text-zinc-400 hover:text-zinc-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div>{annotation.content || "Empty annotation"}</div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Controls */}
      {editable && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={cn(
              "p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100",
              isAdding && "bg-blue-500 text-white"
            )}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
} 