import type { Config } from "tailwindcss";

// Design tokens ported verbatim from the approved Stitch export (code.html)
// to preserve pixel-identical visual design. Do not rename or restructure
// these tokens without re-verifying every screen against the Stitch source.
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-variant": "#dce5df",
        "on-secondary-fixed-variant": "#005322",
        "on-primary-container": "#77a599",
        "inverse-primary": "#a0d0c3",
        "on-primary-fixed": "#00201a",
        "surface-container-low": "#edf6f0",
        "on-surface-variant": "#404846",
        "surface-dim": "#d3dcd7",
        "surface-container-highest": "#dce5df",
        "surface-container-lowest": "#ffffff",
        // Not part of the original Stitch token set, but the export uses
        // `surface-lowest` (no `container-`) throughout — a class that was
        // never defined, so it silently rendered as nothing. Text spots got
        // away with it via inherited color; `hover:bg-surface-lowest` did
        // not, which is what exposed this. Same white as the token above.
        "surface-lowest": "#ffffff",
        "secondary-fixed-dim": "#7bdb8d",
        tertiary: "#01231d",
        "on-secondary-fixed": "#002109",
        "on-tertiary": "#ffffff",
        "on-primary": "#ffffff",
        "on-secondary-container": "#027433",
        "inverse-surface": "#2a322f",
        "primary-fixed-dim": "#a0d0c3",
        "on-surface": "#151d1a",
        "on-tertiary-container": "#81a399",
        error: "#ba1a1a",
        "outline-variant": "#c0c8c5",
        "on-background": "#151d1a",
        "on-tertiary-fixed-variant": "#2d4d45",
        "surface-tint": "#39675c",
        "error-container": "#ffdad6",
        "surface-bright": "#f3fbf6",
        "tertiary-fixed": "#c7eadf",
        "secondary-container": "#97f8a6",
        "on-primary-fixed-variant": "#204e45",
        "surface-container-high": "#e1eae5",
        surface: "#f3fbf6",
        "tertiary-fixed-dim": "#abcec4",
        secondary: "#006d2f",
        "inverse-on-surface": "#eaf3ed",
        "primary-container": "#073b32",
        outline: "#707976",
        "on-error-container": "#93000a",
        primary: "#00241d",
        "on-secondary": "#ffffff",
        "on-error": "#ffffff",
        "surface-container": "#e7f0ea",
        "tertiary-container": "#193932",
        "secondary-fixed": "#97f8a6",
        "primary-fixed": "#bceddf",
        background: "#f3fbf6",
        "on-tertiary-fixed": "#00201a",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "space-md": "1rem",
        "margin-desktop": "3rem",
        "space-xl": "2.5rem",
        "gutter-desktop": "1.5rem",
        "margin-tablet": "2rem",
        gutter: "1rem",
        "space-sm": "0.5rem",
        "space-lg": "1.5rem",
        "space-xs": "0.25rem",
        margin: "1rem",
      },
      fontFamily: {
        // References the CSS variables injected by next/font/google in
        // app/layout.tsx (self-hosted Epilogue / Plus Jakarta Sans) so the
        // Stitch design's per-role font mapping is preserved exactly.
        "headline-lg-mobile": ["var(--font-epilogue)", "sans-serif"],
        "body-md": ["var(--font-plus-jakarta-sans)", "sans-serif"],
        "headline-lg": ["var(--font-epilogue)", "sans-serif"],
        "body-lg": ["var(--font-plus-jakarta-sans)", "sans-serif"],
        "display-lg-mobile": ["var(--font-epilogue)", "sans-serif"],
        "label-lg": ["var(--font-plus-jakarta-sans)", "sans-serif"],
        "headline-sm": ["var(--font-epilogue)", "sans-serif"],
        "display-lg": ["var(--font-epilogue)", "sans-serif"],
        "label-sm": ["var(--font-plus-jakarta-sans)", "sans-serif"],
        "label-md": ["var(--font-plus-jakarta-sans)", "sans-serif"],
        "body-sm": ["var(--font-plus-jakarta-sans)", "sans-serif"],
        "headline-md": ["var(--font-epilogue)", "sans-serif"],
      },
      fontSize: {
        "headline-lg-mobile": [
          "26px",
          { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg": [
          "32px",
          { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "display-lg-mobile": [
          "34px",
          { lineHeight: "40px", letterSpacing: "-0.015em", fontWeight: "700" },
        ],
        "label-lg": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "600" },
        ],
        "headline-sm": [
          "20px",
          { lineHeight: "26px", letterSpacing: "0em", fontWeight: "600" },
        ],
        "display-lg": [
          "48px",
          { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "label-sm": [
          "10px",
          { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "700" },
        ],
        "label-md": [
          "12px",
          { lineHeight: "16px", letterSpacing: "0.03em", fontWeight: "600" },
        ],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "headline-md": [
          "24px",
          { lineHeight: "30px", letterSpacing: "0em", fontWeight: "600" },
        ],
      },
    },
  },
  plugins: [],
};

export default config;
