/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary palette
        "purple-strong":       "#7844E5",
        "purple-weak":         "#8577A3",
        "yellow-pale":         "#FFEE8C",
        // Depth / backgrounds
        "purple-dark":         "#3B1A8A",
        "purple-deep":         "#1A0A42",
        "purple-mid":          "#5C32B8",
        "background":          "#0D0720",
        "background-card":     "#160D30",
        "background-elevated": "#1F1245",
        // Neutrals
        "white-alpha-80":      "rgba(255,255,255,0.8)",
        "white-alpha-40":      "rgba(255,255,255,0.4)",
        "white-alpha-10":      "rgba(255,255,255,0.1)",
        // Accent alphas
        "yellow-alpha-30":     "rgba(255,238,140,0.3)",
        "purple-alpha-30":     "rgba(120,68,229,0.3)",
        "purple-alpha-15":     "rgba(120,68,229,0.15)",
      },
    },
  },
  plugins: [],
}