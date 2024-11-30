'use client';

import { createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimationContextType {
  pageTransitions: boolean;
  scrollAnimations: boolean;
  gestureAnimations: boolean;
}

const AnimationContext = createContext<AnimationContextType>({
  pageTransitions: true,
  scrollAnimations: true,
  gestureAnimations: true,
});

export const useAnimation = () => useContext(AnimationContext);

// Page transition variants
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Gesture animations
export const gestureVariants = {
  tap: { scale: 0.98 },
  hover: { scale: 1.02 },
  drag: { scale: 1.1, cursor: 'grabbing' },
};

interface AnimationProviderProps {
  children: ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  return (
    <AnimationContext.Provider
      value={{
        pageTransitions: true,
        scrollAnimations: true,
        gestureAnimations: true,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
} 