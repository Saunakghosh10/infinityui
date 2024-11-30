'use client';

// Advanced animation variants
export const advancedAnimations = {
  // Entrance animations
  entrance: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -20, opacity: 0 },
    },
    slideDown: {
      initial: { y: -20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 20, opacity: 0 },
    },
    scale: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 },
    },
    flip: {
      initial: { rotateX: 90, opacity: 0 },
      animate: { rotateX: 0, opacity: 1 },
      exit: { rotateX: -90, opacity: 0 },
    },
    elastic: {
      initial: { scale: 0 },
      animate: { scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
      exit: { scale: 0 },
    },
  },

  // Hover animations
  hover: {
    float: {
      y: -5,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    glow: {
      scale: 1.02,
      boxShadow: "0 0 20px rgba(255,255,255,0.2)",
    },
    rotate: {
      rotate: 5,
      scale: 1.05,
    },
    bounce: {
      scale: 0.95,
      transition: { type: "spring", stiffness: 400 },
    },
  },

  // Scroll animations
  scroll: {
    parallax: (depth: number = 0.5) => ({
      y: ["0%", `${depth * 100}%`],
      transition: { ease: "linear" },
    }),
    reveal: {
      opacity: [0, 1],
      y: [50, 0],
      transition: { duration: 0.6 },
    },
    rotate3D: {
      rotateX: [45, 0],
      rotateY: [45, 0],
      opacity: [0, 1],
    },
  },

  // Interactive animations
  interactive: {
    ripple: {
      scale: [1, 1.5],
      opacity: [0.5, 0],
      transition: { duration: 0.5 },
    },
    magnetic: (x: number, y: number) => ({
      x: x * 20,
      y: y * 20,
      transition: { type: "spring", stiffness: 150, damping: 15 },
    }),
    tilt: (x: number, y: number) => ({
      rotateX: y * 20,
      rotateY: x * 20,
      transition: { type: "spring", stiffness: 200, damping: 30 },
    }),
  },
};

// Gesture animations
export const gestureAnimations = {
  drag: {
    drag: true,
    dragElastic: 0.3,
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
    whileDrag: { scale: 1.1 },
  },
  swipe: {
    swipeDistance: 50,
    swipePower: (offset: number, velocity: number) => Math.abs(offset) * velocity,
  },
  pan: {
    pan: true,
    panThreshold: 20,
    onPanEnd: (e: any, info: any) => {
      if (Math.abs(info.offset.x) > 100) {
        // Handle pan gesture
      }
    },
  },
};

// Spring configurations
export const springConfigs = {
  soft: { type: "spring", stiffness: 100, damping: 20 },
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
  stiff: { type: "spring", stiffness: 200, damping: 30 },
  gentle: { type: "spring", stiffness: 50, damping: 15 },
};

// Transition presets
export const transitionPresets = {
  quick: { duration: 0.2, ease: "easeOut" },
  smooth: { duration: 0.4, ease: "easeInOut" },
  elastic: { type: "spring", stiffness: 300, damping: 20 },
  bounce: { type: "spring", stiffness: 200, bounce: 0.5 },
}; 