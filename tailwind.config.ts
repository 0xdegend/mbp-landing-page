import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "forest-black": "#0a0d08",
        "pine-dark": "#0d1a0e",
        "pine-mid": "#1a2e1b",
        "forest-green": "#2d5a2e",
        "moss": "#4a7c59",
        "ash": "#6b7280",
        "bone": "#e8dcc8",
        "bone-light": "#f5ede0",
        "scarlet": "#c0392b",
        "blood": "#8b1a1a",
        "ember": "#e84d0e",
        "tan": "#a0856a",
        "sky-ice": "#7ec8e3",
        "silver": "#b8c5cc",
        "silver-light": "#dce8ec",
        "gold": "#c9a84c",
      },
      fontFamily: {
        beast: ["var(--font-beast)"],
        body: ["var(--font-body)"],
      },
      animation: {
        "breathe": "breathe 4s ease-in-out infinite",
        "swing": "swing 3s ease-in-out infinite",
        "ember-float": "emberFloat 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "drift": "drift 20s linear infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        swing: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        emberFloat: {
          "0%": { transform: "translateY(0px) translateX(0px)", opacity: "1" },
          "100%": { transform: "translateY(-200px) translateX(20px)", opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(192, 57, 43, 0.4)" },
          "50%": { boxShadow: "0 0 60px rgba(192, 57, 43, 0.8), 0 0 100px rgba(232, 77, 14, 0.4)" },
        },
        drift: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-30px)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      backgroundImage: {
        "claw-gradient": "linear-gradient(135deg, #0a0d08 0%, #1a2e1b 50%, #0d1a0e 100%)",
        "ember-gradient": "radial-gradient(ellipse at center, #8b1a1a 0%, #0a0d08 70%)",
        "forest-gradient": "linear-gradient(180deg, #0d1a0e 0%, #0a0d08 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
