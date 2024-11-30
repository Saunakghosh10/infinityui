'use client';

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const alertVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle
};

const styles = {
  info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  success: "bg-green-500/10 text-green-500 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  error: "bg-red-500/10 text-red-500 border-red-500/20"
};

export function Alert({ 
  type = 'info', 
  title, 
  children, 
  onClose,
  className 
}: AlertProps) {
  const Icon = icons[type];

  return (
    <AnimatePresence>
      <motion.div
        variants={alertVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(
          "relative rounded-lg border p-4",
          styles[type],
          className
        )}
      >
        <div className="flex gap-3">
          <Icon className="h-5 w-5 shrink-0" />
          <div className="flex-1">
            {title && (
              <h5 className="mb-1 font-medium leading-none tracking-tight">
                {title}
              </h5>
            )}
            <div className="text-sm opacity-90">{children}</div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="shrink-0 rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
