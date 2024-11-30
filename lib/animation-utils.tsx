export const springConfigs = {
  gentle: {
    type: "spring",
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  },
  medium: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    restDelta: 0.001
  },
  stiff: {
    type: "spring",
    stiffness: 500,
    damping: 40,
    restDelta: 0.001
  }
};

export const transitionPresets = {
  fast: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
  medium: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  slow: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
};

export const getGridItemDelay = (index: number, total: number) => {
  const row = Math.floor(index / Math.sqrt(total));
  const col = index % Math.sqrt(total);
  return (row + col) * 0.05;
}; 