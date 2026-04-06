import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        farm: {
          sky: "hsl(var(--farm-sky))",
          grass: "hsl(var(--farm-grass))",
          barn: "hsl(var(--farm-barn))",
          sun: "hsl(var(--farm-sun))",
          correct: "hsl(var(--farm-correct))",
          wrong: "hsl(var(--farm-wrong))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pop-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "70%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "celebrate": {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.3) rotate(-5deg)" },
          "50%": { transform: "scale(1.3) rotate(5deg)" },
          "75%": { transform: "scale(1.3) rotate(-5deg)" },
          "100%": { transform: "scale(1) rotate(0)" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-8px)" },
          "75%": { transform: "translateX(8px)" },
        },
        "train-chug": {
          "0%, 100%": { transform: "translateY(0)" },
          "25%": { transform: "translateY(-2px)" },
          "75%": { transform: "translateY(2px)" },
        },
        "number-fly": {
          "0%": { transform: "scale(1.5) translateY(0)", opacity: "1" },
          "100%": { transform: "scale(1) translateY(-60px)", opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pop-in": "pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "bounce-in": "bounce-in 0.6s ease-out forwards",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "celebrate": "celebrate 0.6s ease-in-out",
        "shake": "shake 0.4s ease-in-out",
        "train-chug": "train-chug 0.3s ease-in-out infinite",
        "number-fly": "number-fly 0.8s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
