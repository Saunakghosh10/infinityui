'use client';

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
};

const ToastContext = React.createContext<{
  showToast: (message: string, type: ToastType, duration?: number) => void;
}>({
  showToast: () => {},
});

export function useToast() {
  return React.useContext(ToastContext);
}

export function Toast({ id, message, type, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`
        flex items-center gap-2 min-w-[300px] p-4 rounded-lg shadow-lg
        ${type === 'success' && 'bg-green-500/10 border border-green-500/20 text-green-500'}
        ${type === 'error' && 'bg-red-500/10 border border-red-500/20 text-red-500'}
        ${type === 'info' && 'bg-blue-500/10 border border-blue-500/20 text-blue-500'}
        ${type === 'warning' && 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'}
      `}
    >
      <span className="flex-grow">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="p-1 hover:bg-white/10 rounded-md transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType, duration?: number) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
