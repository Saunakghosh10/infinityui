'use client';

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File, Image as ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const fileUploadVariants = cva(
  "relative rounded-lg border-2 border-dashed transition-colors",
  {
    variants: {
      variant: {
        default: "border-zinc-800 hover:border-zinc-700",
        success: "border-green-500/50 bg-green-500/10",
        error: "border-red-500/50 bg-red-500/10",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    }
  }
);

interface FileUploadProps extends VariantProps<typeof fileUploadVariants> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  preview?: boolean;
  onFilesChange?: (files: File[]) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  preview = true,
  onFilesChange,
  onError,
  variant,
  size,
  className,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles || disabled) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate files
    Array.from(newFiles).forEach(file => {
      if (accept && !file.type.match(accept)) {
        errors.push(`${file.name} has an invalid file type`);
        return;
      }
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large`);
        return;
      }
      validFiles.push(file);
    });

    if (multiple) {
      if (files.length + validFiles.length > maxFiles) {
        onError?.(`Maximum ${maxFiles} files allowed`);
        return;
      }
      setFiles(prev => [...prev, ...validFiles]);
    } else {
      setFiles(validFiles.slice(0, 1));
    }

    if (errors.length > 0) {
      const errorMessage = errors.join(', ');
      setError(errorMessage);
      onError?.(errorMessage);
    } else {
      setError(undefined);
      onFilesChange?.(files);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    onFilesChange?.(files.filter((_, i) => i !== index));
  };

  const isImage = (file: File) => file.type.startsWith('image/');

  return (
    <div className="w-full space-y-4">
      <div
        className={cn(
          fileUploadVariants({ variant: error ? "error" : variant, size }),
          isDragging && "border-zinc-600 bg-zinc-800/50",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className="h-8 w-8 text-zinc-400" />
          <div>
            <button
              type="button"
              onClick={() => !disabled && inputRef.current?.click()}
              className="text-blue-400 hover:text-blue-300 font-medium"
              disabled={disabled}
            >
              Click to upload
            </button>
            <span className="text-zinc-400"> or drag and drop</span>
          </div>
          <p className="text-xs text-zinc-500">
            {accept && `Accepted formats: ${accept}`}
            {maxSize && ` • Max size: ${Math.round(maxSize / 1024 / 1024)}MB`}
            {multiple && maxFiles && ` • Max files: ${maxFiles}`}
          </p>
        </div>
      </div>

      {/* File Preview */}
      {preview && files.length > 0 && (
        <motion.div layout className="space-y-2">
          <AnimatePresence mode="popLayout">
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
              >
                {isImage(file) ? (
                  <ImageIcon className="h-5 w-5 text-zinc-400" />
                ) : (
                  <File className="h-5 w-5 text-zinc-400" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{file.name}</p>
                  <p className="text-xs text-zinc-500">
                    {(file.size / 1024).toFixed(1)}KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 text-zinc-400 hover:text-zinc-300"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
} 