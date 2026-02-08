/**
 * LehGo Design System - Color Palette
 * "Premium Local" Aesthetic
 */

const tintColorLight = "#FFCC00";
const tintColorDark = "#FFCC00";

export const Colors = {
  // Brand Identity
  brand: {
    yellow: "#FFCC00", // Lagos Yellow - Primary Action
    yellowDark: "#FFB300", // Pressed states
    asphalt: "#1A1A1A", // Primary Background
    asphaltDark: "#101010", // Darker Depth
    green: "#00C853", // Success / Driver Earnings
    red: "#FF3B30", // Error / Cancel
  },

  // Semantic Neutrals
  neutral: {
    900: "#000000",
    800: "#1A1A1A", // Card Bg
    700: "#252525", // Input Bg
    600: "#333333", // Borders
    500: "#444444", // Dividers
    400: "#666666", // Icons inactive
    300: "#888888", // Secondary Text
    200: "#CCCCCC",
    100: "#EEEEEE",
    50: "#FFFFFF", // Primary Text
  },

  // UI States
  state: {
    success: "#00C853",
    warning: "#FFCC00",
    error: "#FF3B30",
    info: "#2196F3",
  },

  dark: {
    text: "#FFFFFF",
    background: "#1A1A1A",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
