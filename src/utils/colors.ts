// Définition des couleurs pour chaque thème
const lightTheme = {
  // Primary colors (brand/main colors) - White (from lightest to darkest)
  primary: {
    50: "#ffffff",
    100: "#f5f5f5",
    200: "#ebebeb",
    300: "#e0e0e0",
    400: "#d6d6d6",
    500: "#c2c2c2", // Main primary color (white)
    600: "#a3a3a3",
    700: "#858585",
    800: "#666666",
    900: "#4d4d4d",
  },

  // Secondary colors - Teal (from lightest to darkest)
  secondary: {
    50: "#e6f6f8",
    100: "#b8e7ed",
    200: "#8ad8e2",
    300: "#5cc9d7",
    400: "#3DA5B5", // Main secondary color
    500: "#2e8a99",
    600: "#256e7a",
    700: "#1c525b",
    800: "#13363c",
    900: "#0a1a1d",
  },

  // Tertiary colors - Black (from lightest to darkest)
  tertiary: {
    50: "#f8f8f8",
    100: "#e8e8e8",
    200: "#d0d0d0",
    300: "#a8a8a8",
    400: "#808080",
    500: "#1a1a1a", // Main tertiary color (black)
    600: "#121212",
    700: "#0a0a0a",
    800: "#050505",
    900: "#000000",
  },

  // New Accent colors for FilterModal and interactive elements
  accent: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // Main accent color (red)
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Filter-specific colors for better UX
  filter: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Main filter color (blue)
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },

  // Success/Active colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // Main success color
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Warning colors
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Main warning color
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Danger colors for destructive actions and errors
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // Main danger color
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Semantic colors
  background: "#ffffff",
  surface: "#f8f8f8",
  text: "#333333",
  textSecondary: "#666666",
  error: "#E53E3E",
  border: "#E2E8F0",
  borderDark: "#CBD5E0",
};

const darkTheme = {
  // Primary colors inversées pour le dark mode
  primary: {
    50: "#1a1a1a", // Inverse du light
    100: "#2d2d2d",
    200: "#3d3d3d",
    300: "#4d4d4d",
    400: "#5d5d5d",
    500: "#6d6d6d", // Main primary color (dark)
    600: "#7d7d7d",
    700: "#8d8d8d",
    800: "#a3a3a3",
    900: "#ffffff",
  },

  // Secondary colors - gardent les mêmes teintes mais adaptées
  secondary: {
    50: "#0a1a1d",
    100: "#13363c",
    200: "#1c525b",
    300: "#256e7a",
    400: "#3DA5B5", // Garde la même couleur principale
    500: "#5cc9d7",
    600: "#8ad8e2",
    700: "#b8e7ed",
    800: "#e6f6f8",
    900: "#f0fafa",
  },

  // Tertiary colors inversées
  tertiary: {
    50: "#000000",
    100: "#0a0a0a",
    200: "#121212",
    300: "#1a1a1a",
    400: "#333333",
    500: "#f8f8f8", // Main tertiary color (light text)
    600: "#e8e8e8",
    700: "#d0d0d0",
    800: "#a8a8a8",
    900: "#808080",
  },

  // Accent colors for dark mode
  accent: {
    50: "#7f1d1d",
    100: "#991b1b",
    200: "#b91c1c",
    300: "#dc2626",
    400: "#ef4444",
    500: "#f87171", // Main accent color (lighter red for dark mode)
    600: "#fca5a5",
    700: "#fecaca",
    800: "#fee2e2",
    900: "#fef2f2",
  },

  // Filter colors for dark mode
  filter: {
    50: "#0c4a6e",
    100: "#075985",
    200: "#0369a1",
    300: "#0284c7",
    400: "#0ea5e9",
    500: "#38bdf8", // Main filter color (lighter blue for dark mode)
    600: "#7dd3fc",
    700: "#bae6fd",
    800: "#e0f2fe",
    900: "#f0f9ff",
  },

  // Success colors for dark mode
  success: {
    50: "#14532d",
    100: "#166534",
    200: "#15803d",
    300: "#16a34a",
    400: "#22c55e",
    500: "#4ade80", // Main success color (lighter green for dark mode)
    600: "#86efac",
    700: "#bbf7d0",
    800: "#dcfce7",
    900: "#f0fdf4",
  },

  // Warning colors for dark mode
  warning: {
    50: "#78350f",
    100: "#92400e",
    200: "#b45309",
    300: "#d97706",
    400: "#f59e0b",
    500: "#fbbf24", // Main warning color (lighter orange for dark mode)
    600: "#fcd34d",
    700: "#fde68a",
    800: "#fef3c7",
    900: "#fffbeb",
  },

  // Danger colors for destructive actions and errors
  danger: {
    50: "#7f1d1d",
    100: "#991b1b",
    200: "#b91c1c",
    300: "#dc2626",
    400: "#ef4444",
    500: "#f87171", // Main danger color (lighter red for dark mode)
    600: "#fca5a5",
    700: "#fecaca",
    800: "#fee2e2",
    900: "#fef2f2",
  },

  // Semantic colors pour dark mode
  background: "#121212",
  surface: "#1e1e1e",
  text: "#ffffff",
  textSecondary: "#a8a8a8",
  error: "#ff6b6b",
  border: "#2d2d2d",
  borderDark: "#404040",
};

export type ThemeColors = typeof lightTheme;
export { lightTheme, darkTheme };

// Export par défaut pour la compatibilité avec l'ancien système
export default lightTheme;
