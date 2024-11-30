'use client';

export const springConfigs = {
  gentle: { stiffness: 100, damping: 30 },
  soft: { stiffness: 150, damping: 20 },
  medium: { stiffness: 200, damping: 15 },
  stiff: { stiffness: 300, damping: 10 }
};

export const advancedAnimations = {
  entrance: {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    elastic: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 }
    }
  }
}; 