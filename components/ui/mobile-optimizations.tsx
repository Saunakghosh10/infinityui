'use client';

// Add mobile-first layouts to existing components
const mobileFirstStyles = {
  // Base container styles
  container: "w-full max-w-[100vw] overflow-x-hidden px-4 sm:px-6 md:px-8",
  
  // Grid layouts
  grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
  
  // Touch targets
  touchTarget: "min-h-[44px] min-w-[44px]", // Following iOS guidelines
  
  // Responsive spacing
  spacing: {
    sm: "p-2 sm:p-3 md:p-4",
    md: "p-3 sm:p-4 md:p-6",
    lg: "p-4 sm:p-6 md:p-8",
  },
  
  // Responsive typography
  text: {
    sm: "text-sm sm:text-base",
    base: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
  },
  
  // Mobile navigation
  mobileNav: "fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800",
  
  // Performance optimizations
  performance: {
    willChange: "will-change-transform",
    backfaceVisibility: "backface-visible-hidden",
    transform: "transform-gpu",
  }
};

// Update existing components with mobile optimizations
const componentUpdates = {
  Dialog: {
    mobile: "max-h-[90vh] overflow-y-auto touch-pan-y",
    performance: "overscroll-behavior-contain",
  },
  
  Slider: {
    touch: "touch-pan-x",
    target: "min-h-[44px]",
  },
  
  Table: {
    responsive: "overflow-x-auto -mx-4 sm:mx-0",
    container: "min-w-full inline-block align-middle",
  },
  
  Select: {
    mobile: "text-base", // Prevents zoom on iOS
    performance: "overscroll-behavior-contain",
  }
};

// Add responsive images support
const imageOptimizations = {
  responsive: "w-full h-auto object-cover",
  loading: "loading='lazy'",
  sizes: "sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'",
};

// Add offline support utilities
const offlineSupport = {
  cache: "Cache-Control: public, max-age=31536000",
  serviceWorker: "register only on production",
  storage: "IndexedDB for offline data",
}; 