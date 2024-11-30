'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface AnimationContextType {
  isEnabled: boolean;
  intensity: number;
  reducedMotion: boolean;
  setIntensity: (value: number) => void;
  toggleAnimations: () => void;
}

const AnimationContext = createContext<AnimationContextType>({
  isEnabled: true,
  intensity: 1,
  reducedMotion: false,
  setIntensity: () => {},
  toggleAnimations: () => {},
});

export const useAnimation = () => useContext(AnimationContext);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [intensity, setIntensity] = useState(1);
  const reducedMotion = useReducedMotion() ?? false;

  const toggleAnimations = () => setIsEnabled(prev => !prev);

  return (
    <AnimationContext.Provider
      value={{
        isEnabled,
        intensity,
        reducedMotion,
        setIntensity,
        toggleAnimations,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
} 