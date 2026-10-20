/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Colour tokens: each colour has one job (see design principles)
      colors: {
        cream: { DEFAULT: "#FBF7EE", dark: "#F3ECDC" }, // page background, subtle fills
        ink: { DEFAULT: "#1F2937", muted: "#5B6472" }, // text
        line: "#E7E0D0", // warm borders and dividers
        brand: {
          // blue: primary actions, links, focus, "In Progress"
          50: "#EFF4FF",
          100: "#DBE7FE",
          600: "#1D4ED8",
          700: "#1E40AF",
          800: "#1E3A8A",
        },
        hope: {
          // orange: hero action, highlights, "Pending"
          50: "#FFF1E6",
          100: "#FFE0C7",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
        },
        love: {
          // red: errors and destructive actions only
          50: "#FEF2F2",
          600: "#DC2626",
          700: "#B91C1C",
        },
        success: { 50: "#E8F5EC", 600: "#15803D" }, // "Resolved" and success messages
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
      },
      // One very light shadow, used only on cards. No other elevation.
      boxShadow: {
        card: "0 1px 2px rgba(31, 41, 55, 0.06)",
        "card-hover": "0 2px 6px rgba(31, 41, 55, 0.10)",
      },
    },
  },
  plugins: [],
};
