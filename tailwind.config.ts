import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['var(--font-space-grotesk)'],
      },
      animation: {
        "meteor": "meteor var(--meteor-duration, 5s) linear infinite",
        "spotlight": "spotlight 2s ease .75s 1 forwards",
        "aurora": "aurora 60s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        meteor: {
          "0%": { 
            transform: "rotate(215deg) translateX(0)",
            opacity: "1",
            height: "var(--meteor-size, 1px)",
            width: "var(--meteor-size, 1px)"
          },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-900px)",
            opacity: "0",
            height: "var(--meteor-size, 1px)",
            width: "var(--meteor-size, 1px)"
          },
        },
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%,-40%) scale(1)" },
        },
        aurora: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" }
        },
        glow: {
          "0%": { opacity: 0.4 },
          "100%": { opacity: 1 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
