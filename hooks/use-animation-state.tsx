'use client';

import { useState, useCallback } from 'react';
import { useAnimation } from '@/components/ui/animation-provider';
import { springPresets, transitionPresets } from '@/lib/animation-config';

interface UseAnimationStateProps {
  defaultPreset?: keyof typeof springPresets;
  intensity?: number;
  disabled?: boolean;
}

export function useAnimationState({
  defaultPreset = 'default',
  intensity = 1,
  disabled = false,
}: UseAnimationStateProps = {}) {
  const { isEnabled, reducedMotion } = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  const getTransition = useCallback((preset: keyof typeof springPresets = defaultPreset) => {
    if (disabled || !isEnabled || reducedMotion) {
      return transitionPresets.fast;
    }
    return {
      ...springPresets[preset],
      velocity: intensity * 2,
    };
  }, [disabled, isEnabled, reducedMotion, intensity, defaultPreset]);

  const shouldAnimate = !disabled && isEnabled && !reducedMotion;

  return {
    isAnimating,
    setIsAnimating,
    getTransition,
    shouldAnimate,
  };
} 