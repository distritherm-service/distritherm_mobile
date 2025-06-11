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

  // Semantic colors
  background: "#ffffff",
  surface: "#f8f8f8",
  text: "#333333",
  textSecondary: "#666666",
  error: "#E53E3E",
  success: "#38A169",
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

  // Semantic colors pour dark mode
  background: "#121212",
  surface: "#1e1e1e",
  text: "#ffffff",
  textSecondary: "#a8a8a8",
  error: "#ff6b6b",
  success: "#51cf66",
  border: "#2d2d2d",
  borderDark: "#404040",
};

export type ThemeColors = typeof lightTheme;
export { lightTheme, darkTheme };

// Export par défaut pour la compatibilité avec l'ancien système
export default lightTheme;
