export const springPresets = {
  default: { type: "spring", damping: 20, stiffness: 300 },
  gentle: { type: "spring", damping: 25, stiffness: 200 },
  bouncy: { type: "spring", damping: 15, stiffness: 400 },
  stiff: { type: "spring", damping: 30, stiffness: 500 },
};

export const transitionPresets = {
  default: { duration: 0.2, ease: "easeOut" },
  slow: { duration: 0.4, ease: "easeInOut" },
  fast: { duration: 0.1, ease: "easeOut" },
};

export const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const slideVariants = {
  top: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  bottom: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  left: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  right: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
}; 