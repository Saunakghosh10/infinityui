'use client';

// Developer Experience Enhancements
const devTools = {
  // Component playground setup
  playground: {
    wrapper: "relative p-4 border border-zinc-800 rounded-lg",
    controls: "flex gap-2 mb-4",
    preview: "min-h-[200px] flex items-center justify-center",
  },

  // Theme customization utilities
  theme: {
    cssVariables: "--primary: #3b82f6; --accent: #10b981;",
    colorPalette: {
      primary: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
      accent: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
    },
  },

  // Animation customization
  animation: {
    presets: {
      spring: { type: "spring", stiffness: 100, damping: 10 },
      bounce: { type: "spring", stiffness: 200, damping: 15 },
      smooth: { type: "tween", duration: 0.3 },
    },
  },

  // TypeScript improvements
  typescript: {
    strictMode: true,
    types: "export type ComponentProps = React.ComponentProps<typeof Component>",
    generics: "<T extends unknown>",
  },

  // Testing utilities
  testing: {
    setup: "import { render, screen, fireEvent } from '@testing-library/react'",
    assertions: "expect(element).toBeInTheDocument()",
    mocks: "jest.mock('./component')",
  },

  // Documentation helpers
  docs: {
    template: "## Component Name\n\nDescription\n\n### Props\n\n### Examples",
    propTable: "| Prop | Type | Default | Description |",
    examples: "```tsx\n<Component prop={value} />\n```",
  },

  // Code generation
  codeGen: {
    component: "generateComponent('name', { props, variants })",
    types: "generateTypes('Component')",
    tests: "generateTests('Component')",
  },

  // Performance monitoring
  performance: {
    metrics: ["FCP", "LCP", "CLS", "FID", "TTI"],
    measure: "performance.measure('name', 'start', 'end')",
    observe: "new PerformanceObserver((list) => {})",
  },

  // Error boundaries
  errorBoundary: {
    catch: "componentDidCatch(error, errorInfo)",
    fallback: "<ErrorFallback error={error} />",
  },

  // Hot reloading config
  hotReload: {
    accept: "if (module.hot) module.hot.accept()",
    dispose: "if (module.hot) module.hot.dispose(() => {})",
  },

  // Debug tools
  debug: {
    logger: "console.log('[Component]:', data)",
    debugger: "debugger;",
    trace: "console.trace()",
  }
};

// Apply these enhancements to existing components
export const withDevTools = (Component: React.ComponentType) => {
  return process.env.NODE_ENV === 'development'
    ? React.forwardRef((props, ref) => (
        <div className={devTools.playground.wrapper}>
          <Component {...props} ref={ref} />
          {/* Dev tools UI */}
        </div>
      ))
    : Component; 